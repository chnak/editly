import { Textbox } from "fabric/node";
import { registerFont } from "canvas";
import { basename, resolve, dirname } from "path";
import { fileURLToPath } from "url";

// 缓存已加载的字体
const loadedFonts = [];

/**
 * 文本处理器 - 参考 editly 的实现方式，使用 Fabric.js Textbox
 */
export async function createTextElement(config) {
  const { 
    text, 
    font, 
    fontPath,
    fontFamily,
    fillColor, 
    strokeColor, 
    strokeWidth, 
    textAlign, 
    textBaseline, 
    lineHeight, 
    maxWidth, 
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
  
  return {
    text: text, // 保存 text 变量到返回对象中
    async readNextFrame(progress, canvas) {
      if (!this.text) {
        return null;
      }
      
      // 解析字体大小
      const fontSize = font ? parseInt(font) : 16;
      
      // 创建 Fabric Textbox 对象 - 参考 editly 的 subtitle.js
      const textBox = new Textbox(text, {
        fill: fillColor || "#000000",
        fontFamily: finalFontFamily,
        fontSize: fontSize,
        textAlign: textAlign || "left",
        width: maxWidth || width || 200,
        originX: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'right' : 'left',
        originY: textBaseline === 'center' ? 'center' : textBaseline === 'bottom' ? 'bottom' : 'top',
        left: 0, // 位置由 Timeline 设置
        top: 0,  // 位置由 Timeline 设置
        opacity: 1
      });

      // 如果有描边
      if (strokeColor && strokeWidth > 0) {
        textBox.set({
          stroke: strokeColor,
          strokeWidth: strokeWidth
        });
      }

      // 直接返回 Fabric 对象，让 Timeline 处理位置
      return textBox;
    },
    
    async close() {
      // 清理资源
    }
  };
}
