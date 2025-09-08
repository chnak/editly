import { createFrameSource } from "./frameSource.js";
import parseConfig from "./parseConfig.js";
import { expandLayerAliases } from "./sources/index.js";
export default class Track {
  constructor(type = "scene",config={}) {
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
     this.elements=this.elements.map(a=>{
        a.layer.start=a.startTime||0
        a.layer.layerDuration=a.duration
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
    const clip = {
        duration: activeElement.duration,
        layers:this.elements.map(a=>a.layer).map(expandLayerAliases).flat(),
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
