/**
 * A public API for defining new frame sources.
 */
export function defineFrameSource(type, setup) {
    return {
        type,
        async setup(options) {
            return new FrameSource(options, await setup(options));
        },
    };
}
export class FrameSource {
    options;
    implementation;
    constructor(options, implementation) {
        this.options = options;
        this.implementation = implementation;
    }
    async readNextFrame(time, canvas) {
        const { start, layerDuration } = this.layer;
        const offsetTime = time - (start ?? 0);
        const offsetProgress = offsetTime / layerDuration;
        const shouldDrawLayer = offsetProgress >= 0 && offsetProgress <= 1;
        // Skip drawing if the layer has not started or has already ended
        if (!shouldDrawLayer)
            return;
        return await this.implementation.readNextFrame(offsetProgress, canvas, offsetTime);
    }
    async close() {
        await this.implementation.close?.();
    }
    get layer() {
        return this.options.params;
    }
}
