import { createFrameSource } from "./frameSource.js";
import parseConfig from "./parseConfig.js";
import { expandLayerAliases } from "./sources/index.js";
export default class Track {
  constructor(type = "track",config={}) {
    this.type = type;
    this.config=config;
    this.elements = []; // { startTime, duration, layer, frameSource }
    this.volume = 1.0;
  }

  addElement(element) {
    element.clipIndex=this.elements.length+1
    this.elements.push(element);
    this.elements.sort((a, b) => a.startTime - b.startTime);
  }

  async getFrameAtTime(time, width, height, channels,fps, canvas,trackId) {
    // 仅渲染该时间点对应的帧
    return await this._renderAtTimeInternal(time, width, height, channels, fps, trackId);
  }

  async _renderAtTimeInternal(time, width, height, channels, fps, trackId) {
    // 为扁平化结构设置时间属性
    this.elements=this.elements.map(a=>{
        a.start = a.startTime || 0
        a.layerDuration = a.duration
        return a
    })
    
    // 对于scene类型的元素，需要特殊处理时间计算
    let activeElement = this.elements.find(element => {
      if (element.type === "scene") {
        // scene元素需要计算其内部elements的最大时长
        const sceneElements = element.elements || [];
        const maxSceneDuration = Math.max(...sceneElements.map(el => (el.startTime || 0) + (el.duration || 0)), 0);
        const elementStartTime = element.startTime || 0;
        const elementDuration = element.duration || maxSceneDuration;
        return time >= elementStartTime && time < elementStartTime + elementDuration;
      } else {
        return time >= element.startTime && time < element.startTime + element.duration;
      }
    });

    if (!activeElement) return null;
    this.elements.sort((a,b)=>{return a.clipIndex-b.clipIndex})
    
    // 对于scene类型，需要特殊处理时间计算
    let elementTime, elementDuration, frameSourceTime;
    if (activeElement.type === "scene") {
      const sceneElements = activeElement.elements || [];
      elementDuration = activeElement.duration || Math.max(...sceneElements.map(el => (el.startTime || 0) + (el.duration || 0)), 0);
      elementTime = time - (activeElement.startTime || 0);
      const elementNumFrames = Math.round(elementDuration * fps);
      const elementFrameAt = Math.floor(elementTime * fps);
      const elementProgress = elementFrameAt / elementNumFrames;
      frameSourceTime = elementDuration * elementProgress;
    } else {
      elementTime = time - activeElement.startTime;
      elementDuration = activeElement.duration;
      const elementNumFrames = Math.round(elementDuration * fps);
      const elementFrameAt = Math.floor(elementTime * fps);
      const elementProgress = elementFrameAt / elementNumFrames;
      frameSourceTime = elementDuration * elementProgress;
    }
   
    //console.log(`Element frame: ${elementFrameAt}/${elementNumFrames}, Time: ${frameSourceTime.toFixed(3)}s`);
    const num=Number(String(trackId).padEnd(5,'0'))
    const clipIndex = num+this.elements.indexOf(activeElement);
    
    // 处理scene类型的元素
    if (activeElement.type === "scene") {
        return await this._renderSceneElement(activeElement, frameSourceTime, width, height, channels, fps, trackId);
    }
    
    // 组装与当前活动元素时间窗重叠的所有图层，重映射为相对活动元素起点的局部时间
    const overlappingLayers = this.elements
      .filter(e => {
        const eStart = e.startTime;
        const eEnd = e.startTime + e.duration;
        const aStart = activeElement.startTime;
        const aEnd = activeElement.startTime + activeElement.duration;
        return eEnd > aStart && eStart < aEnd; // 有交集
      })
      .map(e => {
        const aStart = activeElement.startTime;
        const relativeStart = Math.max(0, e.startTime - aStart);
        const overlapEnd = Math.min(e.startTime + e.duration, aStart + activeElement.duration);
        const relativeDuration = Math.max(0, overlapEnd - (aStart + relativeStart));
        // 直接使用扁平化的element属性，不再需要layer包装
        const layer = { ...e };
        // 移除不需要的属性，但保留type属性
        delete layer.startTime;
        delete layer.duration;
        delete layer.clipIndex;
        delete layer.frameSource;
        layer.start = relativeStart;
        layer.layerDuration = relativeDuration;
        return layer;
      });

    const clip = {
        duration: activeElement.duration,
        layers: overlappingLayers.map(expandLayerAliases).flat(),
        transition: activeElement.transition || null,
        clipIndex:`${clipIndex}`
    };
    const { clips } = await parseConfig({
        clips: [clip],
        arbitraryAudio: [],
        allowRemoteRequests:this.config.allowRemoteRequests,
        defaults:this.config.defaults,
    });
    if (!activeElement.frameSource) {
        activeElement.frameSource = await createFrameSource({
        clip:clips[0],
        clipIndex:`${clipIndex}`,
        width,
        height,
        verbose: false,
        channels,
        logTimes: false,
        framerateStr: fps.toString(),
        });
    }
    
    return await activeElement.frameSource.readNextFrame({ time: frameSourceTime });
  }

