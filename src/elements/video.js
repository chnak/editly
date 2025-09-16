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
    
    // 视频特有属性
    this.videoWidth = config.videoWidth || config.width;
    this.videoHeight = config.videoHeight || config.height;
    this.fit = config.fit || 'cover'; // 'cover', 'contain', 'fill', 'scale-down'
  }

  async initialize() {
    await super.initialize();
    
    if (this.source) {
      // 获取位置属性
      const positionProps = this.getPositionProps();
      
      this.videoElement = await createVideoElement({
        source: this.source,
        width: this.videoWidth,
        height: this.videoHeight,
        fps: this.fps,
        fit: this.fit,
        left: positionProps.left,
        top: positionProps.top,
        originX: positionProps.originX,
        originY: positionProps.originY
      });
    }
  }

  async readNextFrame(time, canvas) {
    if (!this.videoElement) {
      await this.initialize();
    }
    
    if (!this.videoElement) {
      return null;
    }

    const progress = this.getProgressAtTime(time);
    const transform = this.getTransformAtTime(time);
    
    // 获取视频帧
    const frameData = await this.videoElement.readNextFrame(progress, canvas);
    
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
      originY: positionProps.originY
    };
  }

  async close() {
    if (this.videoElement && this.videoElement.close) {
      await this.videoElement.close();
    }
  }
}
