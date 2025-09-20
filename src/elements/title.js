import { BaseElement } from "./base.js";
import { createTitleElement } from "./titleProcessor.js";

/**
 * 标题元素 - 参考 editly 的 title 实现
 */
export class TitleElement extends BaseElement {
  constructor(config) {
    super(config);
    this.text = config.text || '';
    this.font = config.font;
    this.fontPath = config.fontPath;
    this.fontFamily = config.fontFamily;
    this.fontSize = config.fontSize || 72; // 添加 fontSize 参数，默认 72px
    this.textColor = config.textColor || '#ffffff';
    this.position = config.position || 'center';
    this.zoomDirection = config.zoomDirection; // 不设置默认值，只有传入时才启用
    this.zoomAmount = config.zoomAmount || 0.2;
    this.animate = config.animate || [];
    this.split = config.split || null;
    this.splitDelay = config.splitDelay || 0.1;
    this.splitDuration = config.splitDuration || 0.3;
    this.titleElement = null;
    this.canvasWidth = config.canvasWidth;
    this.canvasHeight = config.canvasHeight;
  }

  async initialize() {
    await super.initialize();
    
    if (!this.titleElement) {
      this.titleElement = await createTitleElement({
        text: this.text,
        font: this.font,
        fontPath: this.fontPath,
        fontFamily: this.fontFamily,
        fontSize: this.fontSize, // 传递 fontSize 参数
        textColor: this.textColor,
        position: this.position,
        x: this.x,
        y: this.y,
        zoomDirection: this.zoomDirection,
        zoomAmount: this.zoomAmount,
        animations: this.animations, // 传递 animations 参数
        split: this.split,
        splitDelay: this.splitDelay,
        splitDuration: this.splitDuration,
        width: this.canvasWidth,
        height: this.canvasHeight
      });
    }
  }

  async readNextFrame(time, canvas) {
    await this.initialize();
    
    if (!this.titleElement) {
      return null;
    }

    const progress = this.getProgressAtTime(time);
    const transform = this.getTransformAtTime(time);
    
    // 获取标题帧
    const frameData = await this.titleElement.readNextFrame(progress, canvas);
    
    if (frameData && frameData.data) {
      // 更新元素的尺寸
      this.width = frameData.width;
      this.height = frameData.height;
      
      // 应用动画变换 - 返回变换后的数据
      return {
        data: frameData.data,
        width: frameData.width,
        height: frameData.height,
        x: transform.x,
        y: transform.y,
        scaleX: transform.scaleX,
        scaleY: transform.scaleY,
        rotation: transform.rotation,
        opacity: transform.opacity,
        rotationX: transform.rotationX,
        rotationY: transform.rotationY,
        translateZ: transform.translateZ
      };
    } else if (frameData && typeof frameData === 'object' && frameData.constructor && frameData.constructor.name) {
      // Fabric 对象 - 应用动画变换
      if (frameData.set) {
        frameData.set({
          left: transform.x,
          top: transform.y,
          scaleX: transform.scaleX,
          scaleY: transform.scaleY,
          angle: transform.rotation,
          opacity: transform.opacity,
          rotationX: transform.rotationX,
          rotationY: transform.rotationY,
          translateZ: transform.translateZ
        });
      }
      return frameData;
    }
    
    return null;
  }

  async close() {
    if (this.titleElement) {
      await this.titleElement.close();
    }
    await super.close();
  }
}
