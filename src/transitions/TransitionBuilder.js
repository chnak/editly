/**
 * 过渡效果构建器
 * 提供链式 API 来创建过渡效果配置
 */
export class TransitionBuilder {
  constructor() {
    this.config = {
      type: 'opacity',
      easing: 'linear'
    };
  }

  /**
   * 设置过渡效果类型
   */
  type(type) {
    this.config.type = type;
    return this;
  }

  /**
   * 设置缓动函数
   */
  easing(easing) {
    this.config.easing = easing;
    return this;
  }

  /**
   * 设置起始值
   */
  from(values) {
    this.config.from = { ...this.config.from, ...values };
    return this;
  }

  /**
   * 设置结束值
   */
  to(values) {
    this.config.to = { ...this.config.to, ...values };
    return this;
  }

  /**
   * 设置方向（用于擦除效果）
   */
  direction(direction) {
    this.config.direction = direction;
    return this;
  }

  /**
   * 设置轴（用于3D效果）
   */
  axis(axis) {
    this.config.axis = axis;
    return this;
  }

  /**
   * 设置角度（用于旋转和3D效果）
   */
  angle(angle) {
    this.config.angle = angle;
    return this;
  }

  /**
   * 构建配置
   */
  build() {
    return { ...this.config };
  }

  // 静态方法 - 快速创建常用过渡效果

  /**
   * 创建淡入淡出效果
   */
  static fade(easing = 'linear') {
    return new TransitionBuilder()
      .type('opacity')
      .from({ opacity: 1 })
      .to({ opacity: 0 })
      .easing(easing)
      .build();
  }

  /**
   * 创建弹跳淡入淡出效果
   */
  static bounceFade(easing = 'easeOutBounce') {
    return new TransitionBuilder()
      .type('opacity')
      .from({ opacity: 1 })
      .to({ opacity: 0 })
      .easing(easing)
      .build();
  }

  /**
   * 创建弹性淡入淡出效果
   */
  static elasticFade(easing = 'easeOutElastic') {
    return new TransitionBuilder()
      .type('opacity')
      .from({ opacity: 1 })
      .to({ opacity: 0 })
      .easing(easing)
      .build();
  }

  /**
   * 创建回弹淡入淡出效果
   */
  static backFade(easing = 'easeOutBack') {
    return new TransitionBuilder()
      .type('opacity')
      .from({ opacity: 1 })
      .to({ opacity: 0 })
      .easing(easing)
      .build();
  }

  /**
   * 创建滑动效果
   */
  static slide(direction = 'left', easing = 'easeInOutQuad') {
    const directions = {
      left: { x: -1 },
      right: { x: 1 },
      up: { y: -1 },
      down: { y: 1 }
    };

    return new TransitionBuilder()
      .type('position')
      .from({ x: 0, y: 0 })
      .to(directions[direction] || { x: -1 })
      .easing(easing)
      .build();
  }

  /**
   * 创建弹性滑动效果
   */
  static elasticSlide(direction = 'left', easing = 'easeOutElastic') {
    return TransitionBuilder.slide(direction, easing);
  }

  /**
   * 创建回弹滑动效果
   */
  static backSlide(direction = 'left', easing = 'easeOutBack') {
    return TransitionBuilder.slide(direction, easing);
  }

  /**
   * 创建缩放效果
   */
  static zoom(type = 'in', easing = 'easeOutQuad') {
    const scales = {
      in: { scale: 2 },
      out: { scale: 0.5 }
    };

    return new TransitionBuilder()
      .type('scale')
      .from({ scale: 1 })
      .to(scales[type] || { scale: 2 })
      .easing(easing)
      .build();
  }

  /**
   * 创建弹性缩放效果
   */
  static elasticZoom(type = 'in', easing = 'easeOutElastic') {
    return TransitionBuilder.zoom(type, easing);
  }

  /**
   * 创建回弹缩放效果
   */
  static backZoom(type = 'in', easing = 'easeOutBack') {
    return TransitionBuilder.zoom(type, easing);
  }

  /**
   * 创建旋转效果
   */
  static rotate(angle = 360, easing = 'easeInOutQuad') {
    return new TransitionBuilder()
      .type('rotation')
      .from({ angle: 0 })
      .to({ angle })
      .easing(easing)
      .build();
  }

  /**
   * 创建弹性旋转效果
   */
  static elasticRotate(angle = 360, easing = 'easeOutElastic') {
    return TransitionBuilder.rotate(angle, easing);
  }

  /**
   * 创建回弹旋转效果
   */
  static backRotate(angle = 360, easing = 'easeOutBack') {
    return TransitionBuilder.rotate(angle, easing);
  }

  /**
   * 创建擦除效果
   */
  static wipe(direction = 'left', easing = 'linear') {
    return new TransitionBuilder()
      .type('wipe')
      .direction(direction)
      .easing(easing)
      .build();
  }

