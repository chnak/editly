import * as fabric from "fabric/node";
import { BaseElement } from "./base.js";
import { parseSubtitles } from "../utils/fabricSplitText.js";
import { getPositionProps } from "../utils/positionUtils.js";
import { AudioElement } from "./audio.js";

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
  // console.log(`[Subtitle] 创建字幕元素，配置:`, {
  //   text: config.text?.substring(0, 20) + '...',
  //   audio: config.audio,
  //   volume: config.volume
  // });
  
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
    height,
    // 音频支持
    audio = null, // 音频文件路径
    audioSegments = [], // 每段字幕对应的音频配置
    volume = 1.0, // 音量
    fadeIn = 0, // 淡入时间
    fadeOut = 0 // 淡出时间
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
      endTime: 0,
      // 音频配置
      audio: audioSegments[index] || null, // 每段字幕对应的音频
      volume: volume,
      fadeIn: fadeIn,
      fadeOut: fadeOut
    };
    data.startTime = totalDuration;
    totalDuration += data.duration;
    data.endTime = totalDuration;
    return data;
  });

  // 创建音频元素（如果有全局音频）
  let globalAudioElement = null;
  if (audio) {
    // console.log(`[Subtitle] 创建全局音频元素: ${audio}`);
    globalAudioElement = new AudioElement({
      type: 'audio',
      source: audio,
      volume: volume,
      fadeIn: fadeIn,
      fadeOut: fadeOut,
      startTime: 0,
      duration: duration
    });
    await globalAudioElement.initialize();
    // console.log(`[Subtitle] 全局音频元素初始化完成`);
  }

  return {
    // 获取音频元素列表（用于渲染器）
    getAudioElements() {
      const audioElements = [];
      
      // 添加全局音频元素
      if (globalAudioElement) {
        // console.log(`[SubtitleProcessor] 添加全局音频元素: ${globalAudioElement.source}`);
        audioElements.push(globalAudioElement);
      } else {
        // console.log(`[SubtitleProcessor] 没有全局音频元素`);
      }
      
      // 添加分段音频元素
      for (const segment of textSegments) {
        if (segment.audio) {
          // console.log(`[SubtitleProcessor] 添加分段音频元素: ${segment.audio}`);
          const segmentAudioElement = new AudioElement({
            type: 'audio',
            source: segment.audio,
            volume: segment.volume,
            fadeIn: segment.fadeIn,
            fadeOut: segment.fadeOut,
            startTime: segment.startTime,
            duration: segment.duration
          });
          audioElements.push(segmentAudioElement);
        }
      }
      
      // console.log(`[SubtitleProcessor] 总共返回 ${audioElements.length} 个音频元素`);
      return audioElements;
    },

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

        // 处理音频
        if (textSegment.audio) {
          // 为当前字幕段创建音频元素
          const segmentAudioElement = new AudioElement({
            source: textSegment.audio,
            volume: textSegment.volume,
            fadeIn: textSegment.fadeIn,
            fadeOut: textSegment.fadeOut,
            startTime: textSegment.startTime,
            duration: textSegment.duration
          });
          await segmentAudioElement.initialize();
          
          // 添加音频流到对象数组
          const audioStream = segmentAudioElement.getAudioStream();
          if (audioStream) {
            objects.push({
              type: 'audio',
              audioStream: audioStream,
              startTime: textSegment.startTime,
              endTime: textSegment.endTime
            });
          }
        }
        
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

      // 处理全局音频（如果有）
      if (globalAudioElement && absoluteTime >= 0 && absoluteTime <= duration) {
        // console.log(`[Subtitle] 处理全局音频，当前时间: ${absoluteTime}`);
        const audioStream = globalAudioElement.getAudioStream();
        if (audioStream) {
          // console.log(`[Subtitle] 添加音频流到对象数组`);
          objects.push({
            type: 'audio',
            audioStream: audioStream,
            startTime: 0,
            endTime: duration
          });
        } else {
          // console.log(`[Subtitle] 音频流为空`);
        }
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