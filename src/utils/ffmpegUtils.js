
import assert from "assert";
import { execa } from "execa";
import fsExtra from "fs-extra";
const config = {
    ffmpegPath: "ffmpeg",
    ffprobePath: "ffprobe",
    enableFfmpegLog: false,
};



/**
 * 获取 FFmpeg 通用参数
 * @returns {Array} 通用参数数组
 */
export function getFfmpegCommonArgs() {
  return ["-hide_banner", ...(config.enableFfmpegLog ? [] : ["-loglevel", "error"])];
}

/**
 * 测试 FFmpeg 可执行文件
 * @param {string} exePath - 可执行文件路径
 * @param {string} name - 名称
 * @returns {Promise<boolean>} 是否可用
 */
export async function testFf(exePath, name) {
  try {
    const { stdout } = await execa(exePath, ['-version']);
    
    // 简单检查是否能正常运行，不严格检查版本
    if (stdout.includes('ffmpeg') || stdout.includes('version')) {
      console.log(`✅ ${name} 检测通过`);
      return true;
    }
    
    throw new Error('无法识别 ffmpeg 输出');
    
  } catch (err) {
    console.warn(`⚠️  ${name} 检测警告:`, err.message);
    return false;
  }
}

/**
 * 配置 FFmpeg 参数
 * @param {Object} params - 配置参数
 */
export async function configureFf(params) {
  Object.assign(config, params);
  await testFf(config.ffmpegPath, "ffmpeg");
  await testFf(config.ffprobePath, "ffprobe");
}

/**
 * 运行 FFmpeg 命令
 * @param {Array} args - 参数数组
 * @param {Object} options - 选项
 * @returns {Object} 进程对象
 */
export function ffmpeg(args, options) {
  if (config.enableFfmpegLog)
    console.log(`$ ${config.ffmpegPath} ${args.join(" ")}`);
  return execa(config.ffmpegPath, [...getFfmpegCommonArgs(), ...args], options);
}

/**
 * 运行 FFprobe 命令
 * @param {Array} args - 参数数组
 * @returns {Object} 进程对象
 */
export function ffprobe(args) {
  return execa(config.ffprobePath, args);
}

/**
 * 读取文件流信息
 * @param {string} path - 文件路径
 * @returns {Promise<Array>} 流信息数组
 */
export async function readFileStreams(path) {
  const { stdout } = await ffprobe([
    "-v", "quiet",
    "-print_format", "json",
    "-show_streams",
    path
  ]);
  
  const data = JSON.parse(stdout);
  return data.streams || [];
}

/**
 * 获取视频信息
 * @param {string} path - 视频文件路径
 * @returns {Promise<Object>} 视频信息
 */
export async function getVideoInfo(path) {
  const streams = await readFileStreams(path);
  const videoStream = streams.find(s => s.codec_type === "video");
  
  if (!videoStream) {
    throw new Error(`无法找到视频流: ${path}`);
  }
  
  return {
    width: videoStream.width,
    height: videoStream.height,
    duration: parseFloat(videoStream.duration),
    fps: eval(videoStream.r_frame_rate),
    codec: videoStream.codec_name,
    bitrate: videoStream.bit_rate
  };
}


export function getCutFromArgs({ cutFrom }) {
    return cutFrom ? ["-ss", cutFrom.toString()] : [];
}
export function getCutToArgs({ cutTo, cutFrom, speedFactor, }) {
    return cutFrom && cutTo ? ["-t", (cutTo - cutFrom) * speedFactor] : [];
}
export async function createConcatFile(segments, concatFilePath) {
    // https://superuser.com/questions/787064/filename-quoting-in-ffmpeg-concat
    await fsExtra.writeFile(concatFilePath, segments.map((seg) => `file '${seg.replace(/'/g, "'\\''")}'`).join("\n"));
}


export function parseFps(fps) {
    const match = typeof fps === "string" && fps.match(/^([0-9]+)\/([0-9]+)$/);
    if (match) {
        const num = parseInt(match[1], 10);
        const den = parseInt(match[2], 10);
        if (den > 0)
            return num / den;
    }
    return undefined;
}

export async function readDuration(p) {
    const { stdout } = await ffprobe([
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        p,
    ]);
    const parsed = parseFloat(stdout);
    assert(!Number.isNaN(parsed));
    return parsed;
}

export async function readVideoFileInfo(p) {
    const streams = await readFileStreams(p);
    const stream = streams.find((s) => s.codec_type === "video"); // TODO
    if (!stream) {
        throw new Error(`Could not find a video stream in ${p}`);
    }
    const duration = await readDuration(p);
    let rotation = parseInt(stream.tags?.rotate ?? "", 10);
    // If we can't find rotation, try side_data_list
    if (Number.isNaN(rotation) && stream.side_data_list?.[0]?.rotation) {
        rotation = parseInt(stream.side_data_list[0].rotation, 10);
    }
    return {
        // numFrames: parseInt(stream.nb_frames, 10),
        duration,
        width: stream.width, // TODO coded_width?
        height: stream.height,
        framerateStr: stream.r_frame_rate,
        rotation: !Number.isNaN(rotation) ? rotation : undefined,
    };
}
