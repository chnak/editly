import { BaseElement } from "./base.js";
import { createTitleElement } from "./titleProcessor.js";

/**
 * 标题元素 - 参考 editly 的 title 实现
 */
export class TitleElement extends BaseElement {
  constructor(config) {
    super(config);
    this.text = config.text || '';
    this.font = config.font;
    this.fontPath = config.fontPath;
    this.fontFamily = config.fontFamily;
    this.fontSize = config.fontSize || 72; // 添加 fontSize 参数，默认 72px
    this.textColor = config.textColor || '#ffffff';
    this.position = config.position || 'center';
    this.zoomDirection = config.zoomDirection; // 不设置默认值，只有传入时才启用
    this.zoomAmount = config.zoomAmount || 0.2;
    this.animate = config.animate || [];
    this.split = config.split || null;
    this.splitDelay = config.splitDelay || 0.1;
    this.splitDuration = config.splitDuration || 0.3;
    this.titleElement = null;
    this.canvasWidth = config.canvasWidth;
    this.canvasHeight = config.canvasHeight;
    
    // 阴影配置
    this.shadow = config.shadow || null;
    this.shadowColor = config.shadowColor || '#000000';
    this.shadowBlur = config.shadowBlur || 0;
    this.shadowOffsetX = config.shadowOffsetX || 0;
    this.shadowOffsetY = config.shadowOffsetY || 0;
    
    // 文本边框配置
    this.stroke = config.stroke || null;
    this.strokeColor = config.strokeColor || '#000000';
    this.strokeWidth = config.strokeWidth || 1;
    
    // 渐变填充配置
    this.gradient = config.gradient || null;
    this.gradientType = config.gradientType || 'linear'; // 'linear' 或 'radial'
    this.gradientColors = config.gradientColors || ['#ff0000', '#0000ff'];
    this.gradientDirection = config.gradientDirection || 'horizontal'; // 'horizontal', 'vertical', 'diagonal'
    
    // 文字装饰配置
    this.underline = config.underline || false;
    this.linethrough = config.linethrough || false;
    this.overline = config.overline || false;
    
    // 文字发光效果
    this.glow = config.glow || null;
    this.glowColor = config.glowColor || '#ffffff';
    this.glowBlur = config.glowBlur || 10;
    
    // 文字变形效果
    this.skewX = config.skewX || 0;
    this.skewY = config.skewY || 0;
    
    // 文字路径效果
    this.textPath = config.textPath || null;
    this.pathData = config.pathData || null;
    
    // 文字遮罩效果
    this.textMask = config.textMask || null;
    this.maskImage = config.maskImage || null;
    
    // 打字机效果
    this.typewriter = config.typewriter || null;
    this.typewriterSpeed = config.typewriterSpeed || 100;
    this.typewriterDelay = config.typewriterDelay || 0;
  }

  async initialize() {
    await super.initialize();
    
    if (!this.titleElement) {
      this.titleElement = await createTitleElement({
        text: this.text,
        font: this.font,
        fontPath: this.fontPath,
        fontFamily: this.fontFamily,
        fontSize: this.fontSize, // 传递 fontSize 参数
        textColor: this.textColor,
        position: this.position,
        x: this.x,
        y: this.y,
        originX: this.originX,
        originY: this.originY,
        zoomDirection: this.zoomDirection,
        zoomAmount: this.zoomAmount,
        animations: this.animations, // 传递 animations 参数
        split: this.split,
        splitDelay: this.splitDelay,
        splitDuration: this.splitDuration,
        duration: this.duration,
        width: this.canvasWidth,
        height: this.canvasHeight,
        // 传递阴影配置
        shadow: this.shadow,
        shadowColor: this.shadowColor,
        shadowBlur: this.shadowBlur,
        shadowOffsetX: this.shadowOffsetX,
        shadowOffsetY: this.shadowOffsetY,
        // 传递边框配置
        stroke: this.stroke,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        // 传递渐变配置
        gradient: this.gradient,
        gradientType: this.gradientType,
        gradientColors: this.gradientColors,
        gradientDirection: this.gradientDirection,
        // 传递文字装饰配置
        underline: this.underline,
        linethrough: this.linethrough,
        overline: this.overline,
        // 传递发光效果配置
        glow: this.glow,
        glowColor: this.glowColor,
        glowBlur: this.glowBlur,
        // 传递变形效果配置
        skewX: this.skewX,
        skewY: this.skewY,
        // 传递路径效果配置
        textPath: this.textPath,
        pathData: this.pathData,
        // 传递遮罩效果配置
        textMask: this.textMask,
        maskImage: this.maskImage,
        // 传递打字机效果配置
        typewriter: this.typewriter,
        typewriterSpeed: this.typewriterSpeed,
        typewriterDelay: this.typewriterDelay
      });
    }
  }

  async readNextFrame(time, canvas) {
    await this.initialize();
    
    if (!this.titleElement) {
      return null;
    }

    const progress = this.getProgressAtTime(time);
    const transform = this.getTransformAtTime(time);
    
    // 获取标题帧
    const frameData = await this.titleElement.readNextFrame(progress, canvas, time);
    
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
    if (this.titleElement) {
      await this.titleElement.close();
    }
    await super.close();
  }
}
