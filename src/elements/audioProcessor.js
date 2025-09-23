import { ffmpeg, readFileStreams } from "../utils/ffmpegUtils.js";
import { join, resolve, basename } from "path";
import { flatMap } from "lodash-es";

/**
 * 音频处理器
 * 用于处理音频的混音、合成和效果
 */
export class AudioProcessor {
  constructor(options = {}) {
    this.tempDir = options.tempDir || process.env.TEMP || process.env.TMP || '/tmp';
    this.verbose = options.verbose || false;
  }

  /**
   * 创建混合音频片段
   * @param {Array} clips 音频片段数组
   * @param {boolean} keepSourceAudio 是否保留源音频
   * @returns {Promise<Array>} 处理后的音频片段
   */
  async createMixedAudioClips({ clips, keepSourceAudio }) {
    const processedClips = [];
    
    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const { duration, layers, transition } = clip;
      
      try {
        const clipAudioPath = join(this.tempDir, `clip${i}-audio.flac`);
        
        // 创建静音音频
        if (!keepSourceAudio) {
          await this.createSilence(duration, clipAudioPath);
          processedClips.push({ path: resolve(clipAudioPath), silent: true });
          continue;
        }

        // 处理音频层
        const audioLayers = layers.filter(({ type, start, stop }) => 
          ["audio", "video"].includes(type) && !start && stop == null
        );

        if (audioLayers.length === 0) {
          await this.createSilence(duration, clipAudioPath);
          processedClips.push({ path: resolve(clipAudioPath), silent: true });
          continue;
        }

        const processedAudioLayers = await this.processAudioLayers(audioLayers, i);
        
        if (processedAudioLayers.length === 0) {
          await this.createSilence(duration, clipAudioPath);
          processedClips.push({ path: resolve(clipAudioPath), silent: true });
          continue;
        }

        if (processedAudioLayers.length === 1) {
          processedClips.push({ 
            path: resolve(processedAudioLayers[0][0]), 
            silent: false 
          });
          continue;
        }

        // 混合多个音频层
        await this.mixAudioLayers(processedAudioLayers, clipAudioPath);
        processedClips.push({ 
          path: resolve(clipAudioPath), 
          silent: false 
        });

      } catch (error) {
        console.error(`处理音频片段 ${i} 失败:`, error);
        // 创建静音作为后备
        const clipAudioPath = join(this.tempDir, `clip${i}-audio-silent.flac`);
        await this.createSilence(duration, clipAudioPath);
        processedClips.push({ path: resolve(clipAudioPath), silent: true });
      }
    }

