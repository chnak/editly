import { BaseElement } from "./base.js";
import { ConfigParser } from "../configParser.js";

/**
 * 组合元素 - 包含多个子元素的容器
 */
export class CompositionElement extends BaseElement {
  constructor(config) {
    super(config);
    this.elements = config.elements || [];
    this.subElements = [];
    this.configParser = null;
  }

  async initialize() {
    await super.initialize();
    
    // 解析子元素
    this.configParser = new ConfigParser({
      elements: this.elements,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      fps: this.fps,
      defaults: this.config.defaults || {}
    });
    
    const parsedConfig = await this.configParser.parse();
    this.subElements = parsedConfig.elements;
  }

  async readNextFrame(time, canvas) {
    await this.initialize();
    
    const progress = this.getProgressAtTime(time);
    const transform = this.getTransformAtTime(time);
    
    // 创建子画布
    const subCanvas = canvas; // 使用同一个画布进行合成
    
    // 渲染所有子元素
    for (const element of this.subElements) {
      try {
        const frameData = await element.readNextFrame(time, subCanvas);
        if (frameData) {
          // 应用变换
          const transformedFrame = this.applyTransform(frameData, transform);
          // 这里应该将变换后的帧添加到画布
        }
      } catch (error) {
        console.warn(`渲染子元素失败: ${element.type}`, error);
      }
    }
    
    return null; // 组合元素不直接返回帧数据，而是通过子元素渲染到画布
  }

  applyTransform(frameData, transform) {
    // 这里应该实现组合元素的变换
    return frameData;
  }

  async close() {
    // 关闭所有子元素
    for (const element of this.subElements) {
      if (element.close) {
        await element.close();
      }
    }
  }
}
