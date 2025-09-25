import { VideoElement } from "./elements/video.js";
import { ImageElement } from "./elements/image.js";
import { TextElement } from "./elements/text.js";
import { TitleElement } from "./elements/title.js";
import { SubtitleElement } from "./elements/subtitle.js";
import { ShapeElement } from "./elements/shape.js";
import { CompositionElement } from "./elements/composition.js";
import { AudioElement } from "./elements/audio.js";

/**
 * 配置解析器 - 将 Creatomate 风格的配置转换为内部格式
 */
export class ConfigParser {
  constructor(config) {
    this.config = config;
    this.canvasWidth = config.width||1280;
    this.canvasHeight = config.height||720;
    this.elementTypes = {
      video: VideoElement,
      image: ImageElement,
      text: TitleElement, // 将 text 类型映射到 TitleElement
      title: TitleElement,
      subtitle: SubtitleElement,
      shape: ShapeElement,
      composition: CompositionElement,
      audio: AudioElement
    };
  }

  /**
   * 解析配置
   */
  async parse() {
    const elements = [];
    let totalDuration = 0;

    // 解析元素
    for (const elementConfig of this.config.elements) {
      const element = await this.createElement(elementConfig);
      if (element) {
        elements.push(element);
        totalDuration = Math.max(totalDuration, element.endTime);
      }
    }

    return {
      elements,
      duration: totalDuration,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      fps: this.config.fps,
      transitions: this.config.transitions || []
    };
  }

  /**
   * 创建元素实例
   */
  async createElement(elementConfig) {
    const ElementClass = this.elementTypes[elementConfig.type];
    if (!ElementClass) {
      console.warn(`未知的元素类型: ${elementConfig.type}`);
      return null;
    }

    // 计算时间信息
    const startTime = elementConfig.startTime || 0;
    const duration = elementConfig.duration || this.config.defaults.duration;
    const endTime = startTime + duration;

    // 创建元素实例
    const element = new ElementClass({
      ...elementConfig,
      startTime,
      duration,
      endTime,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      fps: this.config.fps
    });

    return element;
  }
}
