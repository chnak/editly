import * as fabric from 'fabric/node';
import { createCanvas, ImageData } from 'canvas';
import { boxBlurImage } from '../BoxBlur.js';
// Fabric is used as a fundament for compositing layers in editly
export function canvasToRgba(ctx) {
    // We cannot use toBuffer('raw') because it returns pre-multiplied alpha data (a different format)
    // https://gamedev.stackexchange.com/questions/138813/whats-the-difference-between-alpha-and-premulalpha
    // https://github.com/Automattic/node-canvas#image-pixel-formats-experimental
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    return Buffer.from(imageData.data);
}
export function fabricCanvasToRgba(fabricCanvas) {
    const internalCanvas = fabricCanvas.getNodeCanvas();
    const ctx = internalCanvas.getContext('2d');
    // require('fs').writeFileSync(`${Math.floor(Math.random() * 1e12)}.png`, internalCanvas.toBuffer('image/png'));
    // throw new Error('abort');
    return canvasToRgba(ctx);
}
export function createFabricCanvas({ width, height }) {
    return new fabric.StaticCanvas(null, { width, height });
}
export async function renderFabricCanvas(canvas) {
    // console.time('canvas.renderAll');
    canvas.renderAll();
    // console.timeEnd('canvas.renderAll');
    const rgba = fabricCanvasToRgba(canvas);
    canvas.clear();
    canvas.dispose();
    return rgba;
}
export function toUint8ClampedArray(buffer) {
    // return Uint8ClampedArray.from(buffer);
    // Some people are finding that manual copying is orders of magnitude faster than Uint8ClampedArray.from
    // Since I'm getting similar times for both methods, then why not:
    const data = new Uint8ClampedArray(buffer.length);
    for (let i = 0; i < buffer.length; i += 1) {
        data[i] = buffer[i];
    }
    return data;
}
export async function rgbaToFabricImage({ width, height, rgba }) {
    const canvas = createCanvas(width, height);
    // FIXME: Fabric tries to add a class to this, but DOM is not defined. Because node?
    // https://github.com/fabricjs/fabric.js/issues/10032
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.classList = new Set();
    const ctx = canvas.getContext('2d');
    // https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData
    ctx.putImageData(new ImageData(toUint8ClampedArray(rgba), width, height), 0, 0);
    // https://stackoverflow.com/questions/58209996/unable-to-render-tiff-images-and-add-it-as-a-fabric-object
    return new fabric.FabricImage(canvas);
}
export async function createFabricFrameSource(func, options) {
    const { onRender = () => { }, onClose = () => { } } = await func({ fabric, ...options }) || {};
    return {
        readNextFrame: onRender,
        close: onClose,
    };
}
export async function createCustomCanvasFrameSource({ width, height, params }) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    const { onClose, onRender } = await params.func(({ width, height, canvas }));
    async function readNextFrame(progress) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        await onRender(progress);
        // require('fs').writeFileSync(`${new Date().getTime()}.png`, canvas.toBuffer('image/png'));
        // I don't know any way to draw a node-canvas as a layer on a fabric.js canvas, other than converting to rgba first:
        return canvasToRgba(context);
    }
    return {
        readNextFrame,
        // Node canvas needs no cleanup https://github.com/Automattic/node-canvas/issues/1216#issuecomment-412390668
        close: onClose,
    };
}
export async function blurImage({ mutableImg, width, height }) {
    mutableImg.set({ scaleX: width / mutableImg.width, scaleY: height / mutableImg.height });
    const canvas = mutableImg.toCanvasElement();
    const ctx = canvas.getContext('2d');
    const blurAmount = Math.min(100, Math.max(width, height) / 10); // More than 100 seems to cause issues
    const passes = 1;
    boxBlurImage(ctx, width, height, blurAmount, false, passes);
    return new fabric.FabricImage(canvas);
}
