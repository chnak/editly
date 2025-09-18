import { BaseElement } from "./base.js";
import { createImageElement } from "./imageProcessor.js";

/**
 * 图像元素
 */
export class ImageElement extends BaseElement {
  constructor(config) {
    super(config);
    this.source = config.source;
    this.imageElement = null;
    
    // 图片特有属性
    this.imageWidth = config.imageWidth || config.width;
    this.imageHeight = config.imageHeight || config.height;
    this.fit = config.fit || 'cover'; // 'cover', 'contain', 'fill', 'scale-down'
  }

  async initialize() {
    await super.initialize();
    
    if (this.source) {
      this.imageElement = await createImageElement({
        source: this.source,
        width: this.imageWidth,
        height: this.imageHeight,
        fit: this.fit,
        containerWidth: this.width,
        containerHeight: this.height
      });
    }
  }

  async readNextFrame(time, canvas) {
    await this.initialize();
    
    if (!this.imageElement) {
      return null;
    }

    const progress = this.getProgressAtTime(time);
    const transform = this.getTransformAtTime(time);
    
    // 获取图像帧
    const frameData = await this.imageElement.readNextFrame(progress);
    
    if (frameData) {
      // 应用变换
      return this.applyTransform(frameData, transform);
    }
    
    return null;
  }

  applyTransform(frameData, transform) {
    // 获取位置属性
    const positionProps = this.getPositionProps();
    
    // 应用变换
    return {
      ...frameData,
      x: positionProps.left,
      y: positionProps.top,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
      rotation: transform.rotation,
      opacity: transform.opacity,
      originX: positionProps.originX,
      originY: positionProps.originY,
      // 添加标志位，表示需要在 addFrameToCanvas 中应用位置信息
      applyPositionInTimeline: true
    };
  }

  async close() {
    if (this.imageElement && this.imageElement.close) {
      await this.imageElement.close();
    }
  }
}
