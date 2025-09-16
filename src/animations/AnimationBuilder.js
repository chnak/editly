/**
 * 动画构建器 - 提供链式API来简化动画配置
 * 类似 Creatomate 的动画配置方式
 */
import { animationManager } from './AnimationManager.js';

export class AnimationBuilder {
  constructor() {
    this.animations = [];
    this.currentAnimation = null;
  }

  /**
   * 开始创建一个新的动画
   * @param {string} property 动画属性
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  animate(property) {
    this.currentAnimation = {
      property: property,
      from: null,
      to: null,
      duration: 1,
      startTime: 0,
      delay: 0,
      easing: 'linear',
      repeat: 1,
      direction: 'normal',
      fillMode: 'both'
    };
    return this;
  }

  /**
   * 设置动画的起始值
   * @param {number} value 起始值
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  from(value) {
    if (this.currentAnimation) {
      this.currentAnimation.from = value;
    }
    return this;
  }

  /**
   * 设置动画的结束值
   * @param {number} value 结束值
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  to(value) {
    if (this.currentAnimation) {
      this.currentAnimation.to = value;
    }
    return this;
  }

  /**
   * 设置动画持续时间
   * @param {number} duration 持续时间（秒）
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  duration(duration) {
    if (this.currentAnimation) {
      this.currentAnimation.duration = duration;
    }
    return this;
  }

  /**
   * 设置动画开始时间
   * @param {number} startTime 开始时间（秒）
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  startTime(startTime) {
    if (this.currentAnimation) {
      this.currentAnimation.startTime = startTime;
    }
    return this;
  }

  /**
   * 设置动画延迟时间
   * @param {number} delay 延迟时间（秒）
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  delay(delay) {
    if (this.currentAnimation) {
      this.currentAnimation.delay = delay;
    }
    return this;
  }

  /**
   * 设置缓动函数
   * @param {string} easing 缓动函数名称
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  easing(easing) {
    if (this.currentAnimation) {
      this.currentAnimation.easing = easing;
    }
    return this;
  }

  /**
   * 设置重复次数
   * @param {number|string} repeat 重复次数或 'loop' 或 'reverse'
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  repeat(repeat) {
    if (this.currentAnimation) {
      this.currentAnimation.repeat = repeat;
    }
    return this;
  }

  /**
   * 设置动画方向
   * @param {string} direction 动画方向 ('normal' 或 'reverse')
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  direction(direction) {
    if (this.currentAnimation) {
      this.currentAnimation.direction = direction;
    }
    return this;
  }

  /**
   * 设置填充模式
   * @param {string} fillMode 填充模式 ('none', 'forwards', 'backwards', 'both')
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  fillMode(fillMode) {
    if (this.currentAnimation) {
      this.currentAnimation.fillMode = fillMode;
    }
    return this;
  }

  /**
   * 完成当前动画并添加到动画列表
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  end() {
    if (this.currentAnimation) {
      this.animations.push({ ...this.currentAnimation });
      this.currentAnimation = null;
    }
    return this;
  }

  /**
   * 添加预设动画
   * @param {string} presetName 预设名称
   * @param {Object} options 动画选项
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  preset(presetName, options = {}) {
    const presetAnimation = animationManager.applyPreset(presetName, options);
    this.animations.push(presetAnimation);
    return this;
  }

  /**
   * 创建关键帧动画
   * @param {string} property 动画属性
   * @param {Array} keyframes 关键帧数组
   * @param {Object} options 其他选项
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  keyframes(property, keyframes, options = {}) {
    const keyframeAnimation = animationManager.createKeyframeAnimation({
      property,
      keyframes,
      ...options
    });
    this.animations.push(keyframeAnimation);
    return this;
  }

  /**
   * 获取所有动画
   * @returns {Array} 动画数组
   */
  getAnimations() {
    return this.animations;
  }

  /**
   * 清除所有动画
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  clear() {
    this.animations = [];
    this.currentAnimation = null;
    return this;
  }

  /**
   * 创建动画序列（按顺序执行）
   * @param {Array} animationConfigs 动画配置数组
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  sequence(animationConfigs) {
    let currentTime = 0;
    
    animationConfigs.forEach(config => {
      const animation = {
        ...config,
        startTime: currentTime,
        id: animationManager.generateId()
      };
      this.animations.push(animation);
      currentTime += (config.duration || 1) + (config.delay || 0);
    });
    
    return this;
  }

  /**
   * 创建并行动画（同时执行）
   * @param {Array} animationConfigs 动画配置数组
   * @param {number} startTime 开始时间
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  parallel(animationConfigs, startTime = 0) {
    animationConfigs.forEach(config => {
      const animation = {
        ...config,
        startTime: startTime + (config.delay || 0),
        id: animationManager.generateId()
      };
      this.animations.push(animation);
    });
    
    return this;
  }

  /**
   * 创建延迟动画
   * @param {number} delay 延迟时间
   * @returns {AnimationBuilder} 返回自身以支持链式调用
   */
  wait(delay) {
    // 添加一个空的延迟动画
    this.animations.push({
      property: 'opacity',
      from: 1,
      to: 1,
      duration: delay,
      startTime: 0,
      id: animationManager.generateId()
    });
    return this;
  }
}

