import EventEmitter from "events";
import { VideoRenderer } from "./renderer.js";
import { ConfigParser } from "./configParser.js";
import { Timeline } from "./timeline.js";

/**
 * 基于 Creatomate 配置结构的视频制作库
 * 结合 editly 的帧渲染机制
 */
export class VideoMaker extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      // 输出设置
      outputFormat: config.outputFormat || 'mp4',
      width: config.width || 1920,
      height: config.height || 1080,
      fps: config.fps || 30,
      duration: config.duration || 4,
      
      // 渲染设置
      verbose: config.verbose || false,
      fast: config.fast || false,
      outPath: config.outPath || 'output.mp4',
      playbackSpeed: config.playbackSpeed || 1.0, // 倍速播放，默认1.0倍速
      
      // Creatomate 风格的元素配置
      elements: config.elements || [],
      
      // 过渡效果配置
      transitions: config.transitions || [],
      
      // 全局默认值
      defaults: {
        duration: 4,
        transition: {
          duration: 0.5,
          name: "fade",
          easing: "linear"
        },
        ...config.defaults
      }
    };
    
    this.timeline = null;
    this.renderer = null;
  }

  /**
   * 开始渲染视频
   */
  async start() {
    try {
      this.emit('start');
      
      // 解析配置
      const configParser = new ConfigParser(this.config);
      const parsedConfig = await configParser.parse();
      
      // 创建时间线
      this.timeline = new Timeline(parsedConfig, this.config);
      
      // 创建渲染器
      this.renderer = new VideoRenderer(this.config);
      
      // 开始渲染
      const outputPath = await this.renderer.render(this.timeline);
      
      this.emit('complete', outputPath);
      return outputPath;
      
    } catch (error) {
      this.emit('error', error);
      // 确保在错误时也清理资源
      try {
        await this.close();
      } catch (closeError) {
        console.warn('清理资源时出错:', closeError.message);
      }
      throw error;
    }
  }

  /**
   * 关闭资源
   */
  async close() {
    if (this.timeline) {
      await this.timeline.close();
    }
    if (this.renderer) {
      await this.renderer.close();
    }
  }
}

// 导出元素类
export { VideoElement } from "./elements/video.js";
export { ImageElement } from "./elements/image.js";
export { TextElement } from "./elements/text.js";
export { ShapeElement } from "./elements/shape.js";
export { CompositionElement } from "./elements/composition.js";

// 导出工具类
export { Transition } from "./transitions/transition.js";

// 导出动画系统
export { 
  AnimationManager, 
  KeyframeAnimation,
  animationManager 
} from "./animations/AnimationManager.js";
export { Animation } from "./animations/animation.js";

export { 
  AnimationBuilder, 
  PresetBuilder,
  createAnimationBuilder, 
  createPresetBuilder,
  quickAnimation,
  quickPreset
} from "./animations/AnimationBuilder.js";

// 导出场景系统
export { SceneManager, Scene } from "./scenes/SceneManager.js";
export { SceneTemplateManager } from "./scenes/SceneTemplates.js";

export default VideoMaker;
