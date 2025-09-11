import assert from "assert";
import { registerFont } from "canvas";
import flatMap from "lodash-es/flatMap.js";
import pMap from "p-map";
import { basename } from "path";
import { readDuration, readVideoFileInfo } from "./ffmpeg.js";
import { Transition } from "./transition.js";
import { assertFileValid } from "./utils/util.js";

// Cache for loaded fonts
const loadedFonts = [];

/**
 * Validates arbitrary audio configuration
 */
async function validateArbitraryAudio(audio, allowRemoteRequests) {
    assert(audio === undefined || Array.isArray(audio));
    
    if (!audio) return;

    for (const { path, cutFrom, cutTo, start } of audio) {
        await assertFileValid(path, allowRemoteRequests);
        
        if (cutFrom != null && cutTo != null) {
            assert(cutTo > cutFrom, "cutTo must be greater than cutFrom");
        }
        
        if (cutFrom != null) {
            assert(cutFrom >= 0, "cutFrom must be non-negative");
        }
        
        if (cutTo != null) {
            assert(cutTo >= 0, "cutTo must be non-negative");
        }
        
        assert(
            start == null || start >= 0, 
            `Invalid "start" value: ${start}. Must be non-negative`
        );
    }
}

/**
 * Handles different layer types and processes them accordingly
 */
async function processLayer(layer, allowRemoteRequests) {
    // Validate file-based layers
    if (["image", "image-overlay"].includes(layer.type)) {
        await assertFileValid(layer.path, allowRemoteRequests);
        return layer;
    }
    
    if (layer.type === "gl") {
        await assertFileValid(layer.fragmentPath, allowRemoteRequests);
        return layer;
    }
    
    if (["fabric", "canvas"].includes(layer.type)) {
        assert(typeof layer.func === "function", '"func" must be a function');
        return layer;
    }
    
    if ([
        "radial-gradient", 
        "linear-gradient", 
        "fill-color"
    ].includes(layer.type)) {
        return layer;
    }
    
    // Handle text-based layers
    if (["title", "subtitle", "news-title", "slide-in-text"].includes(layer.type)) {
        const { fontPath, ...rest } = layer;
        assert(rest.text, "Text property is required for text layers");
        
        let fontFamily = rest.fontFamily;
        
        if (fontPath) {
            fontFamily = Buffer.from(basename(fontPath)).toString("base64");
            
            if (!loadedFonts.includes(fontFamily)) {
                registerFont(fontPath, { 
                    family: fontFamily, 
                    weight: "regular", 
                    style: "normal" 
                });
                loadedFonts.push(fontFamily);
            }
        }
        
        return { ...rest, fontFamily };
    }
    
    // Handle video and audio layers (processed later)
    if (["video", "audio", "detached-audio"].includes(layer.type)) {
        return layer;
    }
    
    throw new Error(`Invalid layer type: ${layer.type}`);
}

/**
 * Processes video layer to extract metadata and calculate timing
 */
async function processVideoLayer(layer) {
    const { 
        duration: fileDuration, 
        width: widthIn, 
        height: heightIn, 
        framerateStr, 
        rotation 
    } = await readVideoFileInfo(layer.path);
    
    let { cutFrom = 0, cutTo = fileDuration } = layer;
    
    // Validate and adjust cut points
    cutFrom = Math.max(0, Math.min(cutFrom, fileDuration));
    cutTo = Math.max(cutFrom, Math.min(cutTo, fileDuration));
    
    assert(cutFrom < cutTo, "cutFrom must be lower than cutTo");
    
    const layerDuration = cutTo - cutFrom;
    const isRotated = rotation && [-90, 90, 270, -270].includes(rotation);
    const inputWidth = isRotated ? heightIn : widthIn;
    const inputHeight = isRotated ? widthIn : heightIn;
    
    return {
        ...layer,
        cutFrom,
        cutTo,
        layerDuration,
        framerateStr,
        inputWidth,
        inputHeight
    };
}

/**
 * Processes audio layer to calculate timing and speed factors
 */
async function processAudioLayer(layer, clipDuration) {
    const fileDuration = await readDuration(layer.path);
    
    let { cutFrom = 0, cutTo = cutFrom + clipDuration } = layer;
    
    // Validate and adjust cut points
    cutFrom = Math.max(0, Math.min(cutFrom, fileDuration));
    cutTo = Math.max(cutFrom, Math.min(cutTo, fileDuration));
    
    assert(cutFrom < cutTo, "cutFrom must be lower than cutTo");
    
    const layerDuration = cutTo - cutFrom;
    const speedFactor = clipDuration / layerDuration;
    
    return {
        ...layer,
        cutFrom,
        cutTo,
        speedFactor
    };
}

