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
    this.textColor = config.textColor || '#ffffff';
    this.position = config.position || 'center';
    this.zoomDirection = config.zoomDirection || 'in';
    this.zoomAmount = config.zoomAmount || 0.2;
    this.animate = config.animate || [];
    this.split = config.split || null;
    this.splitDelay = config.splitDelay || 0.1;
    this.splitDuration = config.splitDuration || 0.3;
    this.titleElement = null;
  }

  async initialize() {
    await super.initialize();
    
    
    this.titleElement = await createTitleElement({
      text: this.text,
      font: this.font,
      fontPath: this.fontPath,
      fontFamily: this.fontFamily,
      textColor: this.textColor,
      position: this.position,
      zoomDirection: this.zoomDirection,
      zoomAmount: this.zoomAmount,
      animate: this.animate,
      split: this.split,
      splitDelay: this.splitDelay,
      splitDuration: this.splitDuration,
      width: this.width,
      height: this.height
    });
    
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
      
      return {
        data: frameData.data,
        width: frameData.width,
        height: frameData.height,
        x: transform.x,
        y: transform.y,
        scaleX: transform.scaleX,
        scaleY: transform.scaleY,
        rotation: transform.rotation,
        opacity: transform.opacity
      };
    } else if (frameData && typeof frameData === 'object' && frameData.constructor && frameData.constructor.name) {
      // Fabric 对象 - 直接返回，让 Timeline 处理
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
