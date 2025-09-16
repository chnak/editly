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
  }

  async initialize() {
    await super.initialize();
    
    if (this.source) {
      this.imageElement = await createImageElement({
        source: this.source,
        width: this.width,
        height: this.height
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
    // 这里应该实现图像帧的变换
    // 简化实现，直接返回原始帧数据
    return frameData;
  }

  async close() {
    if (this.imageElement && this.imageElement.close) {
      await this.imageElement.close();
    }
  }
}
