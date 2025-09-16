import { readFile } from "fs/promises";
import { createCanvas, loadImage } from "canvas";

/**
 * 图像处理器 - 处理图像文件的加载和渲染
 */
export async function createImageElement(config) {
  const { source, width, height } = config;
  
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
      
      // 绘制图像
      ctx.drawImage(image, 0, 0, width, height);
      
      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, width, height);
      return Buffer.from(imageData.data);
    },
    
    async close() {
      image = null;
    }
  };
}