  /**
   * 创建3D翻转效果
   */
  static flip3D(axis = 'y', angle = 180, easing = 'easeInOutQuad') {
    return new TransitionBuilder()
      .type('3d')
      .axis(axis)
      .angle(angle)
      .easing(easing)
      .build();
  }

  /**
   * 创建弹性3D翻转效果
   */
  static elasticFlip3D(axis = 'y', angle = 180, easing = 'easeOutElastic') {
    return TransitionBuilder.flip3D(axis, angle, easing);
  }

  /**
   * 创建回弹3D翻转效果
   */
  static backFlip3D(axis = 'y', angle = 180, easing = 'easeOutBack') {
    return TransitionBuilder.flip3D(axis, angle, easing);
  }

  /**
   * 创建溶解效果
   */
  static dissolve(pattern = 'random', easing = 'linear') {
    return new TransitionBuilder()
      .type('dissolve')
      .easing(easing)
      .build();
  }

  /**
   * 创建组合效果
   */
  static combine(effects) {
    const combined = new TransitionBuilder();
    
    effects.forEach(effect => {
      if (effect.type) combined.type(effect.type);
      if (effect.easing) combined.easing(effect.easing);
      if (effect.from) combined.from(effect.from);
      if (effect.to) combined.to(effect.to);
      if (effect.direction) combined.direction(effect.direction);
      if (effect.axis) combined.axis(effect.axis);
      if (effect.angle) combined.angle(effect.angle);
    });

    return combined.build();
  }
}

/**
 * 过渡效果预设生成器
 */
export class TransitionPresetBuilder {
  constructor() {
    this.transitions = [];
  }

  /**
   * 添加过渡效果
   */
  add(type, startTime, duration, customConfig = {}) {
    const transition = {
      type,
      startTime,
      duration,
      ...customConfig
    };
    this.transitions.push(transition);
    return this;
  }

  /**
   * 添加淡入淡出效果
   */
  fade(startTime, duration = 1.0, easing = 'linear') {
    return this.add('fade', startTime, duration, { easing });
  }

  /**
   * 添加滑动效果
   */
  slide(direction, startTime, duration = 1.0, easing = 'easeInOut') {
    return this.add(`slide${direction.charAt(0).toUpperCase() + direction.slice(1)}`, startTime, duration, { easing });
  }

  /**
   * 添加缩放效果
   */
  zoom(type, startTime, duration = 1.0, easing = 'easeOut') {
    return this.add(`zoom${type.charAt(0).toUpperCase() + type.slice(1)}`, startTime, duration, { easing });
  }

  /**
   * 添加旋转效果
   */
  rotate(startTime, duration = 1.0, easing = 'easeInOut') {
    return this.add('rotateIn', startTime, duration, { easing });
  }

  /**
   * 添加擦除效果
   */
  wipe(direction, startTime, duration = 1.0, easing = 'linear') {
    return this.add(`wipe${direction.charAt(0).toUpperCase() + direction.slice(1)}`, startTime, duration, { easing });
  }

  /**
   * 添加3D翻转效果
   */
  flip3D(axis = 'y', startTime, duration = 1.0, easing = 'easeInOut') {
    return this.add('flip3D', startTime, duration, { axis, easing });
  }

  /**
   * 构建过渡效果数组
   */
  build() {
    return [...this.transitions];
  }

  // 静态方法 - 创建预设组合

  /**
   * 创建电影风格过渡
   */
  static cinematic(sceneCount = 3, sceneDuration = 2) {
    const builder = new TransitionPresetBuilder();
    
    for (let i = 0; i < sceneCount - 1; i++) {
      const startTime = (i + 1) * sceneDuration - 0.5;
      const effects = ['fade', 'slideLeft', 'zoomIn'];
      builder.add(effects[i % effects.length], startTime, 1.0);
    }
    
    return builder.build();
  }

  /**
   * 创建现代风格过渡
   */
  static modern(sceneCount = 3, sceneDuration = 2) {
    const builder = new TransitionPresetBuilder();
    
    for (let i = 0; i < sceneCount - 1; i++) {
      const startTime = (i + 1) * sceneDuration - 0.5;
      const effects = ['quickFade', 'slideUp', 'elasticZoom'];
      builder.add(effects[i % effects.length], startTime, 0.8);
    }
    
    return builder.build();
  }

  /**
   * 创建创意风格过渡
   */
  static creative(sceneCount = 3, sceneDuration = 2) {
    const builder = new TransitionPresetBuilder();
    
    for (let i = 0; i < sceneCount - 1; i++) {
      const startTime = (i + 1) * sceneDuration - 0.5;
      const effects = ['rotateClockwise', 'flipY', 'dissolve'];
      builder.add(effects[i % effects.length], startTime, 1.2);
    }
    
    return builder.build();
  }
}

// 导出便捷函数
export const createTransition = (type, config = {}) => {
  return new TransitionBuilder().type(type).from(config.from || {}).to(config.to || {}).easing(config.easing || 'linear').build();
};

export const createPreset = (presetName, ...args) => {
  return TransitionPresetBuilder[presetName](...args);
};
