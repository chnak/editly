import { Textbox } from "fabric/node";
import { defineFrameSource } from "../api/index.js";
import Effects from "../libs/effects.js";
import AnimationController from "../libs/animation.js";
import { defaultFontFamily, getPositionProps, getTranslationParams, getZoomParams,getFrameByKeyFrames } from "../utils/util.js";
export default defineFrameSource("title", async ({ width, height, params }) => {
    const { text, textColor = "#ffffff", fontFamily = defaultFontFamily, position = "center", zoomDirection = "in", zoomAmount = 0.2, layerDuration} = params;
    const fontSize = Math.round(Math.min(width, height) * 0.1);
    const textBox = new Textbox(text, {
        fill: textColor,
        fontFamily,
        fontSize,
        textAlign: "center",
        width: width * 0.8,
    });

    // 定义关键帧动画
    const keyframes = [
        { 
            t: 0, 
            from: { opacity: 0, left: -width/2 }, 
            to: { opacity: 1, left: width/2 },
            ease: 'easeOutQuad',
            duration: 0.2
        },
        { 
            t: 0.5, 
            from: { scaleX: 1, scaleY: 1 }, 
            to: { scaleX: 1.2, scaleY: 1.2 },
            ease: 'easeInOutQuad',
            duration: 0.1
        },
        { 
            t: 0.9, 
            from: { opacity: 1, left: width/2 }, 
            to: { opacity: 0, left: width * 1.5 },
            ease: 'easeInQuad',
            duration: 0.2
        }
    ];
    // console.log(keyframes)
    const animationController = new AnimationController([
        { 
            t: 'in', 
            ...AnimationController.createPresetAnimation('slideInLeft', { duration: 0.3 })
        },
        { 
            t: 0.4, 
            ...AnimationController.createPresetAnimation('bounce', { duration: 0.4 })
        },
        { 
            t: 'out', 
            ...AnimationController.createPresetAnimation('zoomOut', { duration: 0.3 })
        }
    ],{width,height});
    
    
    return {
        async readNextFrame(progress, canvas) {
            const scaleFactor = getZoomParams({ progress, zoomDirection, zoomAmount });
            const translationParams = getTranslationParams({ progress, zoomDirection, zoomAmount });
            // We need the text as an image in order to scale it
           
            const textImage = textBox
            const { left, top, originX, originY } = getPositionProps({ position, width, height });
            // 初始化文本属性
            let textProps = {
                originX,
                originY,
                left: left + translationParams,
                top,
                scaleX: scaleFactor,
                scaleY: scaleFactor,
                opacity:0
            };
            
           
            // 设置文本属性
            textImage.set(textProps);
            animationController.update(progress, textImage, {
                left: left, 
                top: top,
                width:width,
                height:height
            });
 
            canvas.add(textImage);
        },
    };
});

