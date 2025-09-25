import * as fabric from "fabric/node";
import { createCanvas } from "canvas";
import { parsePositionValue, getPositionProps } from "../utils/positionUtils.js";
import { createSplitText } from "../utils/fabricSplitText.js";
import { animationManager } from "../animations/AnimationManager.js";
import { createFabricCanvas, renderFabricCanvas } from "../utils/fabricUtils.js";
import { BaseElement } from "./base.js";


/**
 * 打字机效果 - 逐字显示文字
 * @param {string} text - 原始文字
 * @param {number} progress - 进度 (0-1)
 * @param {number} speed - 打字速度 (毫秒/字符)
 * @returns {string} 显示的文字
 */
function getTypewriterText(text, progress, speed = 100) {
  if (progress <= 0) return '';
  
  // 计算应该显示的字符数
  const totalChars = text.length;
  const visibleChars = Math.floor(progress * totalChars);
  
  return text.substring(0, visibleChars);
}

/**
 * 计算文本位置 - 使用 BaseElement 的 getPositionProps 方法
 * @param {Object} options - 位置选项
 * @param {boolean} isSplitText - 是否为分割文本
 * @returns {Object} 位置属性 { left, top, originX, originY }
 */
function calculateTextPosition(options, isSplitText = false) {
  const {
    position = "center",
    x = 0,
    y = 0,
    originX = "center",
    originY = "center",
    width,
    height,
    textWidth = 0,
    textHeight = 0
  } = options;

  // 对于分割文本，我们需要特殊处理
  if (isSplitText) {
    // 先按原始设置计算位置
    const positionProps = getPositionProps({
      position,
      x,
      y,
      width,
      height,
      originX,
      originY,
      elementWidth: textWidth,
      elementHeight: textHeight
    });
    
    // 将中心点位置转换为左上角位置
    let left = positionProps.left;
    let top = positionProps.top;
    
    // 根据原始原点调整位置
    if (originX === 'center') {
      left -= textWidth / 2;
    } else if (originX === 'right') {
      left -= textWidth;
    }
    
    if (originY === 'center') {
      top -= textHeight / 2;
    } else if (originY === 'bottom') {
      top -= textHeight;
    }
    
    return {
      left,
      top,
      originX: 'left',  // 分割文本固定使用左上角原点
      originY: 'top'    // 分割文本固定使用左上角原点
    };
  } else {
    // 普通文本使用原始计算
    return getPositionProps({
      position,
      x,
      y,
      width,
      height,
      originX,
      originY,
      elementWidth: textWidth,
      elementHeight: textHeight
    });
  }
}


/**
 * 创建渐变填充
 * @param {string} type - 渐变类型 'linear' 或 'radial'
 * @param {Array} colors - 颜色数组
 * @param {string} direction - 渐变方向
 * @param {number} width - 文字宽度
 * @param {number} height - 文字高度
 * @returns {Object} Fabric.js 渐变对象
 */
function createGradient(type, colors, direction, width, height) {
  if (!colors || colors.length < 2) {
    return null;
  }
  
  let coords = {};
  
  if (type === 'linear') {
    switch (direction) {
      case 'horizontal':
        coords = { x1: 0, y1: 0, x2: width, y2: 0 };
        break;
      case 'vertical':
        coords = { x1: 0, y1: 0, x2: 0, y2: height };
        break;
      case 'diagonal':
        coords = { x1: 0, y1: 0, x2: width, y2: height };
        break;
      default:
        coords = { x1: 0, y1: 0, x2: width, y2: 0 };
    }
    
    return new fabric.Gradient({
      type: 'linear',
      coords: coords,
      colorStops: colors.map((color, index) => ({
        offset: index / (colors.length - 1),
        color: color
      }))
    });
  } else if (type === 'radial') {
    return new fabric.Gradient({
      type: 'radial',
      coords: {
        x1: width / 2,
        y1: height / 2,
        x2: width / 2,
        y2: height / 2,
        r1: 0,
        r2: Math.max(width, height) / 2
      },
      colorStops: colors.map((color, index) => ({
        offset: index / (colors.length - 1),
        color: color
      }))
    });
  }
  
  return null;
}

