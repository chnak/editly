import { BaseElement } from "./base.js";
import { createTextElement } from "./textProcessor.js";
import { parseSizeValue } from "../utils/positionUtils.js";

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
    // 解析最大宽度，支持百分比和像素单位
    this.maxWidth = config.maxWidth ? parseSizeValue(config.maxWidth, this.canvasWidth) : undefined;
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
    
    if (frameData) {
      // 更新元素的尺寸
      if (frameData.width) this.width = frameData.width;
      if (frameData.height) this.height = frameData.height;
      
      // 创建完整的帧数据，包含所有变换信息
      return this.createCompleteFrameData(frameData, transform);
    }
    
    return null;
  }


  async close() {
    if (this.textElement && this.textElement.close) {
      await this.textElement.close();
    }
  }
}
