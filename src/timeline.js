import { createFabricCanvas, renderFabricCanvas, rgbaToFabricImage } from "./canvas/fabric.js";
import { Transition } from "../core/transition.js";

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
    // 初始化过渡效果处理器
    this.transitionProcessor = null;
    
    // 处理过渡效果配置
    this.transitions = this.processTransitions(parsedConfig.transitions || []);
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

    // 检查是否有过渡效果需要应用
    const activeTransition = this.getActiveTransitionAtTime(time);
    if (activeTransition) {
      return await this.renderTransitionFrame(time, canvas, activeTransition);
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
   * 处理过渡效果配置
   */
  processTransitions(transitions) {
    const processedTransitions = transitions.map(transition => ({
      name: transition.name || transition.type || 'fade',
      duration: transition.duration || 1,
      easing: transition.easing || 'linear',
      params: transition.params || {},
      startTime: transition.startTime || 0,
      endTime: (transition.startTime || 0) + (transition.duration || 1)
    }));
    //console.log(`[Timeline] 已配置 ${processedTransitions.length} 个过渡效果`);
    return processedTransitions;
  }

  /**
   * 获取指定时间活跃的过渡效果
   */
  getActiveTransitionAtTime(time) {
    return this.transitions.find(transition => {
      return time >= transition.startTime && time < transition.endTime;
    });
  }

  /**
   * 渲染过渡效果帧
   */
  async renderTransitionFrame(time, canvas, transition) {
    const progress = (time - transition.startTime) / transition.duration;
    //console.log(`[Timeline] 渲染过渡帧: ${transition.name} at ${time.toFixed(3)}s, progress=${progress.toFixed(3)}`);
    
    // 获取过渡前的帧（场景A的最后一帧）
    const fromTime = transition.startTime;
    //console.log(`[Timeline] 获取from帧: ${fromTime}s`);
    const fromFrame = await this.getFrameWithoutTransition(fromTime, canvas);
    //console.log(`[Timeline] from帧数据: ${fromFrame.data.length} bytes`);
    
    // 获取过渡后的帧（场景B的第一帧）
    const toTime = transition.endTime;
    //console.log(`[Timeline] 获取to帧: ${toTime}s`);
    const toFrame = await this.getFrameWithoutTransition(toTime, canvas);
    //console.log(`[Timeline] to帧数据: ${toFrame.data.length} bytes`);
    
    // 使用core的Transition类
    if (!this.transitionProcessor) {
      //console.log(`[Timeline] 创建Transition处理器: ${transition.name}`);
      this.transitionProcessor = new Transition({
        name: transition.name || 'fade',
        duration: transition.duration || 1,
        easing: transition.easing || 'linear',
        params: transition.params || {}
      });
    }
    
    // 创建过渡处理器
    //console.log(`[Timeline] 创建过渡处理器: ${this.canvasWidth}x${this.canvasHeight}`);
    const transitionProcessor = this.transitionProcessor.create({
      width: this.canvasWidth,
      height: this.canvasHeight,
      channels: 4
    });
    
    // 应用过渡效果
    //console.log(`[Timeline] 应用过渡效果: progress=${progress.toFixed(3)}`);
    //console.log(`[Timeline] transitionProcessor类型:`, typeof transitionProcessor);
    //  console.log(`[Timeline] transitionProcessor:`, transitionProcessor);
    
    const result = transitionProcessor({
      fromFrame: fromFrame.data,
      toFrame: toFrame.data,
      progress: progress
    });
    
    //  console.log(`[Timeline] 过渡结果: ${result.length} bytes`);
    
    // 直接返回过渡效果的结果数据，而不是包装在对象中
    return result;
  }

  /**
   * 获取不包含过渡效果的帧
   */
  async getFrameWithoutTransition(time, canvas) {
    const tempCanvas = createFabricCanvas({
      width: this.canvasWidth,
      height: this.canvasHeight
    });
    
    const activeElements = this.getActiveElementsAtTime(time);
    
    for (const element of activeElements) {
      try {
        const frameData = await element.readNextFrame(time, tempCanvas);
        if (frameData) {
          await this.addFrameToCanvas(tempCanvas, frameData, element);
        }
      } catch (error) {
        console.warn(`渲染元素失败: ${element.type}`, error);
      }
    }
    
    const rgba = await renderFabricCanvas(tempCanvas);
    return {
      data: rgba,
      width: this.canvasWidth,
      height: this.canvasHeight
    };
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
