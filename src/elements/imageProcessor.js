import { readFile } from "fs/promises";
import { createCanvas, loadImage } from "canvas";
import { parsePositionValue } from "../utils/positionUtils.js";
import { boxBlurImage } from "../utils/BoxBlur.js";

/**
 * 图像处理器 - 处理图像文件的加载和渲染
 */
export async function createImageElement(config) {
  const { source, width, height, fit = 'cover', containerWidth, containerHeight } = config;
  

  // 宽度和高度已经在 ImageElement 中解析过了，直接使用
  // 但需要确保不为0
  const finalWidth = Math.max(width || 100, 1);
  const finalHeight = Math.max(height || 100, 1);
  
  let image = null;
  let blurredImage = null;
  
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
  
  // 如果适配模式是 contain-blur，创建模糊背景
  if (fit === 'contain-blur' && image) {
    try {
      // 创建临时画布来生成模糊背景
      const tempCanvas = createCanvas(finalWidth, finalHeight);
      const tempCtx = tempCanvas.getContext('2d');
      
      // 模糊背景直接拉伸到目标尺寸（参考 editly 的原始实现）
      tempCtx.drawImage(image, 0, 0, finalWidth, finalHeight);
      
      // 应用模糊效果
      const blurAmount = Math.min(100, Math.max(finalWidth, finalHeight) / 10);
      boxBlurImage(tempCtx, finalWidth, finalHeight, blurAmount, false, 1);
      
      // 将模糊后的图像转换为 RGBA 数据
      const imageData = tempCtx.getImageData(0, 0, finalWidth, finalHeight);
      blurredImage = {
        data: Buffer.from(imageData.data),
        width: finalWidth,
        height: finalHeight
      };
    } catch (error) {
      console.warn(`创建模糊背景失败: ${source}`, error);
    }
  }
  
  return {
    async readNextFrame(progress) {
      if (!image) {
        return null;
      }
      
      // 如果适配模式是 contain-blur，返回背景和前景图像
      if (fit === 'contain-blur' && blurredImage) {
        // 创建前景图像（contain 模式）
        const foregroundCanvas = createCanvas(finalWidth, finalHeight);
        const foregroundCtx = foregroundCanvas.getContext('2d');
        
        // contain 模式：计算缩放比例，确保图片完全显示在画布内
        const scaleX = finalWidth / image.width;
        const scaleY = finalHeight / image.height;
        const scale = Math.min(scaleX, scaleY); // 选择较小的缩放比例
        
        // 计算缩放后的尺寸
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        
        // 计算居中位置
        const drawX = (finalWidth - drawWidth) / 2;
        const drawY = (finalHeight - drawHeight) / 2;
        
        foregroundCtx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        
        const foregroundImageData = foregroundCtx.getImageData(0, 0, finalWidth, finalHeight);
        
        return {
          background: blurredImage,
          foreground: {
            data: Buffer.from(foregroundImageData.data),
            width: finalWidth,
            height: finalHeight
          },
          width: finalWidth,
          height: finalHeight
        };
      }
      
      // 创建画布
      const canvas = createCanvas(finalWidth, finalHeight);
      const ctx = canvas.getContext('2d');
      
      // 根据适应模式绘制图像
      const imageAspect = image.width / image.height;
      const canvasAspect = finalWidth / finalHeight;
      
      let drawX = 0, drawY = 0, drawWidth = finalWidth, drawHeight = finalHeight;
      
      switch (fit) {
        case 'cover':
          // 覆盖整个画布，保持宽高比，可能裁剪
          if (imageAspect > canvasAspect) {
            drawWidth = finalHeight * imageAspect;
            drawHeight = finalHeight;
            drawX = (finalWidth - drawWidth) / 2;
          } else {
            drawWidth = finalWidth;
            drawHeight = finalWidth / imageAspect;
            drawY = (finalHeight - drawHeight) / 2;
          }
          break;
        case 'contain':
          // 完整显示图像，保持宽高比，可能有空白
          if (imageAspect > canvasAspect) {
            drawHeight = finalWidth / imageAspect;
            drawY = (finalHeight - drawHeight) / 2;
          } else {
            drawWidth = finalHeight * imageAspect;
            drawX = (finalWidth - drawWidth) / 2;
          }
          break;
        case 'fill':
          // 拉伸填满整个画布，不保持宽高比
          drawWidth = finalWidth;
          drawHeight = finalHeight;
          break;
        case 'scale-down':
          // 缩小以适应画布，保持宽高比
          if (image.width > finalWidth || image.height > finalHeight) {
            if (imageAspect > canvasAspect) {
              drawHeight = finalWidth / imageAspect;
              drawY = (finalHeight - drawHeight) / 2;
            } else {
              drawWidth = finalHeight * imageAspect;
              drawX = (finalWidth - drawWidth) / 2;
            }
          } else {
            drawWidth = image.width;
            drawHeight = image.height;
            drawX = (finalWidth - drawWidth) / 2;
            drawY = (finalHeight - drawHeight) / 2;
          }
          break;
      }
      
      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
      
      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, finalWidth, finalHeight);
      return {
        data: Buffer.from(imageData.data),
        width: finalWidth,
        height: finalHeight
      };
    },
    
    async close() {
      image = null;
    }
  };
}
