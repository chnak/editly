import { BaseElement } from "./base.js";
import { createImageElement } from "./imageProcessor.js";
import { parseSizeValue } from "../utils/positionUtils.js";

/**
 * 图像元素
 */
export class ImageElement extends BaseElement {
  constructor(config) {
    super(config);
    this.source = config.source||config.src;
    this.imageElement = null;
    this.canvasWidth = config.canvasWidth;
    this.canvasHeight = config.canvasHeight;
    // 图片特有属性
    // 解析尺寸值，支持百分比和像素单位
    this.imageWidth = config.width ? parseSizeValue(config.width, this.canvasWidth) : this.canvasWidth;
    this.imageHeight = config.height ? parseSizeValue(config.height, this.canvasHeight) : this.canvasHeight;
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
        containerWidth: this.canvasWidth,
        containerHeight: this.canvasHeight
      });
    }
  }

  async readNextFrame(time, canvas) {
    if (!this.imageElement) {
      await this.initialize();
    }
    
    if (!this.imageElement) {
      return null;
    }

    const progress = this.getProgressAtTime(time);
    const transform = this.getTransformAtTime(time);
    
    // 获取图像帧
    const frameData = await this.imageElement.readNextFrame(progress);
    
    if (frameData) {
      // 如果返回的是包含背景和前景的对象（contain-blur 模式）
      if (frameData.background && frameData.foreground) {
        return {
          background: this.applyTransformToContainBlurBackground(frameData.background, transform),
          foreground: this.applyTransformToContainBlurForeground(frameData.foreground, transform),
          width: frameData.width,
          height: frameData.height,
          isContainBlur: true
        };
      }
      
      // 创建完整的帧数据，包含所有变换信息
      return this.createCompleteFrameData(frameData, transform);
    }
    
    return null;
  }


  async close() {
    if (this.imageElement && this.imageElement.close) {
      await this.imageElement.close();
    }
  }
}
