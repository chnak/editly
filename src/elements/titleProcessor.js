import * as fabric from "fabric/node";
import { registerFont, createCanvas } from "canvas";
import { basename, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { getPositionProps } from "../utils/positionUtils.js";
import { animationManager } from "../animations/AnimationManager.js";
import { textAnimationProcessor } from "../animations/TextAnimationProcessor.js";
import { creatomateTextEffects } from "../animations/CreatomateTextEffects.js";

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
    split = null, // 分割参数：'word' 或 'line'
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
  
  // 文本分割辅助函数
  function splitText(text, splitType) {
    if (!splitType) return [text];
    
    if (splitType === 'word') {
      // 按词分割（支持中英文）
      const chineseRegex = /[\u4e00-\u9fff]/;
      if (chineseRegex.test(text)) {
        // 包含中文，按字符分割
        return text.split('').filter(char => char.trim());
      } else {
        // 纯英文，按单词分割
        return text.split(/\s+/).filter(word => word.trim());
      }
    } else if (splitType === 'line') {
      // 按行分割
      return text.split('\n').filter(item => item.trim());
    }
    return [text];
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
    const segments = splitText(text, split);
    textSegments = segments.map((segment, index) => {
      const segmentText = new fabric.Text(segment, {
        fill: textColor,
        fontFamily: finalFontFamily,
        fontSize: fontSize,
        textAlign: "center"
      });
      return {
        text: segmentText,
        index,
        startTime: index * splitDelay,
        endTime: index * splitDelay + splitDuration
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
                // 分割效果需要返回特殊的数据结构
                return {
                  type: 'split',
                  segments: effectResult.segments,
                  splitType: effectResult.splitType,
                  progress: effectResult.progress,
                  isComplete: effectResult.isComplete
                };
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
        if (split === 'word') {
          totalWidth = textSegments.reduce((sum, segment) => {
            return sum + segment.text.width + fontSize * 0.2;
          }, 0) - fontSize * 0.2;
        }
        
        let currentX = left - totalWidth / 2;
        let currentY = top;
        
        for (let i = 0; i < textSegments.length; i++) {
          const segment = textSegments[i];
          const segmentProgress = Math.max(0, Math.min(1, (progress - segment.startTime) / (segment.endTime - segment.startTime)));
          
          if (segmentProgress > 0) {
            let segmentLeft = currentX;
            let segmentTop = currentY;
            
            if (split === 'word') {
              segmentLeft = currentX;
              currentX += segment.text.width + fontSize * 0.2;
            } else if (split === 'line') {
              segmentTop = currentY + segment.index * (fontSize * 1.5);
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
