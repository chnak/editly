import * as fabric from "fabric/node";
import { BaseElement } from "./base.js";
import { parseSubtitles } from "../utils/fabricSplitText.js";
import { getPositionProps } from "../utils/positionUtils.js";

function createCenteredTextWithBackground(textContent, options = {}) {
  const {
    fontSize = 24,
    fontFamily = 'Arial',
    fill = '#000',
    backgroundColor = '#ffff00',
    padding = 10,
    left = 0,
    top = 0,
    originX = 'center',  // 默认为中心
    originY = 'center'   // 默认为中心
  } = options;

  // 创建文本对象
  const text = new fabric.Text(textContent, {
    fontSize,
    fontFamily,
    fill,
    originX: 'center',
    originY: 'center'
  });

  // 创建背景矩形
  const background = new fabric.Rect({
    width: text.width + padding * 2,
    height: text.height + padding * 2,
    fill: backgroundColor,
    originX: 'center',
    originY: 'center',
    rx: 5,  // x轴圆角半径
    ry: 5   // y轴圆角半径
  });

  // 创建组，使用指定的原点
  const group = new fabric.Group([background, text], {
    left,
    top,
    originX,  // 使用传入的 originX
    originY,  // 使用传入的 originY
    // 不需要设置 objectsOffset，让 Group 自己处理位置
  });

  return group;
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
    padding = 10,
    textAlign = "left",
    position = "bottom",
    x = 0,
    y = 0,
    originX = "center",
    originY = "center",
    duration,
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
  const text_list=parseSubtitles(text,duration);
  let totalDuration = 0;
  const textSegments = text_list.map((item, index) => { 
    
    let data = {
      text: item.text,
      index,
      startTime: 0,
      duration: item.duration,
      endTime: 0
    };
    data.startTime = totalDuration;
    totalDuration += data.duration;
    data.endTime = totalDuration;
    return data;
  });

  return {
    async readNextFrame(progress, canvas, time) {
      // 计算当前时间 - 修复时间计算问题
      const currentTime = time !== null && time !== undefined ? time : (progress * duration);
      const absoluteTime = isNaN(currentTime) ? (progress * duration) : currentTime;

      // 创建文本框
      const objects = [];
      const textSegment = textSegments.find(item=>absoluteTime>=item.startTime&&absoluteTime<=item.endTime);

      if(textSegment){
        const textBox = createCenteredTextWithBackground(textSegment.text, {
          fontSize: finalFontSizeValue,
          fontFamily: finalFontFamily,
          fill: textColor,
          backgroundColor: backgroundColor,
          padding: finalPadding,
          left: 0, // 临时位置，稍后会重新计算
          top: 0,  // 临时位置，稍后会重新计算
          originX: originX,
          originY: originY
        });
        
        // 使用 getPositionProps 计算正确的位置
        const positionProps = getPositionProps({
          position: position || "center",
          x: x || "50%",
          y: y || "50%",
          width: width || 1920,
          height: height || 1080,
          originX: originX || "center",
          originY: originY || "center",
          elementWidth: textBox.width,
          elementHeight: textBox.height
        });
        
        // 更新文本框位置（Group 对象直接设置位置即可）
        textBox.set({
          left: positionProps.left,
          top: positionProps.top,
          originX: positionProps.originX,
          originY: positionProps.originY
        });
        
        // 添加到对象数组
        objects.push({
          type: 'subtitle',
          fabricObject: textBox,
          originalLeft: textBox.left,
          originalTop: textBox.top,
          originalOriginX: textBox.originX,
          originalOriginY: textBox.originY,
          opacity: 1
        });
      } 
      // 返回对象数组
      return {
        objects: objects,
        width: width,
        height: height,
        isObjectArray: true, // 添加这个标志，让渲染器知道这是对象数组
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