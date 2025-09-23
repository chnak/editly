import { Transition } from "./transition.js";

/**
 * 自定义过渡效果类
 * 支持添加自定义的过渡效果
 */
export class CustomTransition extends Transition {
  static customTransitions = new Map();
  
  /**
   * 注册自定义过渡效果
   * @param {string} name - 过渡效果名称
   * @param {Object} config - 过渡效果配置
   * @param {string} config.name - 基础过渡效果名称
   * @param {string} config.easing - 缓动函数
   * @param {Object} config.params - 参数
   * @param {Function} config.customFunction - 自定义函数（可选）
   */
  static registerCustomTransition(name, config) {
    this.customTransitions.set(name, config);
    console.log(`已注册自定义过渡效果: ${name}`);
  }
  
  /**
   * 获取所有自定义过渡效果
   * @returns {Array} 自定义过渡效果列表
   */
  static getCustomTransitions() {
    return Array.from(this.customTransitions.keys());
  }
  
  /**
   * 检查是否为自定义过渡效果
   * @param {string} name - 过渡效果名称
   * @returns {boolean} 是否为自定义过渡效果
   */
  static isCustomTransition(name) {
    return this.customTransitions.has(name);
  }
  
  constructor(options, isLastClip = false) {
    // 检查是否为自定义过渡效果
    if (options && options.name && CustomTransition.isCustomTransition(options.name)) {
      const customConfig = CustomTransition.customTransitions.get(options.name);
      // 合并自定义配置
      options = {
        ...options,
        ...customConfig,
        name: customConfig.name || options.name
      };
    }
    
    super(options, isLastClip);
  }
}

// 预定义一些自定义过渡效果
CustomTransition.registerCustomTransition("smooth-fade", {
  name: "fade",
  easing: "easeInOutCubic",
  params: {}
});

CustomTransition.registerCustomTransition("fast-wipe-left", {
  name: "wipeLeft",
  easing: "easeOutExpo",
  params: {}
});

CustomTransition.registerCustomTransition("slow-zoom", {
  name: "crosszoom",
  easing: "easeInOutSine",
  params: {}
});

CustomTransition.registerCustomTransition("bounce-transition", {
  name: "circle",
  easing: "easeOutBounce",
  params: {}
});

CustomTransition.registerCustomTransition("dramatic-swipe", {
  name: "directional",
  easing: "easeOutBack",
  params: { direction: [1, 0] }
});

export default CustomTransition;
