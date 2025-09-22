// https://easings.net/
// 完整的缓动函数库，移植自 core/libs/easings.js

const pow = Math.pow;
const sqrt = Math.sqrt;
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * PI) / 3;
const c5 = (2 * PI) / 4.5;

// 内部使用的弹跳函数
const bounceOut = function (x) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
};

// 线性缓动
export const linear = (x) => x;

// 二次缓动
export const easeInQuad = function (x) {
  return x * x;
};

export const easeOutQuad = function (x) {
  return 1 - (1 - x) * (1 - x);
};

export const easeInOutQuad = function (x) {
  return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
};

// 三次缓动
export const easeInCubic = function (x) {
  return x * x * x;
};

export const easeOutCubic = function (x) {
  return 1 - pow(1 - x, 3);
};

export const easeInOutCubic = function (x) {
  return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
};

// 四次缓动
export const easeInQuart = function (x) {
  return x * x * x * x;
};

export const easeOutQuart = function (x) {
  return 1 - pow(1 - x, 4);
};

export const easeInOutQuart = function (x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
};

// 五次缓动
export const easeInQuint = function (x) {
  return x * x * x * x * x;
};

export const easeOutQuint = function (x) {
  return 1 - pow(1 - x, 5);
};

export const easeInOutQuint = function (x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
};

// 正弦缓动
export const easeInSine = function (x) {
  return 1 - cos((x * PI) / 2);
};

export const easeOutSine = function (x) {
  return sin((x * PI) / 2);
};

export const easeInOutSine = function (x) {
  return -(cos(PI * x) - 1) / 2;
};

// 指数缓动
export const easeInExpo = function (x) {
  return x === 0 ? 0 : pow(2, 10 * x - 10);
};

export const easeOutExpo = function (x) {
  return x === 1 ? 1 : 1 - pow(2, -10 * x);
};

export const easeInOutExpo = function (x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? pow(2, 20 * x - 10) / 2
    : (2 - pow(2, -20 * x + 10)) / 2;
};

// 圆形缓动
export const easeInCirc = function (x) {
  return 1 - sqrt(1 - pow(x, 2));
};

export const easeOutCirc = function (x) {
  return sqrt(1 - pow(x - 1, 2));
};

export const easeInOutCirc = function (x) {
  return x < 0.5
    ? (1 - sqrt(1 - pow(2 * x, 2))) / 2
    : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
};

// 回弹缓动
export const easeInBack = function (x) {
  return c3 * x * x * x - c1 * x * x;
};

export const easeOutBack = function (x) {
  return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
};

export const easeInOutBack = function (x) {
  return x < 0.5
    ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
};

// 弹性缓动
export const easeInElastic = function (x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
};

export const easeOutElastic = function (x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
};

export const easeInOutElastic = function (x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
    : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
};

// 弹跳缓动
export const easeInBounce = function (x) {
  return 1 - bounceOut(1 - x);
};

export const easeOutBounce = bounceOut;

export const easeInOutBounce = function (x) {
  return x < 0.5
    ? (1 - bounceOut(1 - 2 * x)) / 2
    : (1 + bounceOut(2 * x - 1)) / 2;
};

// 兼容性映射 - 将简化的名称映射到完整的函数
export const easingMap = {
  // 基本缓动
  'linear': linear,
  'easeIn': easeInQuad,
  'easeOut': easeOutQuad,
  'easeInOut': easeInOutQuad,
  
  // 二次缓动
  'quad': easeInOutQuad,
  'easeInQuad': easeInQuad,
  'easeOutQuad': easeOutQuad,
  'easeInOutQuad': easeInOutQuad,
  
  // 三次缓动
  'cubic': easeInOutCubic,
  'easeInCubic': easeInCubic,
  'easeOutCubic': easeOutCubic,
  'easeInOutCubic': easeInOutCubic,
  
  // 四次缓动
  'quart': easeInOutQuart,
  'easeInQuart': easeInQuart,
  'easeOutQuart': easeOutQuart,
  'easeInOutQuart': easeInOutQuart,
  
  // 五次缓动
  'quint': easeInOutQuint,
  'easeInQuint': easeInQuint,
  'easeOutQuint': easeOutQuint,
  'easeInOutQuint': easeInOutQuint,
  
  // 正弦缓动
  'sine': easeInOutSine,
  'easeInSine': easeInSine,
  'easeOutSine': easeOutSine,
  'easeInOutSine': easeInOutSine,
  
  // 指数缓动
  'expo': easeInOutExpo,
  'easeInExpo': easeInExpo,
  'easeOutExpo': easeOutExpo,
  'easeInOutExpo': easeInOutExpo,
  
  // 圆形缓动
  'circ': easeInOutCirc,
  'easeInCirc': easeInCirc,
  'easeOutCirc': easeOutCirc,
  'easeInOutCirc': easeInOutCirc,
  
  // 回弹缓动
  'back': easeInOutBack,
  'easeInBack': easeInBack,
  'easeOutBack': easeOutBack,
  'easeInOutBack': easeInOutBack,
  
  // 弹性缓动
  'elastic': easeInOutElastic,
  'easeInElastic': easeInElastic,
  'easeOutElastic': easeOutElastic,
  'easeInOutElastic': easeInOutElastic,
  
  // 弹跳缓动
  'bounce': easeOutBounce,
  'easeInBounce': easeInBounce,
  'easeOutBounce': easeOutBounce,
  'easeInOutBounce': easeInOutBounce,
  
  // 特殊缓动（保持向后兼容）
  'spring': easeOutElastic,  // spring 映射到弹性缓动
  'swing': easeInOutSine,    // swing 映射到正弦缓动
};

// 获取缓动函数
export function getEasingFunction(easingName) {
  return easingMap[easingName] || linear;
}

// 默认导出所有缓动函数
export default {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
  getEasingFunction,
  easingMap
};
