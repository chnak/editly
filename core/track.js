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
    const activeElement = this.elements.find(element => 
        time >= element.startTime && time < element.startTime + element.duration
    );

    if (!activeElement) return null;
    this.elements.sort((a,b)=>{return a.clipIndex-b.clipIndex})
    const elementTime = time - activeElement.startTime;
    
    // 完全模仿原始 Editly 的时间计算逻辑
    const elementNumFrames = Math.round(activeElement.duration * fps);
    const elementFrameAt = Math.floor(elementTime * fps);
    const elementProgress = elementFrameAt / elementNumFrames;
    const frameSourceTime = activeElement.duration * elementProgress;
   
    //console.log(`Element frame: ${elementFrameAt}/${elementNumFrames}, Time: ${frameSourceTime.toFixed(3)}s`);
    const num=Number(String(trackId).padEnd(5,'0'))
    const clipIndex = num+this.elements.indexOf(activeElement);
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

  async close() {
    for (const element of this.elements) {
      if (element.frameSource) {
        await element.frameSource.close();
      }
    }
  }
}
