import assert from "assert";
import * as fabric from "fabric/node";
import fileUrl from "file-url";
import { pathExists } from "fs-extra";
import { sortBy } from "lodash-es";
export function toArrayInteger(buffer) {
    if (buffer.length > 0) {
        const data = new Uint8ClampedArray(buffer.length);
        for (let i = 0; i < buffer.length; i += 1) {
            data[i] = buffer[i];
        }
        return data;
    }
    return [];
}
// x264 requires multiple of 2
export const multipleOf2 = (x) => Math.round(x / 2) * 2;
export function getPositionProps({ position, width, height, }) {
    let originY = "center";
    let originX = "center";
    let top = height / 2;
    let left = width / 2;
    const margin = 0.05;
    if (typeof position === "string") {
        if (position === "top") {
            originY = "top";
            top = height * margin;
        }
        else if (position === "bottom") {
            originY = "bottom";
            top = height * (1 - margin);
        }
        else if (position === "center") {
            originY = "center";
            top = height / 2;
        }
        else if (position === "top-left") {
            originX = "left";
            originY = "top";
            left = width * margin;
            top = height * margin;
        }
        else if (position === "top-right") {
            originX = "right";
            originY = "top";
            left = width * (1 - margin);
            top = height * margin;
        }
        else if (position === "center-left") {
            originX = "left";
            originY = "center";
            left = width * margin;
            top = height / 2;
        }
        else if (position === "center-right") {
            originX = "right";
            originY = "center";
            left = width * (1 - margin);
            top = height / 2;
        }
        else if (position === "bottom-left") {
            originX = "left";
            originY = "bottom";
            left = width * margin;
            top = height * (1 - margin);
        }
        else if (position === "bottom-right") {
            originX = "right";
            originY = "bottom";
            left = width * (1 - margin);
            top = height * (1 - margin);
        }
    }
    else {
        if (position?.x != null) {
            originX = position.originX || "left";
            left = width * position.x;
        }
        if (position?.y != null) {
            originY = position.originY || "top";
            top = height * position.y;
        }
    }
    return { originX, originY, top, left };
}
export function getFrameByKeyFrames(keyframes, progress) {
    if (keyframes.length < 2)
        throw new Error("Keyframes must be at least 2");
    
    const sortedKeyframes = sortBy(keyframes, "t");
    
    // 检查关键帧时间是否有效
    const invalidKeyframe = sortedKeyframes.find((k, i) => {
        if (i === 0) return false;
        return k.t === sortedKeyframes[i - 1].t;
    });
    if (invalidKeyframe)
        throw new Error("Invalid keyframe: duplicate time values");
    
    // 确保进度在有效范围内
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    // 找到当前进度所在的关键帧区间
    let prevKeyframe = sortedKeyframes[0];
    let nextKeyframe = sortedKeyframes[sortedKeyframes.length - 1];
    
    for (let i = 0; i < sortedKeyframes.length - 1; i++) {
        if (clampedProgress >= sortedKeyframes[i].t && clampedProgress <= sortedKeyframes[i + 1].t) {
            prevKeyframe = sortedKeyframes[i];
            nextKeyframe = sortedKeyframes[i + 1];
            break;
        }
    }
    
    // 计算当前区间的effectProgress (0-1)
    let effectProgress = 0;
    const timeDiff = nextKeyframe.t - prevKeyframe.t;
    
    if (timeDiff > 0) {
        effectProgress = (clampedProgress - prevKeyframe.t) / timeDiff;
        effectProgress = Math.max(0, Math.min(1, effectProgress)); // 确保在0-1之间
    } else if (clampedProgress >= prevKeyframe.t) {
        effectProgress = 1; // 如果时间相同，且进度>=关键帧时间，设为1
    }
    
    // 插值计算属性值
    const data = Object.fromEntries(Object.entries(prevKeyframe.props).map(([propName, prevVal]) => {
        const nextVal = nextKeyframe.props[propName];
        
        // 确保值是数字才进行插值
        if (typeof prevVal === 'number' && typeof nextVal === 'number') {
            return [propName, prevVal + (nextVal - prevVal) * effectProgress];
        } else {
            // 非数字值直接使用下一个关键帧的值
            return [propName, nextVal];
        }
    }));
    
    // 返回属性数据和effectProgress
    return {
        ...data,
        _effectProgress: effectProgress,
        _currentSegment: { 
            start: prevKeyframe.t, 
            end: nextKeyframe.t,
            prevKeyframe: prevKeyframe.props,
            nextKeyframe: nextKeyframe.props
        }
    };
}
export const isUrl = (path) => /^https?:\/\//.test(path);
export const assertFileValid = async (path, allowRemoteRequests) => {
    if (isUrl(path)) {
        assert(allowRemoteRequests, "Remote requests are not allowed");
        return;
    }
    assert(await pathExists(path), `File does not exist ${path}`);
};
export const loadImage = (pathOrUrl) => fabric.util.loadImage(isUrl(pathOrUrl) ? pathOrUrl : fileUrl(pathOrUrl));
export const defaultFontFamily = "sans-serif";
export function getZoomParams({ progress, zoomDirection, zoomAmount = 0.1, }) {
    let scaleFactor = 1;
    if (zoomDirection === "left" || zoomDirection === "right")
        return 1.3 + zoomAmount;
    if (zoomDirection === "in")
        scaleFactor = 1 + zoomAmount * progress;
    else if (zoomDirection === "out")
        scaleFactor = 1 + zoomAmount * (1 - progress);
    return scaleFactor;
}
export function getTranslationParams({ progress, zoomDirection, zoomAmount = 0.1, }) {
    let translation = 0;
    const range = zoomAmount * 1000;
    if (zoomDirection === "right")
        translation = progress * range - range / 2;
    else if (zoomDirection === "left")
        translation = -(progress * range - range / 2);
    return translation;
}
export function getRekt(width, height) {
    // width and height with room to rotate
    return new fabric.Rect({
        originX: "center",
        originY: "center",
        left: width / 2,
        top: height / 2,
        width: width * 2,
        height: height * 2,
    });
}
