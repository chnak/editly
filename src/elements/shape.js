import { BaseElement } from "./base.js";
import { createShapeElement } from "./shapeProcessor.js";
import { parseSizeValue } from "../utils/positionUtils.js";

/**
 * 形状元素
 */
export class ShapeElement extends BaseElement {
  constructor(config) {
    super(config);
    this.shape = config.shape || 'rectangle'; // rectangle, circle, triangle, etc.
    this.fillColor = config.fillColor || config.fill || '#ffffff';
    this.strokeColor = config.strokeColor;
    this.strokeWidth = config.strokeWidth || 0;
    // 解析尺寸值，支持百分比和像素单位
    this.shapeWidth = config.width ? parseSizeValue(config.width, this.canvasWidth) : 100;
    this.shapeHeight = config.height ? parseSizeValue(config.height, this.canvasHeight) : 100;
    this.shapeElement = null;
  }

  async initialize() {
    await super.initialize();
    
    this.shapeElement = await createShapeElement({
      shape: this.shape,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      shapeWidth: this.shapeWidth,
      shapeHeight: this.shapeHeight,
      width: this.canvasWidth,
      height: this.canvasHeight
    });
  }

  async readNextFrame(time, canvas) {
    await this.initialize();
    
    if (!this.shapeElement) {
      return null;
    }

    const progress = this.getProgressAtTime(time);
    const transform = this.getTransformAtTime(time);
    
    // 获取形状帧
    const frameData = await this.shapeElement.readNextFrame(progress, canvas);
    
    if (frameData) {
      // 创建完整的帧数据，包含所有变换信息
      return this.createCompleteFrameData(frameData, transform);
    }
    
    return null;
  }


  async close() {
    if (this.shapeElement && this.shapeElement.close) {
      await this.shapeElement.close();
    }
  }
}
