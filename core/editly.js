import assert from "assert";
import fsExtra from "fs-extra";
import { merge } from "lodash-es";
import JSON5 from "json5";
import { nanoid } from "nanoid";
import Audio from "./audio.js";
import EventEmitter from "events";
import Track from "./track.js";
import MultiTrackTimeline from "./timeline.js";
import { dirname, join } from "path";
import { configureFf, ffmpeg, parseFps } from "./ffmpeg.js";
import { assertFileValid, multipleOf2 } from "./utils/util.js";

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
        channels:4
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

            let outProcess;
            let totalFramesWritten = 0;
            const totalFrames = Math.ceil(timeline.duration * fps);
            outProcess = this.startFfmpegWriterProcess({width,height,framerateStr,audioFilePath,isGif,fps,fast,outPath});
            this.emit('start')
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