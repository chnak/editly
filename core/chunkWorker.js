import { parentPort, workerData } from 'worker_threads';
import { createFabricCanvas, renderFabricCanvas, rgbaToFabricImage } from './sources/fabric.js';
import { createFrameSource } from './frameSource.js';
import parseConfig from './parseConfig.js';
import { expandLayerAliases } from './sources/index.js';
import { ffmpeg } from './ffmpeg.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 重建Timeline类（简化版，用于Worker中）
class WorkerTimeline {
  constructor(serializedData) {
    this.tracks = new Map(serializedData.tracks);
    this.duration = serializedData.duration;
    this.globalLayers = serializedData.globalLayers;
  }

  async getCompositeFrameAtTime(time, width, height, channels, verbose = false, fps) {
    const canvas = createFabricCanvas({ width, height });
    const imageMap = new Map();

    // 按轨道优先级顺序渲染
    const sortedTrackIds = Array.from(this.tracks.keys()).sort();
    await asyncPool(10, sortedTrackIds, async (trackId) => {
      const track = this.tracks.get(trackId);
      if (!track) return true;
      const rgba = await track.getFrameAtTime(time, width, height, channels, fps, canvas, trackId);
      if (rgba && rgba.length === width * height * channels) {
        const fabricImage = await rgbaToFabricImage({ width, height, rgba });
        imageMap.set(trackId, fabricImage);
      }
      return true;
    });

    sortedTrackIds.forEach(trackId => {
      const fabricImage = imageMap.get(trackId);
      if (fabricImage) {
        canvas.add(fabricImage);
      }
    });
    
    return await renderFabricCanvas(canvas);
  }
}

// 重建Track类（简化版，用于Worker中）
class WorkerTrack {
  constructor(type = "track", config = {}) {
    this.type = type;
    this.config = config;
    this.elements = [];
    this.volume = 1.0;
  }

  addElement(element) {
    element.clipIndex = this.elements.length + 1;
    this.elements.push(element);
    this.elements.sort((a, b) => a.startTime - b.startTime);
  }

  async getFrameAtTime(time, width, height, channels, fps, canvas, trackId) {
    return await this._renderAtTimeInternal(time, width, height, channels, fps, trackId);
  }

