import assert from "assert";
import GL from "gl";
import createBuffer from "gl-buffer";
import createTexture from "gl-texture2d";
import glTransition from "gl-transition";
import glTransitions from "gl-transitions";
import ndarray from "ndarray";
import * as easings from "../utils/easings.js";

const { default: createTransition } = glTransition;
const TransitionAliases = {
    // 方向性过渡效果
    "directional-left": { name: "directional", easing: "easeOutExpo", params: { direction: [1, 0] } },
    "directional-right": {
        name: "directional",
        easing: "easeOutExpo",
        params: { direction: [-1, 0] },
    },
    "directional-down": { name: "directional", easing: "easeOutExpo", params: { direction: [0, 1] } },
    "directional-up": { name: "directional", easing: "easeOutExpo", params: { direction: [0, -1] } },
};
const AllTransitions = [...glTransitions.map((t) => t.name), ...Object.keys(TransitionAliases)];
function getRandomTransition() {
    return AllTransitions[Math.floor(Math.random() * AllTransitions.length)];
}
export class Transition {
    name;
    duration;
    params;
    easingFunction;
    source;
    constructor(options, isLastClip = false) {
        if (!options || isLastClip) {
            options = { duration: 0 };
        }
        
        assert(typeof options === "object", "Transition must be an object");
        assert(
            options.duration === 0 || options.name,
            "Please specify transition name or set duration to 0"
        );

        if (options.name === "random") {
            options.name = getRandomTransition();
        }
        
        const aliasedTransition = options.name && TransitionAliases[options.name];
        if (aliasedTransition) {
            Object.assign(options, aliasedTransition);
        }

        this.duration = options.duration ?? 0;
        this.name = options.name;
        this.params = options.params;
        this.easingFunction = options.easing && easings[options.easing] ? easings[options.easing] : easings.linear;

        // A dummy transition can be used to have an audio transition without a video transition
        // (Note: You will lose a portion from both clips due to overlap)
        if (this.name && this.name !== "dummy") {
            this.source = glTransitions.find(
                ({ name }) => name.toLowerCase() === this.name?.toLowerCase()
            );
            assert(this.source, `Transition not found: ${this.name}`);
        }
    }
    create({ width, height, channels }) {
        const gl = GL(width, height);
        const resizeMode = "stretch";

        if (!gl) {
            throw new Error(
                "gl returned null, this probably means that some dependencies are not installed. See README."
            );
        }

        function convertFrame(buf) {
            // @see https://github.com/stackgl/gl-texture2d/issues/16
            return ndarray(buf, [width, height, channels], [channels, width * channels, 1]);
        }

        return ({ fromFrame, toFrame, progress }) => {
            if (!this.source) {
                // No transition found, just switch frames half way through the transition.
                return this.easingFunction(progress) > 0.5 ? toFrame : fromFrame;
            }

            const buffer = createBuffer(gl, [-1, -1, -1, 4, 4, -1], gl.ARRAY_BUFFER, gl.STATIC_DRAW);
            let transition;

            try {
                transition = createTransition(gl, this.source, { resizeMode });

                gl.clear(gl.COLOR_BUFFER_BIT);

                // console.time('runTransitionOnFrame internal');
                const fromFrameNdArray = convertFrame(fromFrame);
                const textureFrom = createTexture(gl, fromFrameNdArray);
                textureFrom.minFilter = gl.LINEAR;
                textureFrom.magFilter = gl.LINEAR;

                // console.timeLog('runTransitionOnFrame internal');
                const toFrameNdArray = convertFrame(toFrame);
                const textureTo = createTexture(gl, toFrameNdArray);
                textureTo.minFilter = gl.LINEAR;
                textureTo.magFilter = gl.LINEAR;

                buffer.bind();
                transition.draw(
                    this.easingFunction(progress),
                    textureFrom,
                    textureTo,
                    gl.drawingBufferWidth,
                    gl.drawingBufferHeight,
                    this.params
                );

                textureFrom.dispose();
                textureTo.dispose();

                // console.timeLog('runTransitionOnFrame internal');

                const outArray = Buffer.allocUnsafe(width * height * 4);
                gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, outArray);

                // console.timeEnd('runTransitionOnFrame internal');

                return outArray;

                // require('fs').writeFileSync(`${new Date().getTime()}.raw`, outArray);
                // Testing: ffmpeg -f rawvideo -vcodec rawvideo -pix_fmt rgba -s 2166x1650 -i 1586619627191.raw -vf format=yuv420p -vcodec libx264 -y out.mp4
            } finally {
                buffer.dispose();
                if (transition) transition.dispose();
            }
        };
    }
}
