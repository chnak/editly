import { Animation } from './animation.js';

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
    // ========== 基础动画 ==========
    
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

    // 缩放进入
    this.addPreset('zoomIn', {
      property: 'scaleX',
      from: 0,
      to: 1,
      duration: 0.5,
      easing: 'easeOut'
    });

    // 缩放进入 - Y轴
    this.addPreset('zoomInY', {
      property: 'scaleY',
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

    // 缩放退出 - Y轴
    this.addPreset('zoomOutY', {
      property: 'scaleY',
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
      duration: 0.6,
      easing: 'bounce'
    });

    // 弹跳进入 - Y轴
    this.addPreset('bounceInY', {
      property: 'scaleY',
      from: 0,
      to: 1,
      duration: 0.6,
      easing: 'bounce'
    });

    // 弹性进入
    this.addPreset('elasticIn', {
      property: 'scaleX',
      from: 0,
      to: 1,
      duration: 0.6,
      easing: 'elastic'
    });

    // 弹性进入 - Y轴
    this.addPreset('elasticInY', {
      property: 'scaleY',
      from: 0,
      to: 1,
      duration: 0.6,
      easing: 'elastic'
    });

    // ========== 滑动动画 ==========

    // 从左侧滑入
    this.addPreset('slideInLeft', {
      property: 'x',
      from: -300,
      to: 0,
      duration: 0.5,
      easing: 'easeOut',
      isOffset: true // 标记为偏移量动画
    });

    // 从右侧滑入
    this.addPreset('slideInRight', {
      property: 'x',
      from: 300,
      to: 0,
      duration: 0.5,
      easing: 'easeOut',
      isOffset: true // 标记为偏移量动画
    });

    // 从上方滑入
    this.addPreset('slideInTop', {
      property: 'y',
      from: -200,
      to: 0,
      duration: 0.5,
      easing: 'easeOut',
      isOffset: true // 标记为偏移量动画
    });

    // 从下方滑入
    this.addPreset('slideInBottom', {
      property: 'y',
      from: 200,
      to: 0,
      duration: 0.5,
      easing: 'easeOut',
      isOffset: true // 标记为偏移量动画
    });

    // ========== 3D效果 ==========

    // 3D翻转
    this.addPreset('flip3D', {
      property: 'rotation',
      from: -180,
      to: 0,
      duration: 0.5,
      easing: 'easeOut'
    });

    // 3D缩放
    this.addPreset('scale3D', {
      property: 'scaleX',
      from: 0,
      to: 1,
      duration: 0.5,
      easing: 'easeOut'
    });

    // 透视变换
    this.addPreset('perspective', {
      property: 'rotation',
      from: -45,
      to: 0,
      duration: 0.5,
      easing: 'easeOut'
    });

    // 翻转进入X轴
    this.addPreset('flipInX', {
      property: 'rotation',
      from: -90,
      to: 0,
      duration: 0.6,
      easing: 'easeOut'
    });

    // 翻转进入Y轴
    this.addPreset('flipInY', {
      property: 'rotation',
      from: 90,
      to: 0,
      duration: 0.6,
      easing: 'easeOut'
    });

    // ========== 特效动画 ==========

    // 爆炸效果
    this.addPreset('explode', {
      property: 'scaleX',
      from: 0,
      to: 1.5,
      duration: 0.4,
      easing: 'easeOut'
    });

    // 溶解效果
    this.addPreset('dissolve', {
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 0.5,
      easing: 'easeInOut'
    });

    // 螺旋效果
    this.addPreset('spiral', {
      property: 'rotation',
      from: 0,
      to: 360,
      duration: 0.5,
      easing: 'easeInOut'
    });

    // 摇摆进入
    this.addPreset('swingIn', {
      property: 'rotation',
      from: -15,
      to: 0,
      duration: 0.6,
      easing: 'swing'
    });

    // 摇摆动画
    this.addPreset('wobble', {
      property: 'rotation',
      from: -10,
      to: 10,
      duration: 0.6,
      easing: 'easeInOut'
    });

    // 脉冲效果
    this.addPreset('pulse', {
      property: 'scaleX',
      from: 1,
      to: 1.2,
      duration: 0.5,
      easing: 'easeInOut'
    });

    // 闪烁动画
    this.addPreset('blink', {
      property: 'opacity',
      from: 1,
      to: 0,
      duration: 0.3,
      easing: 'linear'
    });

    // 弹簧效果
    this.addPreset('spring', {
      property: 'scaleX',
      from: 0,
      to: 1,
      duration: 0.6,
      easing: 'spring'
    });

    // ========== 文本特效 ==========

    // 打字机效果
    this.addPreset('typewriter', {
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 0.6,
      easing: 'linear'
    });

    // 逐字显示
    this.addPreset('reveal', {
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 0.6,
      easing: 'easeOut'
    });

    // 擦除效果
    this.addPreset('wipe', {
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 0.6,
      easing: 'easeInOut'
    });

    // 分割效果
    this.addPreset('split', {
      property: 'scaleX',
      from: 0,
      to: 1,
      duration: 0.6,
      easing: 'easeOut'
    });

    // 模糊到清晰
    this.addPreset('blurIn', {
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 0.6,
      easing: 'easeOut'
    });

    // 故障效果
    this.addPreset('glitch', {
      property: 'x',
      from: -5,
      to: 5,
      duration: 0.5,
      easing: 'linear'
    });

    // 震动效果
    this.addPreset('shake', {
      property: 'x',
      from: -3,
      to: 3,
      duration: 0.6,
      easing: 'linear'
    });

    // 波浪效果
    this.addPreset('wave', {
      property: 'y',
      from: -10,
      to: 10,
      duration: 1.0,
      easing: 'easeInOut'
    });

    // ========== 文本专用动画 ==========

    // 文本缩放进入
    this.addPreset('textZoomIn', {
      property: 'scaleX',
      from: 0.8,
      to: 1.2,
      duration: 1.0,
      easing: 'easeOut'
    });

    // 文本缩放退出
    this.addPreset('textZoomOut', {
      property: 'scaleX',
      from: 1.2,
      to: 0.8,
      duration: 1.0,
      easing: 'easeIn'
    });

    // 文本位移动画进入
    this.addPreset('textTranslateIn', {
      property: 'x',
      from: -50,
      to: 0,
      duration: 1.0,
      easing: 'easeOut'
    });

    // 文本位移动画退出
    this.addPreset('textTranslateOut', {
      property: 'x',
      from: 0,
      to: 50,
      duration: 1.0,
      easing: 'easeIn'
    });

    // 文本分割动画 - 逐字显示
    this.addPreset('textSplitWord', {
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 0.3,
      easing: 'easeOut'
    });

    // 文本分割动画 - 逐行显示
    this.addPreset('textSplitLine', {
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 0.3,
      easing: 'easeOut'
    });

    // 文本打字机效果
    this.addPreset('textTypewriter', {
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 2.0,
      easing: 'linear'
    });

    // 文本擦除效果
    this.addPreset('textWipe', {
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 1.0,
      easing: 'easeInOut'
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


// 导出默认实例
export const animationManager = new AnimationManager();
