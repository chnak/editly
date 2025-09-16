import { readFile } from "fs/promises";
import { createCanvas, loadImage } from "canvas";

/**
 * 图像处理器 - 处理图像文件的加载和渲染
 */
export async function createImageElement(config) {
  const { source, width, height, fit = 'cover' } = config;
  
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
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      
      // 根据适应模式绘制图像
      const imageAspect = image.width / image.height;
      const canvasAspect = width / height;
      
      let drawX = 0, drawY = 0, drawWidth = width, drawHeight = height;
      
      switch (fit) {
        case 'cover':
          // 覆盖整个画布，保持宽高比，可能裁剪
          if (imageAspect > canvasAspect) {
            drawWidth = height * imageAspect;
            drawHeight = height;
            drawX = (width - drawWidth) / 2;
          } else {
            drawWidth = width;
            drawHeight = width / imageAspect;
            drawY = (height - drawHeight) / 2;
          }
          break;
        case 'contain':
          // 完整显示图像，保持宽高比，可能有空白
          if (imageAspect > canvasAspect) {
            drawHeight = width / imageAspect;
            drawY = (height - drawHeight) / 2;
          } else {
            drawWidth = height * imageAspect;
            drawX = (width - drawWidth) / 2;
          }
          break;
        case 'fill':
          // 拉伸填满整个画布，不保持宽高比
          drawWidth = width;
          drawHeight = height;
          break;
        case 'scale-down':
          // 缩小以适应画布，保持宽高比
          if (image.width > width || image.height > height) {
            if (imageAspect > canvasAspect) {
              drawHeight = width / imageAspect;
              drawY = (height - drawHeight) / 2;
            } else {
              drawWidth = height * imageAspect;
              drawX = (width - drawWidth) / 2;
            }
          } else {
            drawWidth = image.width;
            drawHeight = image.height;
            drawX = (width - drawWidth) / 2;
            drawY = (height - drawHeight) / 2;
          }
          break;
      }
      
      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
      
      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, width, height);
      return {
        data: Buffer.from(imageData.data),
        width: width,
        height: height
      };
    },
    
    async close() {
      image = null;
    }
  };
}
