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
    if (!frameData) return;

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
    
    if (frameData instanceof Buffer) {
      // 旧格式 RGBA 数据 - 根据元素尺寸创建图像
      const elementWidth = element.width || this.canvasWidth;
      const elementHeight = element.height || this.canvasHeight;
      
      const fabricImage = await rgbaToFabricImage({ 
        width: elementWidth, 
        height: elementHeight, 
        rgba: frameData 
      });
      
      canvas.add(fabricImage);
    } else if (frameData.data && frameData.width && frameData.height) {
      // 新格式 RGBA 数据 - 包含变换信息
      const fabricImage = await rgbaToFabricImage({ 
        width: frameData.width, 
        height: frameData.height, 
        rgba: frameData.data 
      });
      
      // 应用变换信息
      this.applyFabricTransform(fabricImage, frameData);
      canvas.add(fabricImage);
    } else if (frameData.constructor && frameData.constructor.name) {
      // Fabric 对象 - 变换信息已在元素处理器中设置
      canvas.add(frameData);
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
