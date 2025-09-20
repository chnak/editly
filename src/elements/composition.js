import { BaseElement } from "./base.js";
import { ConfigParser } from "../configParser.js";

/**
 * 组合元素 - 包含多个子元素的容器
 */
export class CompositionElement extends BaseElement {
  constructor(config) {
    super(config);
    this.elements = config.elements || [];
    this.subElements = [];
    this.configParser = null;
  }

  async initialize() {
    await super.initialize();
    
    // 解析子元素
    this.configParser = new ConfigParser({
      elements: this.elements,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      fps: this.fps,
      defaults: this.config?.defaults || {}
    });
    
    const parsedConfig = await this.configParser.parse();
    this.subElements = parsedConfig.elements;
    
    // 为每个子元素设置正确的画布尺寸和 FPS
    for (const element of this.subElements) {
      element.canvasWidth = this.canvasWidth;
      element.canvasHeight = this.canvasHeight;
      element.fps = this.fps;
    }
  }

  async readNextFrame(time, canvas) {
    await this.initialize();
    
    // 检查时间是否在 Composition 的范围内
    if (time < this.startTime || time > this.endTime) {
      return null;
    }
    
    const progress = this.getProgressAtTime(time);
    const transform = this.getTransformAtTime(time);
    
    // 计算相对于 Composition 的时间
    const relativeTime = time - this.startTime;
    
    // 按 zIndex 排序子元素
    const sortedElements = [...this.subElements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    
    // 渲染所有子元素
    for (const element of sortedElements) {
      try {
        // 检查子元素是否在当前时间范围内
        if (relativeTime >= element.startTime && relativeTime <= element.endTime) {
          // 计算子元素的相对时间
          const elementRelativeTime = relativeTime - element.startTime;
          
          // 确保子元素已初始化
          if (!element.isInitialized) {
            await element.initialize();
          }
          
          // 创建子元素的画布上下文
          const ctx = canvas.getContext('2d');
          
          // 保存当前画布状态
          ctx.save();
          
          // 应用 Composition 的变换
          ctx.translate(transform.x, transform.y);
          ctx.rotate(transform.rotation * Math.PI / 180);
          ctx.scale(transform.scaleX, transform.scaleY);
          ctx.globalAlpha = transform.opacity;
          
          // 调用子元素的 readNextFrame 方法
          const frameData = await element.readNextFrame(elementRelativeTime, canvas);
          
          // 如果子元素返回了帧数据，需要将其渲染到画布上
          if (frameData) {
            await this.renderFrameDataToCanvas(canvas, frameData);
          }
          
          // 恢复画布状态
          ctx.restore();
        }
      } catch (error) {
        console.warn(`渲染子元素失败: ${element.type}`, error);
      }
    }
    
    return null; // 组合元素不直接返回帧数据，而是通过子元素渲染到画布
  }

  /**
   * 将帧数据渲染到画布
   */
  async renderFrameDataToCanvas(canvas, frameData) {
    if (!frameData) return;
    
    // 导入必要的工具函数
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    // 处理不同的帧数据格式
    if (frameData.data && frameData.width && frameData.height) {
      // 新格式 RGBA 数据
      const fabricImage = await rgbaToFabricImage({
        width: frameData.width,
        height: frameData.height,
        rgba: frameData.data
      });
      
      // 应用变换信息
      if (frameData.x !== undefined) fabricImage.set('left', frameData.x);
      if (frameData.y !== undefined) fabricImage.set('top', frameData.y);
      if (frameData.scaleX !== undefined) fabricImage.set('scaleX', frameData.scaleX);
      if (frameData.scaleY !== undefined) fabricImage.set('scaleY', frameData.scaleY);
      if (frameData.rotation !== undefined) fabricImage.set('angle', frameData.rotation);
      if (frameData.opacity !== undefined) fabricImage.set('opacity', frameData.opacity);
      if (frameData.originX !== undefined) fabricImage.set('originX', frameData.originX);
      if (frameData.originY !== undefined) fabricImage.set('originY', frameData.originY);
      
      // 添加到画布
      canvas.add(fabricImage);
    } else if (frameData instanceof Buffer) {
      // 旧格式 RGBA 数据
      const fabricImage = await rgbaToFabricImage({
        width: frameData.width || 100,
        height: frameData.height || 100,
        rgba: frameData
      });
      
      // 应用变换信息
      if (frameData.x !== undefined) fabricImage.set('left', frameData.x);
      if (frameData.y !== undefined) fabricImage.set('top', frameData.y);
      if (frameData.scaleX !== undefined) fabricImage.set('scaleX', frameData.scaleX);
      if (frameData.scaleY !== undefined) fabricImage.set('scaleY', frameData.scaleY);
      if (frameData.rotation !== undefined) fabricImage.set('angle', frameData.rotation);
      if (frameData.opacity !== undefined) fabricImage.set('opacity', frameData.opacity);
      if (frameData.originX !== undefined) fabricImage.set('originX', frameData.originX);
      if (frameData.originY !== undefined) fabricImage.set('originY', frameData.originY);
      
      // 添加到画布
      canvas.add(fabricImage);
    } else if (frameData.imageData) {
      // 包含 imageData 的帧数据
      const ctx = canvas.getContext('2d');
      ctx.putImageData(frameData.imageData, 0, 0);
    }
  }




  async close() {
    // 关闭所有子元素
    for (const element of this.subElements) {
      if (element.close) {
        await element.close();
      }
    }
  }
}
