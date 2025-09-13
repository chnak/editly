import { spawn } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fsExtra from 'fs-extra';
import { ffmpeg, createConcatFile } from './ffmpeg.js';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class ProcessRenderer {
  constructor(options = {}) {
    this.options = {
      maxWorkers: options.maxWorkers || Math.max(1, Math.floor(require('os').cpus().length * 0.8)),
      chunkDuration: options.chunkDuration || 2.0,
      verbose: options.verbose || false,
      ...options
    };
    this.processes = [];
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
        // 创建临时配置文件
        const configPath = join(dirname(chunkPath), `config_${chunkIndex}.json`);
        const config = {
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
        };
        
        await fsExtra.writeJson(configPath, config);

        // 启动子进程
        const childProcess = spawn('node', [join(__dirname, 'chunkProcess.js'), configPath], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        this.processes.push(childProcess);

        let output = '';
        let errorOutput = '';

        childProcess.stdout.on('data', (data) => {
          output += data.toString();
          if (this.options.verbose) {
            console.log(`块 ${chunkIndex}: ${data.toString().trim()}`);
          }
        });

        childProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
          if (this.options.verbose) {
            console.error(`块 ${chunkIndex} 错误: ${data.toString().trim()}`);
          }
        });

        childProcess.on('close', (code) => {
          // 清理配置文件
          fsExtra.remove(configPath).catch(() => {});
          
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`子进程退出，代码: ${code}\n输出: ${output}\n错误: ${errorOutput}`));
          }
        });

        childProcess.on('error', (error) => {
          reject(error);
        });

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
    // 将timeline对象序列化为可传递给子进程的数据
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
    // 关闭所有子进程
    await Promise.all(this.processes.map(proc => {
      return new Promise((resolve) => {
        proc.kill();
        proc.on('exit', resolve);
      });
    }));
    this.processes = [];
  }
}
