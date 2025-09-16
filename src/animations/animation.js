/**
 * 动画类
 */
export class Animation {
  constructor(config) {
    this.property = config.property; // x, y, scaleX, scaleY, rotation, opacity
    this.from = config.from;
    this.to = config.to;
    this.duration = config.duration || 1;
    this.startTime = config.startTime || 0;
    this.easing = config.easing || 'linear';
  }

  /**
   * 获取动画在当前时间的值
   */
  getValueAtTime(time) {
    const animTime = time - this.startTime;
    const progress = Math.max(0, Math.min(animTime / this.duration, 1));
    const easedProgress = this.ease(progress, this.easing);
    
    return this.lerp(this.from, this.to, easedProgress);
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
    switch (type) {
      case 'easeIn':
        return t * t;
      case 'easeOut':
        return 1 - (1 - t) * (1 - t);
      case 'easeInOut':
        return t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
      case 'bounce':
        return this.bounceEase(t);
      case 'elastic':
        return this.elasticEase(t);
      case 'linear':
      default:
        return t;
    }
  }

  /**
   * 弹跳缓动
   */
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

  /**
   * 弹性缓动
   */
  elasticEase(t) {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
  }
}
