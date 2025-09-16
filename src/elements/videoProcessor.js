import { ffmpeg, readFileStreams } from "../utils/ffmpegUtils.js";
import { rawVideoToFrames, calculateVideoScale, getInputCodec, buildVideoFFmpegArgs, calculateVideoPosition } from "../utils/videoUtils.js";
import { rgbaToFabricImage } from "../utils/fabricUtils.js";

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
    left = 0,
    top = 0,
    originX = 'left',
    originY = 'top'
  } = config;
  
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
    requestedWidth: width,
    requestedHeight: height,
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
  
  return {
    async readNextFrame(progress, canvas) {
      try {
        const { value: rgba, done } = await iterator.next();
        
        if (done) {
          return null;
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
          originX,
          originY
        });
        
        // 设置图像属性
        img.set({
          originX,
          originY,
          left: left + position.centerOffsetX,
          top: top + position.centerOffsetY
        });
        
        // 添加到画布
        if (canvas) {
          canvas.add(img);
        }
        
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
    }
  };
}
