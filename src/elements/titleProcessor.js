import * as fabric from "fabric/node";
import { registerFont, createCanvas } from "canvas";
import { basename, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { getPositionProps } from "../utils/positionUtils.js";
import { animationManager } from "../animations/AnimationManager.js";
import { textAnimationProcessor } from "../animations/TextAnimationProcessor.js";
import { creatomateTextEffects } from "../animations/CreatomateTextEffects.js";
import { createSplitText } from "../utils/fabricSplitText.js";

// 缓存已加载的字体
const loadedFonts = [];

/**
 * 标题处理器 - 参考 editly 的 title.js 实现
 */
export async function createTitleElement(config) {
  const { 
    text, 
    font, 
    fontPath,
    fontFamily,
    textColor = "#ffffff", 
    position = "center", 
    x, // 自定义 X 坐标
    y, // 自定义 Y 坐标
    zoomDirection = "in", 
    zoomAmount = 0.2, 
    animations = [], // 添加 animations 参数
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
          weight: "bold", 
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
  
  // 计算字体大小
  const fontSize = Math.round(Math.min(width, height) * 0.1);
  
  // 文本分割辅助函数 - 参考 slide-in-text.js 实现
  function splitText(text, splitType) {
    if (!splitType) return [text];
    
    switch (splitType) {
      case 'letter':
        // 按字符分割
        return text.split('').filter(char => char.trim());
      case 'word':
        // 按单词分割（支持中英文）
        // 使用正则表达式分割，保留空格
        const words = text.split(/(\s+)/);
        return words.filter(word => word.length > 0);
      case 'line':
        // 按行分割
        return text.split('\n').filter(item => item.trim());
      default:
        return [text];
    }
  }

  // 字符宽度计算辅助函数 - 参考 slide-in-text.js 实现
  function measureTextWidth(text, fontSize, fontFamily) {
    // 创建临时canvas测量文本宽度
    const tempCanvas = createCanvas(1, 1);
    const ctx = tempCanvas.getContext('2d');
    ctx.font = `${fontSize}px ${fontFamily}`;
    return ctx.measureText(text).width;
  }

  // 将文本分割为多行 - 参考 slide-in-text.js 实现
  function splitTextIntoLines(text, fontSize, maxWidth, fontFamily) {
    const words = text.split('\n');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = measureTextWidth(testLine, fontSize, fontFamily);
      
      if (width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }
  
  // 创建文本对象
    const textBox = new fabric.Textbox(text, {
    fill: textColor,
    fontFamily: finalFontFamily,
    fontSize: fontSize,
    textAlign: "center",
    width: width * 0.8
  });
  
  // 如果启用了分割动画，创建分割后的文本片段
  let textSegments = [];
  if (split) {
    // 使用 Fabric SplitText 进行精确的文本分割
    const splitTextInstance = createSplitText(text, {
      fontSize: fontSize,
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
  
  // 设置文本动画处理器
  textAnimationProcessor.setAnimationManager(animationManager);
  
  
  return {
    text: text, // 保存 text 变量到返回对象中
    async readNextFrame(progress, canvas) {
      if (!this.text) {
        return null;
      }
      
      // 优先使用 animations 参数，如果没有则使用 zoomDirection 和 zoomAmount
      let zoomAnimation, translateAnimation;
      
      if (animations && animations.length > 0) {
        // 使用 animations 参数
        zoomAnimation = { scaleX: 1, scaleY: 1 };
        translateAnimation = { translateX: 0, translateY: 0 };
        
        // 检查是否有 Creatomate 风格的文本特效
        const textEffect = animations.find(anim => anim.type && creatomateTextEffects.getAvailableEffects().includes(anim.type));
        
        if (textEffect) {
          // 处理 Creatomate 风格的文本特效
          const effectResult = creatomateTextEffects.processTextEffect(textEffect.type, {
            text,
            progress,
            split: textEffect.split || 'default', // 添加 split 参数支持
            ...textEffect
          });
          
          // 根据特效类型应用不同的变换
          switch (textEffect.type) {
            case 'typewriter':
              // 打字机效果 - 只显示部分文本
              if (effectResult.visibleText) {
                text = effectResult.visibleText;
              }
              break;
            case 'reveal':
              // 逐字显示效果
              if (effectResult.visibleChars) {
                text = effectResult.visibleChars.map(char => char.char).join('');
              }
              break;
            case 'wipe':
              // 擦除效果
              if (effectResult.clipWidth !== undefined) {
                // 这里需要特殊的裁剪处理
              }
              break;
            case 'split':
            case 'splitWords':
            case 'splitLines':
            case 'splitChars':
            case 'waveSplit':
            case 'rotateSplit':
            case 'scaleSplit':
            case 'fadeSplit':
            case 'slideSplit':
              // 分割效果 - 需要特殊处理
              if (effectResult.segments) {
                // 分割效果需要特殊渲染，直接处理
                return renderSplitTextEffect(canvas, effectResult, {
                  x: x || 0,
                  y: y || 0,
                  fontSize,
                  color: textColor,
                  fontFamily: finalFontFamily,
                  width,
                  height
                });
              }
              break;
            case 'glitch':
              // 故障效果
              if (effectResult.x !== undefined) {
                translateAnimation.translateX += effectResult.x;
                translateAnimation.translateY += effectResult.y || 0;
                zoomAnimation.rotation = effectResult.rotation || 0;
              }
              break;
            case 'shake':
              // 震动效果
              if (effectResult.x !== undefined) {
                translateAnimation.translateX += effectResult.x;
                translateAnimation.translateY += effectResult.y || 0;
                zoomAnimation.rotation = effectResult.rotation || 0;
              }
              break;
            case 'pulse':
              // 脉冲效果
              if (effectResult.scaleX !== undefined) {
                zoomAnimation.scaleX *= effectResult.scaleX;
                zoomAnimation.scaleY *= effectResult.scaleY || effectResult.scaleX;
              }
              break;
            case 'wave':
              // 波浪效果
              if (effectResult.y !== undefined) {
                translateAnimation.translateY += effectResult.y;
                zoomAnimation.rotation = effectResult.rotation || 0;
                zoomAnimation.scaleX *= effectResult.scaleX || 1;
              }
              break;
            case 'spring':
              // 弹簧效果
              if (effectResult.scaleX !== undefined) {
                zoomAnimation.scaleX *= effectResult.scaleX;
                zoomAnimation.scaleY *= effectResult.scaleY || effectResult.scaleX;
                zoomAnimation.rotation = effectResult.rotation || 0;
              }
              break;
            case 'flip3D':
              // 3D翻转效果
              if (effectResult.rotationX !== undefined) {
                zoomAnimation.rotationX = effectResult.rotationX;
                zoomAnimation.rotationY = effectResult.rotationY || 0;
                zoomAnimation.scaleX *= effectResult.scaleX || 1;
                zoomAnimation.scaleY *= effectResult.scaleY || 1;
              }
              break;
            case 'explode':
              // 爆炸效果
              if (effectResult.scaleX !== undefined) {
                zoomAnimation.scaleX *= effectResult.scaleX;
                zoomAnimation.scaleY *= effectResult.scaleY || effectResult.scaleX;
                zoomAnimation.rotation = effectResult.rotation || 0;
              }
              break;
            case 'dissolve':
              // 溶解效果
              if (effectResult.scaleX !== undefined) {
                zoomAnimation.scaleX *= effectResult.scaleX;
                zoomAnimation.scaleY *= effectResult.scaleY || effectResult.scaleX;
                zoomAnimation.rotation = effectResult.rotation || 0;
              }
              break;
            case 'spiral':
              // 螺旋效果
              if (effectResult.rotation !== undefined) {
                zoomAnimation.rotation = effectResult.rotation;
                zoomAnimation.scaleX *= effectResult.scaleX || 1;
                zoomAnimation.scaleY *= effectResult.scaleY || 1;
                translateAnimation.translateX += effectResult.x || 0;
                translateAnimation.translateY += effectResult.y || 0;
              }
              break;
            case 'wobble':
              // 摇摆效果
              if (effectResult.rotation !== undefined) {
                zoomAnimation.rotation = effectResult.rotation;
                zoomAnimation.scaleX *= effectResult.scaleX || 1;
                zoomAnimation.scaleY *= effectResult.scaleY || 1;
              }
              break;
          }
        } else {
          // 处理普通的 animations 参数
          for (const anim of animations) {
            const animValue = anim.getValueAtTime ? anim.getValueAtTime(progress * 2) : null; // 假设持续时间为2秒
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
              }
            }
          }
        }
      } else {
        // 使用传统的 zoomDirection 和 zoomAmount
        zoomAnimation = textAnimationProcessor.createZoomAnimation({ 
          progress, 
          zoomDirection, 
          zoomAmount 
        });
        translateAnimation = textAnimationProcessor.createTranslateAnimation({ 
          progress, 
          zoomDirection, 
          zoomAmount 
        });
      }
      
      const { left, top, originX, originY } = getPositionProps({ position, width, height, x, y });
      
      if (split && textSegments.length > 0) {
        // 使用动画库处理分割动画
        const splitAnimation = textAnimationProcessor.createSplitAnimation({
          text,
          splitType: split,
          splitDelay,
          splitDuration,
          progress,
          fontSize,
          textColor,
          fontFamily
        });
        
        let totalWidth = 0;
        let totalHeight = 0;
        
        // 使用精确的宽度计算
        const charSpacing = fontSize * 0.1; // 参考 slide-in-text.js 的字符间距设置
        
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
            totalHeight = textSegments.length * fontSize * 1.5;
          }
        }
        
        let currentX = left - totalWidth / 2;
        let currentY = top - totalHeight / 2;
        
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
                segmentTop = currentY + segment.index * (fontSize * 1.5);
              }
            }
            
            // 使用动画库计算动画属性
            const animatedProps = {
              originX: "center",
              originY: "center",
              left: segmentLeft + translateAnimation.translateX,
              top: segmentTop + translateAnimation.translateY,
              scaleX: zoomAnimation.scaleX,
              scaleY: zoomAnimation.scaleY,
              opacity: segmentProgress
            };
            
            // 创建新的文本段对象避免画布冲突
            const newSegmentText = new fabric.Text(segment.text.text, {
              fontFamily: finalFontFamily,
              fontSize: fontSize,
              fill: textColor,
              originX: "center",
              originY: "center"
            });
            
            newSegmentText.set(animatedProps);
            canvas.add(newSegmentText);
          }
        }
      } else {
        // 处理普通文本动画 - 使用动画库
        const newTextBox = new fabric.Text(text, {
          fontFamily: finalFontFamily,
          fontSize: fontSize,
          fill: textColor,
          originX: "center",
          originY: "center"
        });
        
        // 使用动画库计算文本属性
        const textProps = {
          originX,
          originY,
          left: left + translateAnimation.translateX,
          top: top + translateAnimation.translateY,
          scaleX: zoomAnimation.scaleX,
          scaleY: zoomAnimation.scaleY
        };
        
        newTextBox.set(textProps);
        canvas.add(newTextBox);
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

/**
 * 渲染分割文本效果
 */
function renderSplitTextEffect(canvas, splitData, options) {
  const { segments, splitType } = splitData;
  const { x, y, fontSize, color, fontFamily, width, height } = options;
  
  if (!segments || segments.length === 0) {
    return null;
  }
  
  let currentX = x;
  let currentY = y;
  const lineHeight = fontSize * 1.2;
  const charSpacing = fontSize * 0.1; // 参考 slide-in-text.js 的字符间距设置
  
  segments.forEach((segment, index) => {
    if (segment.opacity > 0) {
      const segmentText = new fabric.FabricText(segment.text, {
        fontFamily: fontFamily,
        fontSize: fontSize,
        fill: color,
        originX: "center",
        originY: "center",
        left: currentX + (segment.x || 0),
        top: currentY + (segment.y || 0),
        scaleX: segment.scaleX || 1,
        scaleY: segment.scaleY || 1,
        angle: segment.rotation || 0,
        opacity: segment.opacity
      });
      
      canvas.add(segmentText);
      
      // 使用 Fabric.js 计算的准确宽度
      const segmentWidth = segmentText.width;
      
      // 计算下一个元素的位置 - 使用 Fabric.js 计算的宽度
      if (splitType === 'word' || splitType === 'letter' || splitType === 'char' || splitType === 'space') {
        // 如果是空格，不添加字符间距
        const textContent = typeof segment.text === 'string' ? segment.text : segment.text.text;
        const isSpace = textContent.trim() === '';
        currentX += segmentWidth + (isSpace ? 0 : charSpacing);
      } else if (splitType === 'line') {
        currentY += lineHeight;
        currentX = x; // 重置X位置
      }
    }
  });
  
  // 渲染画布并返回帧数据
  canvas.renderAll();
  const canvasElement = canvas.getElement();
  const imageData = canvasElement.getContext('2d').getImageData(0, 0, width, height);
  
  return {
    data: Buffer.from(imageData.data),
    width: width,
    height: height
  };
}
