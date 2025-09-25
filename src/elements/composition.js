import { BaseElement } from "./base.js";
import { ConfigParser } from "../configParser.js";
import { parsePositionValue } from "../utils/positionUtils.js";
import { createFabricCanvas, renderFabricCanvas } from "../canvas/fabric.js";

/**
 * 组合元素 - 包含多个子元素的容器
 */
export class CompositionElement extends BaseElement {
  constructor(config) {
    super(config);
    this.elements = config.elements || [];
    this.subElements = [];
    this.configParser = null;
    
    // 解析 width 和 height，支持百分比单位
    this.width = config.width ? parsePositionValue(config.width, this.canvasWidth) : this.canvasWidth;
    this.height = config.height ? parsePositionValue(config.height, this.canvasHeight) : this.canvasHeight;
  }

  async initialize() {
    await super.initialize();
    
    // 解析子元素，使用 Composition 的宽高作为子元素的画布尺寸
    this.configParser = new ConfigParser({
      elements: this.elements,
      canvasWidth: this.width,  // 使用 Composition 的宽度
      canvasHeight: this.height, // 使用 Composition 的高度
      fps: this.fps,
      defaults: this.config?.defaults || {}
    });
    
    const parsedConfig = await this.configParser.parse();
    this.subElements = parsedConfig.elements;
    
    // 为每个子元素设置正确的画布尺寸和 FPS
    for (const element of this.subElements) {
      element.canvasWidth = this.width;   // 使用 Composition 的宽度
      element.canvasHeight = this.height; // 使用 Composition 的高度
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
    
    // 创建一个临时的画布来渲染子元素
    const tempCanvas = createFabricCanvas({
      width: this.width,
      height: this.height
    });
    
    // 渲染所有子元素到临时画布
    for (const element of sortedElements) {
      try {
        // 检查子元素是否在当前时间范围内（使用相对时间）
        if (relativeTime >= element.startTime && relativeTime <= element.endTime) {
          // 确保子元素已初始化
          if (!element.isInitialized) {
            await element.initialize();
          }
          
          // 调用子元素的 readNextFrame 方法，使用相对时间
          // 这样子元素的时间系统相对于 Composition 本身
          const frameData = await element.readNextFrame(relativeTime, tempCanvas);
          
          // 如果子元素返回了帧数据，需要将其渲染到临时画布上
          if (frameData) {
            await this.renderFrameDataToCanvas(tempCanvas, frameData);
          }
        }
      } catch (error) {
        console.warn(`渲染子元素失败: ${element.type}`, error);
      }
    }
    
    // 将临时画布转换为帧数据
    const rgba = await renderFabricCanvas(tempCanvas);
    const frameData = {
      data: rgba,
      width: this.width,
      height: this.height
    };
    
    if (frameData) {
      // 创建完整的帧数据，包含所有变换信息
      return this.createCompleteFrameData(frameData, transform);
    }
    
    return null;
  }


  /**
   * 将帧数据渲染到画布
   */
  async renderFrameDataToCanvas(canvas, frameData) {
    if (!frameData) return;
    
    // 导入必要的工具函数
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    // 处理对象数组（新的架构）
    if (frameData.isObjectArray && frameData.objects && Array.isArray(frameData.objects)) {
      // 添加所有对象到画布
      for (const obj of frameData.objects) {
        if (obj.fabricObject) {
          // 确保对象从之前的画布中移除
          if (obj.fabricObject.canvas) {
            obj.fabricObject.canvas.remove(obj.fabricObject);
          }
          canvas.add(obj.fabricObject);
        }
      }
      return;
    }
    
    // 处理 contain-blur 效果
    if (frameData.isContainBlur && frameData.background && frameData.foreground) {
      // 添加背景图像
      const backgroundImage = await rgbaToFabricImage({
        width: frameData.background.width,
        height: frameData.background.height,
        rgba: frameData.background.data
      });
      
      // 应用背景的变换信息
      this.applyFabricTransform(backgroundImage, frameData.background);
      canvas.add(backgroundImage);
      
      // 添加前景图像
      const foregroundImage = await rgbaToFabricImage({
        width: frameData.foreground.width,
        height: frameData.foreground.height,
        rgba: frameData.foreground.data
      });
      
      // 应用前景的变换信息
      this.applyFabricTransform(foregroundImage, frameData.foreground);
      canvas.add(foregroundImage);
      return;
    }
    
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

  /**
   * 将变换信息应用到 Fabric 对象
   * @param {Object} fabricObject - Fabric 对象
   * @param {Object} transformData - 变换数据
   */
  applyFabricTransform(fabricObject, transformData) {
    if (!fabricObject || !fabricObject.set) return;

    // 处理位置属性
    if (transformData.x !== undefined) {
      fabricObject.set('left', transformData.x);
    }
    if (transformData.y !== undefined) {
      fabricObject.set('top', transformData.y);
    }

    // 处理其他属性
    const properties = [
      'originX', 'originY', 'scaleX', 'scaleY', 
      'rotation', 'opacity', 'rotationX', 'rotationY', 'translateZ'
    ];

    properties.forEach(prop => {
      if (transformData[prop] !== undefined) {
        const fabricProp = prop === 'rotation' ? 'angle' : prop;
        fabricObject.set(fabricProp, transformData[prop]);
      }
    });
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
