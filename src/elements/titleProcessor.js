import { Textbox, FabricText } from "fabric/node";
import { registerFont, createCanvas } from "canvas";
import { basename, resolve, dirname } from "path";
import { fileURLToPath } from "url";

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
    zoomDirection = "in", 
    zoomAmount = 0.2, 
    animate = [],
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
  const textBox = new Textbox(text, {
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
      const segmentText = new FabricText(segment, {
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
  
  // 简化的动画控制器（暂时不实现复杂的动画系统）
  function getZoomParams({ progress, zoomDirection, zoomAmount }) {
    if (zoomDirection === "in") {
      return 1 + (progress * zoomAmount);
    } else {
      return 1 + ((1 - progress) * zoomAmount);
    }
  }
  
  function getTranslationParams({ progress, zoomDirection, zoomAmount }) {
    if (zoomDirection === "in") {
      return progress * zoomAmount * 50;
    } else {
      return (1 - progress) * zoomAmount * 50;
    }
  }
  
  function getPositionProps({ position, width, height }) {
    switch (position) {
      case "top":
        return { left: width / 2, top: height * 0.2, originX: "center", originY: "center" };
      case "bottom":
        return { left: width / 2, top: height * 0.8, originX: "center", originY: "center" };
      case "left":
        return { left: width * 0.2, top: height / 2, originX: "center", originY: "center" };
      case "right":
        return { left: width * 0.8, top: height / 2, originX: "center", originY: "center" };
      default: // center
        return { left: width / 2, top: height / 2, originX: "center", originY: "center" };
    }
  }
  
  return {
    text: text, // 保存 text 变量到返回对象中
    async readNextFrame(progress, canvas) {
      if (!this.text) {
        return null;
      }
      
      const scaleFactor = getZoomParams({ progress, zoomDirection, zoomAmount });
      const translationParams = getTranslationParams({ progress, zoomDirection, zoomAmount });
      const { left, top, originX, originY } = getPositionProps({ position, width, height });
      
      if (split && textSegments.length > 0) {
        // 处理分割动画
        let totalWidth = 0;
        if (split === 'word') {
          totalWidth = textSegments.reduce((sum, segment) => {
            return sum + segment.text.width + fontSize * 0.2;
          }, 0) - fontSize * 0.2;
        }
        
        let currentX = left - totalWidth / 2;
        let currentY = top;
        
        for (const segment of textSegments) {
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
            
            const animatedProps = {
              originX: "center",
              originY: "center",
              left: segmentLeft + translationParams,
              top: segmentTop,
              scaleX: scaleFactor,
              scaleY: scaleFactor,
              opacity: segmentProgress
            };
            
            segment.text.set(animatedProps);
            canvas.add(segment.text);
          }
        }
      } else {
        // 处理普通文本动画
        const textProps = {
          originX,
          originY,
          left: left + translationParams,
          top,
          scaleX: scaleFactor,
          scaleY: scaleFactor
        };
        
        textBox.set(textProps);
        canvas.add(textBox);
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