/**
 * 动画预设构建器 - 提供更高级的预设动画组合
 */
export class PresetBuilder {
  constructor() {
    this.builder = new AnimationBuilder();
  }

  /**
   * 淡入效果
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  fadeIn(options = {}) {
    this.builder.preset('fadeIn', options);
    return this;
  }

  /**
   * 淡出效果
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  fadeOut(options = {}) {
    this.builder.preset('fadeOut', options);
    return this;
  }

  /**
   * 从左侧滑入
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  slideInLeft(options = {}) {
    this.builder.preset('slideInLeft', options);
    return this;
  }

  /**
   * 从右侧滑入
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  slideInRight(options = {}) {
    this.builder.preset('slideInRight', options);
    return this;
  }

  /**
   * 从上方滑入
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  slideInTop(options = {}) {
    this.builder.preset('slideInTop', options);
    return this;
  }

  /**
   * 从下方滑入
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  slideInBottom(options = {}) {
    this.builder.preset('slideInBottom', options);
    return this;
  }

  /**
   * 缩放进入
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  zoomIn(options = {}) {
    this.builder.preset('zoomIn', options);
    return this;
  }

  /**
   * 缩放退出
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  zoomOut(options = {}) {
    this.builder.preset('zoomOut', options);
    return this;
  }

  /**
   * 旋转进入
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  rotateIn(options = {}) {
    this.builder.preset('rotateIn', options);
    return this;
  }

  /**
   * 弹跳进入
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  bounceIn(options = {}) {
    this.builder.preset('bounceIn', options);
    return this;
  }

  /**
   * 弹性进入
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  elasticIn(options = {}) {
    this.builder.preset('elasticIn', options);
    return this;
  }

  /**
   * 摇摆动画
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  wobble(options = {}) {
    this.builder.preset('wobble', options);
    return this;
  }

  /**
   * 脉冲动画
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  pulse(options = {}) {
    this.builder.preset('pulse', options);
    return this;
  }

  /**
   * 闪烁动画
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  blink(options = {}) {
    this.builder.preset('blink', options);
    return this;
  }

  /**
   * 摇摆进入
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  swingIn(options = {}) {
    this.builder.preset('swingIn', options);
    return this;
  }

  /**
   * 翻转进入X轴
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  flipInX(options = {}) {
    this.builder.preset('flipInX', options);
    return this;
  }

  /**
   * 翻转进入Y轴
   * @param {Object} options 选项
   * @returns {PresetBuilder} 返回自身以支持链式调用
   */
  flipInY(options = {}) {
    this.builder.preset('flipInY', options);
    return this;
  }

  /**
   * 获取动画构建器
   * @returns {AnimationBuilder} 动画构建器
   */
  getBuilder() {
    return this.builder;
  }

  /**
   * 获取所有动画
   * @returns {Array} 动画数组
   */
  getAnimations() {
    return this.builder.getAnimations();
  }
}

/**
 * 创建动画构建器的工厂函数
 * @returns {AnimationBuilder} 动画构建器实例
 */
export function createAnimationBuilder() {
  return new AnimationBuilder();
}

/**
 * 创建预设构建器的工厂函数
 * @returns {PresetBuilder} 预设构建器实例
 */
export function createPresetBuilder() {
  return new PresetBuilder();
}

/**
 * 快速创建动画的便捷函数
 * @param {string} property 动画属性
 * @param {Object} config 动画配置
 * @returns {Animation} 动画实例
 */
export function quickAnimation(property, config) {
  const builder = new AnimationBuilder();
  return builder.animate(property)
    .from(config.from)
    .to(config.to)
    .duration(config.duration || 1)
    .easing(config.easing || 'linear')
    .end()
    .getAnimations()[0];
}

/**
 * 快速创建预设动画的便捷函数
 * @param {string} presetName 预设名称
 * @param {Object} options 选项
 * @returns {Animation} 动画实例
 */
export function quickPreset(presetName, options = {}) {
  return animationManager.applyPreset(presetName, options);
}
