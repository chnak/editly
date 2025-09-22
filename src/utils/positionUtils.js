/**
 * 位置工具函数 - 支持多种单位和定位方式
 */

/**
 * 解析位置值，支持多种单位
 * @param {string|number} value - 位置值
 * @param {number} containerSize - 容器尺寸（宽度或高度）
 * @param {string} unit - 单位类型
 * @returns {number} 解析后的像素值
 */
export function parsePositionValue(value, containerSize, unit = 'px') {
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value === 'string') {
    // 检查是否包含表达式（+ 或 -）
    if (value.includes('+') || value.includes('-')) {
      return parsePositionExpression(value, containerSize);
    }
    
    // 提取数值和单位
    const match = value.match(/^([+-]?\d*\.?\d+)([a-zA-Z%]*)$/);
    if (!match) {
      return 0;
    }
    
    const numValue = parseFloat(match[1]);
    const valueUnit = match[2] || unit;
    
    switch (valueUnit) {
      case 'px':
        return numValue;
      case '%':
        return (numValue / 100) * containerSize;
      case 'vw':
        // 视口宽度单位 (1vw = 1% of viewport width)
        return (numValue / 100) * containerSize;
      case 'vh':
        // 视口高度单位 (1vh = 1% of viewport height)
        return (numValue / 100) * containerSize;
      case 'vm':
        // 视口最小单位 (1vm = 1% of viewport min(width, height))
        const minSize = Math.min(containerSize, containerSize); // 这里需要传入实际的视口尺寸
        return (numValue / 100) * minSize;
      case 'vmin':
        // 视口最小单位 (1vmin = 1% of viewport min(width, height))
        return (numValue / 100) * Math.min(containerSize, containerSize);
      case 'vmax':
        // 视口最大单位 (1vmax = 1% of viewport max(width, height))
        return (numValue / 100) * Math.max(containerSize, containerSize);
      default:
        return numValue;
    }
  }
  
  return 0;
}

/**
 * 获取元素位置属性
 * @param {Object} options - 位置选项
 * @param {string} options.position - 预定义位置 ('top', 'bottom', 'left', 'right', 'center')
 * @param {string|number} options.x - X 坐标
 * @param {string|number} options.y - Y 坐标
 * @param {number} options.width - 容器宽度
 * @param {number} options.height - 容器高度
 * @param {string} options.originX - X 轴原点 ('left', 'center', 'right')
 * @param {string} options.originY - Y 轴原点 ('top', 'center', 'bottom')
 * @returns {Object} 位置属性 { left, top, originX, originY }
 */
export function getPositionProps({ 
  position, 
  x, 
  y, 
  width, 
  height, 
  originX = 'center', 
  originY = 'center' 
}) {
  // 如果提供了自定义坐标且不是默认值，优先使用
  if (x !== undefined && y !== undefined && (x !== 0 || y !== 0)) {
    const left = parsePositionValue(x, width, 'px');
    const top = parsePositionValue(y, height, 'px');
    
    return { 
      left, 
      top, 
      originX, 
      originY 
    };
  }
  
  // 否则使用预定义位置
  switch (position) {
    case "top":
      return { 
        left: width / 2, 
        top: height * 0.2, 
        originX: "center", 
        originY: "center" 
      };
    case "bottom":
      return { 
        left: width / 2, 
        top: height * 0.8, 
        originX: "center", 
        originY: "center" 
      };
    case "left":
      return { 
        left: width * 0.2, 
        top: height / 2, 
        originX: "center", 
        originY: "center" 
      };
    case "right":
      return { 
        left: width * 0.8, 
        top: height / 2, 
        originX: "center", 
        originY: "center" 
      };
    case "top-left":
      return { 
        left: width * 0.1, 
        top: height * 0.1, 
        originX: "left", 
        originY: "top" 
      };
    case "top-right":
      return { 
        left: width * 0.9, 
        top: height * 0.1, 
        originX: "right", 
        originY: "top" 
      };
    case "bottom-left":
      return { 
        left: width * 0.1, 
        top: height * 0.9, 
        originX: "left", 
        originY: "bottom" 
      };
    case "bottom-right":
      return { 
        left: width * 0.9, 
        top: height * 0.9, 
        originX: "right", 
        originY: "bottom" 
      };
    default: // center
      return { 
        left: width / 2, 
        top: height / 2, 
        originX: "center", 
        originY: "center" 
      };
  }
}

/**
 * 解析尺寸值，支持多种单位
 * @param {string|number} value - 尺寸值
 * @param {number} containerSize - 容器尺寸
 * @param {string} unit - 默认单位
 * @returns {number} 解析后的像素值
 */
export function parseSizeValue(value, containerSize, unit = 'px') {
  return parsePositionValue(value, containerSize, unit);
}

/**
 * 解析变换值，支持多种单位
 * @param {string|number} value - 变换值
 * @param {number} containerSize - 容器尺寸
 * @param {string} unit - 默认单位
 * @returns {number} 解析后的像素值
 */
export function parseTransformValue(value, containerSize, unit = 'px') {
  return parsePositionValue(value, containerSize, unit);
}

/**
 * 计算元素的实际位置（考虑原点）
 * @param {Object} options - 位置选项
 * @param {number} options.left - 左位置
 * @param {number} options.top - 上位置
 * @param {number} options.width - 元素宽度
 * @param {number} options.height - 元素高度
 * @param {string} options.originX - X 轴原点
 * @param {string} options.originY - Y 轴原点
 * @returns {Object} 实际位置 { left, top }
 */
export function calculateActualPosition({ left, top, width, height, originX, originY }) {
  let actualLeft = left;
  let actualTop = top;
  
  // 根据 X 轴原点调整位置
  switch (originX) {
    case 'left':
      // 不需要调整
      break;
    case 'center':
      actualLeft = left - width / 2;
      break;
    case 'right':
      actualLeft = left - width;
      break;
  }
  
  // 根据 Y 轴原点调整位置
  switch (originY) {
    case 'top':
      // 不需要调整
      break;
    case 'center':
      actualTop = top - height / 2;
      break;
    case 'bottom':
      actualTop = top - height;
      break;
  }
  
  return { left: actualLeft, top: actualTop };
}

/**
 * 解析位置字符串，支持复杂的定位表达式
 * @param {string} positionString - 位置字符串，如 "50% + 20px"
 * @param {number} containerSize - 容器尺寸
 * @returns {number} 解析后的像素值
 */
export function parsePositionExpression(positionString, containerSize) {
  if (typeof positionString !== 'string') {
    return parsePositionValue(positionString, containerSize);
  }
  
  // 简单的表达式解析，支持加法和减法
  const parts = positionString.split(/([+-])/);
  let result = 0;
  let operator = '+';
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed === '+' || trimmed === '-') {
      operator = trimmed;
      continue;
    }
    
    if (trimmed) {
      const value = parsePositionValue(trimmed, containerSize);
      if (operator === '+') {
        result += value;
      } else {
        result -= value;
      }
    }
  }
  
  return result;
}
