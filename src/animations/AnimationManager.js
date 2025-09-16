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
   * @returns {Animation} 动画实例
   */
  applyPreset(presetName, options = {}) {
    const preset = this.presets.get(presetName);
    if (!preset) {
      throw new Error(`预设动画 "${presetName}" 不存在`);
    }

    const config = {
      ...preset,
      ...options,
      id: this.generateId()
    };

    return this.createAnimation(config);
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
   * @param {Object} config 动画配置
   */
  addPreset(name, config) {
    this.presets.set(name, config);
  }

  /**
   * 初始化预设动画
   */
  initializePresets() {
    // 淡入动画
    this.addPreset('fadeIn', {
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 0.5,
      easing: 'easeOut'
    });

    // 淡出动画
    this.addPreset('fadeOut', {
      property: 'opacity',
      from: 1,
      to: 0,
      duration: 0.5,
      easing: 'easeIn'
    });

    // 从左侧滑入
    this.addPreset('slideInLeft', {
      property: 'x',
      from: -1000,
      to: 0,
      duration: 0.6,
      easing: 'easeOut'
    });

    // 从右侧滑入
    this.addPreset('slideInRight', {
      property: 'x',
      from: 1000,
      to: 0,
      duration: 0.6,
      easing: 'easeOut'
    });

    // 从上方滑入
    this.addPreset('slideInTop', {
      property: 'y',
      from: -1000,
      to: 0,
      duration: 0.6,
      easing: 'easeOut'
    });

    // 从下方滑入
    this.addPreset('slideInBottom', {
      property: 'y',
      from: 1000,
      to: 0,
      duration: 0.6,
      easing: 'easeOut'
    });

    // 缩放进入
    this.addPreset('zoomIn', {
      property: 'scaleX',
      from: 0,
      to: 1,
      duration: 0.5,
      easing: 'easeOut'
    });

    // 缩放退出
    this.addPreset('zoomOut', {
      property: 'scaleX',
      from: 1,
      to: 0,
      duration: 0.5,
      easing: 'easeIn'
    });

    // 旋转进入
    this.addPreset('rotateIn', {
      property: 'rotation',
      from: -180,
      to: 0,
      duration: 0.6,
      easing: 'easeOut'
    });

    // 弹跳进入
    this.addPreset('bounceIn', {
      property: 'scaleX',
      from: 0,
      to: 1,
      duration: 0.8,
      easing: 'bounce'
    });

    // 弹性进入
    this.addPreset('elasticIn', {
      property: 'scaleX',
      from: 0,
      to: 1,
      duration: 1.0,
      easing: 'elastic'
    });

    // 摇摆动画
    this.addPreset('wobble', {
      property: 'rotation',
      from: 0,
      to: 0,
      duration: 0.6,
      easing: 'wobble'
    });

    // 脉冲动画
    this.addPreset('pulse', {
      property: 'scaleX',
      from: 1,
      to: 1.1,
      duration: 0.3,
      easing: 'easeInOut',
      repeat: 'reverse'
    });

    // 闪烁动画
    this.addPreset('blink', {
      property: 'opacity',
      from: 1,
      to: 0,
      duration: 0.1,
      easing: 'linear',
      repeat: 'reverse'
    });

    // 摇摆进入
    this.addPreset('swingIn', {
      property: 'rotation',
      from: -15,
      to: 0,
      duration: 0.6,
      easing: 'swing'
    });

    // 翻转进入
    this.addPreset('flipInX', {
      property: 'rotationX',
      from: -90,
      to: 0,
      duration: 0.6,
      easing: 'easeOut'
    });

    // 翻转进入Y轴
    this.addPreset('flipInY', {
      property: 'rotationY',
      from: -90,
      to: 0,
      duration: 0.6,
      easing: 'easeOut'
    });
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

/**
 * 动画类 - 单个属性动画
 */
export class Animation {
  constructor(config) {
    this.id = config.id || 'anim_' + Math.random().toString(36).substr(2, 9);
    this.property = config.property; // 动画属性
    this.from = config.from; // 起始值
    this.to = config.to; // 结束值
    this.duration = config.duration || 1; // 持续时间
    this.startTime = config.startTime || 0; // 开始时间
    this.delay = config.delay || 0; // 延迟时间
    this.easing = config.easing || 'linear'; // 缓动函数
    this.repeat = config.repeat || 1; // 重复次数 (数字或 'reverse' 或 'loop')
    this.direction = config.direction || 'normal'; // 动画方向
    this.fillMode = config.fillMode || 'both'; // 填充模式
    
    // 计算实际开始时间
    this.actualStartTime = this.startTime + this.delay;
    this.endTime = this.actualStartTime + this.duration;
  }

  /**
   * 获取动画在当前时间的值
   * @param {number} time 当前时间
   * @returns {number|null} 动画值，如果动画不活跃则返回null
   */
  getValueAtTime(time) {
    if (time < this.actualStartTime) {
      return this.fillMode === 'backwards' || this.fillMode === 'both' ? this.from : null;
    }

    if (time > this.endTime) {
      if (this.repeat === 'loop' || (typeof this.repeat === 'number' && this.repeat > 1)) {
        // 处理循环动画
        const cycleTime = (time - this.actualStartTime) % this.duration;
        return this.calculateValue(cycleTime);
      }
      return this.fillMode === 'forwards' || this.fillMode === 'both' ? this.to : null;
    }

    const animTime = time - this.actualStartTime;
    return this.calculateValue(animTime);
  }

  /**
   * 计算动画值
   * @param {number} animTime 动画时间
   * @returns {number} 动画值
   */
  calculateValue(animTime) {
    const progress = Math.max(0, Math.min(animTime / this.duration, 1));
    const easedProgress = this.ease(progress, this.easing);
    
    return this.lerp(this.from, this.to, easedProgress);
  }

  /**
   * 线性插值
   * @param {number} a 起始值
   * @param {number} b 结束值
   * @param {number} t 插值参数 (0-1)
   * @returns {number} 插值结果
   */
  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /**
   * 缓动函数
   * @param {number} t 时间参数 (0-1)
   * @param {string} type 缓动类型
   * @returns {number} 缓动后的值
   */
  ease(t, type) {
    switch (type) {
      case 'easeIn':
        return t * t;
      case 'easeOut':
        return 1 - (1 - t) * (1 - t);
      case 'easeInOut':
        return t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
      case 'easeInCubic':
        return t * t * t;
      case 'easeOutCubic':
        return 1 - Math.pow(1 - t, 3);
      case 'easeInOutCubic':
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      case 'easeInQuart':
        return t * t * t * t;
      case 'easeOutQuart':
        return 1 - Math.pow(1 - t, 4);
      case 'easeInOutQuart':
        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
      case 'bounce':
        return this.bounceEase(t);
      case 'elastic':
        return this.elasticEase(t);
      case 'back':
        return this.backEase(t);
      case 'circ':
        return this.circEase(t);
      case 'expo':
        return this.expoEase(t);
      case 'sine':
        return this.sineEase(t);
      case 'swing':
        return this.swingEase(t);
      case 'wobble':
        return this.wobbleEase(t);
      case 'linear':
      default:
        return t;
    }
  }

  // 各种缓动函数实现
  bounceEase(t) {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }

  elasticEase(t) {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
  }

  backEase(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  }

  circEase(t) {
    return 1 - Math.sqrt(1 - t * t);
  }

  expoEase(t) {
    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  }

  sineEase(t) {
    return 1 - Math.cos((t * Math.PI) / 2);
  }

  swingEase(t) {
    return 0.5 - Math.cos(t * Math.PI) / 2;
  }

  wobbleEase(t) {
    return t + Math.sin(t * Math.PI * 8) * 0.1;
  }
}

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

// 导出默认实例
export const animationManager = new AnimationManager();
