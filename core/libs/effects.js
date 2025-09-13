import * as fabric from "fabric/node";

const TARGET = { x: 0, y: 0, scaleX: 1, scaleY: 1, angle: 0, opacity: 1 };
const TARGET_LEFT = { x: -0.1, y: 0};
const TARGET_RIGHT = { x: 0.1, y: 0 };
const TARGET_UP = { x: 0, y: -0.1 };
const TARGET_DOWN = { x: 0, y: 0.1 };
const TARGET_LEFT_BIG = { x: -0.2, y: 0 };
const TARGET_RIGHT_BIG = { x: 0.2, y: 0 };
const TARGET_UP_BIG = { x: 0, y: -0.2 };
const TARGET_DOWN_BIG = { x: 0, y: 0.2 };

// 缓动函数映射
const EASING_FUNCTIONS = {
  linear: (t) => t,
  ...fabric.util.ease
};
// 通用特效配置
const Effects = {
  effects: {
    // 基础淡入淡出
    fadeIn: { 
      from: { opacity: 0 }, 
      to: TARGET, 
      ease: 'easeOutQuad' 
    },
    fadeOut: { 
      from: TARGET, 
      to: { opacity: 0 }, 
      ease: 'easeInQuad' 
    },
    
    // 方向淡入
    fadeInLeft: ['fadeIn', { from: TARGET_LEFT }],
    fadeInRight: ['fadeIn', { from: TARGET_RIGHT }],
    fadeInUp: ['fadeIn', { from: TARGET_UP }],
    fadeInDown: ['fadeIn', { from: TARGET_DOWN }],
    fadeInLeftBig: ['fadeIn', { from: TARGET_LEFT_BIG }],
    fadeInRightBig: ['fadeIn', { from: TARGET_RIGHT_BIG }],
    fadeInUpBig: ['fadeIn', { from: TARGET_UP_BIG }],
    fadeInDownBig: ['fadeIn', { from: TARGET_DOWN_BIG }],
    
    // 方向淡出
    fadeOutLeft: ['fadeOut', { to: TARGET_LEFT }],
    fadeOutRight: ['fadeOut', { to: TARGET_RIGHT }],
    fadeOutUp: ['fadeOut', { to: TARGET_UP }],
    fadeOutDown: ['fadeOut', { to: TARGET_DOWN }],
    
    // 缩放效果
    zoomIn: { 
      from: { scaleX: 0, scaleY: 0, opacity: 0 }, 
      to: TARGET, 
      ease: 'easeOutBack' 
    },
    zoomOut: { 
      from: TARGET, 
      to: { scaleX: 0, scaleY: 0, opacity: 0 }, 
      ease: 'easeInBack' 
    },
    
    // 旋转效果
    rotateIn: { 
      from: { angle: -180, opacity: 0 }, 
      to: TARGET, 
      ease: 'easeOutCubic' 
    },
    rotateOut: { 
      from: TARGET, 
      to: { angle: 180, opacity: 0 }, 
      ease: 'easeInCubic' 
    },
    
    // 弹跳效果
    bounceIn: { 
      from: { scaleX: 0.3, scaleY: 0.3, opacity: 0 }, 
      to: TARGET, 
      ease: 'easeOutBounce' 
    },
    
    // 自定义效果
    pulse: {
      keyframes: (progress) => {
        const pulseProgress = Math.sin(progress * Math.PI * 2);
        return {
          scaleX: 1 + pulseProgress * 0.1,
          scaleY: 1 + pulseProgress * 0.1
        };
      }
    }
  },

  // 解析特效配置
  parseEffect(effectName) {
    let effectConfig = this.effects[effectName];
    
    if (!effectConfig) {
      throw new Error(`Effect "${effectName}" not found`);
    }
    
    // 处理组合效果
    if (Array.isArray(effectConfig)) {
      const [baseEffectName, overrideConfig] = effectConfig;
      const baseConfig = this.parseEffect(baseEffectName);
      return { ...baseConfig, ...overrideConfig };
    }
    
    return effectConfig;
  },

  // 根据progress计算动画状态
  calculateAnimationState(object,effectName, progress, customConfig = {}) {
    const config = this.parseEffect(effectName);
    const mergedConfig = { ...config, ...customConfig };
    
    const easedProgress = EASING_FUNCTIONS[mergedConfig.ease || 'linear'](progress);
    
    // 处理关键帧动画
    if (mergedConfig.keyframes) {
      return mergedConfig.keyframes(easedProgress);
    }
    
    // 处理标准的from-to动画
    const currentState = {};
    
    // 遍历所有属性，进行插值计算
    for (let key in mergedConfig.to) {
      let startValue = mergedConfig.from[key] !== undefined ? mergedConfig.from[key] : TARGET[key];
      let endValue = mergedConfig.to[key];
      if(key === 'x'){
          key = 'left';
          startValue = object.left + (object.width * object.scaleX) * startValue;
          endValue = object.left + (object.width * object.scaleX) * endValue;
      }
      // 修复y(top)计算
      if(key === 'y'){
          key = 'top';
          startValue = object.top + (object.height * object.scaleY) * startValue;
          endValue = object.top + (object.height * object.scaleY) * endValue;
      }
      if (typeof startValue === 'number' && typeof endValue === 'number') {
        currentState[key] = startValue + (endValue - startValue) * easedProgress;
      } else {
        currentState[key] = endValue;
      }
    }
    
    return currentState;
  },

  // 应用特效到对象
  applyEffectToObject(object, effectName, progress, customConfig = {}) {
    const animationState = this.calculateAnimationState(object,effectName, progress, customConfig);
    object.set(animationState);
    return animationState;
  }
};

export default Effects