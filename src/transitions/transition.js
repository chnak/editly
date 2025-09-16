/**
 * 过渡效果基类
 */
export class Transition {
  constructor(config) {
    this.duration = config.duration || 0.5;
    this.type = config.type || 'fade';
  }

  /**
   * 应用过渡效果
   */
  apply(fromFrame, toFrame, progress) {
    switch (this.type) {
      case 'fade':
        return this.fadeTransition(fromFrame, toFrame, progress);
      case 'slide':
        return this.slideTransition(fromFrame, toFrame, progress);
      case 'zoom':
        return this.zoomTransition(fromFrame, toFrame, progress);
      default:
        return this.fadeTransition(fromFrame, toFrame, progress);
    }
  }

  /**
   * 淡入淡出过渡
   */
  fadeTransition(fromFrame, toFrame, progress) {
    if (!fromFrame || !toFrame) {
      return toFrame || fromFrame;
    }

    const result = Buffer.alloc(fromFrame.length);
    for (let i = 0; i < fromFrame.length; i += 4) {
      const r1 = fromFrame[i];
      const g1 = fromFrame[i + 1];
      const b1 = fromFrame[i + 2];
      const a1 = fromFrame[i + 3];

      const r2 = toFrame[i];
      const g2 = toFrame[i + 1];
      const b2 = toFrame[i + 2];
      const a2 = toFrame[i + 3];

      result[i] = Math.round(r1 * (1 - progress) + r2 * progress);
      result[i + 1] = Math.round(g1 * (1 - progress) + g2 * progress);
      result[i + 2] = Math.round(b1 * (1 - progress) + b2 * progress);
      result[i + 3] = Math.round(a1 * (1 - progress) + a2 * progress);
    }

    return result;
  }

  /**
   * 滑动过渡
   */
  slideTransition(fromFrame, toFrame, progress) {
    // 简化实现，返回淡入淡出效果
    return this.fadeTransition(fromFrame, toFrame, progress);
  }

  /**
   * 缩放过渡
   */
  zoomTransition(fromFrame, toFrame, progress) {
    // 简化实现，返回淡入淡出效果
    return this.fadeTransition(fromFrame, toFrame, progress);
  }
}
