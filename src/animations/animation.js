import { getEasingFunction } from '../utils/easings.js';

/**
 * 动画类
 */
export class Animation {
  constructor(config) {
    this.id = config.id || Math.random().toString(36).substr(2, 9);
    this.property = config.property; // x, y, scaleX, scaleY, rotation, opacity
    this.from = config.from;
    this.to = config.to;
    this.duration = config.duration || 1;
    this.startTime = config.startTime || 0;
    this.delay = config.delay !== undefined ? config.delay : 0; // 动画延迟时间
    this.easing = config.easing || 'linear';
    this.isOffset = config.isOffset || false; // 是否为偏移量动画
  }

  /**
   * 获取动画在当前时间的值
   */
  getValueAtTime(time) {
    // 计算实际开始时间（考虑延迟）
    const actualStartTime = this.startTime + this.delay;
    
    // 如果当前时间小于实际开始时间
    if (time < actualStartTime) {
      // 对于负延迟（Out 动画），在动画开始前应该保持正常状态（from 值）
      // 对于正延迟，在动画开始前应该保持初始状态（from 值）
      return this.from;
    }
    
    // 计算动画时间
    const animTime = time - actualStartTime;
    
    // 如果动画时间超过持续时间，返回结束值
    if (animTime >= this.duration) {
      return this.to;
    }
    
    // 计算动画进度
    const progress = animTime / this.duration;
    const easedProgress = this.ease(progress, this.easing);
    const value = this.lerp(this.from, this.to, easedProgress);
    
    return value;
  }

  /**
   * 线性插值
   */
  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /**
   * 缓动函数
   */
  ease(t, type) {
    // 使用新的缓动函数库
    const easingFunction = getEasingFunction(type);
    return easingFunction(t);
  }

}
