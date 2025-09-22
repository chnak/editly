/**
 * 过渡效果配置示例
 * 展示如何使用简化的配置创建各种过渡效果
 */

// 基础过渡效果配置
export const basicTransitions = {
  // 淡入淡出
  fade: {
    type: 'opacity',
    from: { opacity: 1 },
    to: { opacity: 0 },
    easing: 'linear'
  },
  
  // 快速淡入淡出
  quickFade: {
    type: 'opacity',
    from: { opacity: 1 },
    to: { opacity: 0 },
    easing: 'easeInOut'
  },
  
  // 弹跳淡入淡出
  bounceFade: {
    type: 'opacity',
    from: { opacity: 1 },
    to: { opacity: 0 },
    easing: 'bounce'
  }
};

// 滑动过渡效果配置
export const slideTransitions = {
  // 左滑
  slideLeft: {
    type: 'position',
    from: { x: 0 },
    to: { x: -1 },
    easing: 'easeInOut'
  },
  
  // 右滑
  slideRight: {
    type: 'position',
    from: { x: 0 },
    to: { x: 1 },
    easing: 'easeInOut'
  },
  
  // 上滑
  slideUp: {
    type: 'position',
    from: { y: 0 },
    to: { y: -1 },
    easing: 'easeInOut'
  },
  
  // 下滑
  slideDown: {
    type: 'position',
    from: { y: 0 },
    to: { y: 1 },
    easing: 'easeInOut'
  },
  
  // 对角线滑动
  slideDiagonal: {
    type: 'position',
    from: { x: 0, y: 0 },
    to: { x: 1, y: -1 },
    easing: 'easeInOut'
  }
};

// 缩放过渡效果配置
export const scaleTransitions = {
  // 放大
  zoomIn: {
    type: 'scale',
    from: { scale: 1 },
    to: { scale: 2 },
    easing: 'easeOut'
  },
  
  // 缩小
  zoomOut: {
    type: 'scale',
    from: { scale: 1 },
    to: { scale: 0.5 },
    easing: 'easeIn'
  },
  
  // 弹性缩放
  elasticZoom: {
    type: 'scale',
    from: { scale: 1 },
    to: { scale: 1.5 },
    easing: 'elastic'
  }
};

// 旋转过渡效果配置
export const rotationTransitions = {
  // 顺时针旋转
  rotateClockwise: {
    type: 'rotation',
    from: { angle: 0 },
    to: { angle: 360 },
    easing: 'easeInOut'
  },
  
  // 逆时针旋转
  rotateCounterClockwise: {
    type: 'rotation',
    from: { angle: 0 },
    to: { angle: -360 },
    easing: 'easeInOut'
  },
  
  // 半圈旋转
  rotateHalf: {
    type: 'rotation',
    from: { angle: 0 },
    to: { angle: 180 },
    easing: 'easeInOut'
  }
};

// 擦除过渡效果配置
export const wipeTransitions = {
  // 左擦除
  wipeLeft: {
    type: 'wipe',
    direction: 'left',
    easing: 'linear'
  },
  
  // 右擦除
  wipeRight: {
    type: 'wipe',
    direction: 'right',
    easing: 'linear'
  },
  
  // 上擦除
  wipeUp: {
    type: 'wipe',
    direction: 'up',
    easing: 'linear'
  },
  
  // 下擦除
  wipeDown: {
    type: 'wipe',
    direction: 'down',
    easing: 'linear'
  }
};

// 3D 过渡效果配置
export const threeDTransitions = {
  // Y轴翻转
  flipY: {
    type: '3d',
    axis: 'y',
    angle: 180,
    easing: 'easeInOut'
  },
  
  // X轴翻转
  flipX: {
    type: '3d',
    axis: 'x',
    angle: 180,
    easing: 'easeInOut'
  },
  
  // Z轴翻转
  flipZ: {
    type: '3d',
    axis: 'z',
    angle: 180,
    easing: 'easeInOut'
  }
};

// 特殊效果配置
export const specialTransitions = {
  // 溶解效果
  dissolve: {
    type: 'dissolve',
    pattern: 'random',
    easing: 'linear'
  },
  
  // 模糊效果
  blur: {
    type: 'blur',
    from: { blur: 0 },
    to: { blur: 10 },
    easing: 'easeInOut'
  },
  
  // 像素化效果
  pixelate: {
    type: 'pixelate',
    from: { pixelSize: 1 },
    to: { pixelSize: 20 },
    easing: 'easeInOut'
  }
};

// 组合效果配置
export const combinedTransitions = {
  // 滑动 + 淡入淡出
  slideFade: {
    type: 'position',
    from: { x: 0, opacity: 1 },
    to: { x: -1, opacity: 0 },
    easing: 'easeInOut'
  },
  
  // 缩放 + 旋转
  zoomRotate: {
    type: 'scale',
    from: { scale: 1, angle: 0 },
    to: { scale: 2, angle: 360 },
    easing: 'easeOut'
  }
};

// 所有过渡效果配置
export const allTransitions = {
  ...basicTransitions,
  ...slideTransitions,
  ...scaleTransitions,
  ...rotationTransitions,
  ...wipeTransitions,
  ...threeDTransitions,
  ...specialTransitions,
  ...combinedTransitions
};

// 预设过渡效果组合
export const transitionPresets = {
  // 电影风格
  cinematic: [
    { name: 'fade', duration: 1.0, startTime: 0 },
    { name: 'slideLeft', duration: 1.5, startTime: 2 },
    { name: 'zoomIn', duration: 1.0, startTime: 4 }
  ],
  
  // 现代风格
  modern: [
    { name: 'quickFade', duration: 0.5, startTime: 0 },
    { name: 'slideUp', duration: 0.8, startTime: 1.5 },
    { name: 'elasticZoom', duration: 1.0, startTime: 3 }
  ],
  
  // 创意风格
  creative: [
    { name: 'rotateClockwise', duration: 1.5, startTime: 0 },
    { name: 'flipY', duration: 1.0, startTime: 2 },
    { name: 'dissolve', duration: 1.2, startTime: 3.5 }
  ]
};