    return processedClips;
  }

  /**
   * 创建静音音频
   */
  async createSilence(duration, outputPath) {
    const args = [
      "-nostdin",
      "-f", "lavfi",
      "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
      "-sample_fmt", "s32",
      "-ar", "48000",
      "-t", duration.toString(),
      "-c:a", "flac",
      "-y", outputPath
    ];

    await ffmpeg(args);
  }

  /**
   * 处理音频层
   */
  async processAudioLayers(audioLayers, clipIndex) {
    const processedLayers = [];

    for (let j = 0; j < audioLayers.length; j++) {
      const audioLayer = audioLayers[j];
      const { path, cutFrom, cutTo, speedFactor } = audioLayer;
      
      try {
        const streams = await readFileStreams(path);
        if (!streams.some(s => s.codec_type === "audio")) {
          continue;
        }

        const layerAudioPath = join(this.tempDir, `clip${clipIndex}-layer${j}-audio.flac`);
        
        let atempoFilter;
        if (Math.abs(speedFactor - 1) > 0.01) {
          const atempo = 1 / speedFactor;
          if (atempo >= 0.5 && atempo <= 100) {
            atempoFilter = `atempo=${atempo}`;
          } else {
            console.warn(`音频速度 ${atempo} 超出支持范围，跳过`);
            continue;
          }
        }

        const cutToArg = (cutTo - cutFrom) * speedFactor;
        const args = [
          "-nostdin",
          ...this.getCutFromArgs({ cutFrom }),
          "-i", path,
          "-t", cutToArg.toString(),
          "-sample_fmt", "s32",
          "-ar", "48000",
          "-map", "a:0",
          "-c:a", "flac",
          ...(atempoFilter ? ["-filter:a", atempoFilter] : []),
          "-y", layerAudioPath
        ];

        await ffmpeg(args);
        processedLayers.push([layerAudioPath, audioLayer]);

      } catch (error) {
        if (this.verbose) {
          console.error("无法提取音频:", path, error);
        }
      }
    }

    return processedLayers;
  }

  /**
   * 混合音频层
   */
  async mixAudioLayers(processedAudioLayers, outputPath) {
    const weights = processedAudioLayers.map(([, { mixVolume }]) => mixVolume ?? 1);
    
    const args = [
      "-nostdin",
      ...flatMap(processedAudioLayers, ([layerAudioPath]) => ["-i", layerAudioPath]),
      "-filter_complex",
      `amix=inputs=${processedAudioLayers.length}:duration=longest:weights=${weights.join(" ")}`,
      "-c:a", "flac",
      "-y", outputPath
    ];

    await ffmpeg(args);
  }

  /**
   * 交叉淡化连接音频片段
   */
  async crossFadeConcatClipAudio(clipAudio) {
    if (clipAudio.length < 2) {
      return clipAudio[0].path;
    }

    const outPath = join(this.tempDir, "audio-concat.flac");
    
    if (this.verbose) {
      console.log("合并音频:", clipAudio.map(({ path }) => basename(path)));
    }

    let inStream = "[0:a]";
    const filterGraph = clipAudio
      .slice(0, -1)
      .map(({ transition }, i) => {
        const outStream = `[concat${i}]`;
        const epsilon = 0.0001;
        const duration = Math.max(epsilon, transition?.duration ?? 0);
        const outCurve = transition?.audioOutCurve ?? "tri";
        const inCurve = transition?.audioInCurve ?? "tri";
        
        let ret = `${inStream}[${i + 1}:a]acrossfade=d=${duration}:c1=${outCurve}:c2=${inCurve}`;
        inStream = outStream;
        if (i < clipAudio.length - 2) {
          ret += outStream;
        }
        return ret;
      })
      .join(",");

    const args = [
      "-nostdin",
      ...flatMap(clipAudio, ({ path }) => ["-i", path]),
      "-filter_complex", filterGraph,
      "-c", "flac",
      "-y", outPath
    ];

    await ffmpeg(args);
    return outPath;
  }

  /**
   * 混合任意音频流
   */
  async mixArbitraryAudio({ streams, audioNorm, outputVolume }) {
    let maxGain = 30;
    let gaussSize = 5;
    
    if (audioNorm) {
      if (audioNorm.gaussSize != null) gaussSize = audioNorm.gaussSize;
      if (audioNorm.maxGain != null) maxGain = audioNorm.maxGain;
    }

    const enableAudioNorm = audioNorm && audioNorm.enable;

    let filterComplex = streams
      .map(({ start, cutFrom, cutTo }, i) => {
        const cutToArg = cutTo != null ? `:end=${cutTo}` : "";
        const apadArg = i > 0 ? ",apad" : "";
        return `[${i}:a]atrim=start=${cutFrom || 0}${cutToArg},adelay=delays=${Math.floor((start || 0) * 1000)}:all=1${apadArg}[a${i}]`;
      })
      .join(";");

    const volumeArg = outputVolume != null ? `,volume=${outputVolume}` : "";
    const audioNormArg = enableAudioNorm ? `,dynaudnorm=g=${gaussSize}:maxgain=${maxGain}` : "";
    
    filterComplex += `;${streams.map((_, i) => `[a${i}]`).join("")}amix=inputs=${streams.length}:duration=first:dropout_transition=0:weights=${streams.map(s => s.mixVolume != null ? s.mixVolume : 1).join(" ")}${audioNormArg}${volumeArg}`;

    const mixedAudioPath = join(this.tempDir, "audio-mixed.flac");
    const args = [
      "-nostdin",
      ...flatMap(streams, ({ path, loop }) => ["-stream_loop", (loop || 0).toString(), "-i", path]),
      "-vn",
      "-filter_complex", filterComplex,
      "-c:a", "flac",
      "-y", mixedAudioPath
    ];

    await ffmpeg(args);
    return mixedAudioPath;
  }

  /**
   * 编辑音频
   */
  async editAudio({ keepSourceAudio, clips, arbitraryAudio, clipsAudioVolume, audioNorm, outputVolume }) {
    if (clips.length === 0) {
      return undefined;
    }

    if (!(keepSourceAudio || arbitraryAudio.length > 0)) {
      return undefined;
    }

    console.log("从所有片段中提取音频/静音");
    
    // 混合每个片段的音频
    const clipAudio = await this.createMixedAudioClips({ clips, keepSourceAudio });
    
    // 如果只有静音片段且没有任意音频，返回无音频
    if (clipAudio.every(ca => ca.silent) && arbitraryAudio.length === 0) {
      return undefined;
    }

    // 合并和淡化片段音频
    const concatedClipAudioPath = await this.crossFadeConcatClipAudio(clipAudio);
    
    const streams = [
      { path: concatedClipAudioPath, mixVolume: clipsAudioVolume },
      ...arbitraryAudio
    ];

    console.log("混合片段音频与任意音频");
    
    if (streams.length < 2) {
      return concatedClipAudioPath;
    }

    const mixedFile = await this.mixArbitraryAudio({ streams, audioNorm, outputVolume });
    return mixedFile;
  }

  /**
   * 获取截取参数
   */
  getCutFromArgs({ cutFrom }) {
    return cutFrom ? ["-ss", cutFrom.toString()] : [];
  }
}

// 导出默认实例
export const audioProcessor = new AudioProcessor();
