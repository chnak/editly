import { Worker } from 'worker_threads';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fsExtra from 'fs-extra';
import { ffmpeg, createConcatFile } from './ffmpeg.js';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class ParallelRenderer {
  constructor(options = {}) {
    this.options = {
      maxWorkers: options.maxWorkers || Math.max(1, Math.floor(require('os').cpus().length * 0.8)),
      chunkDuration: options.chunkDuration || 2.0, // 每个块2秒
      verbose: options.verbose || false,
      ...options
    };
    this.workers = [];
    this.chunkFiles = [];
  }

  async renderParallel(timeline, totalDuration, fps, width, height, channels, outPath, audioFilePath, isGif, fast) {
    const totalFrames = Math.ceil(totalDuration * fps);
    const chunkFrames = Math.ceil(this.options.chunkDuration * fps);
    const numChunks = Math.ceil(totalFrames / chunkFrames);
    
    if (this.options.verbose) {
      console.log(`并行渲染配置: ${numChunks}个块, 每块${chunkFrames}帧, ${this.options.maxWorkers}个工作进程`);
    }

    // 创建临时目录存储分块视频
    const tmpDir = join(dirname(outPath), `editly-parallel-${nanoid()}`);
    await fsExtra.ensureDir(tmpDir);

    try {
      // 并行渲染所有块
      const chunkPromises = [];
      for (let chunkIndex = 0; chunkIndex < numChunks; chunkIndex++) {
        const startFrame = chunkIndex * chunkFrames;
        const endFrame = Math.min(startFrame + chunkFrames, totalFrames);
        const startTime = startFrame / fps;
        const endTime = endFrame / fps;
        
        const chunkPath = join(tmpDir, `chunk_${chunkIndex.toString().padStart(3, '0')}.mp4`);
        this.chunkFiles.push(chunkPath);
        
        chunkPromises.push(
          this.renderChunk(
            timeline, 
            startTime, 
            endTime, 
            startFrame, 
            endFrame, 
            fps, 
            width, 
            height, 
            channels, 
            chunkPath,
            chunkIndex
          )
        );
      }

      // 等待所有块渲染完成
      await Promise.all(chunkPromises);
      
      if (this.options.verbose) {
        console.log('所有块渲染完成，开始合成最终视频...');
      }

      // 合成最终视频
      await this.concatenateVideos(outPath, audioFilePath, isGif, fast);
      
      return outPath;
    } finally {
      // 清理临时文件
      if (!this.options.keepTmp) {
        await fsExtra.remove(tmpDir);
      }
    }
  }

  async renderChunk(timeline, startTime, endTime, startFrame, endFrame, fps, width, height, channels, chunkPath, chunkIndex) {
    return new Promise(async (resolve, reject) => {
      try {
        const worker = new Worker(new URL('./chunkWorker.js', import.meta.url), {
          workerData: {
            timeline: this.serializeTimeline(timeline),
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
            options: {
              verbose: this.options.verbose,
              fast: this.options.fast,
              keepTmp: this.options.keepTmp
            }
          }
        });

        worker.on('message', (message) => {
          if (message.type === 'progress') {
            this.options.onChunkProgress?.(chunkIndex, message.progress);
          } else if (message.type === 'complete') {
            resolve();
          } else if (message.type === 'error') {
            reject(new Error(message.error));
          }
        });

        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });

        this.workers.push(worker);
      } catch (error) {
        reject(error);
      }
    });
  }

  async concatenateVideos(outPath, audioFilePath, isGif, fast) {
    // 创建concat文件
    const concatFilePath = join(dirname(outPath), `concat_${nanoid()}.txt`);
    await createConcatFile(this.chunkFiles, concatFilePath);

    try {
      // 使用FFmpeg合并视频
      const args = [
        '-f', 'concat',
        '-safe', '0',
        '-i', concatFilePath,
        ...(audioFilePath ? ['-i', audioFilePath] : []),
        ...(!isGif ? ['-map', '0:v:0'] : []),
        ...(audioFilePath ? ['-map', '1:a:0'] : []),
        ...(isGif ? [
          '-vf', 'format=rgb24,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
          '-loop', '0'
        ] : [
          '-vf', 'format=yuv420p',
          '-vcodec', 'libx264',
          '-profile:v', 'high',
          ...(fast ? ['-preset:v', 'ultrafast'] : ['-preset:v', 'medium']),
          '-crf', '18',
          '-movflags', 'faststart'
        ]),
        '-y', outPath
      ];

      await ffmpeg(args);
    } finally {
      // 清理concat文件
      await fsExtra.remove(concatFilePath);
    }
  }

  serializeTimeline(timeline) {
    // 将timeline对象序列化为可传递给Worker的数据
    const serializedTracks = [];
    for (const [trackId, track] of timeline.tracks) {
      serializedTracks.push([
        trackId,
        {
          type: track.type,
          config: track.config,
          elements: track.elements,
          volume: track.volume
        }
      ]);
    }
    
    return {
      tracks: serializedTracks,
      duration: timeline.duration,
      globalLayers: timeline.globalLayers
    };
  }

  async close() {
    // 关闭所有Worker
    await Promise.all(this.workers.map(worker => worker.terminate()));
    this.workers = [];
  }
}
