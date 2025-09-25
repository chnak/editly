import { BaseElement } from "./base.js";
import { createVideoElement } from "./videoProcessor.js";
import { parseSizeValue } from "../utils/positionUtils.js";

/**
 * 视频元素
 */
export class VideoElement extends BaseElement {
  constructor(config) {
    super(config);
    this.source = config.source||config.src;
    this.track = config.track || 1;
    this.transition = config.transition;
    this.videoElement = null;
    this.canvasWidth = config.canvasWidth;
    this.canvasHeight = config.canvasHeight;
    // 视频特有属性 - 解析尺寸值，支持百分比和像素单位
    this.videoWidth = config.width ? parseSizeValue(config.width, this.canvasWidth) : this.canvasWidth;
    this.videoHeight = config.height ? parseSizeValue(config.height, this.canvasHeight) : this.canvasHeight;
    this.fit = config.fit || 'cover'; // 'cover', 'contain', 'fill', 'scale-down'
    
    // 视频截取属性
    this.cutFrom = config.cutFrom; // 开始时间（秒）
    this.cutTo = config.cutTo; // 结束时间（秒）
    this.speedFactor = config.speedFactor || 1; // 播放速度倍数
    
    // 视频循环属性
    this.loop = config.loop || false; // 是否循环播放
  }

  async initialize() {
    await super.initialize();
    
    if (this.source) {
      this.videoElement = await createVideoElement({
        source: this.source,
        width: this.videoWidth,
        height: this.videoHeight,
        fps: this.fps,
        fit: this.fit,
        cutFrom: this.cutFrom,
        cutTo: this.cutTo,
        speedFactor: this.speedFactor,
        loop: this.loop,
        elementDuration: this.duration,
        containerWidth: this.canvasWidth,
        containerHeight: this.canvasHeight
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
      // 创建完整的帧数据，包含所有变换信息
      return this.createCompleteFrameData(frameData, transform);
    }
    
    return null;
  }


  async close() {
    if (this.videoElement && this.videoElement.close) {
      await this.videoElement.close();
    }
  }
}
