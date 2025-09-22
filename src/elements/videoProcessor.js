import { ffmpeg, readFileStreams } from "../utils/ffmpegUtils.js";
import { rawVideoToFrames, calculateVideoScale, getInputCodec, buildVideoFFmpegArgs, calculateVideoPosition } from "../utils/videoUtils.js";
import { rgbaToFabricImage } from "../utils/fabricUtils.js";
import { parsePositionValue } from "../utils/positionUtils.js";

/**
 * 视频处理器 - 处理视频文件的帧提取
 */
export async function createVideoElement(config) {
  const { 
    source, 
    width, 
    height, 
    fps, 
    fit = 'cover',
    cutFrom,
    cutTo,
    speedFactor = 1,
    loop = false,
    elementDuration = 0,
    containerWidth = 1280,
    containerHeight = 720
  } = config;
  
  
  // 解析宽度和高度，支持百分比值
  const parsedWidth = typeof width === 'string' 
    ? parsePositionValue(width, containerWidth, 'px')
    : width;
  const parsedHeight = typeof height === 'string'
    ? parsePositionValue(height, containerHeight, 'px')
    : height;
  
  // 获取视频流信息
  const streams = await readFileStreams(source);
  const firstVideoStream = streams.find(s => s.codec_type === "video");
  
  if (!firstVideoStream) {
    throw new Error(`无法找到视频流: ${source}`);
  }
  
  const inputWidth = firstVideoStream.width;
  const inputHeight = firstVideoStream.height;
  
  // 使用工具函数计算缩放参数
  const scaleParams = calculateVideoScale({
    inputWidth,
    inputHeight,
    requestedWidth: parsedWidth,
    requestedHeight: parsedHeight,
    resizeMode: fit
  });
  
  const { targetWidth, targetHeight, scaleFilter } = scaleParams;
  
  // 获取输入编解码器
  const inputCodec = getInputCodec(firstVideoStream.codec_name);
  
  // 构建 FFmpeg 参数
  const args = buildVideoFFmpegArgs({
    inputPath: source,
    inputCodec,
    cutFrom,
    cutTo,
    speedFactor,
    framerate: fps,
    scaleFilter
  });
  
  
  const controller = new AbortController();
  const transform = rawVideoToFrames({
    width: targetWidth,
    height: targetHeight,
    channels: 4,
    signal: controller.signal
  });
  
  const ps = ffmpeg(args, {
    encoding: "buffer",
    buffer: false,
    stdin: "ignore",
    stdout: { transform },
    stderr: process.stderr,
    forceKillAfterDelay: 1000,
    cancelSignal: controller.signal
  });
  
  // 处理错误
  ps.catch((err) => {
    if (!err.isCanceled) {
      throw err;
    }
  });
  
  // 转换为迭代器
  const iterator = ps.iterable();
  
  // 循环相关状态
  let frameBuffer = [];
  let currentFrameIndex = 0;
  let isBuffering = true;
  let videoDuration = 0;
  
  // 如果启用循环，先缓冲所有帧
  if (loop && elementDuration > 0) {
    try {
      // 计算视频实际时长
      if (cutFrom !== undefined && cutTo !== undefined) {
        videoDuration = (cutTo - cutFrom) / speedFactor;
      } else if (cutFrom !== undefined) {
        videoDuration = (firstVideoStream.duration - cutFrom) / speedFactor;
      } else if (cutTo !== undefined) {
        videoDuration = cutTo / speedFactor;
      } else {
        videoDuration = firstVideoStream.duration / speedFactor;
      }
      
      // 缓冲视频帧
      let frameCount = 0;
      while (true) {
        const { value: rgba, done } = await iterator.next();
        if (done) break;
        if (rgba) {
          frameBuffer.push(Buffer.from(rgba));
          frameCount++;
        }
      }
      
      isBuffering = false;
    } catch (error) {
      console.error("视频缓冲错误:", error);
      isBuffering = false;
    }
  }
  
  return {
    async readNextFrame(progress, canvas) {
      try {
        let rgba;
        
        if (loop && !isBuffering && frameBuffer.length > 0) {
          // 循环模式：从缓冲的帧中获取
          const frameIndex = Math.floor(progress * frameBuffer.length) % frameBuffer.length;
          rgba = frameBuffer[frameIndex];
        } else {
          // 正常模式：从迭代器获取
          const { value, done } = await iterator.next();
          if (done) {
            return null;
          }
          rgba = value;
        }
        
        if (!rgba) {
          return null;
        }
        
        // 转换为 Fabric 图像
        const img = await rgbaToFabricImage({
          width: targetWidth,
          height: targetHeight,
          rgba: Buffer.from(rgba)
        });
        
        // 计算位置偏移
        const position = calculateVideoPosition({
          resizeMode: fit,
          requestedWidth: width,
          requestedHeight: height,
          targetWidth,
          targetHeight,
          originX: 'center',
          originY: 'center'
        });
        
        // 设置图像属性 - 不设置位置，让上层处理
        img.set({
          originX: 'center',
          originY: 'center',
          left: position.centerOffsetX,
          top: position.centerOffsetY
        });
        
        // 不添加到画布，让上层处理
        
        return {
          data: Buffer.from(rgba),
          width: targetWidth,
          height: targetHeight
        };
        
      } catch (error) {
        console.error("视频帧读取错误:", error);
        return null;
      }
    },
    
    async close() {
      if (!ps.exitCode) {
        controller.abort();
      }
      // 清理缓冲
      frameBuffer = [];
    }
  };
}
