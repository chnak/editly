import { BaseElement } from "./base.js";
import { createShapeElement } from "./shapeProcessor.js";

/**
 * 形状元素
 */
export class ShapeElement extends BaseElement {
  constructor(config) {
    super(config);
    this.shape = config.shape || 'rectangle'; // rectangle, circle, triangle, etc.
    this.fillColor = config.fillColor || '#ffffff';
    this.strokeColor = config.strokeColor;
    this.strokeWidth = config.strokeWidth || 0;
    this.shapeWidth = config.shapeWidth || 100;
    this.shapeHeight = config.shapeHeight || 100;
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
      width: this.width,
      height: this.height
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
    if (this.shapeElement && this.shapeElement.close) {
      await this.shapeElement.close();
    }
  }
}
