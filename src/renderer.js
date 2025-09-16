import { spawn } from "child_process";
import { createWriteStream } from "fs";
import { dirname, join } from "path";
import { nanoid } from "nanoid";
import fsExtra from "fs-extra";

/**
 * 视频渲染器 - 负责将时间线渲染为视频文件
 */
export class VideoRenderer {
  constructor(config) {
    this.config = config;
    this.tmpDir = join(dirname(config.outPath), `video-maker-tmp-${nanoid()}`);
    this.ffmpegProcess = null;
  }

  /**
   * 渲染视频
   */
  async render(timeline) {
    try {
      await fsExtra.ensureDir(this.tmpDir);
      
      const totalFrames = Math.ceil(timeline.duration * timeline.fps);
      const frameSize = timeline.width * timeline.height * 4; // RGBA
      
      console.log(`开始渲染: ${timeline.width}x${timeline.height} ${timeline.fps}fps, 总帧数: ${totalFrames}`);
      
      // 启动 FFmpeg 进程
      this.startFfmpegProcess();
      
      // 逐帧渲染
      for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
        const currentTime = frameIndex / timeline.fps;
        
        if (this.config.verbose) {
          console.log(`渲染帧 ${frameIndex + 1}/${totalFrames} (${currentTime.toFixed(2)}s)`);
        }
        
        // 获取合成帧
        const frameData = await timeline.getCompositeFrameAtTime(currentTime);
        
        if (frameData && frameData.length === frameSize) {
          // 写入 FFmpeg
          await this.writeFrameToFfmpeg(frameData);
        } else {
          console.warn(`帧数据无效: ${frameIndex}`);
        }
        
        // 进度回调
        if (!this.config.verbose && frameIndex % 10 === 0) {
          const progress = Math.floor((frameIndex / totalFrames) * 100);
          process.stdout.write(`\r渲染进度: ${progress}%`);
        }
      }
      
      // 结束 FFmpeg 进程
      await this.finishFfmpegProcess();
      
      console.log(`\n渲染完成: ${this.config.outPath}`);
      return this.config.outPath;
      
    } catch (error) {
      console.error('渲染失败:', error);
      throw error;
    }
  }

  /**
   * 启动 FFmpeg 进程
   */
  startFfmpegProcess() {
    const args = [
      '-f', 'rawvideo',
      '-vcodec', 'rawvideo',
      '-pix_fmt', 'rgba',
      '-s', `${this.config.width}x${this.config.height}`,
      '-r', this.config.fps.toString(),
      '-i', '-',
      '-c:v', 'libx264',
      '-preset', this.config.fast ? 'ultrafast' : 'medium',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',  // 使用更兼容的颜色格式
      '-movflags', 'faststart',
      '-y',
      this.config.outPath
    ];

    this.ffmpegProcess = spawn('ffmpeg', args, {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.ffmpegProcess.stderr.on('data', (data) => {
      if (this.config.verbose) {
        console.log('FFmpeg:', data.toString());
      }
    });

    this.ffmpegProcess.on('error', (error) => {
      console.error('FFmpeg 错误:', error);
    });
  }

  /**
   * 写入帧数据到 FFmpeg
   */
  async writeFrameToFfmpeg(frameData) {
    return new Promise((resolve, reject) => {
      if (!this.ffmpegProcess || !this.ffmpegProcess.stdin) {
        reject(new Error('FFmpeg 进程未启动'));
        return;
      }

      this.ffmpegProcess.stdin.write(frameData, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 完成 FFmpeg 进程
   */
  async finishFfmpegProcess() {
    return new Promise((resolve, reject) => {
      if (!this.ffmpegProcess) {
        resolve();
        return;
      }

      this.ffmpegProcess.stdin.end();
      
      this.ffmpegProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg 退出码: ${code}`));
        }
      });
    });
  }

  /**
   * 关闭渲染器
   */
  async close() {
    if (this.ffmpegProcess) {
      this.ffmpegProcess.kill();
      this.ffmpegProcess = null;
    }
    
    // 清理临时目录
    if (await fsExtra.pathExists(this.tmpDir)) {
      try {
        await fsExtra.remove(this.tmpDir);
        console.log(`✓ 临时目录已清理: ${this.tmpDir}`);
      } catch (error) {
        console.warn(`⚠️ 清理临时目录失败: ${error.message}`);
      }
    }
  }
}
