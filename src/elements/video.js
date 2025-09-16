import { BaseElement } from "./base.js";
import { createVideoElement } from "./videoProcessor.js";

/**
 * 视频元素
 */
export class VideoElement extends BaseElement {
  constructor(config) {
    super(config);
    this.source = config.source;
    this.track = config.track || 1;
    this.transition = config.transition;
    this.videoElement = null;
  }

  async initialize() {
    await super.initialize();
    
    if (this.source) {
      this.videoElement = await createVideoElement({
        source: this.source,
        width: this.width,
        height: this.height,
        fps: this.fps
      });
    }
  }

  async readNextFrame(time, canvas) {
    await this.initialize();
    
    if (!this.videoElement) {
      return null;
    }

    const progress = this.getProgressAtTime(time);
    const transform = this.getTransformAtTime(time);
    
    // 获取视频帧
    const frameData = await this.videoElement.readNextFrame(progress);
    
    if (frameData) {
      // 应用变换
      return this.applyTransform(frameData, transform);
    }
    
    return null;
  }

  applyTransform(frameData, transform) {
    // 这里应该实现视频帧的变换
    // 简化实现，直接返回原始帧数据
    return frameData;
  }

  async close() {
    if (this.videoElement && this.videoElement.close) {
      await this.videoElement.close();
    }
  }
}
