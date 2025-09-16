import { BaseElement } from "./base.js";
import { createTextElement } from "./textProcessor.js";

/**
 * 文本元素
 */
export class TextElement extends BaseElement {
  constructor(config) {
    super(config);
    this.text = config.text || '';
    this.font = config.font;
    this.fontPath = config.fontPath;
    this.fontFamily = config.fontFamily;
    this.fillColor = config.fillColor || '#ffffff';
    this.strokeColor = config.strokeColor;
    this.strokeWidth = config.strokeWidth || 0;
    this.textAlign = config.textAlign || 'left';
    this.textBaseline = config.textBaseline || 'top';
    this.lineHeight = config.lineHeight || 1.2;
    this.maxWidth = config.maxWidth;
    this.textElement = null;
  }

  async initialize() {
    await super.initialize();
    
    console.log(`🔍 初始化文本元素:`, {
      text: this.text,
      font: this.font,
      fillColor: this.fillColor
    });
    
    this.textElement = await createTextElement({
      text: this.text,
      font: this.font,
      fontPath: this.fontPath,
      fontFamily: this.fontFamily,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      textAlign: this.textAlign,
      textBaseline: this.textBaseline,
      lineHeight: this.lineHeight,
      maxWidth: this.maxWidth,
      width: this.width,
      height: this.height
    });
    
    console.log(`✅ 文本元素初始化完成:`, this.textElement ? '成功' : '失败');
  }

  async readNextFrame(time, canvas) {
    await this.initialize();
    
    if (!this.textElement) {
      return null;
    }

    const progress = this.getProgressAtTime(time);
    const transform = this.getTransformAtTime(time);
    
    // 获取文本帧
    const frameData = await this.textElement.readNextFrame(progress, canvas);
    
    if (frameData && frameData.data) {
      // 更新元素的尺寸
      this.width = frameData.width;
      this.height = frameData.height;
      
      // 应用变换
      return this.applyTransform(frameData, transform);
    }
    
    return null;
  }

  applyTransform(frameData, transform) {
    // 返回包含变换信息的对象
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
  }

  async close() {
    if (this.textElement && this.textElement.close) {
      await this.textElement.close();
    }
  }
}
