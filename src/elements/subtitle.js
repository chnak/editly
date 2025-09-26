import { BaseElement } from "./base.js";
import { createTextElement } from "./subtitleProcessor.js";
import { parseSizeValue } from "../utils/positionUtils.js";

/**
 * 文本元素
 */
export class SubtitleElement extends BaseElement {
  constructor(config) {
    super(config);
    // console.log(`[SubtitleElement] 构造函数接收配置:`, {
    //   text: config.text?.substring(0, 20) + '...',
    //   audio: config.audio,
    //   volume: config.volume
    // });
    
    this.text = config.text || '';
    this.font = config.font;
    this.fontPath = config.fontPath;
    this.fontFamily = config.fontFamily;
    this.fillColor = config.fillColor || '#ffffff';
    this.strokeColor = config.strokeColor;
    this.strokeWidth = config.strokeWidth || 0;
    this.textAlign = config.textAlign || 'left';
    this.textBaseline = config.textBaseline || 'top';
    this.lineHeight = config.lineHeight || 1.2;
    this.backgroundColor = config.backgroundColor || 'rgba(0, 0, 0, 0.3)';
    this.position = config.position || 'bottom';
    this.padding = config.padding || 10;
    this.audio = config.audio;
    this.audioSegments = config.audioSegments||config.audioElements||[];
    this.volume = config.volume;
    this.fadeIn = config.fadeIn;
    this.fadeOut = config.fadeOut;
    
    // console.log(`[SubtitleElement] 设置后的属性:`, {
    //   audio: this.audio,
    //   volume: this.volume
    // });
    // 解析最大宽度，支持百分比和像素单位
    this.maxWidth = config.maxWidth ? parseSizeValue(config.maxWidth, this.canvasWidth) : undefined;
    this.textElement = null;
  }

  async initialize() {
    await super.initialize();
    
    // console.log(`🔍 初始化文本元素:`, {
    //   text: this.text,
    //   font: this.font,
    //   fillColor: this.fillColor
    // });
    
    this.textElement = await createTextElement({
      text: this.text,
      font: this.font,
      fontPath: this.fontPath,
      fontFamily: this.fontFamily,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      textAlign: this.textAlign,
      textBaseline: this.textBaseline,
      lineHeight: this.lineHeight,
      maxWidth: this.maxWidth,
      duration: this.duration,
      width: this.width,
      height: this.height,
      backgroundColor: this.backgroundColor,
      position: this.position,
      padding: this.padding,
      audio: this.audio,
      audioSegments: this.audioSegments,
      volume: this.volume,
      fadeIn: this.fadeIn,
      fadeOut: this.fadeOut
    });
    
    //console.log(`✅ 文本元素初始化完成:`, this.textElement ? '成功' : '失败');
  }

  async readNextFrame(time, canvas) {
    await this.initialize();
    
    if (!this.textElement) {
      return null;
    }

    const progress = this.getProgressAtTime(time);
    const transform = this.getTransformAtTime(time);
    
    // 获取文本帧
    const frameData = await this.textElement.readNextFrame(progress, canvas);
    
    if (frameData) {
      // 更新元素的尺寸
      if (frameData.width) this.width = frameData.width;
      if (frameData.height) this.height = frameData.height;
      
      // 创建完整的帧数据，包含所有变换信息
      return this.createCompleteFrameData(frameData, transform);
    }
    
    return null;
  }

  /**
   * 获取音频元素列表（用于渲染器）
   */
  async getAudioElements() {
    // console.log(`[SubtitleElement] getAudioElements 被调用`);
    
    // 确保 textElement 被初始化
    if (!this.textElement) {
      // console.log(`[SubtitleElement] textElement 不存在，尝试初始化`);
      await this.initialize();
    }
    
    if (!this.textElement) {
      // console.log(`[SubtitleElement] textElement 初始化失败`);
      return [];
    }
    
    // console.log(`[SubtitleElement] textElement 存在，检查 getAudioElements 方法`);
    
    // 如果 textElement 有 getAudioElements 方法，调用它
    if (typeof this.textElement.getAudioElements === 'function') {
      // console.log(`[SubtitleElement] 调用 textElement.getAudioElements()`);
      const audioElements = this.textElement.getAudioElements();
      // console.log(`[SubtitleElement] textElement 返回 ${audioElements.length} 个音频元素`);
      return audioElements;
    }
    
    // console.log(`[SubtitleElement] textElement 没有 getAudioElements 方法`);
    return [];
  }


  async close() {
    if (this.textElement && this.textElement.close) {
      await this.textElement.close();
    }
  }
}
