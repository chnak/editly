import { createFabricCanvas, renderFabricCanvas, rgbaToFabricImage } from "./canvas/fabric.js";

/**
 * 时间线管理类 - 管理所有元素的时间轴和渲染
 */
export class Timeline {
  constructor(parsedConfig, globalConfig) {
    this.elements = parsedConfig.elements;
    this.duration = parsedConfig.duration;
    this.canvasWidth= parsedConfig.canvasWidth;
    this.canvasHeight = parsedConfig.canvasHeight;
    this.fps = parsedConfig.fps;
    this.globalConfig = globalConfig;

  }

  /**
   * 获取指定时间的合成帧
   */
  async getCompositeFrameAtTime(time, canvas) {
    if (!canvas) {
      canvas = createFabricCanvas({ 
        width: this.canvasWidth, 
        height: this.canvasHeight 
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
        // 对于关键错误（如文件不存在），抛出异常以停止渲染
        if (error.message.includes('Command failed') || error.message.includes('ENOENT')) {
          throw error;
        }
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
      const elementWidth = element.width || this.canvasWidth;
      const elementHeight = element.height || this.canvasHeight;
      
      const fabricImage = await rgbaToFabricImage({ 
        width: elementWidth, 
        height: elementHeight, 
        rgba: frameData 
      });
      
      canvas.add(fabricImage);
    } else if (frameData && typeof frameData === 'object' && frameData.data && frameData.width && frameData.height) {
      // 新的数据格式 - 包含变换信息（RGBA 数据）
      const fabricImage = await rgbaToFabricImage({ 
        width: frameData.width, 
        height: frameData.height, 
        rgba: frameData.data 
      });
      
      // 根据元素的标志位决定是否应用位置信息
      if (frameData.applyPositionInTimeline && frameData.x !== undefined && frameData.y !== undefined) {
        fabricImage.set('left', frameData.x);
        fabricImage.set('top', frameData.y);
        if (frameData.originX !== undefined) {
          fabricImage.set('originX', frameData.originX);
        }
        if (frameData.originY !== undefined) {
          fabricImage.set('originY', frameData.originY);
        }
      }
      
      // 应用变换信息（所有元素都需要）
      if (frameData.scaleX !== undefined) {
        fabricImage.set('scaleX', frameData.scaleX);
      }
      if (frameData.scaleY !== undefined) {
        fabricImage.set('scaleY', frameData.scaleY);
      }
      if (frameData.rotation !== undefined) {
        fabricImage.set('angle', frameData.rotation);
      }
      if (frameData.opacity !== undefined) {
        fabricImage.set('opacity', frameData.opacity);
      }
      
      canvas.add(fabricImage);
    } else if (frameData && typeof frameData === 'object' && frameData.constructor && frameData.constructor.name) {
      console.log("📦 处理 Fabric 对象数据");
      // Fabric 对象 - 位置信息已在元素处理器中设置
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
