import { Rect, Textbox } from "fabric/node";
import { BaseElement } from "./base.js";

/**
 * 缓动函数 - easeOutExpo
 */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * 创建字幕元素
 */
export async function createTextElement(config) {
  const {
    text = "",
    font = null,
    fontPath = null,
    fontFamily = null,
    fontSize = 48,
    textColor = "#ffffff",
    backgroundColor = "rgba(0,0,0,0.3)",
    delay = 0,
    speed = 1,
    padding = null,
    textAlign = "left",
    position = "bottom",
    x = 0,
    y = 0,
    originX = "center",
    originY = "center",
    duration = 4,
    width,
    height
  } = config;

  // 使用 BaseElement 的字体处理逻辑
  const fontResult = await BaseElement.processFont({ fontPath, fontFamily, fontSize }, width, height);
  const finalFontFamily = fontResult.fontFamily;
  const finalFontSize = fontResult.fontSize;

  // 计算尺寸和位置
  const min = Math.min(width, height);
  const finalPadding = padding !== null ? padding : 0.05 * min;
  const finalFontSizeValue = finalFontSize;

  return {
    async readNextFrame(progress, canvas, time) {
      const easedProgress = easeOutExpo(Math.max(0, Math.min((progress - delay) * speed, 1)));

      // 创建文本框
      const textBox = new Textbox(text, {
        fill: textColor,
        fontFamily: finalFontFamily,
        fontSize: finalFontSizeValue,
        textAlign: textAlign,
        width: width - finalPadding * 2,
        originX: "center",
        originY: position === "bottom" ? "bottom" : position === "top" ? "top" : "center",
        left: width / 2 + (-1 + easedProgress) * finalPadding,
        top: position === "bottom" ? height - finalPadding : 
             position === "top" ? finalPadding : 
             height / 2,
        opacity: easedProgress,
      });

      // 获取文本框的实际边界
      const textBounds = textBox.getBoundingRect();
      
      // 创建背景矩形，位置基于文本框的实际位置
      const rect = new Rect({
        left: textBounds.left - finalPadding,
        top: textBounds.top - finalPadding,
        width: textBounds.width + finalPadding * 2,
        height: textBounds.height + finalPadding * 2,
        originX: "center",
        originY: position === "bottom" ? "bottom" : position === "top" ? "top" : "center",
        fill: backgroundColor,
        opacity: easedProgress,
      });

      // 返回对象数组
      return {
        objects: [
          {
            type: 'background',
            fabricObject: rect,
            originalLeft: rect.left,
            originalTop: rect.top,
            originalOriginX: rect.originX,
            originalOriginY: rect.originY
          },
          {
            type: 'text',
            fabricObject: textBox,
            originalLeft: textBox.left,
            originalTop: textBox.top,
            originalOriginX: textBox.originX,
            originalOriginY: textBox.originY
          }
        ],
        width: width,
        height: height,
        isSplitText: false,
        textLeft: 0,
        textTop: 0,
        textWidth: width,
        textHeight: height
      };
    },

    async close() {
      // 清理资源
    }
  };
}