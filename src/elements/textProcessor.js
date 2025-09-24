import { Textbox } from "fabric/node";
import { BaseElement } from "./base.js";

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
  
  // 使用 BaseElement 的字体处理逻辑
  const fontResult = await BaseElement.processFont({ fontPath, fontFamily }, width, height);
  const finalFontFamily = fontResult.fontFamily;
  
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