  async _renderAtTimeInternal(time, width, height, channels, fps, trackId) {
    // 为扁平化结构设置时间属性
    this.elements = this.elements.map(a => {
      a.start = a.startTime || 0;
      a.layerDuration = a.duration;
      return a;
    });
    
    // 对于scene类型的元素，需要特殊处理时间计算
    let activeElement = this.elements.find(element => {
      if (element.type === "scene") {
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
    this.elements.sort((a, b) => { return a.clipIndex - b.clipIndex });
    
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
   
    const num = Number(String(trackId).padEnd(5, '0'));
    const clipIndex = num + this.elements.indexOf(activeElement);
    
    // 处理scene类型的元素
    if (activeElement.type === "scene") {
      return await this._renderSceneElement(activeElement, frameSourceTime, width, height, channels, fps, trackId);
    }
    
    // 组装与当前活动元素时间窗重叠的所有图层
    const overlappingLayers = this.elements
      .filter(e => {
        const eStart = e.startTime;
        const eEnd = e.startTime + e.duration;
        const aStart = activeElement.startTime;
        const aEnd = activeElement.startTime + activeElement.duration;
        return eEnd > aStart && eStart < aEnd;
      })
      .map(e => {
        const aStart = activeElement.startTime;
        const relativeStart = Math.max(0, e.startTime - aStart);
        const overlapEnd = Math.min(e.startTime + e.duration, aStart + activeElement.duration);
        const relativeDuration = Math.max(0, overlapEnd - (aStart + relativeStart));
        const layer = { ...e };
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
      clipIndex: `${clipIndex}`
    };

    const { clips } = await parseConfig({
      clips: [clip],
      arbitraryAudio: [],
      allowRemoteRequests: this.config.allowRemoteRequests,
      defaults: this.config.defaults,
    });

    if (!activeElement.frameSource) {
      activeElement.frameSource = await createFrameSource({
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
    
    return await activeElement.frameSource.readNextFrame({ time: frameSourceTime });
  }

  async _renderSceneElement(sceneElement, frameSourceTime, width, height, channels, fps, trackId) {
    const sceneElements = sceneElement.elements || [];
    
    const processedElements = sceneElements.map(el => ({
      ...el,
      start: el.startTime || 0,
      layerDuration: el.duration
    }));
    
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
    
    const overlappingLayers = processedElements
      .filter(e => {
        const eStart = e.startTime || 0;
        const eEnd = eStart + (e.duration || 0);
        const aStart = sceneElementStartTime;
        const aEnd = sceneElementStartTime + sceneElementDuration;
        return eEnd > aStart && eStart < aEnd;
      })
      .map(e => {
        const eStart = e.startTime || 0;
        const eDuration = e.duration || 0;
        const aStart = sceneElementStartTime;
        const relativeStart = Math.max(0, eStart - aStart);
        const overlapEnd = Math.min(eStart + eDuration, aStart + sceneElementDuration);
        const relativeDuration = Math.max(0, overlapEnd - (aStart + relativeStart));
        const layer = { ...e };
        delete layer.startTime;
        delete layer.duration;
        layer.start = relativeStart;
        layer.layerDuration = relativeDuration;
        return layer;
      });

    const num = Number(String(trackId).padEnd(5, '0'));
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

// Worker主逻辑
async function renderChunk() {
  try {
    const {
      timeline: serializedTimeline,
      startTime,
      endTime,
      startFrame,
      endFrame,
      fps,
      width,
      height,
      channels,
      chunkPath,
      chunkIndex,
      options
    } = workerData;

    // 重建timeline对象
    const timeline = new WorkerTimeline(serializedTimeline);
    
    // 重建tracks
    for (const [trackId, trackData] of timeline.tracks) {
      const track = new WorkerTrack(trackData.type, trackData.config);
      track.elements = trackData.elements;
      timeline.tracks.set(trackId, track);
    }

    const totalFrames = endFrame - startFrame;
    let framesWritten = 0;

    // 启动FFmpeg进程写入分块视频
    const args = [
      "-f", "rawvideo",
      "-vcodec", "rawvideo",
      "-pix_fmt", "rgba",
      "-s", `${width}x${height}`,
      "-r", fps.toString(),
      "-i", "-",
      "-vf", "format=yuv420p",
      "-vcodec", "libx264",
      "-profile:v", "high",
      ...(options.fast ? ["-preset:v", "ultrafast"] : ["-preset:v", "medium"]),
      "-crf", "18",
      "-movflags", "faststart",
      "-y", chunkPath
    ];

    const ffmpegProcess = ffmpeg(args, {
      encoding: "buffer",
      buffer: false,
      stdin: "pipe",
      stdout: process.stdout,
      stderr: process.stderr,
    });

    // 逐帧渲染当前块
    for (let frameIndex = startFrame; frameIndex < endFrame; frameIndex++) {
      const currentTime = frameIndex / fps;
      
      if (options.verbose) {
        console.log(`Worker ${chunkIndex}: 渲染帧 ${frameIndex}/${endFrame} (${currentTime.toFixed(2)}s)`);
      }
      
      // 获取合成帧
      const frameData = await timeline.getCompositeFrameAtTime(
        currentTime, width, height, channels, options.verbose, fps
      );
      
      if (!frameData) {
        console.warn(`Worker ${chunkIndex}: 时间 ${currentTime}s 无帧数据`);
        continue;
      }

      // 写入FFmpeg
      await new Promise((resolve) => {
        ffmpegProcess?.stdin?.write(frameData, resolve);
      });

      framesWritten++;
      
      // 发送进度更新
      if (framesWritten % 10 === 0) {
        const progress = Math.floor((framesWritten / totalFrames) * 100);
        parentPort.postMessage({ type: 'progress', progress });
      }
    }

    // 结束FFmpeg进程
    ffmpegProcess.stdin?.end();
    await ffmpegProcess;

    parentPort.postMessage({ type: 'complete' });
  } catch (error) {
    parentPort.postMessage({ type: 'error', error: error.message });
  }
}

// 启动渲染
renderChunk();
