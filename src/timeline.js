import { createFabricCanvas, renderFabricCanvas, rgbaToFabricImage } from "./canvas/fabric.js";

/**
 * 时间线管理类 - 管理所有元素的时间轴和渲染
 */
export class Timeline {
  constructor(parsedConfig, globalConfig) {
    this.elements = parsedConfig.elements;
    this.duration = parsedConfig.duration;
    this.width = parsedConfig.width;
    this.height = parsedConfig.height;
    this.fps = parsedConfig.fps;
    this.globalConfig = globalConfig;
  }

  /**
   * 获取指定时间的合成帧
   */
  async getCompositeFrameAtTime(time, canvas) {
    if (!canvas) {
      canvas = createFabricCanvas({ 
        width: this.width, 
        height: this.height 
      });
    }

    // 按层级顺序渲染元素
    const activeElements = this.getActiveElementsAtTime(time);
    
    for (const element of activeElements) {
      try {
        const progress = element.getProgressAtTime(time);
        const frameData = await element.readNextFrame(time, canvas);
        if (frameData) {
          // 将帧数据添加到画布
          await this.addFrameToCanvas(canvas, frameData, element);
        }
      } catch (error) {
        console.warn(`渲染元素失败: ${element.type}`, error);
      }
    }

    return await renderFabricCanvas(canvas);
  }

  /**
   * 获取指定时间活跃的元素
   */
  getActiveElementsAtTime(time) {
    return this.elements
      .filter(element => {
        return time >= element.startTime && time < element.endTime;
      })
      .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)); // 按层级排序
  }

  /**
   * 将帧数据添加到画布
   */
  async addFrameToCanvas(canvas, frameData, element) {
    if (frameData instanceof Buffer) {
      // RGBA 数据 - 需要根据元素的实际尺寸创建图像
      const elementWidth = element.width || this.width;
      const elementHeight = element.height || this.height;
      
      const fabricImage = await rgbaToFabricImage({ 
        width: elementWidth, 
        height: elementHeight, 
        rgba: frameData 
      });
      
      // 设置位置和变换
      if (element.x !== undefined) fabricImage.set('left', element.x);
      if (element.y !== undefined) fabricImage.set('top', element.y);
      if (element.scaleX !== undefined) fabricImage.set('scaleX', element.scaleX);
      if (element.scaleY !== undefined) fabricImage.set('scaleY', element.scaleY);
      if (element.rotation !== undefined) fabricImage.set('angle', element.rotation);
      if (element.opacity !== undefined) fabricImage.set('opacity', element.opacity);
      
      canvas.add(fabricImage);
    } else if (frameData && typeof frameData === 'object' && frameData.data && frameData.width && frameData.height) {
      // 新的数据格式 - 包含变换信息（RGBA 数据）
      const fabricImage = await rgbaToFabricImage({ 
        width: frameData.width, 
        height: frameData.height, 
        rgba: frameData.data 
      });
      
      // 设置位置和变换
      if (frameData.x !== undefined) fabricImage.set('left', frameData.x);
      if (frameData.y !== undefined) fabricImage.set('top', frameData.y);
      if (frameData.scaleX !== undefined) fabricImage.set('scaleX', frameData.scaleX);
      if (frameData.scaleY !== undefined) fabricImage.set('scaleY', frameData.scaleY);
      if (frameData.rotation !== undefined) fabricImage.set('angle', frameData.rotation);
      if (frameData.opacity !== undefined) fabricImage.set('opacity', frameData.opacity);
      
      canvas.add(fabricImage);
    } else if (frameData && typeof frameData === 'object' && frameData.constructor && frameData.constructor.name) {
      console.log("📦 处理 Fabric 对象数据");
      // Fabric 对象 - 设置位置和变换
      if (element.x !== undefined) frameData.set('left', element.x);
      if (element.y !== undefined) frameData.set('top', element.y);
      if (element.scaleX !== undefined) frameData.set('scaleX', element.scaleX);
      if (element.scaleY !== undefined) frameData.set('scaleY', element.scaleY);
      if (element.rotation !== undefined) frameData.set('angle', element.rotation);
      if (element.opacity !== undefined) frameData.set('opacity', element.opacity);
      
      canvas.add(frameData);
    }
  }

  /**
   * 关闭所有元素
   */
  async close() {
    for (const element of this.elements) {
      if (element.close) {
        await element.close();
      }
    }
  }
}
