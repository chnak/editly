import { createCanvas as createNodeCanvas, ImageData } from "canvas";
import * as fabric from "fabric/node";

/**
 * 创建 Fabric 画布 - 使用真正的 Fabric.js
 */
export function createFabricCanvas({ width, height }) {
  return new fabric.StaticCanvas(null, { width, height });
}

/**
 * 渲染画布为 RGBA 数据 - 参考 editly 的实现
 */
export async function renderFabricCanvas(canvas) {
  // 参考 editly/core/sources/fabric.js 的 fabricCanvasToRgba 函数
  // 首先渲染所有对象到画布
  canvas.renderAll();
  
  const internalCanvas = canvas.getNodeCanvas();
  const ctx = internalCanvas.getContext("2d");
  
  // 参考 editly/core/sources/fabric.js 的 canvasToRgba 函数
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return Buffer.from(imageData.data);
}

/**
 * 将 RGBA 数据转换为 Fabric 图像对象 - 参考 editly 的实现
 */
export async function rgbaToFabricImage({ width, height, rgba }) {
  // 参考 editly/core/sources/fabric.js 的 rgbaToFabricImage 函数
  const canvas = createNodeCanvas(width, height);
  // FIXME: Fabric tries to add a class to this, but DOM is not defined. Because node?
  // https://github.com/fabricjs/fabric.js/issues/10032
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canvas.classList = new Set();
  const ctx = canvas.getContext("2d");
  
  // 参考 editly 的 toUint8ClampedArray 函数
  const data = new Uint8ClampedArray(rgba.length);
  for (let i = 0; i < rgba.length; i += 1) {
    data[i] = rgba[i];
  }
  
  // https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData
  ctx.putImageData(new ImageData(data, width, height), 0, 0);
  
  // https://stackoverflow.com/questions/58209996/unable-to-render-tiff-images-and-add-it-as-a-fabric-object
  return new fabric.FabricImage(canvas);
}
