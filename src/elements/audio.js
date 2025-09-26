import { BaseElement } from "./base.js";
import { ffmpeg, readFileStreams } from "../../core/ffmpeg.js";
import { join, resolve } from "path";

/**
 * 音频元素
 * 用于播放音频文件
 */
export class AudioElement extends BaseElement {
  constructor(config) {
    super(config);
    
    // 音频特有属性
    this.source = config.source;
    this.volume = config.volume || 1.0; // 音量 (0.0 - 1.0)
    this.mixVolume = config.mixVolume || 1.0; // 混音音量
    this.loop = config.loop || false; // 是否循环播放
    this.fadeIn = config.fadeIn || 0; // 淡入时间（秒）
    this.fadeOut = config.fadeOut || 0; // 淡出时间（秒）
    
    // 音频截取属性
    this.cutFrom = config.cutFrom || 0; // 开始时间（秒）
    this.cutTo = config.cutTo; // 结束时间（秒）
    this.speedFactor = config.speedFactor || 1; // 播放速度倍数
    
    // 音频处理属性
    this.audioNorm = config.audioNorm || false; // 是否启用音频标准化
    this.audioNormGaussSize = config.audioNormGaussSize || 5; // 音频标准化高斯大小
    this.audioNormMaxGain = config.audioNormMaxGain || 30; // 音频标准化最大增益
    
    // 内部状态
    this.audioPath = null;
    this.audioDuration = 0;
    this.isInitialized = false;
  }

  async initialize() {
    await super.initialize();
    
    if (this.source) {
      await this.processAudio();
      this.isInitialized = true;
    }
  }

  /**
   * 处理音频文件
   */
  async processAudio() {
    try {
      //console.log(`[AudioElement] 开始处理音频文件: ${this.source}`);
      
      // 检查文件是否有音频流
      const streams = await readFileStreams(this.source);
      //console.log(`[AudioElement] 文件流信息:`, streams);
      
      if (!streams.some(s => s.codec_type === "audio")) {
        throw new Error(`文件 ${this.source} 不包含音频流`);
      }

      // 获取音频时长
      const audioStream = streams.find(s => s.codec_type === "audio");
      const originalDuration = audioStream.duration || 0;
      //console.log(`[AudioElement] 原始音频时长: ${originalDuration}s`);

      // 计算实际播放时长
      // 优先级：duration > cutTo > 原始时长
      if (this.duration) {
        this.audioDuration = this.duration;
        //console.log(`[AudioElement] 使用元素duration: ${this.audioDuration}s`);
      } else if (this.cutTo) {
        this.audioDuration = Math.min(originalDuration, this.cutTo - this.cutFrom);
        //console.log(`[AudioElement] 使用cutTo截取: ${this.audioDuration}s`);
      } else {
        this.audioDuration = originalDuration;
        //console.log(`[AudioElement] 使用原始时长: ${this.audioDuration}s`);
      }

      // 处理音频文件
      //console.log(`[AudioElement] 开始创建处理后的音频文件...`);
      this.audioPath = await this.createProcessedAudio();
      //console.log(`[AudioElement] 音频处理完成，输出路径: ${this.audioPath}`);
      
    } catch (error) {
      console.error(`[AudioElement] 处理音频文件失败: ${this.source}`, error);
      throw error;
    }
  }

