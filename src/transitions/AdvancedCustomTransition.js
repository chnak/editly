import { Transition } from "./transition.js";
import * as easings from "../utils/easings.js";

/**
 * 高级自定义过渡效果类
 * 支持完全自定义的过渡效果实现
 */
export class AdvancedCustomTransition extends Transition {
  static customTransitions = new Map();
  
  /**
   * 注册高级自定义过渡效果
   * @param {string} name - 过渡效果名称
   * @param {Object} config - 过渡效果配置
   */
  static registerAdvancedCustomTransition(name, config) {
    this.customTransitions.set(name, config);
    console.log(`已注册高级自定义过渡效果: ${name}`);
  }
  
  /**
   * 获取所有高级自定义过渡效果
   * @returns {Array} 高级自定义过渡效果列表
   */
  static getAdvancedCustomTransitions() {
    return Array.from(this.customTransitions.keys());
  }
  
  /**
   * 检查是否为高级自定义过渡效果
   * @param {string} name - 过渡效果名称
   * @returns {boolean} 是否为高级自定义过渡效果
   */
  static isAdvancedCustomTransition(name) {
    return this.customTransitions.has(name);
  }
  
  constructor(options, isLastClip = false) {
    // 检查是否为高级自定义过渡效果
    if (options && options.name && AdvancedCustomTransition.isAdvancedCustomTransition(options.name)) {
      const customConfig = AdvancedCustomTransition.customTransitions.get(options.name);
      // 合并自定义配置，但保持原始名称
      options = {
        ...options,
        ...customConfig,
        name: options.name // 保持原始的自定义名称
      };
      
      // 先调用父类构造函数，然后修改属性
      super({ duration: 0 }, isLastClip);
      
      // 设置自定义属性
      this.duration = options.duration ?? 0;
      this.name = options.name;
      this.params = options.params;
      this.easingFunction = options.easing && easings[options.easing] 
        ? easings[options.easing] 
        : (x => x); // 默认线性函数
      this.source = null; // 自定义过渡效果不需要source
    } else {
      super(options, isLastClip);
    }
  }
  
  /**
   * 重写create方法以支持自定义过渡效果
   */
  create({ width, height, channels }) {
    // 如果是高级自定义过渡效果，使用自定义实现
    if (AdvancedCustomTransition.isAdvancedCustomTransition(this.name)) {
      return this.createCustomTransition({ width, height, channels });
    }
    
    // 否则使用父类的实现
    return super.create({ width, height, channels });
  }
  
  /**
   * 创建自定义过渡效果
   * @param {Object} config - 配置
   * @returns {Function} 过渡效果函数
   */
  createCustomTransition({ width, height, channels }) {
    const customConfig = AdvancedCustomTransition.customTransitions.get(this.name);
    
    return ({ fromFrame, toFrame, progress }) => {
      // 根据自定义配置实现过渡效果
      switch (this.name) {
        case "custom-fade":
          return this.customFadeTransition(fromFrame, toFrame, progress);
        case "custom-slide":
          return this.customSlideTransition(fromFrame, toFrame, progress, customConfig);
        case "custom-zoom":
          return this.customZoomTransition(fromFrame, toFrame, progress, customConfig);
        default:
          // 回退到基础过渡效果
          return this.easingFunction(progress) > 0.5 ? toFrame : fromFrame;
      }
    };
  }
  
  /**
   * 自定义淡入淡出过渡效果
   * @param {Buffer} fromFrame - 起始帧
   * @param {Buffer} toFrame - 结束帧
   * @param {number} progress - 进度
   * @returns {Buffer} 过渡后的帧
   */
  customFadeTransition(fromFrame, toFrame, progress) {
    const easedProgress = this.easingFunction(progress);
    const alpha = easedProgress;
    
    // 简单的线性插值
    const result = Buffer.alloc(fromFrame.length);
    for (let i = 0; i < fromFrame.length; i += 4) {
      result[i] = Math.round(fromFrame[i] * (1 - alpha) + toFrame[i] * alpha);     // R
      result[i + 1] = Math.round(fromFrame[i + 1] * (1 - alpha) + toFrame[i + 1] * alpha); // G
      result[i + 2] = Math.round(fromFrame[i + 2] * (1 - alpha) + toFrame[i + 2] * alpha); // B
      result[i + 3] = Math.round(fromFrame[i + 3] * (1 - alpha) + toFrame[i + 3] * alpha); // A
    }
    
    return result;
  }
  
  /**
   * 自定义滑动过渡效果
   * @param {Buffer} fromFrame - 起始帧
   * @param {Buffer} toFrame - 结束帧
   * @param {number} progress - 进度
   * @param {Object} config - 配置
   * @returns {Buffer} 过渡后的帧
   */
  customSlideTransition(fromFrame, toFrame, progress, config) {
    const easedProgress = this.easingFunction(progress);
    const direction = config.direction || 'left';
    
    // 这里可以实现更复杂的滑动逻辑
    // 目前简化为淡入淡出
    return this.customFadeTransition(fromFrame, toFrame, progress);
  }
  
  /**
   * 自定义缩放过渡效果
   * @param {Buffer} fromFrame - 起始帧
   * @param {Buffer} toFrame - 结束帧
   * @param {number} progress - 进度
   * @param {Object} config - 配置
   * @returns {Buffer} 过渡后的帧
   */
  customZoomTransition(fromFrame, toFrame, progress, config) {
    const easedProgress = this.easingFunction(progress);
    
    // 这里可以实现更复杂的缩放逻辑
    // 目前简化为淡入淡出
    return this.customFadeTransition(fromFrame, toFrame, progress);
  }
}

// 注册一些高级自定义过渡效果
AdvancedCustomTransition.registerAdvancedCustomTransition("custom-fade", {
  easing: "easeInOutCubic",
  params: {}
});

AdvancedCustomTransition.registerAdvancedCustomTransition("custom-slide", {
  easing: "easeOutExpo",
  direction: "left",
  params: {}
});

AdvancedCustomTransition.registerAdvancedCustomTransition("custom-zoom", {
  easing: "easeInOutSine",
  scale: 1.2,
  params: {}
});

export default AdvancedCustomTransition;
