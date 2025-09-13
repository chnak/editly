import assert from "assert";
import fsExtra from "fs-extra";
import { merge } from "lodash-es";
import JSON5 from "json5";
import { nanoid } from "nanoid";
import Audio from "./audio.js";
import EventEmitter from "events";
import Track from "./track.js";
import MultiTrackTimeline from "./timeline.js";
import ProcessRenderer from "./processRenderer.js";
import HybridRenderer from "./hybridRenderer.js";
import AutoOptimizer from "./autoOptimizer.js";
import { dirname, join } from "path";
import { configureFf, ffmpeg, parseFps } from "./ffmpeg.js";
import { assertFileValid, multipleOf2 } from "./utils/util.js";
import os from "os";

const globalDefaults = {
    duration: 4,
    transition: {
        duration: 0.5,
        name: "random",
        audioOutCurve: "tri",
        audioInCurve: "tri",
    },
};
class Editly extends EventEmitter {
  constructor(config={}) {
    super();
    this.tracks=config.tracks||{},
    this.options={
        verbose:config.verbose||false,
        logTimes:config.logTimes||false,
        keepTmp:config.keepTmp||false,
        fast:config.fast||false,
        outPath:config.outPath,
        defaults:merge({}, globalDefaults, config.defaults),
        width:config.width||1920,
        height:config.height||1080,
        fps:config.fps||25,
        audioFilePath:config.audioFilePath,
        allowRemoteRequests:config.allowRemoteRequests||false,
        audioNorm:config.audioNorm,
        outputVolume:config.outputVolume,
        customOutputArgs:config.customOutputArgs,
        isGif:config.isGif||false,
        ffmpegPath:config.ffmpegPath??"ffmpeg",
        ffprobePath:config.ffprobePath?? "ffprobe",
        channels:4,
        parallel:config.parallel||false,
        maxWorkers:config.maxWorkers||Math.max(1, Math.floor(os.cpus().length * 0.8)),
        chunkDuration:config.chunkDuration||2.0,
        keepTmp:config.keepTmp||false,
        useThreads:config.useThreads||false,
        useHybrid:config.useHybrid||false,
        autoOptimize:config.autoOptimize||false
    }
    this.options.outDir=dirname(this.options.outPath)
    this.options.tmpDir=join(this.options.outDir, `editly-tmp-${nanoid()}`)
  }