/**
 * Processes a single clip and its layers
 */
async function processClip(clip, clipIndex, totalClips, defaults, allowRemoteRequests) {
    const { layers, duration: clipDuration, transition: transitionConfig } = clip;
    const transition = new Transition(transitionConfig, clipIndex === totalClips - 1);

    // Process all layers
    const processedLayers = await pMap(layers, async (layer) => {
        return processLayer(layer, allowRemoteRequests);
    }, { concurrency: 1 });
    
    // Calculate clip duration if not provided
    const resolvedClipDuration = clipDuration || 
        processedLayers.find(layer => layer.type === "video")?.layerDuration || 
        defaults.duration;
    
    assert(resolvedClipDuration, `Duration parameter is required for videoless clip ${clipIndex}`);

    // Process layers with timing information
    const layersWithTiming = await pMap(processedLayers, async (layer) => {
        if (!layer) return null;
        
        const startTime = layer.start || 0;
        const endTime = layer.stop || (startTime+layer.layerDuration) //resolvedClipDuration;
        const layerDuration = endTime - startTime;

        // Validate layer timing
        assert(
            layerDuration > 0 && layerDuration <= resolvedClipDuration, 
            `Invalid start ${startTime} or stop ${endTime} for clip duration ${resolvedClipDuration}`
        );
        
        const layerWithTiming = { ...layer, start: startTime, layerDuration };
        
        // Process specific layer types
        if (layerWithTiming.type === "video") {
            const processedVideoLayer = await processVideoLayer(layerWithTiming);
            const speedFactor = resolvedClipDuration / processedVideoLayer.layerDuration;
            return { ...processedVideoLayer, speedFactor };
        }
        
        if (layerWithTiming.type === "audio") {
            return processAudioLayer(layerWithTiming, resolvedClipDuration);
        }
        
        return layerWithTiming;
    });
    
    // Filter out null layers and detached audio
    const filteredLayers = layersWithTiming.filter(layer => 
        layer && layer.type !== "detached-audio"
    );
    
    // Collect detached audio
    const detachedAudio = processedLayers
        .filter(layer => layer && layer.type === "detached-audio")
        .map(({ start = 0, ...rest }) => ({ ...rest, clipIndex, start }));
    
    return {
        transition,
        duration: resolvedClipDuration,
        layers: filteredLayers,
        detachedAudio
    };
}

/**
 * Main function to parse configuration
 */
export default async function parseConfig({
    clips,
    arbitraryAudio: arbitraryAudioIn,
    backgroundAudioPath,
    backgroundAudioVolume,
    loopAudio,
    allowRemoteRequests,
    defaults,
}) {
    // Process all clips
    const processedClips = await pMap(
        clips, 
        (clip, index) => processClip(clip, index, clips.length, defaults, allowRemoteRequests),
        { concurrency: 1 }
    );
    
    // Calculate safe transition durations and collect detached audio
    let totalClipDuration = 0;
    const allDetachedAudio = [];
    const finalClips = [];
    
    for (let i = 0; i < processedClips.length; i++) {
        const clip = processedClips[i];
        const nextClip = processedClips[i + 1];
        
        // Calculate safe transition duration
        let safeTransitionDuration = 0;
        if (nextClip) {
            safeTransitionDuration = Math.min(
                clip.duration / 2,
                nextClip.duration / 2,
                clip.transition.duration
            );
        }
        
        // Add detached audio with global timing
        for (const audio of clip.detachedAudio) {
            allDetachedAudio.push({
                ...audio,
                start: totalClipDuration + audio.start
            });
        }
        
        // Update total duration and transition
        totalClipDuration += clip.duration - safeTransitionDuration;
        finalClips.push({
            ...clip,
            transition: {
                ...clip.transition,
                duration: safeTransitionDuration
            }
        });
    }
    
    // Prepare arbitrary audio
    const arbitraryAudio = [
        // Background audio
        ...(backgroundAudioPath ? [{
            path: backgroundAudioPath,
            mixVolume: backgroundAudioVolume ?? 1,
            loop: loopAudio ? -1 : 0,
        }] : []),
        
        // User-provided audio
        ...(arbitraryAudioIn || []),
        
        // Detached audio from clips
        ...allDetachedAudio
    ];
    
    // Validate audio
    await validateArbitraryAudio(arbitraryAudio, allowRemoteRequests);
    
    return {
        clips: finalClips,
        arbitraryAudio
    };
}