/**
 * 处理预设动画配置
 * 支持以下格式：
 * 1. 字符串数组: ["fadeIn", "zoomIn"]
 * 2. 对象数组: [{type: "fadeIn"}, {type: "zoomIn", duration: 2}]
 * 3. 复杂配置: [{property: "scaleX", keyframes: [...]}]
 */
function processPresetAnimations(animations) {
  if (!animations || !Array.isArray(animations)) {
    return [];
  }
  
  const processedAnimations = [];
  
  
  for (const anim of animations) {
    if (typeof anim === 'string') {
      // 字符串格式: "fadeIn"
      const preset = animationManager.presets.get(anim);
      if (preset) {
       // 检查是否为多属性动画
        if (preset.type === 'multi' && preset.properties) {
          // 处理多属性动画
          for (const prop of preset.properties) {
            processedAnimations.push({
              property: prop.property,
              keyframes: [
                { time: 0, value: prop.from },
                { time: 1, value: prop.to }
              ],
              duration: prop.duration || 1,
              easing: prop.easing || 'easeOut',
              delay: prop.delay || 0, // 传递 delay 参数
              type: anim,
              isOffset: prop.isOffset || false
            });
          }
        } else {
          // 单属性动画
          processedAnimations.push({
            property: preset.property,
            keyframes: [
              { time: 0, value: preset.from },
              { time: 1, value: preset.to }
            ],
            duration: preset.duration || 1,
            easing: preset.easing || 'easeOut',
            delay: preset.delay || 0, // 传递 delay 参数
            type: anim, // 保存原始类型用于特殊处理
            isOffset: preset.isOffset || false // 传递 isOffset 属性
          });
          
          // 如果是缩放动画，自动添加 scaleY
          if (preset.property === 'scaleX' && (anim === 'zoomIn' || anim === 'zoomOut' || anim === 'textZoomIn' || anim === 'textZoomOut')) {
            processedAnimations.push({
              property: 'scaleY',
              keyframes: [
                { time: 0, value: preset.from },
                { time: 1, value: preset.to }
              ],
              duration: preset.duration || 1,
              easing: preset.easing || 'easeOut',
              delay: preset.delay || 0, // 传递 delay 参数
              type: anim
            });
          }
        }
      }
    } else if (anim.type) {
      // 对象格式: {type: "fadeIn", duration: 2}
      const preset = animationManager.presets.get(anim.type);
      if (preset) {
        // 检查是否为多属性动画
        if (preset.type === 'multi' && preset.properties) {
          // 处理多属性动画
          for (const prop of preset.properties) {
            processedAnimations.push({
              property: prop.property,
              keyframes: [
                { time: 0, value: prop.from },
                { time: 1, value: prop.to }
              ],
              duration: anim.duration || prop.duration || 1,
              easing: anim.easing || prop.easing || 'easeOut',
              delay: anim.delay || prop.delay || 0, // 传递 delay 参数
              type: anim.type,
              isOffset: prop.isOffset || false
            });
          }
        } else {
          // 单属性动画
          processedAnimations.push({
            property: preset.property,
            keyframes: [
              { time: 0, value: preset.from },
              { time: 1, value: preset.to }
            ],
            duration: anim.duration || preset.duration || 1,
            easing: anim.easing || preset.easing || 'easeOut',
            delay: anim.delay || preset.delay || 0, // 传递 delay 参数
            type: anim.type,
            isOffset: preset.isOffset || false // 传递 isOffset 属性
          });
          
          // 如果是缩放动画，自动添加 scaleY
          if (preset.property === 'scaleX' && (anim.type === 'zoomIn' || anim.type === 'zoomOut' || anim.type === 'textZoomIn' || anim.type === 'textZoomOut')) {
            processedAnimations.push({
              property: 'scaleY',
              keyframes: [
                { time: 0, value: preset.from },
                { time: 1, value: preset.to }
              ],
              duration: anim.duration || preset.duration || 1,
              easing: anim.easing || preset.easing || 'easeOut',
              delay: anim.delay || preset.delay || 0, // 传递 delay 参数
              type: anim.type
            });
          }
        }
      }
    } else if (anim.property) {
      // 复杂配置格式: {property: "scaleX", keyframes: [...]}
      processedAnimations.push(anim);
    }
  }
  
  return processedAnimations;
}

