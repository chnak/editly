import assert from "assert";
import { merge } from "lodash-es";
import { nanoid } from "nanoid";
import { dirname, join } from "path";
import { expandLayerAliases } from "./sources/index.js";
const globalDefaults = {
    duration: 4,
    transition: {
        duration: 0.5,
        name: "random",
        audioOutCurve: "tri",
        audioInCurve: "tri",
    },
};
export class Configuration {
    clips;
    outPath;
    tmpDir;
    allowRemoteRequests;
    customOutputArgs;
    defaults;
    // Video
    width;
    height;
    fps;
    // Audio
    audioFilePath;
    backgroundAudioVolume;
    loopAudio;
    keepSourceAudio;
    audioNorm;
    outputVolume;
    clipsAudioVolume;
    audioTracks;
    // Debug
    enableFfmpegLog;
    verbose;
    logTimes;
    keepTmp;
    fast;
    ffmpegPath;
    ffprobePath;
    constructor(input) {
        assert(input.outPath, "Please provide an output path");
        assert(Array.isArray(input.clips) && input.clips.length > 0, "Please provide at least 1 clip");
        assert(!input.customOutputArgs || Array.isArray(input.customOutputArgs), "customOutputArgs must be an array of arguments");
        this.outPath = input.outPath;
        this.width = input.width;
        this.height = input.height;
        this.fps = input.fps;
        this.audioFilePath = input.audioFilePath;
        this.backgroundAudioVolume = input.backgroundAudioVolume;
        this.loopAudio = input.loopAudio;
        this.clipsAudioVolume = input.clipsAudioVolume ?? 1;
        this.audioTracks = input.audioTracks ?? [];
        this.keepSourceAudio = input.keepSourceAudio;
        this.allowRemoteRequests = input.allowRemoteRequests ?? false;
        this.audioNorm = input.audioNorm;
        this.outputVolume = input.outputVolume;
        this.customOutputArgs = input.customOutputArgs;
        this.defaults = merge({}, globalDefaults, input.defaults);
        this.clips = input.clips.map((clip) => {
            let { layers } = clip;
            if (layers && !Array.isArray(layers))
                layers = [layers]; // Allow single layer for convenience
            assert(Array.isArray(layers) && layers.length > 0, "clip.layers must be an array with at least one layer.");
            layers = layers
                .map(expandLayerAliases)
                .flat()
                .map((layer) => {
                assert(layer.type, 'All "layers" must have a type');
                return merge({}, this.defaults.layer ?? {}, this.defaults.layerType?.[layer.type] ?? {}, layer);
            });
            const { transition } = merge({}, this.defaults, clip);
            assert(transition == null || typeof transition === "object", "Transition must be an object");
            return { transition, layers, duration: clip.duration };
        });
        // Testing options:
        this.verbose = input.verbose ?? false;
        this.enableFfmpegLog = input.enableFfmpegLog ?? this.verbose;
        this.logTimes = input.logTimes ?? false;
        this.keepTmp = input.keepTmp ?? false;
        this.fast = input.fast ?? false;
        this.ffmpegPath = input.ffmpegPath ?? "ffmpeg";
        this.ffprobePath = input.ffprobePath ?? "ffprobe";
        this.tmpDir = join(this.outDir, `editly-tmp-${nanoid()}`);
    }
    get outDir() {
        return dirname(this.outPath);
    }
    get isGif() {
        return this.outPath.toLowerCase().endsWith(".gif");
    }
}