  // 处理scene类型元素的渲染
  async _renderSceneElement(sceneElement, frameSourceTime, width, height, channels, fps, trackId) {
    const sceneElements = sceneElement.elements || [];
    
    // 为scene内部的elements设置时间属性
    const processedElements = sceneElements.map(el => ({
        ...el,
        start: el.startTime || 0,
        layerDuration: el.duration
    }));
    
    // 找到当前时间点活跃的scene内部元素
    const activeSceneElement = processedElements.find(element => {
      const elementStartTime = element.startTime || 0;
      const elementDuration = element.duration || 0;
      return frameSourceTime >= elementStartTime && frameSourceTime < elementStartTime + elementDuration;
    });

    if (!activeSceneElement) return null;
    
    const sceneElementStartTime = activeSceneElement.startTime || 0;
    const sceneElementDuration = activeSceneElement.duration || 0;
    const sceneElementTime = frameSourceTime - sceneElementStartTime;
    const sceneElementNumFrames = Math.round(sceneElementDuration * fps);
    const sceneElementFrameAt = Math.floor(sceneElementTime * fps);
    const sceneElementProgress = sceneElementFrameAt / sceneElementNumFrames;
    const sceneFrameSourceTime = sceneElementDuration * sceneElementProgress;
    
    // 组装scene内部重叠的所有图层
    const overlappingLayers = processedElements
      .filter(e => {
        const eStart = e.startTime || 0;
        const eEnd = eStart + (e.duration || 0);
        const aStart = sceneElementStartTime;
        const aEnd = sceneElementStartTime + sceneElementDuration;
        return eEnd > aStart && eStart < aEnd; // 有交集
      })
      .map(e => {
        const eStart = e.startTime || 0;
        const eDuration = e.duration || 0;
        const aStart = sceneElementStartTime;
        const relativeStart = Math.max(0, eStart - aStart);
        const overlapEnd = Math.min(eStart + eDuration, aStart + sceneElementDuration);
        const relativeDuration = Math.max(0, overlapEnd - (aStart + relativeStart));
        // 直接使用扁平化的element属性
        const layer = { ...e };
        // 移除不需要的属性，但保留type属性
        delete layer.startTime;
        delete layer.duration;
        layer.start = relativeStart;
        layer.layerDuration = relativeDuration;
        return layer;
      });

    const num = Number(String(trackId).padEnd(5,'0'));
    const clipIndex = num + this.elements.indexOf(sceneElement) + processedElements.indexOf(activeSceneElement);
    
    const clip = {
        duration: sceneElementDuration,
        layers: overlappingLayers.map(expandLayerAliases).flat(),
        transition: activeSceneElement.transition || null,
        clipIndex: `${clipIndex}`
    };
    
    const { clips } = await parseConfig({
        clips: [clip],
        arbitraryAudio: [],
        allowRemoteRequests: this.config.allowRemoteRequests,
        defaults: this.config.defaults,
    });
    
    if (!activeSceneElement.frameSource) {
        activeSceneElement.frameSource = await createFrameSource({
            clip: clips[0],
            clipIndex: `${clipIndex}`,
            width,
            height,
            verbose: false,
            channels,
            logTimes: false,
            framerateStr: fps.toString(),
        });
    }
    
    return await activeSceneElement.frameSource.readNextFrame({ time: sceneFrameSourceTime });
  }

  async close() {
    for (const element of this.elements) {
      if (element.frameSource) {
        await element.frameSource.close();
      }
      // 如果是scene类型，还需要清理scene内部的elements
      if (element.type === "scene" && element.elements) {
        for (const sceneElement of element.elements) {
          if (sceneElement.frameSource) {
            await sceneElement.frameSource.close();
          }
        }
      }
    }
  }
}
