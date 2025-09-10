import { Gradient } from "fabric/node";
import { defineFrameSource } from "../libs/index.js";
import { getRandomGradient } from "../colors.js";
import { getRekt } from "../utils/util.js";
export default defineFrameSource("linear-gradient", async ({ width, height, params }) => {
    const { colors: inColors } = params;
    const colors = inColors && inColors.length === 2 ? inColors : getRandomGradient();
    return {
        async readNextFrame(progress, canvas) {
            const rect = getRekt(width, height);
            rect.set("fill", new Gradient({
                coords: {
                    x1: 0,
                    y1: 0,
                    x2: width,
                    y2: height,
                },
                colorStops: [
                    { offset: 0, color: colors[0] },
                    { offset: 1, color: colors[1] },
                ],
            }));
            rect.rotate(progress * 30);
            canvas.add(rect);
        },
    };
});
