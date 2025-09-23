import * as fabric from "fabric/node";
import { registerFont, createCanvas } from "canvas";
import { basename, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { parsePositionValue } from "../utils/positionUtils.js";
import { createSplitText } from "../utils/fabricSplitText.js";
import { animationManager } from "../animations/AnimationManager.js";
import { createFabricCanvas, renderFabricCanvas } from "../utils/fabricUtils.js";

// 缓存已加载的字体
const loadedFonts = [];

/**
 * 解析字体大小，支持多种单位
 * @param {string|number} value - 字体大小值
 * @param {number} width - 容器宽度
 * @param {number} height - 容器高度
 * @returns {number} 解析后的像素值
 */
function parseFontSize(value, width, height) {
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value === 'string') {
    // 提取数值和单位
    const match = value.match(/^([+-]?\d*\.?\d+)([a-zA-Z%]*)$/);
    if (!match) {
      return 72; // 默认字体大小
    }
    
    const numValue = parseFloat(match[1]);
    const valueUnit = match[2] || 'px';
    
    switch (valueUnit) {
      case 'px':
        return numValue;
      case '%':
        // 百分比基于最小尺寸
        return (numValue / 100) * Math.min(width, height);
      case 'vw':
        // 视口宽度单位
        return (numValue / 100) * width;
      case 'vh':
        // 视口高度单位
        return (numValue / 100) * height;
      case 'vmin':
        // 视口最小单位
        return (numValue / 100) * Math.min(width, height);
      case 'vmax':
        // 视口最大单位
        return (numValue / 100) * Math.max(width, height);
      default:
        return numValue;
    }
  }
  
  return 72; // 默认字体大小
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
    strokeWidth = 1
  } = config;
  
  // 处理字体注册
  let finalFontFamily = fontFamily || 'Arial';
  
  // 如果没有指定字体路径，尝试使用默认中文字体
  if (!fontPath) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const defaultChineseFont = resolve(__dirname, '../fonts/PatuaOne-Regular.ttf');
    try {
      const fontName = Buffer.from(basename(defaultChineseFont)).toString("base64");
      if (!loadedFonts.includes(fontName)) {
        registerFont(defaultChineseFont, { 
          family: fontName, 
          weight: "normal", 
          style: "normal" 
        });
        loadedFonts.push(fontName);
        console.log(`✓ 默认中文字体已注册: ${defaultChineseFont} -> ${fontName}`);
        finalFontFamily = fontName;
      } else {
        finalFontFamily = fontName;
      }
    } catch (error) {
      console.warn(`默认中文字体注册失败: ${defaultChineseFont}`, error.message);
    }
  } else if (fontPath) {
    const fontName = Buffer.from(basename(fontPath)).toString("base64");
    if (!loadedFonts.includes(fontName)) {
      try {
        registerFont(fontPath, { 
          family: fontName, 
          weight: "regular", 
          style: "normal" 
        });
        loadedFonts.push(fontName);
        console.log(`✓ 字体已注册: ${fontPath} -> ${fontName}`);
      } catch (error) {
        console.warn(`字体注册失败: ${fontPath}`, error.message);
      }
    }
    finalFontFamily = fontName;
  }
  
  // 处理字体大小，支持多种单位
  const finalFontSize = Math.round(parseFontSize(fontSize, width, height));
  
  
  
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
        
        // 计算文本的起始位置（左上角）
        // 使用画布中心作为基准点，让 BaseElement 处理最终位置
        let currentX = (width - totalWidth) / 2;
        let currentY = (height - totalHeight) / 2;
        
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
            const textObj = new fabric.Text(textContent, {
              fontSize: finalFontSize,
              fontFamily: finalFontFamily,
              fill: textColor,
              left: segmentLeft + translateX,
              top: segmentTop + translateY,
              scaleX: scaleX,
              scaleY: scaleY,
              angle: angle,
              opacity: opacity,
              originX: 'center',
              originY: 'center',
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
              strokeWidth: stroke ? strokeWidth : 0
            });
            
            // 将文本对象添加到主Canvas
            mainCanvas.add(textObj);
          }
        }
        
        // 渲染Fabric Canvas并返回图像数据
        const rgba = await renderFabricCanvas(mainCanvas);
        return {
          data: rgba,
          width: width,
          height: height
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
        
        // 创建Fabric.js Text对象，放在画布中心，应用动画
        const textObj = new fabric.Text(text, {
          fontSize: finalFontSize,
          fontFamily: finalFontFamily,
          fill: textColor,
          left: actualWidth / 2 + translateX,   // 画布中心 + 动画偏移
          top: actualHeight / 2 + translateY,   // 画布中心 + 动画偏移
          scaleX: scaleX,
          scaleY: scaleY,
          angle: angle,
          opacity: opacity,
          originX: 'center', // 使用 center 作为原点
          originY: 'center',  // 使用 center 作为原点
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
          strokeWidth: stroke ? strokeWidth : 0
        });
        
        // 将文本对象添加到Canvas
        textCanvas.add(textObj);
        
        // 渲染Fabric Canvas并返回图像数据
        const rgba = await renderFabricCanvas(textCanvas);
        return {
          data: rgba,
          width: actualWidth,
          height: actualHeight
        };
      }
      
    },
    
    async close() {
      // 清理资源
    }
  };
}

