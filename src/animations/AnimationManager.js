import { Animation } from './Animation.js';

/**
 * 关键帧动画类 - 支持多个关键帧的复杂动画
 */
export class KeyframeAnimation {
  constructor(config) {
    this.id = config.id || 'keyframe_' + Math.random().toString(36).substr(2, 9);
    this.property = config.property;
    this.keyframes = config.keyframes || []; // [{ time: 0, value: 0, easing: 'linear' }]
    this.duration = config.duration || 1;
    this.startTime = config.startTime || 0;
    this.delay = config.delay || 0;
    this.repeat = config.repeat || 1;
    this.direction = config.direction || 'normal';
    this.fillMode = config.fillMode || 'both';
    
    // 排序关键帧
    this.keyframes.sort((a, b) => a.time - b.time);
    
    this.actualStartTime = this.startTime + this.delay;
    this.endTime = this.actualStartTime + this.duration;
  }

  /**
   * 获取关键帧动画在当前时间的值
   * @param {number} time 当前时间
   * @returns {number|null} 动画值
   */
  getValueAtTime(time) {
    if (time < this.actualStartTime) {
      return this.fillMode === 'backwards' || this.fillMode === 'both' ? this.keyframes[0]?.value : null;
    }

    if (time > this.endTime) {
      return this.fillMode === 'forwards' || this.fillMode === 'both' ? this.keyframes[this.keyframes.length - 1]?.value : null;
    }

    const animTime = time - this.actualStartTime;
    return this.calculateKeyframeValue(animTime);
  }

  /**
   * 计算关键帧动画值
   * @param {number} animTime 动画时间
   * @returns {number} 动画值
   */
  calculateKeyframeValue(animTime) {
    const normalizedTime = animTime / this.duration;
    
    // 找到当前时间对应的关键帧区间
    for (let i = 0; i < this.keyframes.length - 1; i++) {
      const currentKeyframe = this.keyframes[i];
      const nextKeyframe = this.keyframes[i + 1];
      
      if (normalizedTime >= currentKeyframe.time && normalizedTime <= nextKeyframe.time) {
        // 计算在当前区间内的进度
        const segmentProgress = (normalizedTime - currentKeyframe.time) / (nextKeyframe.time - currentKeyframe.time);
        
        // 应用缓动函数
        const easing = nextKeyframe.easing || currentKeyframe.easing || 'linear';
        const easedProgress = this.ease(segmentProgress, easing);
        
        // 插值计算
        return this.lerp(currentKeyframe.value, nextKeyframe.value, easedProgress);
      }
    }
    
    // 如果时间超出范围，返回最后一个关键帧的值
    return this.keyframes[this.keyframes.length - 1]?.value || 0;
  }

  /**
   * 线性插值
   */
  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /**
   * 缓动函数（复用Animation类的实现）
   */
  ease(t, type) {
    const animation = new Animation({ easing: type });
    return animation.ease(t, type);
  }
}

/**
 * 通用动画管理器 - 类似 Creatomate 的动画系统
 * 支持多种动画类型、预设动画和关键帧动画
 */
export class AnimationManager {
  constructor() {
    this.animations = new Map(); // 存储所有动画
    this.presets = new Map(); // 存储预设动画
    this.keyframes = new Map(); // 存储关键帧动画
    
    // 初始化预设动画
    this.initializePresets();
  }

  /**
   * 创建动画
   * @param {Object} config 动画配置
   * @returns {Animation} 动画实例
   */
  createAnimation(config) {
    const animation = new Animation(config);
    this.animations.set(animation.id, animation);
    return animation;
  }

  /**
   * 创建关键帧动画
   * @param {Object} config 关键帧动画配置
   * @returns {KeyframeAnimation} 关键帧动画实例
   */
  createKeyframeAnimation(config) {
    const animation = new KeyframeAnimation(config);
    this.keyframes.set(animation.id, animation);
    return animation;
  }

  /**
   * 应用预设动画
   * @param {string} presetName 预设名称
   * @param {Object} options 动画选项
   * @returns {Animation|Array<Animation>} 动画实例或动画数组（多属性动画）
   */
  applyPreset(presetName, options = {}) {
    const preset = this.presets.get(presetName);
    if (!preset) {
      throw new Error(`预设动画 "${presetName}" 不存在`);
    }

    // 检查是否为多属性动画
    if (preset.type === 'multi' && preset.properties) {
      // 返回多属性动画数组
      return preset.properties.map(prop => {
        const config = {
          ...prop,
          ...options,
          id: this.generateId()
        };
        return this.createAnimation(config);
      });
    } else {
      // 单属性动画
      const config = {
        ...preset,
        ...options,
        id: this.generateId()
      };
      return this.createAnimation(config);
    }
  }

