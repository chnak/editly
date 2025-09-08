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

   

    // 按轨道优先级顺序渲染（数字小的在底层）
    const sortedTrackIds = Array.from(this.tracks.keys()).sort();
    
    for (const trackId of sortedTrackIds) {
      const track = this.tracks.get(trackId);
      if (!track) continue;
      const rgba = await track.getFrameAtTime(time, width, height, channels,fps,canvas,trackId);
      if (rgba&& rgba.length === width * height * channels) {
        const fabricImage = await rgbaToFabricImage({ width, height, rgba });
        canvas.add(fabricImage);
         
      }
    }

    return await renderFabricCanvas(canvas)
  }

  async close() {
    for (const track of this.tracks.values()) {
      await track.close();
    }
  }
}