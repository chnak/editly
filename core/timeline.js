import { createFabricCanvas,renderFabricCanvas, rgbaToFabricImage } from "./sources/fabric.js";
export default class MultiTrackTimeline {
  constructor() {
    this.tracks = new Map(); // trackId -> Track
    this.duration = 0;
    this.globalLayers = []; // 全局层（在所有轨道之上）
  }

  addTrack(trackId, track) {
    this.tracks.set(trackId, track);
  }

  getTrack(trackId) {
    return this.tracks.get(trackId);
  }

  addGlobalLayer(layer) {
    this.globalLayers.push(layer);
  }

  async getCompositeFrameAtTime(time, width, height, channels, verbose = false,fps) {
    const canvas = createFabricCanvas({ width, height });

    const imageMap = new Map();

    // 按轨道优先级顺序渲染（数字小的在底层）
    const sortedTrackIds = Array.from(this.tracks.keys()).sort();
    await asyncPool(10, sortedTrackIds, async (trackId) => {
        const track = this.tracks.get(trackId);
        if(!track) return true;
        const rgba = await track.getFrameAtTime(time, width, height, channels,fps,canvas,trackId);
        if (rgba&& rgba.length === width * height * channels) {
          const fabricImage = await rgbaToFabricImage({ width, height, rgba });
          imageMap.set(trackId, fabricImage);
          //canvas.insertAt(fabricImage, trackId);
          //canvas.insertAt(fabricImage, trackId);
        }
        return true
    });
    sortedTrackIds.forEach(trackId => {
        const fabricImage = imageMap.get(trackId);
        if (fabricImage) {
            canvas.add(fabricImage);
        }
    });
    
    return await renderFabricCanvas(canvas)
  }

  async close() {
    for (const track of this.tracks.values()) {
      await track.close();
    }
  }
}


async function asyncPool(poolLimit, array, iteratorFn) {
    const ret = [];
    const executing = [];
    
    for (const item of array) {
        const p = Promise.resolve().then(() => iteratorFn(item, array));
        ret.push(p);
        
        if (poolLimit <= array.length) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            
            if (executing.length >= poolLimit) {
                await Promise.race(executing);
            }
        }
    }
    
    return Promise.all(ret);
}