import { createCanvas, ImageData } from "canvas";
import * as fabric from "fabric/node";

/**
 * Fabric.js 相关工具函数
 */

/**
 * 将 RGBA 缓冲区转换为 Fabric 图像
 * @param {Object} options - 选项
 * @param {number} options.width - 图像宽度
 * @param {number} options.height - 图像高度
 * @param {Buffer} options.rgba - RGBA 数据缓冲区
 * @returns {Promise<fabric.FabricImage>} Fabric 图像对象
 */
export async function rgbaToFabricImage({ width, height, rgba }) {
  const canvas = createCanvas(width, height);
  // 修复 Fabric 尝试添加类的问题
  canvas.classList = new Set();
  const ctx = canvas.getContext("2d");
  
  // 将 RGBA 数据转换为 ImageData 并绘制到画布
  ctx.putImageData(new ImageData(toUint8ClampedArray(rgba), width, height), 0, 0);
  
  return new fabric.FabricImage(canvas);
}

/**
 * 将 Uint8Array 转换为 Uint8ClampedArray
 * @param {Uint8Array|Buffer} buffer - 输入缓冲区
 * @returns {Uint8ClampedArray} 转换后的数组
 */
export function toUint8ClampedArray(buffer) {
  const data = new Uint8ClampedArray(buffer.length);
  for (let i = 0; i < buffer.length; i += 1) {
    data[i] = buffer[i];
  }
  return data;
}

/**
 * 从 Canvas 上下文获取 RGBA 数据
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @returns {Buffer} RGBA 数据缓冲区
 */
export function canvasToRgba(ctx) {
  // 不能使用 toBuffer('raw') 因为它返回预乘 alpha 数据（不同格式）
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  return Buffer.from(imageData.data);
}

/**
 * 从 Fabric Canvas 获取 RGBA 数据
 * @param {fabric.StaticCanvas} fabricCanvas - Fabric Canvas
 * @returns {Buffer} RGBA 数据缓冲区
 */
export function fabricCanvasToRgba(fabricCanvas) {
  const internalCanvas = fabricCanvas.getNodeCanvas();
  const ctx = internalCanvas.getContext("2d");
  return canvasToRgba(ctx);
}

/**
 * 创建 Fabric Canvas
 * @param {Object} options - 选项
 * @param {number} options.width - 画布宽度
 * @param {number} options.height - 画布高度
 * @returns {fabric.StaticCanvas} Fabric Canvas
 */
export function createFabricCanvas({ width, height }) {
  return new fabric.StaticCanvas(null, { width, height });
}

/**
 * 渲染 Fabric Canvas 并返回 RGBA 数据
 * @param {fabric.StaticCanvas} canvas - Fabric Canvas
 * @returns {Buffer} RGBA 数据
 */
export async function renderFabricCanvas(canvas) {
  canvas.renderAll();
  const rgba = fabricCanvasToRgba(canvas);
  canvas.clear();
  canvas.dispose();
  return rgba;
}

/**
 * 克隆 Fabric 图像
 * @param {fabric.FabricImage} img - 原始图像
 * @returns {fabric.FabricImage} 克隆的图像
 */
export function cloneFabricImage(img) {
  return img.cloneAsImage({});
}
