import assert from "assert";
import { join } from "path";
import { fileURLToPath } from "url";
import canvas from "./canvas.js";
import fabric from "./fabric.js";
import fillColor from "./fill-color.js";
import gl from "./gl.js";
import imageOverlay from "./image-overlay.js";
import image from "./image.js";
import linearGradient from "./linear-gradient.js";
import newsTitle from "./news-title.js";
import radialGradient from "./radial-gradient.js";
import slideInText from "./slide-in-text.js";
import subtitle from "./subtitle.js";
import title from "./title.js";
import video from "./video.js";
import scene from "./scene.js";
import charByCharText from "./char-by-char-text.js";
import lineByLineText from "./line-by-line-text.js";
const dirname = fileURLToPath(new URL("..", import.meta.url));
const sources = [
    canvas,
    fabric,
    fillColor,
    gl,
    imageOverlay,
    image,
    linearGradient,
    newsTitle,
    radialGradient,
    slideInText,
    subtitle,
    title,
    video,
    scene,
    charByCharText,
    lineByLineText,
];
export async function createLayerSource(options) {
    const layer = options.params;
    const source = sources.find(({ type }) => type == layer.type);
    assert(source, `Invalid type ${layer.type}`);
    return await source.setup(options);
}
export function expandLayerAliases(params) {
    if (params.type === "editly-banner") {
        return [
            { type: "linear-gradient" },
            { ...params, type: "title", text: "Made with\nEDITLY\nmifi.no" },
        ];
    }
    if (params.type === "title-background") {
        const backgroundTypes = [
            "radial-gradient",
            "linear-gradient",
            "fill-color",
        ];
        const { background = { type: backgroundTypes[Math.floor(Math.random() * backgroundTypes.length)] }, ...title } = params;
        return [background, { ...title, type: "title" }];
    }
    // TODO if random-background radial-gradient linear etc
    if (params.type === "pause") {
        return [{ ...params, type: "fill-color" }];
    }
    if (params.type === "rainbow-colors") {
        return [{ type: "gl", fragmentPath: join(dirname, "shaders/rainbow-colors.frag") }];
    }
    return [params];
}
export default sources;
