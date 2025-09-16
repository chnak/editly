import { execa } from "execa";

/**
 * FFmpeg 工具函数
 */

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
