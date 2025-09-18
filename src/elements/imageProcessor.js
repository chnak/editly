import { readFile } from "fs/promises";
import { createCanvas, loadImage } from "canvas";
import { parsePositionValue } from "../utils/positionUtils.js";

/**
 * 图像处理器 - 处理图像文件的加载和渲染
 */
export async function createImageElement(config) {
  const { source, width, height, fit = 'cover', containerWidth, containerHeight } = config;

  // 解析宽度和高度，支持百分比值
  const parsedWidth = typeof width === 'string' 
    ? parsePositionValue(width, containerWidth || 1280, 'px')
    : width;
  const parsedHeight = typeof height === 'string'
    ? parsePositionValue(height, containerHeight || 720, 'px')
    : height;
  
  let image = null;
  
  try {
    // 加载图像
    if (typeof source === 'string') {
      image = await loadImage(source);
    } else if (source instanceof Buffer) {
      image = await loadImage(source);
    }
  } catch (error) {
    console.warn(`加载图像失败: ${source}`, error);
  }
  
  return {
    async readNextFrame(progress) {
      if (!image) {
        return null;
      }
      
      // 创建画布
      const canvas = createCanvas(parsedWidth, parsedHeight);
      const ctx = canvas.getContext('2d');
      
      // 根据适应模式绘制图像
      const imageAspect = image.width / image.height;
      const canvasAspect = parsedWidth / parsedHeight;
      
      let drawX = 0, drawY = 0, drawWidth = parsedWidth, drawHeight = parsedHeight;
      
      switch (fit) {
        case 'cover':
          // 覆盖整个画布，保持宽高比，可能裁剪
          if (imageAspect > canvasAspect) {
            drawWidth = parsedHeight * imageAspect;
            drawHeight = parsedHeight;
            drawX = (parsedWidth - drawWidth) / 2;
          } else {
            drawWidth = parsedWidth;
            drawHeight = parsedWidth / imageAspect;
            drawY = (parsedHeight - drawHeight) / 2;
          }
          break;
        case 'contain':
          // 完整显示图像，保持宽高比，可能有空白
          if (imageAspect > canvasAspect) {
            drawHeight = parsedWidth / imageAspect;
            drawY = (parsedHeight - drawHeight) / 2;
          } else {
            drawWidth = parsedHeight * imageAspect;
            drawX = (parsedWidth - drawWidth) / 2;
          }
          break;
        case 'fill':
          // 拉伸填满整个画布，不保持宽高比
          drawWidth = parsedWidth;
          drawHeight = parsedHeight;
          break;
        case 'scale-down':
          // 缩小以适应画布，保持宽高比
          if (image.width > parsedWidth || image.height > parsedHeight) {
            if (imageAspect > canvasAspect) {
              drawHeight = parsedWidth / imageAspect;
              drawY = (parsedHeight - drawHeight) / 2;
            } else {
              drawWidth = parsedHeight * imageAspect;
              drawX = (parsedWidth - drawWidth) / 2;
            }
          } else {
            drawWidth = image.width;
            drawHeight = image.height;
            drawX = (parsedWidth - drawWidth) / 2;
            drawY = (parsedHeight - drawHeight) / 2;
          }
          break;
      }
      
      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
      
      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, parsedWidth, parsedHeight);
      return {
        data: Buffer.from(imageData.data),
        width: parsedWidth,
        height: parsedHeight
      };
    },
    
    async close() {
      image = null;
    }
  };
}
