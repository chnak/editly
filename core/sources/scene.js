import { defineFrameSource } from "../libs/index.js";
import { createLayerSource } from "./index.js";

// A composite frame source for a single scene.
// Params example:
// {
//   type: "scene",
//   duration: 3, // optional, fallback to max(elements.startTime + duration)
//   elements: [
//     { startTime: 0, duration: 3, layer: { type: "video", path: "..." } },
//     { /* if startTime omitted, treated as 0 */ duration: 2, layer: { type: "title", text: "..." } }
//   ]
// }
export default defineFrameSource("scene", async (options) => {
  const { width, height, channels, framerateStr, verbose, logTimes, params } = options;

  const elements = Array.isArray(params?.elements) ? params.elements : [];

  // Build child layer sources and compute scene duration
  let maxEndRel = 0;
  const childSources = [];
  for (const element of elements) {
    const elStart = (typeof element.startTime === "number") ? element.startTime : 0;
    const elDuration = element.duration;
    if (typeof elDuration !== "number") continue;
    maxEndRel = Math.max(maxEndRel, elStart + elDuration);

    // 支持扁平化结构：直接使用element作为layer参数，而不是element.layer
    const layerParams = element.layer || element;
    
    const child = await createLayerSource({
      width,
      height,
      channels,
      framerateStr,
      verbose,
      logTimes,
      params: layerParams,
    });
    childSources.push({ start: elStart, duration: elDuration, source: child });
  }

  const sceneDuration = (typeof params?.duration === "number") ? params.duration : maxEndRel || 0.00001;

  async function readNextFrame(progress, canvas) {
    // Clamp progress to [0,1] and map to local time
    const clamped = Math.max(0, Math.min(progress, 1));
    const time = clamped * sceneDuration;

    // Render elements whose window contains this time, in provided order
    for (const { start, duration, source } of childSources) {
      if (time >= start && time < start + duration) {
        const localProgress = (time - start) / duration;
        await source.readNextFrame(localProgress, canvas);
      }
    }
  }

  async function close() {
    await Promise.all(childSources.map(({ source }) => source?.close?.()));
  }

  return { readNextFrame, close };
});