/**
 * 标题处理器 - 参考 editly 的 title.js 实现
 */
export async function createTitleElement(config) {
  const { 
    text, 
    font, 
    fontPath,
    fontFamily,
    fontSize = 72, // 添加 fontSize 参数，默认 72px
    textColor = "#ffffff", 
    position = "center", 
    x, // 自定义 X 坐标
    y, // 自定义 Y 坐标
    originX = "center", // 原点 X
    originY = "center", // 原点 Y
    zoomDirection, // 不设置默认值，只有传入时才启用
    zoomAmount = 0.2, 
    animations = [], // 动画配置
    split = null, // 分割参数：'letter'、'word' 或 'line'
    splitDelay = 0.1, // 分割动画延迟
    splitDuration = 0.3, // 分割动画持续时间
    duration = 4, // 元素持续时间
    width, 
    height,
    // 阴影配置
    shadow = null,
    shadowColor = "#000000",
    shadowBlur = 0,
    shadowOffsetX = 0,
    shadowOffsetY = 0,
    // 边框配置
    stroke = null,
    strokeColor = "#000000",
    strokeWidth = 1,
    // 渐变填充配置
    gradient = null,
    gradientType = 'linear',
    gradientColors = ['#ff0000', '#0000ff'],
    gradientDirection = 'horizontal',
    // 文字装饰配置
    underline = false,
    linethrough = false,
    overline = false,
    // 文字发光效果
    glow = null,
    glowColor = '#ffffff',
    glowBlur = 10,
    // 文字变形效果
    skewX = 0,
    skewY = 0,
    // 文字路径效果
    textPath = null,
    pathData = null,
    // 文字遮罩效果
    textMask = null,
    maskImage = null,
    // 打字机效果
    typewriter = null,
    typewriterSpeed = 100, // 毫秒/字符
    typewriterDelay = 0 // 开始延迟
  } = config;
  
  // 使用 BaseElement 的字体处理逻辑
  const fontResult = await BaseElement.processFont({ fontPath, fontFamily, fontSize }, width, height);
  const finalFontFamily = fontResult.fontFamily;
  const finalFontSize = fontResult.fontSize;
  
  
  
  // 如果启用了分割动画，创建分割后的文本片段
  let textSegments = [];
  if (split) {
    // 使用 Fabric SplitText 进行精确的文本分割
    const splitTextInstance = createSplitText(text, {
      fontSize: finalFontSize,
      fontFamily: finalFontFamily,
      fill: textColor,
      // 使用智能间距配置
      autoSpacing: true,
      dynamicSpacing: true,  // 启用动态间距调整
      minCharSpacing: 0.08,  // 最小字符间距
      maxCharSpacing: 0.25,  // 最大字符间距
      minWordSpacing: 0.15,  // 最小单词间距
      maxWordSpacing: 0.4,   // 最大单词间距
      lineHeight: 1.2
    });
    
    // 获取指定类型的分割数据
    const segments = splitTextInstance.getSegments(split);
    
    textSegments = segments.map((segment, index) => {
      return {
        text: segment.text,
        index,
        startTime: index * splitDelay,
        endTime: index * splitDelay + splitDuration,
        width: segment.width,
        height: segment.height,
        x: segment.x,
        y: segment.y,
        isSpace: segment.isSpace || false,
        splitTextInstance: splitTextInstance // 保存 SplitText 实例引用
      };
    });
  }
  
  
  
  return {
    text: text, // 保存 text 变量到返回对象中
    async readNextFrame(progress, canvas, time = null) {
      if (!this.text) {
        return null;
      }
      
      // 动画效果由 BaseElement 处理，这里不需要处理
      
      // 位置解析现在由 BaseElement 统一处理，这里不需要解析
      
      if (split && textSegments.length > 0) {
        // 处理分割动画
        
        let totalWidth = 0;
        let totalHeight = 0;
        
        // 使用精确的宽度计算
        const charSpacing = finalFontSize * 0.1; // 参考 slide-in-text.js 的字符间距设置
        
        // 使用 SplitText 的精确尺寸计算
        if (textSegments.length > 0 && textSegments[0].splitTextInstance) {
          const splitTextInstance = textSegments[0].splitTextInstance;
          totalWidth = splitTextInstance.getTotalWidth();
          totalHeight = splitTextInstance.getTotalHeight();
        } else {
          // 回退到简单计算
          if (split === 'word' || split === 'letter') {
            totalWidth = textSegments.reduce((sum, segment) => {
              const segmentWidth = segment.width || segment.text.width;
              const isSpace = segment.isSpace || false;
              return sum + segmentWidth + (isSpace ? 0 : charSpacing);
            }, 0);
            if (textSegments.length > 0) {
              const lastSegment = textSegments[textSegments.length - 1];
              const isLastSpace = lastSegment.isSpace || false;
              if (!isLastSpace) {
                totalWidth -= charSpacing;
              }
            }
          } else if (split === 'line') {
            totalHeight = textSegments.length * finalFontSize * 1.5;
          }
        }
        
        // 使用 getPositionProps 计算文本位置（分割文本）
        const positionProps = calculateTextPosition({
          position,
          x,
          y,
          originX,
          originY,
          width,
          height,
          textWidth: totalWidth,
          textHeight: totalHeight
        }, true); // 标记为分割文本
        
        // 计算文本的起始位置（左上角）
        let currentX = positionProps.left;
        let currentY = positionProps.top;
        
        // 创建主Fabric Canvas用于合成所有分割文本片段
        const mainCanvas = createFabricCanvas({ width, height });
        
        for (let i = 0; i < textSegments.length; i++) {
          const segment = textSegments[i];
          // 计算分割动画进度
          // segment.startTime 和 segment.endTime 是相对于分割动画的延迟时间（秒）
          // 使用绝对时间来计算分割动画进度
          const absoluteTime = time || (progress * duration);
          const segmentProgress = Math.max(0, Math.min(1, (absoluteTime - segment.startTime) / (segment.endTime - segment.startTime)));
          
          
          if (segmentProgress > 0) {
            let segmentLeft = currentX;
            let segmentTop = currentY;
            
            // 使用 SplitText 的精确位置
            if (segment.x !== undefined && segment.y !== undefined) {
              // segment.x 是相对于文本起始点的偏移量，直接使用
              segmentLeft = currentX + segment.x;
              segmentTop = currentY + segment.y;
            } else {
              // 回退到简单位置计算
              if (split === 'word' || split === 'letter') {
                segmentLeft = currentX;
                const segmentWidth = segment.width || segment.text.width;
                const isSpace = segment.isSpace || false;
                currentX += segmentWidth + (isSpace ? 0 : charSpacing);
              } else if (split === 'line') {
                segmentTop = currentY + segment.index * (finalFontSize * 1.5);
              }
            }
            
            // 处理分割文本的动画效果
            let scaleX = 1, scaleY = 1, angle = 0, translateX = 0, translateY = 0;
            let rotationX = 0, rotationY = 0, rotationZ = 0, translateZ = 0;
            let opacity = segmentProgress; // 默认使用分割进度作为透明度
            let hasOpacityAnimation = false; // 标记是否有透明度动画
            
            if (animations && animations.length > 0) {
              // 处理多个动画的组合
              let scaleXAnimations = [];
              let scaleYAnimations = [];
              let rotationAnimations = [];
              let opacityAnimations = [];
              let translateXAnimations = [];
              let translateYAnimations = [];
              
              // 收集所有动画值
              for (const anim of animations) {
                const absoluteTime = time || (progress * duration);
                const animValue = anim.getValueAtTime(absoluteTime);
                
                switch (anim.property) {
                  case 'scaleX':
                    scaleXAnimations.push(animValue);
                    break;
                  case 'scaleY':
                    scaleYAnimations.push(animValue);
                    break;
                  case 'rotation':
                  case 'rotationZ':
                    rotationAnimations.push(animValue);
                    break;
                  case 'rotationX':
                    rotationAnimations.push(animValue);
                    break;
                  case 'rotationY':
                    rotationAnimations.push(animValue);
                    break;
                  case 'x':
                    if (anim.isOffset) {
                      translateXAnimations.push(animValue);
                    } else {
                      translateX = animValue;
                    }
                    break;
                  case 'y':
                    if (anim.isOffset) {
                      translateYAnimations.push(animValue);
                    } else {
                      translateY = animValue;
                    }
                    break;
                  case 'translateZ':
                    translateZ = animValue;
                    break;
                  case 'opacity':
                    opacityAnimations.push(animValue);
                    hasOpacityAnimation = true;
                    break;
                }
              }
              
              // 应用动画组合
              if (scaleXAnimations.length > 0) {
                // 对于缩放，使用乘法组合（bounceIn: 0→1, explodeOut: 1→1.5）
                scaleX = scaleXAnimations.reduce((acc, val) => acc * val, 1);
              }
              if (scaleYAnimations.length > 0) {
                scaleY = scaleYAnimations.reduce((acc, val) => acc * val, 1);
              }
              if (rotationAnimations.length > 0) {
                // 对于旋转，使用加法组合
                angle = rotationAnimations.reduce((acc, val) => acc + val, 0);
                rotationZ = angle;
              }
              if (opacityAnimations.length > 0) {
                // 对于透明度，使用乘法组合
                opacity = opacityAnimations.reduce((acc, val) => acc * val, 1);
              }
              if (translateXAnimations.length > 0) {
                translateX += translateXAnimations.reduce((acc, val) => acc + val, 0);
              }
              if (translateYAnimations.length > 0) {
                translateY += translateYAnimations.reduce((acc, val) => acc + val, 0);
              }
            }
            
            // 如果没有透明度动画，使用分割进度作为透明度
            if (!hasOpacityAnimation) {
              opacity = segmentProgress;
            }
            
            // 创建Fabric.js Text对象渲染分割文本片段
            const textContent = segment.char || (segment.text && segment.text.text) || segment.text || '';
            
            // 计算文字尺寸用于渐变
            const tempText = new fabric.Text(textContent, {
              fontSize: finalFontSize,
              fontFamily: finalFontFamily
            });
            const textWidth = tempText.getScaledWidth();
            const textHeight = tempText.getScaledHeight();
            
            // 创建渐变填充
            let fillColor = textColor;
            if (gradient) {
              const gradientObj = createGradient(gradientType, gradientColors, gradientDirection, textWidth, textHeight);
              if (gradientObj) {
                fillColor = gradientObj;
              }
            }
            
            const textObj = new fabric.Text(textContent, {
              fontSize: finalFontSize,
              fontFamily: finalFontFamily,
              fill: fillColor,
              left: segmentLeft + translateX,
              top: segmentTop + translateY,
              scaleX: scaleX,
              scaleY: scaleY,
              angle: angle,
              opacity: opacity,
              originX: positionProps.originX,
              originY: positionProps.originY,
              // 3D 变换属性（Fabric.js 可能不完全支持，但保留以备将来扩展）
              rotationX: rotationX,
              rotationY: rotationY,
              rotationZ: rotationZ,
              translateZ: translateZ,
              // 阴影配置
              shadow: shadow ? new fabric.Shadow({
                color: shadowColor,
                blur: shadowBlur,
                offsetX: shadowOffsetX,
                offsetY: shadowOffsetY
              }) : null,
              // 边框配置
              stroke: stroke ? strokeColor : null,
              strokeWidth: stroke ? strokeWidth : 0,
              // 文字装饰配置
              underline: underline,
              linethrough: linethrough,
              overline: overline,
              // 文字变形配置
              skewX: skewX,
              skewY: skewY
            });
            
            // 应用发光效果（通过多重阴影实现）
            if (glow) {
              const glowShadow = new fabric.Shadow({
                color: glowColor,
                blur: glowBlur,
                offsetX: 0,
                offsetY: 0
              });
              textObj.set('shadow', glowShadow);
            }
            
            // 将文本对象添加到主Canvas
            mainCanvas.add(textObj);
          }
        }
        
        // 返回对象数组而不是渲染图像
        // 让 BaseElement 统一处理位置动画和渲染
        const objects = [];
        
        // 收集所有文本对象
        mainCanvas.forEachObject((obj) => {
          objects.push({
            type: 'text',
            fabricObject: obj,
            // 保存原始位置信息，BaseElement 会处理位置动画
            originalLeft: obj.left,
            originalTop: obj.top,
            originalOriginX: obj.originX,
            originalOriginY: obj.originY
          });
        });
        
        return {
          objects: objects,
          width: width,
          height: height,
          isSplitText: true, // 标记为分割文本
          splitOriginX: positionProps.originX, // 保存分割文本的原点
          splitOriginY: positionProps.originY,
          // 整体文本的位置和尺寸
          textLeft: positionProps.left,
          textTop: positionProps.top,
          textWidth: totalWidth,
          textHeight: totalHeight
        };
      } else {
        // 处理普通文本动画 - 使用Fabric Canvas
        // 先创建一个临时文本对象来计算实际尺寸
        const tempTextObj = new fabric.Text(text, {
          fontSize: finalFontSize,
          fontFamily: finalFontFamily,
          fill: textColor
        });
        
        // 获取文本的实际尺寸
        const textWidth = tempTextObj.getScaledWidth();
        const textHeight = tempTextObj.getScaledHeight();
        
        // 添加一些边距
        const padding = 20;
        const actualWidth = Math.ceil(textWidth) + padding * 2;
        const actualHeight = Math.ceil(textHeight) + padding * 2;
        
        // 创建实际尺寸的画布
        const textCanvas = createFabricCanvas({ width: actualWidth, height: actualHeight });
        
        // 处理动画效果
        let scaleX = 1, scaleY = 1, angle = 0, translateX = 0, translateY = 0;
        let rotationX = 0, rotationY = 0, rotationZ = 0, translateZ = 0;
        let opacity = 1;
        
        if (animations && animations.length > 0) {
          // 处理多个动画的组合
          let scaleXAnimations = [];
          let scaleYAnimations = [];
          let rotationAnimations = [];
          let opacityAnimations = [];
          let translateXAnimations = [];
          let translateYAnimations = [];
          
          // 收集所有动画值
          for (const anim of animations) {
            const absoluteTime = time || (progress * duration);
            const animValue = anim.getValueAtTime(absoluteTime);
            
            if (animValue !== null) {
              switch (anim.property) {
                case 'scaleX':
                  scaleXAnimations.push(animValue);
                  break;
                case 'scaleY':
                  scaleYAnimations.push(animValue);
                  break;
                case 'rotation':
                case 'rotationZ':
                  rotationAnimations.push(animValue);
                  break;
                case 'rotationX':
                  rotationAnimations.push(animValue);
                  break;
                case 'rotationY':
                  rotationAnimations.push(animValue);
                  break;
                case 'x':
                  if (anim.isOffset) {
                    translateXAnimations.push(animValue);
                  } else {
                    translateX = animValue;
                  }
                  break;
                case 'y':
                  if (anim.isOffset) {
                    translateYAnimations.push(animValue);
                  } else {
                    translateY = animValue;
                  }
                  break;
                case 'translateZ':
                  translateZ = animValue;
                  break;
                case 'opacity':
                  opacityAnimations.push(animValue);
                  break;
              }
            }
          }
          
          // 应用动画组合
          if (scaleXAnimations.length > 0) {
            // 对于缩放，使用乘法组合（bounceIn: 0→1, explodeOut: 1→1.5）
            scaleX = scaleXAnimations.reduce((acc, val) => acc * val, 1);
          }
          if (scaleYAnimations.length > 0) {
            scaleY = scaleYAnimations.reduce((acc, val) => acc * val, 1);
          }
          if (rotationAnimations.length > 0) {
            // 对于旋转，使用加法组合
            angle = rotationAnimations.reduce((acc, val) => acc + val, 0);
            rotationZ = angle;
          }
          if (opacityAnimations.length > 0) {
            // 对于透明度，使用乘法组合
            opacity = opacityAnimations.reduce((acc, val) => acc * val, 1);
          }
          if (translateXAnimations.length > 0) {
            translateX += translateXAnimations.reduce((acc, val) => acc + val, 0);
          }
          if (translateYAnimations.length > 0) {
            translateY += translateYAnimations.reduce((acc, val) => acc + val, 0);
          }
        }
        
        // 创建渐变填充
        let fillColor = textColor;
        if (gradient) {
          const gradientObj = createGradient(gradientType, gradientColors, gradientDirection, actualWidth, actualHeight);
          if (gradientObj) {
            fillColor = gradientObj;
          }
        }
        
        // 处理打字机效果
        let displayText = text;
        
        // 打字机效果
        if (typewriter) {
          displayText = getTypewriterText(text, progress, typewriterSpeed);
        }
        
        // 使用 getPositionProps 计算文本位置（普通文本）
        const positionProps = calculateTextPosition({
          position,
          x,
          y,
          originX,
          originY,
          width,
          height,
          textWidth: actualWidth,
          textHeight: actualHeight
        }, false); // 标记为普通文本
        
        // 创建文字对象
        if (displayText) {
          const textObj = new fabric.Text(displayText, {
            fontSize: finalFontSize,
            fontFamily: finalFontFamily,
            fill: fillColor,
            left: positionProps.left + translateX,
            top: positionProps.top + translateY,
            scaleX: scaleX,
            scaleY: scaleY,
            angle: angle,
            opacity: opacity,
            originX: 'center',
            originY: 'center',
            rotationX: rotationX,
            rotationY: rotationY,
            rotationZ: rotationZ,
            translateZ: translateZ,
            shadow: shadow ? new fabric.Shadow({
              color: shadowColor,
              blur: shadowBlur,
              offsetX: shadowOffsetX,
              offsetY: shadowOffsetY
            }) : null,
            stroke: stroke ? strokeColor : null,
            strokeWidth: stroke ? strokeWidth : 0,
            underline: underline,
            linethrough: linethrough,
            overline: overline,
            skewX: skewX,
            skewY: skewY
          });
          
          // 应用发光效果
          if (glow) {
            const glowShadow = new fabric.Shadow({
              color: glowColor,
              blur: glowBlur,
              offsetX: 0,
              offsetY: 0
            });
            textObj.set('shadow', glowShadow);
          }
          
          // 将文字对象添加到Canvas
          textCanvas.add(textObj);
        }
        
        // 返回对象数组而不是渲染图像
        // 让 BaseElement 统一处理位置动画和渲染
        const objects = [];
        
        // 收集所有文本对象
        textCanvas.forEachObject((obj) => {
          objects.push({
            type: 'text',
            fabricObject: obj,
            // 保存原始位置信息，BaseElement 会处理位置动画
            originalLeft: obj.left,
            originalTop: obj.top,
            originalOriginX: obj.originX,
            originalOriginY: obj.originY
          });
        });
        
        return {
          objects: objects,
          width: actualWidth,
          height: actualHeight,
          isSplitText: false, // 标记为普通文本
          // 整体文本的位置和尺寸
          textLeft: positionProps.left,
          textTop: positionProps.top,
          textWidth: actualWidth,
          textHeight: actualHeight
        };
      }
      
    },
    
    async close() {
      // 清理资源
    }
  };
}

