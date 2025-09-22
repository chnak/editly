import { createCanvas } from "canvas";
import { getPositionProps } from "../utils/positionUtils.js";

/**
 * 形状处理器 - 处理各种形状的渲染
 */
export async function createShapeElement(config) {
  const { 
    shape, 
    fillColor, 
    strokeColor, 
    strokeWidth, 
    shapeWidth, 
    shapeHeight, 
    width, 
    height,
    position = 'center',
    x = 0,
    y = 0,
    originX = 'center',
    originY = 'center'
  } = config;
  
  // 使用 getPositionProps 解析位置
  const positionProps = getPositionProps({
    position,
    x,
    y,
    width: width,
    height: height,
    originX,
    originY
  });
  
  return {
    async readNextFrame(progress, canvas) {
      // 创建画布
      const shapeCanvas = createCanvas(width, height);
      const ctx = shapeCanvas.getContext('2d');
      
      // 设置样式
      ctx.fillStyle = fillColor;
      if (strokeColor && strokeWidth > 0) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
      }
      
      // 使用解析后的位置
      const x = positionProps.left;
      const y = positionProps.top;
      
      // 绘制形状
      ctx.beginPath();
      
      switch (shape) {
        case 'rectangle':
          ctx.rect(x, y, shapeWidth, shapeHeight);
          break;
          
        case 'circle':
          const radius = Math.min(shapeWidth, shapeHeight) / 2;
          ctx.arc(x + shapeWidth / 2, y + shapeHeight / 2, radius, 0, 2 * Math.PI);
          break;
          
        case 'triangle':
          ctx.moveTo(x + shapeWidth / 2, y);
          ctx.lineTo(x, y + shapeHeight);
          ctx.lineTo(x + shapeWidth, y + shapeHeight);
          ctx.closePath();
          break;
          
        default:
          // 默认绘制矩形
          ctx.rect(x, y, shapeWidth, shapeHeight);
      }
      
      // 填充和描边
      if (fillColor) {
        ctx.fill();
      }
      if (strokeColor && strokeWidth > 0) {
        ctx.stroke();
      }
      
      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, width, height);
      return {
        data: Buffer.from(imageData.data),
        width: width,
        height: height,
        x: positionProps.left,
        y: positionProps.top,
        originX: positionProps.originX,
        originY: positionProps.originY
      };
    },
    
    async close() {
      // 清理资源
    }
  };
}