  start() {
    const timeline = new MultiTrackTimeline();
    const verbose=this.options.verbose;
    const tmpDir=this.options.tmpDir
    const isGif=this.options.isGif
    const fast=this.options.fast
    const outPath=this.options.outPath
    const channels=this.options.channels
    return new Promise(async (resolve, reject) => {
        try{
            for (const [trackId, trackConfig] of Object.entries(this.tracks)) {
                const track = new Track(trackConfig.type,this.options);

                // 仅支持 elements：每个轨道通过 elements 列表定义场景元素
                {
                    // 扁平化结构：直接将layer属性提升到element级别
                    for (const elementConfig of trackConfig.elements || []) {
                        const startTimeSafe = (typeof elementConfig.startTime === "number") ? elementConfig.startTime : 0;
                        // 扁平化结构：检查是否还有layer属性（向后兼容）或直接使用扁平化结构
                        const flatElement = elementConfig.layer ? {
                            startTime: startTimeSafe,
                            duration: elementConfig.duration,
                            ...elementConfig.layer, // 将layer的所有属性直接展开
                            transition: elementConfig.transition // 保留transition属性
                        } : {
                            startTime: startTimeSafe,
                            duration: elementConfig.duration,
                            ...elementConfig, // 直接使用扁平化的element
                            transition: elementConfig.transition // 保留transition属性
                        };
                        track.addElement(flatElement);
                        
                        // 更新总时长（startTime 缺省按 0 处理）
                        let elementDuration = elementConfig.duration;
                        // 如果是scene类型，需要计算其内部elements的最大时长
                        if (flatElement.type === "scene" && flatElement.elements) {
                            const sceneElements = flatElement.elements;
                            const maxSceneDuration = Math.max(...sceneElements.map(el => (el.startTime || 0) + (el.duration || 0)), 0);
                            elementDuration = elementDuration || maxSceneDuration;
                        }
                        timeline.duration = Math.max(
                            timeline.duration, 
                            startTimeSafe + elementDuration
                        );
                    }
                }
                
                timeline.addTrack(trackId, track);
            }
            const { editAudio } = Audio({ verbose, tmpDir });
            const audioFilePath = !isGif ? await editAudio({
                keepSourceAudio: true,
                arbitraryAudio: [],
                clipsAudioVolume: 1.0,
                clips: [], // 需要根据轨道信息重新实现音频处理
                audioNorm:this.options.audioNorm,
                outputVolume:this.options.outputVolume,
            }) : undefined;

            // 解析视频参数
            let width = this.options.width;
            let height = this.options.height;
            let fps = this.options.fps;
            let framerateStr = String(fps);

            if (this.options.fast) {
                fps = 15;
                framerateStr = String(fps);
                const numPixelsEachDirection = 250;
                const aspectRatio = width / height;
                width = multipleOf2(numPixelsEachDirection * Math.sqrt(aspectRatio));
                height = multipleOf2(numPixelsEachDirection * Math.sqrt(1 / aspectRatio));
            }

            console.log(`Multi-track timeline: ${width}x${height} ${fps}fps, duration: ${timeline.duration}s`);

            this.emit('start');

            // 检查是否启用自动优化
            if (this.options.autoOptimize) {
                console.log("🤖 启用自动优化模式");
                const optimizer = new AutoOptimizer();
                const videoConfig = {
                    width,
                    height,
                    fps,
                    duration: timeline.duration
                };
                
                const optimizedConfig = optimizer.calculateOptimalConfig(videoConfig, this.tracks);
                
                // 更新配置
                this.options.maxWorkers = optimizedConfig.maxWorkers;
                this.options.chunkDuration = optimizedConfig.chunkDuration;
                this.options.parallel = true;
                
                console.log(`🎯 自动优化结果: ${optimizedConfig.maxWorkers}个进程, ${optimizedConfig.chunkDuration}秒分块`);
                console.log(`📊 配置置信度: ${optimizedConfig.confidence.toFixed(1)}%`);
                
                this.emit('optimization-complete', optimizedConfig);
            }

            // 检查是否启用并行渲染
            if (this.options.parallel) {
                let parallelRenderer;
                
                if (this.options.useHybrid) {
                    // 使用混合渲染器
                    console.log(`启用混合并行渲染: ${this.options.maxWorkers}个进程/线程, 每块${this.options.chunkDuration}秒`);
                    parallelRenderer = new HybridRenderer({
                        maxWorkers: this.options.maxWorkers,
                        chunkDuration: this.options.chunkDuration,
                        verbose: verbose,
                        keepTmp: this.options.keepTmp,
                        onChunkProgress: (chunkIndex, progress) => {
                            if (verbose) {
                                console.log(`块 ${chunkIndex} 进度: ${progress}%`);
                            }
                        }
                    });
                    
                    // 发送策略检测事件
                    const strategyInfo = parallelRenderer.getStrategyInfo(timeline);
                    this.emit('strategy-detected', strategyInfo);
                } else {
                    // 使用传统渲染器
                    const rendererType = this.options.useThreads ? "工作线程" : "工作进程";
                    console.log(`启用并行渲染: ${this.options.maxWorkers}个${rendererType}, 每块${this.options.chunkDuration}秒`);
                    
                    parallelRenderer = this.options.useThreads ? 
                        new (await import('./parallelRenderer.js')).default({
                            maxWorkers: this.options.maxWorkers,
                            chunkDuration: this.options.chunkDuration,
                            verbose: verbose,
                            keepTmp: this.options.keepTmp,
                            onChunkProgress: (chunkIndex, progress) => {
                                if (verbose) {
                                    console.log(`块 ${chunkIndex} 进度: ${progress}%`);
                                }
                            }
                        }) :
                        new ProcessRenderer({
                            maxWorkers: this.options.maxWorkers,
                            chunkDuration: this.options.chunkDuration,
                            verbose: verbose,
                            keepTmp: this.options.keepTmp,
                            onChunkProgress: (chunkIndex, progress) => {
                                if (verbose) {
                                    console.log(`块 ${chunkIndex} 进度: ${progress}%`);
                                }
                            }
                        });
                }

                try {
                    await parallelRenderer.renderParallel(
                        timeline, 
                        timeline.duration, 
                        fps, 
                        width, 
                        height, 
                        channels, 
                        outPath, 
                        audioFilePath, 
                        isGif, 
                        fast
                    );
                    
                    console.log(`\n并行渲染完成. 输出文件: ${outPath}`);
                    this.emit('complete', outPath);
                    resolve(outPath);
                } catch (error) {
                    this.emit('error', error);
                    reject(error);
                } finally {
                    await parallelRenderer.close();
                }
            } else {
                // 原有的串行渲染逻辑
                let outProcess;
                let totalFramesWritten = 0;
                const totalFrames = Math.ceil(timeline.duration * fps);
                outProcess = this.startFfmpegWriterProcess({width,height,framerateStr,audioFilePath,isGif,fps,fast,outPath});
                
                outProcess.on("exit", (code) => {
                    if (verbose)
                        console.log("Output ffmpeg exited", code);
                });

                outProcess.catch((err) => {
                    this.emit('error',err)
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
                        this.emit('progress',percent)
                    }
                }

                outProcess.stdin?.end();
                await outProcess;
                console.log(`\nDone. Output file: ${outPath}`);
                this.emit('complete',outPath)
                resolve(outPath)
            }
        }catch(err){
            console.log(err)
            this.emit('error',err)
            reject(err)
        }finally {
            await timeline.close();
            if (!this.options.keepTmp) await fsExtra.remove(this.options.tmpDir);
        }
    })
  }

  startFfmpegWriterProcess({width,height,framerateStr,audioFilePath,isGif,fps,fast,outPath}){
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
}


export default Editly;