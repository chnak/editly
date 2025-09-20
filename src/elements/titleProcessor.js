import * as fabric from "fabric/node";
import { registerFont, createCanvas } from "canvas";
import { basename, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { getPositionProps, parsePositionValue } from "../utils/positionUtils.js";
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
        processedAnimations.push({
          property: preset.property,
          keyframes: [
            { time: 0, value: preset.from },
            { time: 1, value: preset.to }
          ],
          duration: preset.duration || 1,
          easing: preset.easing || 'easeOut',
          type: anim // 保存原始类型用于特殊处理
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
            type: anim
          });
        }
      }
    } else if (anim.type) {
      // 对象格式: {type: "fadeIn", duration: 2}
      const preset = animationManager.presets.get(anim.type);
      if (preset) {
        processedAnimations.push({
          property: preset.property,
          keyframes: [
            { time: 0, value: preset.from },
            { time: 1, value: preset.to }
          ],
          duration: anim.duration || preset.duration || 1,
          easing: anim.easing || preset.easing || 'easeOut',
          type: anim.type
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
            type: anim.type
          });
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
    width, 
    height 
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
    async readNextFrame(progress, canvas) {
      if (!this.text) {
        return null;
      }
      
      // 处理动画效果
      let zoomAnimation, translateAnimation, rotationAnimation, opacityAnimation;
      
      // 初始化默认值
      zoomAnimation = { scaleX: 1, scaleY: 1 };
      translateAnimation = { translateX: 0, translateY: 0 };
      rotationAnimation = { rotation: 0 };
      opacityAnimation = { opacity: 1 };
      
      // 处理 animations 配置
      if (animations && animations.length > 0) {
        // 直接使用 animations，因为它们已经是 Animation 对象
        const processedAnimations = animations;
        
        
        for (const anim of processedAnimations) {
          // 计算动画值
          let animValue = null;
          
          
          
          // 检查是否是 Animation 对象
          if (anim.getValueAtTime) {
            // 使用 Animation 对象的 getValueAtTime 方法
            animValue = anim.getValueAtTime(progress);
            
            
          } else if (anim.keyframes && anim.keyframes.length > 0) {
            // 使用关键帧计算动画值
            // progress 是 0-1 之间的值，表示当前元素的时间进度
            const animTime = progress; // 直接使用 progress，因为它是 0-1 之间的值
            
            // 简单的线性插值
            for (let i = 0; i < anim.keyframes.length - 1; i++) {
              const current = anim.keyframes[i];
              const next = anim.keyframes[i + 1];
              
              if (animTime >= current.time && animTime <= next.time) {
                const t = (animTime - current.time) / (next.time - current.time);
                animValue = current.value + (next.value - current.value) * t;
                break;
              }
            }
            
            // 如果时间超出范围，使用最后一个关键帧的值
            if (animValue === null && anim.keyframes.length > 0) {
              const lastKeyframe = anim.keyframes[anim.keyframes.length - 1];
              animValue = lastKeyframe.value;
            }
          }
          
          if (animValue !== null) {
            switch (anim.property) {
              case 'scaleX':
                zoomAnimation.scaleX = animValue;
                break;
              case 'scaleY':
                zoomAnimation.scaleY = animValue;
                break;
              case 'x':
                translateAnimation.translateX = animValue - (x || 0);
                break;
              case 'y':
                translateAnimation.translateY = animValue - (y || 0);
                break;
              case 'rotation':
              case 'rotationX':
              case 'rotationY':
              case 'rotationZ':
                rotationAnimation.rotation = animValue;
                break;
              case 'opacity':
                opacityAnimation.opacity = animValue;
                break;
            }
            
          }
        }
      } else if (zoomDirection) {
        // 回退到简单的缩放动画
        const scale = 1 + (zoomAmount * (zoomDirection === 'in' ? progress : 1 - progress));
        zoomAnimation = { scaleX: scale, scaleY: scale };
      }
      
      const { left, top, originX, originY } = getPositionProps({ position, width, height, x, y });
      
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
        
        let currentX = left - totalWidth / 2;
        let currentY = top - totalHeight / 2;
        
        // 创建主Fabric Canvas用于合成所有分割文本片段
        const mainCanvas = createFabricCanvas({ width, height });
        
        for (let i = 0; i < textSegments.length; i++) {
          const segment = textSegments[i];
          const segmentProgress = Math.max(0, Math.min(1, (progress - segment.startTime) / (segment.endTime - segment.startTime)));
          
          if (segmentProgress > 0) {
            let segmentLeft = currentX;
            let segmentTop = currentY;
            
            // 使用 SplitText 的精确位置
            if (segment.x !== undefined && segment.y !== undefined) {
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
            
            // 创建Fabric.js Text对象渲染分割文本片段
            const textObj = new fabric.Text(segment.char || segment.text.text || segment.text, {
              fontSize: finalFontSize,
              fontFamily: finalFontFamily,
              fill: textColor,
              left: segmentLeft + translateAnimation.translateX,
              top: segmentTop + translateAnimation.translateY,
              scaleX: zoomAnimation.scaleX,
              scaleY: zoomAnimation.scaleY,
              angle: rotationAnimation.rotation,
              opacity: opacityAnimation.opacity * segmentProgress,
              originX: 'center',
              originY: 'center'
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
        const textCanvas = createFabricCanvas({ width, height });
        
        // 创建Fabric.js Text对象
        const textObj = new fabric.Text(text, {
          fontSize: finalFontSize,
          fontFamily: finalFontFamily,
          fill: textColor,
          left: left + translateAnimation.translateX,
          top: top + translateAnimation.translateY,
          scaleX: zoomAnimation.scaleX,
          scaleY: zoomAnimation.scaleY,
          angle: rotationAnimation.rotation,
          opacity: opacityAnimation.opacity,
          originX: 'center',
          originY: 'center'
        });
        
        // 将文本对象添加到Canvas
        textCanvas.add(textObj);
        
        // 渲染Fabric Canvas并返回图像数据
        const rgba = await renderFabricCanvas(textCanvas);
        return {
          data: rgba,
          width: width,
          height: height
        };
      }
      
      // 渲染画布并返回帧数据
      canvas.renderAll();
      const canvasElement = canvas.getElement();
      const imageData = canvasElement.getContext('2d').getImageData(0, 0, width, height);
      
      
      return {
        data: Buffer.from(imageData.data),
        width: width,
        height: height
      };
    },
    
    async close() {
      // 清理资源
    }
  };
}