  /**
   * 创建处理后的音频文件
   */
  async createProcessedAudio() {
    const tempDir = process.env.TEMP || process.env.TMP || '/tmp';
    const audioPath = join(tempDir, `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.flac`);
    
    //console.log(`[AudioElement] 创建临时音频文件: ${audioPath}`);
    
    const args = [
      "-nostdin",
      "-i", this.source,
      "-t", this.audioDuration.toString(),
      "-sample_fmt", "s32",
      "-ar", "48000",
      "-map", "a:0",
      "-c:a", "flac"
    ];

    // 添加截取参数
    if (this.cutFrom > 0) {
      args.splice(2, 0, "-ss", this.cutFrom.toString());
      //console.log(`[AudioElement] 添加截取参数: -ss ${this.cutFrom}`);
    }

    // 添加速度调整
    if (Math.abs(this.speedFactor - 1) > 0.01) {
      const atempo = 1 / this.speedFactor;
      if (atempo >= 0.5 && atempo <= 100) {
        args.push("-filter:a", `atempo=${atempo}`);
        //console.log(`[AudioElement] 添加速度调整: atempo=${atempo}`);
      } else {
        console.warn(`[AudioElement] 音频速度 ${atempo} 超出FFmpeg支持范围，使用原始速度`);
      }
    }

    // 添加音量调整
    if (this.volume !== 1.0) {
      const volumeFilter = `volume=${this.volume}`;
      if (args.includes("-filter:a")) {
        // 如果已有滤镜，合并
        const filterIndex = args.indexOf("-filter:a");
        args[filterIndex + 1] = `${args[filterIndex + 1]},${volumeFilter}`;
      } else {
        args.push("-filter:a", volumeFilter);
      }
      //console.log(`[AudioElement] 添加音量调整: volume=${this.volume}`);
    }

    // 添加淡入淡出效果
    if (this.fadeIn > 0 || this.fadeOut > 0) {
      const fadeFilter = this.createFadeFilter();
      if (fadeFilter) {
        if (args.includes("-filter:a")) {
          const filterIndex = args.indexOf("-filter:a");
          args[filterIndex + 1] = `${args[filterIndex + 1]},${fadeFilter}`;
        } else {
          args.push("-filter:a", fadeFilter);
        }
        //  console.log(`[AudioElement] 添加淡入淡出效果: ${fadeFilter}`);
      }
    }

    // 添加音频标准化
    if (this.audioNorm) {
      const normFilter = `dynaudnorm=g=${this.audioNormGaussSize}:maxgain=${this.audioNormMaxGain}`;
      if (args.includes("-filter:a")) {
        const filterIndex = args.indexOf("-filter:a");
        args[filterIndex + 1] = `${args[filterIndex + 1]},${normFilter}`;
      } else {
        args.push("-filter:a", normFilter);
      }
      //console.log(`[AudioElement] 添加音频标准化: ${normFilter}`);
    }

    args.push("-y", audioPath);

    //console.log(`[AudioElement] FFmpeg命令:`, args);
    //console.log(`[AudioElement] 开始执行FFmpeg...`);
    
    await ffmpeg(args);
    
    //console.log(`[AudioElement] FFmpeg执行完成`);
    return audioPath;
  }

  /**
   * 创建淡入淡出滤镜
   */
  createFadeFilter() {
    const filters = [];
    
    if (this.fadeIn > 0) {
      filters.push(`afade=t=in:ss=0:d=${this.fadeIn}`);
    }
    
    if (this.fadeOut > 0) {
      const fadeOutStart = Math.max(0, this.audioDuration - this.fadeOut);
      filters.push(`afade=t=out:st=${fadeOutStart}:d=${this.fadeOut}`);
    }
    
    return filters.length > 0 ? filters.join(",") : null;
  }

  /**
   * 读取下一帧（音频元素不产生视觉帧）
   */
  async readNextFrame(time, canvas) {
    // 音频元素不产生视觉帧，返回null
    return null;
  }

  /**
   * 获取音频信息
   */
  getAudioInfo() {
    return {
      source: this.source,
      duration: this.audioDuration,
      volume: this.volume,
      mixVolume: this.mixVolume,
      loop: this.loop,
      cutFrom: this.cutFrom,
      cutTo: this.cutTo,
      speedFactor: this.speedFactor,
      fadeIn: this.fadeIn,
      fadeOut: this.fadeOut,
      audioPath: this.audioPath
    };
  }

  /**
   * 获取音频流信息（用于混音）
   */
  getAudioStream() {
    if (!this.audioPath) {
      return null;
    }

    return {
      path: resolve(this.audioPath),
      start: this.startTime,
      cutFrom: this.cutFrom,
      cutTo: this.cutTo,
      mixVolume: this.mixVolume,
      loop: this.loop ? -1 : 0 // FFmpeg的循环参数：-1表示无限循环，0表示不循环
    };
  }

  /**
   * 检查是否在指定时间播放
   */
  isPlayingAtTime(time) {
    return time >= this.startTime && time < this.endTime;
  }

  /**
   * 获取当前播放进度（相对于音频开始）
   */
  getPlaybackProgress(time) {
    if (!this.isPlayingAtTime(time)) {
      return 0;
    }
    
    const elapsed = time - this.startTime;
    return Math.min(elapsed / this.audioDuration, 1);
  }

  async close() {
    // 清理临时文件
    if (this.audioPath && this.audioPath.includes('audio-')) {
      try {
        const fs = await import('fs');
        await fs.promises.unlink(this.audioPath);
      } catch (error) {
        // 忽略删除失败的错误
        console.warn('清理临时音频文件失败:', error.message);
      }
    }
  }
}
