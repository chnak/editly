import { Transform } from "stream";

/**
 * 视频处理工具函数
 */

/**
 * 将原始视频流转换为单独的帧
 * @param {Object} options - 选项
 * @param {number} options.width - 帧宽度
 * @param {number} options.height - 帧高度
 * @param {number} options.channels - 通道数（通常为4，RGBA）
 * @returns {Transform} 转换流
 */
export function rawVideoToFrames({ width, height, channels, ...options }) {
  const frameByteSize = width * height * channels;
  let buffer = new Uint8Array(frameByteSize);
  let bytesRead = 0;
  
  return new Transform({
    ...options,
    writableObjectMode: false,
    readableObjectMode: true,
    transform(chunk, _, callback) {
      let startAt = 0;
      // 在块中查找帧
      while (startAt < chunk.length) {
        const endAt = Math.min(startAt + frameByteSize - bytesRead, chunk.length);
        const bytesToRead = endAt - startAt;
        buffer.set(chunk.slice(startAt, endAt), bytesRead);
        bytesRead = (bytesRead + bytesToRead) % frameByteSize;
        
        if (bytesRead === 0) {
          // 发出帧
          this.push(buffer);
          // 重置数据缓冲区
          buffer = new Uint8Array(frameByteSize);
        }
        // 移动到下一帧
        startAt = endAt;
      }
      callback();
    },
  });
}

/**
 * 计算视频缩放参数
 * @param {Object} options - 选项
 * @param {number} options.inputWidth - 输入宽度
 * @param {number} options.inputHeight - 输入高度
 * @param {number} options.requestedWidth - 请求宽度
 * @param {number} options.requestedHeight - 请求高度
 * @param {string} options.resizeMode - 调整模式
 * @returns {Object} 缩放参数
 */
export function calculateVideoScale({ inputWidth, inputHeight, requestedWidth, requestedHeight, resizeMode = 'contain' }) {
  const inputAspectRatio = inputWidth / inputHeight;
  const canvasAspectRatio = requestedWidth / requestedHeight;
  
  let targetWidth = requestedWidth;
  let targetHeight = requestedHeight;
  let scaleFilter;
  
  switch (resizeMode) {
    case 'contain':
    case 'contain-blur':
      if (canvasAspectRatio > inputAspectRatio) {
        targetHeight = requestedHeight;
        targetWidth = Math.round(requestedHeight * inputAspectRatio);
      } else {
        targetWidth = requestedWidth;
        targetHeight = Math.round(requestedWidth / inputAspectRatio);
      }
      scaleFilter = `scale=${targetWidth}:${targetHeight}`;
      break;
      
    case 'cover':
      let scaledWidth, scaledHeight;
      if (canvasAspectRatio > inputAspectRatio) {
        scaledWidth = requestedWidth;
        scaledHeight = Math.round(requestedWidth / inputAspectRatio);
      } else {
        scaledHeight = requestedHeight;
        scaledWidth = Math.round(requestedHeight * inputAspectRatio);
      }
      scaleFilter = `scale=${scaledWidth}:${scaledHeight},crop=${requestedWidth}:${requestedHeight}`;
      break;
      
    case 'fill':
    case 'stretch':
      scaleFilter = `scale=${requestedWidth}:${requestedHeight}`;
      break;
      
    case 'scale-down':
      if (inputWidth > requestedWidth || inputHeight > requestedHeight) {
        if (canvasAspectRatio > inputAspectRatio) {
          targetHeight = requestedHeight;
          targetWidth = Math.round(requestedHeight * inputAspectRatio);
        } else {
          targetWidth = requestedWidth;
          targetHeight = Math.round(requestedWidth / inputAspectRatio);
        }
        scaleFilter = `scale=${targetWidth}:${targetHeight}`;
      } else {
        targetWidth = inputWidth;
        targetHeight = inputHeight;
        scaleFilter = `scale=${targetWidth}:${targetHeight}`;
      }
      break;
      
    default:
      scaleFilter = `scale=${requestedWidth}:${requestedHeight}`;
  }
  
  return {
    targetWidth,
    targetHeight,
    scaleFilter
  };
}

/**
 * 获取视频输入编解码器
 * @param {string} codecName - 编解码器名称
 * @returns {string|null} 输入编解码器
 */
export function getInputCodec(codecName) {
  switch (codecName) {
    case 'vp8':
      return 'libvpx';
    case 'vp9':
      return 'libvpx-vp9';
    default:
      return null;
  }
}

/**
 * 构建 FFmpeg 视频处理参数
 * @param {Object} options - 选项
 * @returns {Array} FFmpeg 参数数组
 */
export function buildVideoFFmpegArgs({
  inputPath,
  inputCodec,
  cutFrom,
  cutTo,
  speedFactor = 1,
  framerate,
  scaleFilter,
  outputFormat = 'rawvideo'
}) {
  const args = [
    '-nostdin',
    ...(inputCodec ? ['-vcodec', inputCodec] : []),
    ...(cutFrom ? ['-ss', cutFrom.toString()] : []),
    '-i', inputPath,
    ...(cutTo ? ['-t', ((cutTo - cutFrom) * speedFactor).toString()] : []),
    '-vf', `${speedFactor !== 1 ? `setpts=${speedFactor}*PTS,` : ''}fps=${framerate},${scaleFilter}`,
    '-map', 'v:0',
    '-vcodec', 'rawvideo',
    '-pix_fmt', 'rgba',
    '-f', outputFormat,
    '-'
  ];
  
  return args;
}

/**
 * 计算视频位置偏移
 * @param {Object} options - 选项
 * @returns {Object} 位置偏移
 */
export function calculateVideoPosition({
  resizeMode,
  requestedWidth,
  requestedHeight,
  targetWidth,
  targetHeight,
  originX = 'left',
  originY = 'top'
}) {
  let centerOffsetX = 0;
  let centerOffsetY = 0;
  
  if (resizeMode === 'contain' || resizeMode === 'contain-blur') {
    const dirX = originX === 'left' ? 1 : -1;
    const dirY = originY === 'top' ? 1 : 0;
    centerOffsetX = (dirX * (requestedWidth - targetWidth)) / 2;
    centerOffsetY = (dirY * (requestedHeight - targetHeight)) / 2;
  }
  
  return { centerOffsetX, centerOffsetY };
}
