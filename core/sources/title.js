import { Textbox } from "fabric/node";
import { defineFrameSource } from "../api/index.js";
import Effects from "../libs/effects.js";
import { defaultFontFamily, getPositionProps, getTranslationParams, getZoomParams,getFrameByKeyFrames } from "../utils/util.js";
export default defineFrameSource("title", async ({ width, height, params }) => {
    const { text, textColor = "#ffffff", fontFamily = defaultFontFamily, position = "center", zoomDirection = "in", zoomAmount = 0.2, } = params;
    const fontSize = Math.round(Math.min(width, height) * 0.1);
    const textBox = new Textbox(text, {
        fill: textColor,
        fontFamily,
        fontSize,
        textAlign: "center",
        width: width * 0.8,
    });
    let currentEffect = 'fadeIn';
    let effectProgress = 0;
    return {
        async readNextFrame(progress, canvas) {
            const scaleFactor = getZoomParams({ progress, zoomDirection, zoomAmount });
            const translationParams = getTranslationParams({ progress, zoomDirection, zoomAmount });
            // We need the text as an image in order to scale it
           
            const textImage = textBox.cloneAsImage({});
            const { left, top, originX, originY } = getPositionProps({ position, width, height });
            textImage.set({
                originX,
                originY,
                left: left + translationParams,
                top,
                scaleX: scaleFactor,
                scaleY: scaleFactor,
            });
            const {effect,_effectProgress} = getFrameByKeyFrames([
                { t: 0.1, props: { effect:'fadeInLeft' } },
                { t: 0.3, props: { effect:'zoomIn' } },
                { t: 0.8, props: { effect:'rotateIn' } },
                { t: 0.9, props: { effect:'fadeOutRight' } },
            ], progress);
            currentEffect=effect
            console.log( _effectProgress)
            // 应用当前特效
            Effects.applyEffectToObject(textImage, currentEffect, _effectProgress,{
                // 可以在这里覆盖默认配置
                ease: 'linear'
            });
            canvas.add(textImage);
        },
    };
});
