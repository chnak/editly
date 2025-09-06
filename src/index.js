import assert from "assert";
import fsExtra from "fs-extra";
import JSON5 from "json5";
import Audio from "./audio.js";
import { createCanvas, ImageData } from "canvas";
import { Configuration } from "./configuration.js";
import { configureFf, ffmpeg, parseFps } from "./ffmpeg.js";
import { createFrameSource } from "./frameSource.js";
import parseConfig from "./parseConfig.js";
import { createFabricCanvas,renderFabricCanvas, rgbaToFabricImage } from "./sources/fabric.js";
import { assertFileValid, multipleOf2 } from "./util.js";

const channels = 4;
/**
 * 轨道类 - 管理单个轨道上的所有元素
 */
class Track {
  constructor(type = "scene") {
    this.type = type;
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
        layers:this.elements.map(a=>a.layer),
        transition: activeElement.transition || null,
        clipIndex:`${clipIndex}`
    };

    if (!activeElement.frameSource) {
        activeElement.frameSource = await createFrameSource({
        clip,
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

/**
 * 多轨道时间线类
 */
class MultiTrackTimeline {
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

    // 渲染全局层
    for (const globalLayer of this.globalLayers) {
      // 这里需要实现全局层的渲染逻辑
      // 可以根据layer的类型调用相应的渲染器
      if (verbose) console.log("Rendering global layer:", globalLayer.type);
    }

    // const internalCanvas = canvas.getNodeCanvas();
    // const data=internalCanvas.toBuffer("image/png")
    // await fsExtra.writeFile(`temp/${time}.png`, data);
    return await renderFabricCanvas(canvas)
  }

  async close() {
    for (const track of this.tracks.values()) {
      await track.close();
    }
  }
}

/**
 * 新的多轨道Editly主函数
 */
async function Editly(input) {
  const config = new Configuration(input);
  const { 
    verbose = false, logTimes = false, keepTmp = false, fast = false, 
    outPath, tracks: tracksConfig, globalLayers = [], 
    width: requestedWidth, height: requestedHeight, fps: requestedFps, 
    audioFilePath: backgroundAudioPath, allowRemoteRequests, 
    audioNorm, outputVolume, customOutputArgs, isGif, tmpDir 
  } = config;

  await configureFf(config);
  if (verbose) console.log(JSON5.stringify(config, null, 2));

  // 创建多轨道时间线
  const timeline = new MultiTrackTimeline();

  // 解析和配置轨道
  for (const [trackId, trackConfig] of Object.entries(tracksConfig || {})) {
    const track = new Track(trackConfig.type);
    
    for (const elementConfig of trackConfig.elements || []) {
      track.addElement({
        startTime: elementConfig.startTime,
        duration: elementConfig.duration,
        layer: elementConfig.layer
      });
      
      // 更新总时长
      timeline.duration = Math.max(
        timeline.duration, 
        elementConfig.startTime + elementConfig.duration
      );
    }
    
    timeline.addTrack(trackId, track);
  }

  // 添加全局层
  for (const globalLayer of globalLayers) {
    timeline.addGlobalLayer(globalLayer);
  }

  // 音频处理（简化版）
  const { editAudio } = Audio({ verbose, tmpDir });
  const audioFilePath = !isGif ? await editAudio({
    keepSourceAudio: true,
    arbitraryAudio: [],
    clipsAudioVolume: 1.0,
    clips: [], // 需要根据轨道信息重新实现音频处理
    audioNorm,
    outputVolume,
  }) : undefined;

  // 解析视频参数
  let width = requestedWidth || 640;
  let height = requestedHeight || 480;
  let fps = requestedFps || 25;
  let framerateStr = String(fps);

  if (fast) {
    fps = 15;
    framerateStr = String(fps);
    const numPixelsEachDirection = 250;
    const aspectRatio = width / height;
    width = multipleOf2(numPixelsEachDirection * Math.sqrt(aspectRatio));
    height = multipleOf2(numPixelsEachDirection * Math.sqrt(1 / aspectRatio));
  }

  console.log(`Multi-track timeline: ${width}x${height} ${fps}fps, duration: ${timeline.duration}s`);

  // 启动FFmpeg输出进程
  function startFfmpegWriterProcess() {
    const args = [
      "-f", "rawvideo",
      "-vcodec", "rawvideo",
      "-pix_fmt", "rgba",
      "-s", `${width}x${height}`,
      "-r", framerateStr,
      "-i", "-",
      ...(audioFilePath ? ["-i", audioFilePath] : []),
      ...(!isGif ? ["-map", "0:v:0"] : []),
      ...(audioFilePath ? ["-map", "1:a:0"] : []),
      ...(isGif ? [
        "-vf", `format=rgb24,fps=${fps},scale=${width}:${height}:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
        "-loop", "0"
      ] : [
        "-vf", "format=yuv420p",
        "-vcodec", "libx264",
        "-profile:v", "high",
        ...(fast ? ["-preset:v", "ultrafast"] : ["-preset:v", "medium"]),
        "-crf", "18",
        "-movflags", "faststart"
      ]),
      "-y", outPath
    ];
    
    return ffmpeg(args, {
        encoding: "buffer",
        buffer: false,
        stdin: "pipe",
        stdout: process.stdout,
        stderr: process.stderr,
    });
  }

  let outProcess;
  let totalFramesWritten = 0;
  const totalFrames = Math.ceil(timeline.duration * fps);

  try {
    outProcess = startFfmpegWriterProcess();
    let outProcessError;
    outProcess.on("exit", (code) => {
        if (verbose)
            console.log("Output ffmpeg exited", code);
    });

    outProcess.catch((err) => {
        outProcessError = err;
    });
    // 逐帧渲染时间线
    for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
      const currentTime = frameIndex / fps;
      
      if (verbose) {
        console.log(`Rendering frame ${frameIndex}/${totalFrames} (${currentTime.toFixed(2)}s)`);
      }
      
      // 获取合成帧
      const frameData = await timeline.getCompositeFrameAtTime(
        currentTime, width, height, channels, verbose,fps
      );
      if (!frameData) {
        console.warn(`No frame data at time ${currentTime}s`);
        continue;
      }

      // 写入FFmpeg
      await new Promise((resolve) => {
        outProcess?.stdin?.write(frameData, resolve);
      });

      totalFramesWritten++;
      
      // 进度显示
      if (!verbose && totalFramesWritten % 10 === 0) {
        const percent = Math.floor((totalFramesWritten / totalFrames) * 100);
        process.stdout.write(`\rRendering: ${percent}%`);
      }
    }

    outProcess.stdin?.end();
    await outProcess;
    
  } finally {
    await timeline.close();
    if (!keepTmp) await fsExtra.remove(tmpDir);
  }

  console.log(`\nDone. Output file: ${outPath}`);
}
/**
 * Pure function to get a frame at a certain time.
 * TODO: I think this does not respect transition durations
 *
 * @param config - ConfigurationOptions.
 */
export async function renderSingleFrame(input) {
    const time = input.time ?? 0;
    const config = new Configuration(input);
    const { clips: clipsIn, allowRemoteRequests, width = 800, height = 600, verbose, logTimes, outPath = `${Math.floor(Math.random() * 1e12)}.png`, defaults, } = config;
    configureFf(config);
    const { clips } = await parseConfig({
        clips: clipsIn,
        arbitraryAudio: [],
        allowRemoteRequests,
        defaults,
    });
    let clipStartTime = 0;
    const clip = clips.find((c) => {
        if (clipStartTime <= time && clipStartTime + c.duration > time)
            return true;
        clipStartTime += c.duration;
        return false;
    });
    assert(clip, "No clip found at requested time");
    const clipIndex = clips.indexOf(clip);
    const frameSource = await createFrameSource({
        clip,
        clipIndex,
        width,
        height,
        channels,
        verbose,
        logTimes,
        framerateStr: "1",
    });
    const rgba = await frameSource.readNextFrame({ time: time - clipStartTime });
    // TODO converting rgba to png can be done more easily?
    const canvas = createFabricCanvas({ width, height });
    const fabricImage = await rgbaToFabricImage({ width, height, rgba });
    canvas.add(fabricImage);
    canvas.renderAll();
    const internalCanvas = canvas.getNodeCanvas();
    await fsExtra.writeFile(outPath, internalCanvas.toBuffer("image/png"));
    canvas.clear();
    canvas.dispose();
    await frameSource.close();
}
Editly.renderSingleFrame = renderSingleFrame;
export default Editly;