  /**
   * 批量创建动画
   * @param {Array} animations 动画配置数组
   * @returns {Array} 动画实例数组
   */
  createAnimations(animations) {
    return animations.map(anim => this.createAnimation(anim));
  }

  /**
   * 获取动画
   * @param {string} id 动画ID
   * @returns {Animation} 动画实例
   */
  getAnimation(id) {
    return this.animations.get(id);
  }

  /**
   * 移除动画
   * @param {string} id 动画ID
   */
  removeAnimation(id) {
    this.animations.delete(id);
  }

  /**
   * 清除所有动画
   */
  clearAnimations() {
    this.animations.clear();
  }

  /**
   * 获取所有可用的预设动画
   * @returns {Array} 预设动画名称数组
   */
  getAvailablePresets() {
    return Array.from(this.presets.keys());
  }

  /**
   * 添加自定义预设动画
   * @param {string} name 预设名称
   * @param {Object|Array} config 动画配置，支持单属性或多属性
   */
  addPreset(name, config) {
    // 如果配置是数组，表示多属性动画
    if (Array.isArray(config)) {
      this.presets.set(name, {
        type: 'multi',
        properties: config
      });
    } else {
      // 单属性动画
      this.presets.set(name, config);
    }
  }

  /**
   * 初始化预设动画 - 现代主流动画效果
   */
  initializePresets() {
    // ========== 现代基础动画 ==========
    
    // 淡入淡出
    this.addPreset('fadeIn', {
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 0.6,
      easing: 'easeOut'
    });

    this.addPreset('fadeOut', {
      property: 'opacity',
      from: 1,
      to: 0,
      duration: 0.6,
      easing: 'easeIn',
      delay: -0.6  // 在元素结束前0.6秒开始
    });

    // 缩放动画
    this.addPreset('zoomIn', {
      property: 'scaleX',
      from: 0,
      to: 1,
      duration: 0.6,
      easing: 'easeOut'
    });

    this.addPreset('zoomOut', {
      property: 'scaleX',
      from: 1,
      to: 0,
      duration: 0.6,
      easing: 'easeIn',
      delay: -0.6  // 在元素结束前0.6秒开始
    });

    // 旋转动画
    this.addPreset('rotateIn', {
      property: 'rotation',
      from: -180,
      to: 0,
      duration: 0.8,
      easing: 'easeOut'
    });

    this.addPreset('rotateOut', {
      property: 'rotation',
      from: 0,
      to: 180,
      duration: 0.8,
      easing: 'easeIn',
      delay: -0.8  // 在元素结束前0.8秒开始
    });

    // 滑动动画
    this.addPreset('slideInLeft', {
      property: 'x',
      from: -300,
      to: 0,
      duration: 0.6,
      easing: 'easeOut',
      isOffset: true
    });

    this.addPreset('slideInRight', {
      property: 'x',
      from: 300,
      to: 0,
      duration: 0.6,
      easing: 'easeOut',
      isOffset: true
    });

    this.addPreset('slideInTop', {
      property: 'y',
      from: -200,
      to: 0,
      duration: 0.6,
      easing: 'easeOut',
      isOffset: true
    });

    this.addPreset('slideInBottom', {
      property: 'y',
      from: 200,
      to: 0,
      duration: 0.6,
      easing: 'easeOut',
      isOffset: true
    });

    // 滑出动画
    this.addPreset('slideOutLeft', {
      property: 'x',
      from: 0,
      to: -300,
      duration: 0.6,
      easing: 'easeIn',
      isOffset: true,
      delay: -0.6  // 在元素结束前0.6秒开始
    });

    this.addPreset('slideOutRight', {
      property: 'x',
      from: 0,
      to: 300,
      duration: 0.6,
      easing: 'easeIn',
      isOffset: true,
      delay: -0.6  // 在元素结束前0.6秒开始
    });

    this.addPreset('slideOutTop', {
      property: 'y',
      from: 0,
      to: -200,
      duration: 0.6,
      easing: 'easeIn',
      isOffset: true,
      delay: -0.6  // 在元素结束前0.6秒开始
    });

    this.addPreset('slideOutBottom', {
      property: 'y',
      from: 0,
      to: 200,
      duration: 0.6,
      easing: 'easeIn',
      isOffset: true,
      delay: -0.6  // 在元素结束前0.6秒开始
    });

    // ========== 现代特效动画 ==========

    // Material Design 风格
    this.addPreset('materialRipple', [
      { property: 'scaleX', from: 0, to: 1, duration: 0.4, easing: 'easeOut' },
      { property: 'scaleY', from: 0, to: 1, duration: 0.4, easing: 'easeOut' },
      { property: 'opacity', from: 0.3, to: 0, duration: 0.4, easing: 'easeOut' }
    ]);

    // iOS 风格弹性动画
    this.addPreset('iosBounce', [
      { property: 'scaleX', from: 0, to: 1.1, duration: 0.3, easing: 'easeOut' },
      { property: 'scaleY', from: 0, to: 1.1, duration: 0.3, easing: 'easeOut' },
      { property: 'scaleX', from: 1.1, to: 1, duration: 0.2, easing: 'easeIn', delay: 0.3 },
      { property: 'scaleY', from: 1.1, to: 1, duration: 0.2, easing: 'easeIn', delay: 0.3 }
    ]);

    // 现代弹跳效果
    this.addPreset('bounceIn', [
      { property: 'scaleX', from: 0, to: 1, duration: 0.6, easing: 'easeInBounce' },
      { property: 'scaleY', from: 0, to: 1, duration: 0.6, easing: 'easeInBounce' },
      { property: 'opacity', from: 0, to: 1, duration: 0.6, easing: 'easeOut' }
    ]);

    // 弹性效果
    this.addPreset('elasticIn', [
      { property: 'scaleX', from: 0, to: 1, duration: 0.8, easing: 'elastic' },
      { property: 'scaleY', from: 0, to: 1, duration: 0.8, easing: 'elastic' },
      { property: 'opacity', from: 0, to: 1, duration: 0.4, easing: 'easeOut' }
    ]);

    // 3D 翻转效果
    this.addPreset('flip3D', [
      { property: 'rotation', from: -180, to: 0, duration: 0.8, easing: 'easeOut' },
      { property: 'scaleX', from: 0.8, to: 1, duration: 0.8, easing: 'easeOut' },
      { property: 'opacity', from: 0, to: 1, duration: 0.4, easing: 'easeOut' }
    ]);

    // 脉冲效果
    this.addPreset('pulse', [
      { property: 'scaleX', from: 1, to: 1.1, duration: 0.5, easing: 'easeInOut' },
      { property: 'scaleY', from: 1, to: 1.1, duration: 0.5, easing: 'easeInOut' },
      { property: 'opacity', from: 1, to: 0.7, duration: 0.5, easing: 'easeInOut' },
      { property: 'scaleX', from: 1.1, to: 1, duration: 0.5, easing: 'easeInOut', delay: 0.5 },
      { property: 'scaleY', from: 1.1, to: 1, duration: 0.5, easing: 'easeInOut', delay: 0.5 },
      { property: 'opacity', from: 0.7, to: 1, duration: 0.5, easing: 'easeInOut', delay: 0.5 }
    ]);

    // 摇摆效果
    this.addPreset('swing', [
      { property: 'rotation', from: -15, to: 15, duration: 0.3, easing: 'easeInOut' },
      { property: 'rotation', from: 15, to: 0, duration: 0.3, easing: 'easeInOut', delay: 0.3 },
      { property: 'x', from: -5, to: 5, duration: 0.6, easing: 'easeInOut', isOffset: true }
    ]);

    // 震动效果
    this.addPreset('shake', [
      { property: 'x', from: -10, to: 10, duration: 0.1, easing: 'linear' },
      { property: 'x', from: 10, to: -10, duration: 0.1, easing: 'linear', delay: 0.1 },
      { property: 'x', from: -10, to: 10, duration: 0.1, easing: 'linear', delay: 0.2 },
      { property: 'x', from: 10, to: 0, duration: 0.1, easing: 'linear', delay: 0.3 }
    ]);

    // 波浪效果
    this.addPreset('wave', [
      { property: 'y', from: 0, to: -10, duration: 0.5, easing: 'easeInOut' },
      { property: 'y', from: -10, to: 0, duration: 0.5, easing: 'easeInOut', delay: 0.5 }
    ]);

    // 故障效果
    this.addPreset('glitch', [
      { property: 'x', from: 0, to: -5, duration: 0.1, easing: 'linear' },
      { property: 'x', from: -5, to: 5, duration: 0.1, easing: 'linear', delay: 0.1 },
      { property: 'x', from: 5, to: 0, duration: 0.1, easing: 'linear', delay: 0.2 },
      { property: 'opacity', from: 1, to: 0.8, duration: 0.1, easing: 'linear', delay: 0.1 },
      { property: 'opacity', from: 0.8, to: 1, duration: 0.1, easing: 'linear', delay: 0.2 }
    ]);

    // 螺旋效果
    this.addPreset('spiral', [
      { property: 'rotation', from: 0, to: 360, duration: 1.0, easing: 'easeInOut' },
      { property: 'scaleX', from: 0, to: 1, duration: 1.0, easing: 'easeOut' },
      { property: 'scaleY', from: 0, to: 1, duration: 1.0, easing: 'easeOut' },
      { property: 'opacity', from: 0, to: 1, duration: 0.6, easing: 'easeOut' }
    ]);

    // 爆炸效果
    this.addPreset('explode', [
      { property: 'scaleX', from: 0, to: 1.2, duration: 0.3, easing: 'easeOut' },
      { property: 'scaleY', from: 0, to: 1.2, duration: 0.3, easing: 'easeOut' },
      { property: 'scaleX', from: 1.2, to: 1, duration: 0.2, easing: 'easeIn', delay: 0.3 },
      { property: 'scaleY', from: 1.2, to: 1, duration: 0.2, easing: 'easeIn', delay: 0.3 },
      { property: 'rotation', from: 0, to: 360, duration: 0.5, easing: 'easeOut' },
      { property: 'opacity', from: 0, to: 1, duration: 0.3, easing: 'easeOut' }
    ]);

    // 溶解效果
    this.addPreset('dissolve', [
      { property: 'opacity', from: 0, to: 1, duration: 0.8, easing: 'easeInOut' },
      { property: 'scaleX', from: 0.9, to: 1, duration: 0.8, easing: 'easeOut' },
      { property: 'scaleY', from: 0.9, to: 1, duration: 0.8, easing: 'easeOut' }
    ]);

    // 弹簧效果
    this.addPreset('spring', [
      { property: 'scaleX', from: 0, to: 1, duration: 0.8, easing: 'spring' },
      { property: 'scaleY', from: 0, to: 1, duration: 0.8, easing: 'spring' },
      { property: 'opacity', from: 0, to: 1, duration: 0.4, easing: 'easeOut' }
    ]);

    // 弹簧退出效果
    this.addPreset('springOut', [
      { property: 'scaleX', from: 1, to: 0, duration: 0.8, easing: 'spring', delay: -0.8 },
      { property: 'scaleY', from: 1, to: 0, duration: 0.8, easing: 'spring', delay: -0.8 },
      { property: 'opacity', from: 1, to: 0, duration: 0.4, easing: 'easeIn', delay: -0.4 }
    ]);

    // 爆炸退出效果
    this.addPreset('explodeOut', [
      { property: 'scaleX', from: 1, to: 1.5, duration: 0.4, easing: 'easeIn', delay: -0.6 },
      { property: 'scaleY', from: 1, to: 1.5, duration: 0.4, easing: 'easeIn', delay: -0.6 },
      { property: 'rotation', from: 0, to: 360, duration: 0.6, easing: 'easeIn', delay: -0.6 },
      { property: 'opacity', from: 1, to: 0, duration: 0.6, easing: 'easeIn', delay: -0.6 }
    ]);

    // 溶解退出效果
    this.addPreset('dissolveOut', [
      { property: 'opacity', from: 1, to: 0, duration: 0.8, easing: 'easeIn', delay: -0.8 },
      { property: 'scaleX', from: 1, to: 0.9, duration: 0.8, easing: 'easeIn', delay: -0.8 },
      { property: 'scaleY', from: 1, to: 0.9, duration: 0.8, easing: 'easeIn', delay: -0.8 }
    ]);

    // ========== 现代多属性动画 ==========

    // 超级缩放进入
    this.addPreset('superZoomIn', [
      { property: 'scaleX', from: 0, to: 1, duration: 0.6, easing: 'easeOut' },
      { property: 'scaleY', from: 0, to: 1, duration: 0.6, easing: 'easeOut' },
      { property: 'opacity', from: 0, to: 1, duration: 0.4, easing: 'easeOut' }
    ]);

    // 超级滑入左侧
    this.addPreset('superSlideInLeft', [
      { property: 'x', from: -300, to: 0, duration: 0.6, easing: 'easeOut', isOffset: true },
      { property: 'opacity', from: 0, to: 1, duration: 0.4, easing: 'easeOut' }
    ]);

    // 超级滑入右侧
    this.addPreset('superSlideInRight', [
      { property: 'x', from: 300, to: 0, duration: 0.6, easing: 'easeOut', isOffset: true },
      { property: 'opacity', from: 0, to: 1, duration: 0.4, easing: 'easeOut' }
    ]);

    // 超级滑入上方
    this.addPreset('superSlideInTop', [
      { property: 'y', from: -200, to: 0, duration: 0.6, easing: 'easeOut', isOffset: true },
      { property: 'opacity', from: 0, to: 1, duration: 0.4, easing: 'easeOut' }
    ]);

    // 超级滑入下方
    this.addPreset('superSlideInBottom', [
      { property: 'y', from: 200, to: 0, duration: 0.6, easing: 'easeOut', isOffset: true },
      { property: 'opacity', from: 0, to: 1, duration: 0.4, easing: 'easeOut' }
    ]);

    // 超级旋转进入
    this.addPreset('superRotateIn', [
      { property: 'rotation', from: -180, to: 0, duration: 0.8, easing: 'easeOut' },
      { property: 'scaleX', from: 0.5, to: 1, duration: 0.8, easing: 'easeOut' },
      { property: 'scaleY', from: 0.5, to: 1, duration: 0.8, easing: 'easeOut' },
      { property: 'opacity', from: 0, to: 1, duration: 0.4, easing: 'easeOut' }
    ]);

    // 超级弹跳进入
    this.addPreset('superBounceIn', [
      { property: 'scaleX', from: 0, to: 1, duration: 0.6, easing: 'easeInBounce' },
      { property: 'scaleY', from: 0, to: 1, duration: 0.6, easing: 'easeInBounce' },
      { property: 'rotation', from: -10, to: 0, duration: 0.6, easing: 'easeOut' },
      { property: 'opacity', from: 0, to: 1, duration: 0.3, easing: 'easeOut' }
    ]);

    // 超级弹性进入
    this.addPreset('superElasticIn', [
      { property: 'scaleX', from: 0, to: 1, duration: 0.8, easing: 'elastic' },
      { property: 'scaleY', from: 0, to: 1, duration: 0.8, easing: 'elastic' },
      { property: 'opacity', from: 0, to: 1, duration: 0.4, easing: 'easeOut' }
    ]);

    // 超级3D翻转
    this.addPreset('superFlip3D', [
      { property: 'rotation', from: -180, to: 0, duration: 0.8, easing: 'easeOut' },
      { property: 'scaleX', from: 0.8, to: 1, duration: 0.8, easing: 'easeOut' },
      { property: 'scaleY', from: 0.8, to: 1, duration: 0.8, easing: 'easeOut' },
      { property: 'opacity', from: 0, to: 1, duration: 0.4, easing: 'easeOut' }
    ]);

    // 超级爆炸效果
    this.addPreset('superExplode', [
      { property: 'scaleX', from: 0, to: 1.2, duration: 0.3, easing: 'easeOut' },
      { property: 'scaleY', from: 0, to: 1.2, duration: 0.3, easing: 'easeOut' },
      { property: 'scaleX', from: 1.2, to: 1, duration: 0.2, easing: 'easeIn', delay: 0.3 },
      { property: 'scaleY', from: 1.2, to: 1, duration: 0.2, easing: 'easeIn', delay: 0.3 },
      { property: 'rotation', from: 0, to: 360, duration: 0.5, easing: 'easeOut' },
      { property: 'opacity', from: 0, to: 1, duration: 0.3, easing: 'easeOut' }
    ]);

    // 超级脉冲效果
    this.addPreset('superPulse', [
      { property: 'scaleX', from: 1, to: 1.2, duration: 0.5, easing: 'easeInOut' },
      { property: 'scaleY', from: 1, to: 1.2, duration: 0.5, easing: 'easeInOut' },
      { property: 'opacity', from: 1, to: 0.8, duration: 0.5, easing: 'easeInOut' },
      { property: 'scaleX', from: 1.2, to: 1, duration: 0.5, easing: 'easeInOut', delay: 0.5 },
      { property: 'scaleY', from: 1.2, to: 1, duration: 0.5, easing: 'easeInOut', delay: 0.5 },
      { property: 'opacity', from: 0.8, to: 1, duration: 0.5, easing: 'easeInOut', delay: 0.5 }
    ]);

    // 超级摇摆效果
    this.addPreset('superSwing', [
      { property: 'rotation', from: -15, to: 15, duration: 0.3, easing: 'easeInOut' },
      { property: 'rotation', from: 15, to: 0, duration: 0.3, easing: 'easeInOut', delay: 0.3 },
      { property: 'x', from: -10, to: 10, duration: 0.6, easing: 'easeInOut', isOffset: true },
      { property: 'y', from: -5, to: 5, duration: 0.6, easing: 'easeInOut', isOffset: true }
    ]);

    // 超级故障效果
    this.addPreset('superGlitch', [
      { property: 'x', from: 0, to: -5, duration: 0.1, easing: 'linear' },
      { property: 'x', from: -5, to: 5, duration: 0.1, easing: 'linear', delay: 0.1 },
      { property: 'x', from: 5, to: 0, duration: 0.1, easing: 'linear', delay: 0.2 },
      { property: 'y', from: 0, to: -3, duration: 0.1, easing: 'linear' },
      { property: 'y', from: -3, to: 3, duration: 0.1, easing: 'linear', delay: 0.1 },
      { property: 'y', from: 3, to: 0, duration: 0.1, easing: 'linear', delay: 0.2 },
      { property: 'rotation', from: 0, to: -2, duration: 0.1, easing: 'linear' },
      { property: 'rotation', from: -2, to: 2, duration: 0.1, easing: 'linear', delay: 0.1 },
      { property: 'rotation', from: 2, to: 0, duration: 0.1, easing: 'linear', delay: 0.2 },
      { property: 'opacity', from: 1, to: 0.8, duration: 0.1, easing: 'linear' },
      { property: 'opacity', from: 0.8, to: 1, duration: 0.1, easing: 'linear', delay: 0.1 }
    ]);

    // 超级波浪效果
    this.addPreset('superWave', [
      { property: 'y', from: 0, to: -10, duration: 0.5, easing: 'easeInOut' },
      { property: 'y', from: -10, to: 10, duration: 0.5, easing: 'easeInOut', delay: 0.5 },
      { property: 'y', from: 10, to: 0, duration: 0.5, easing: 'easeInOut', delay: 1.0 },
      { property: 'rotation', from: -5, to: 5, duration: 0.5, easing: 'easeInOut' },
      { property: 'rotation', from: 5, to: 0, duration: 0.5, easing: 'easeInOut', delay: 0.5 },
      { property: 'scaleX', from: 0.95, to: 1.05, duration: 0.5, easing: 'easeInOut' },
      { property: 'scaleX', from: 1.05, to: 0.95, duration: 0.5, easing: 'easeInOut', delay: 0.5 },
      { property: 'scaleX', from: 0.95, to: 1, duration: 0.5, easing: 'easeInOut', delay: 1.0 }
    ]);

    // 超级螺旋效果
    this.addPreset('superSpiral', [
      { property: 'rotation', from: 0, to: 360, duration: 0.8, easing: 'easeInOut' },
      { property: 'scaleX', from: 0, to: 1, duration: 0.8, easing: 'easeOut' },
      { property: 'scaleY', from: 0, to: 1, duration: 0.8, easing: 'easeOut' },
      { property: 'opacity', from: 0, to: 1, duration: 0.4, easing: 'easeOut' }
    ]);

    // 超级溶解效果
    this.addPreset('superDissolve', [
      { property: 'opacity', from: 0, to: 1, duration: 0.8, easing: 'easeInOut' },
      { property: 'scaleX', from: 0.8, to: 1, duration: 0.8, easing: 'easeOut' },
      { property: 'scaleY', from: 0.8, to: 1, duration: 0.8, easing: 'easeOut' }
    ]);

    // 超级弹簧效果
    this.addPreset('superSpring', [
      { property: 'scaleX', from: 0, to: 1, duration: 0.8, easing: 'spring' },
      { property: 'scaleY', from: 0, to: 1, duration: 0.8, easing: 'spring' },
      { property: 'rotation', from: -10, to: 0, duration: 0.8, easing: 'easeOut' },
      { property: 'opacity', from: 0, to: 1, duration: 0.3, easing: 'easeOut' }
    ]);
  }

  /**
   * 生成唯一ID
   * @returns {string} 唯一ID
   */
  generateId() {
    return 'anim_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 销毁动画管理器
   */
  destroy() {
    this.animations.clear();
    this.presets.clear();
    this.keyframes.clear();
  }
}


// 导出默认实例
export const animationManager = new AnimationManager();
