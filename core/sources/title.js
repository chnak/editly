import { Textbox } from "fabric/node";
import { defineFrameSource } from "../libs/index.js";
import Effects from "../libs/effects.js";
import AnimationController from "../libs/animation.js";
import { defaultFontFamily, getPositionProps, getTranslationParams, getZoomParams,getFrameByKeyFrames } from "../utils/util.js";
export default defineFrameSource("title", async ({ width, height, params }) => {
    const { 
        text, 
        textColor = "#ffffff", 
        fontFamily = defaultFontFamily, 
        position = "center", 
        zoomDirection = "in", 
        zoomAmount = 0.2, 
        animate=[]
    } = params;
    const fontSize = Math.round(Math.min(width, height) * 0.1);
    const textBox = new Textbox(text, {
        fill: textColor,
        fontFamily,
        fontSize,
        textAlign: "center",
        width: width * 0.8
    });
    // console.log(params)
    // 定义关键帧动画
    const keyframes = [
        { 
            time: 'in', 
            effect:'slideInLeft'
        },
        { 
            time: 0.5, 
            from: { scaleX: 1, scaleY: 1 }, 
            to: { scaleX: 1.2, scaleY: 1.2 },
            ease: 'easeInOutQuad',
            duration: 0.1
        },
        { 
            time:'out',
            effect:'slideOutRight'
        }
    ];
   
    // console.log(keyframes)
    const animates=animate.map(item=>{
        if(item.effect){
            return { 
                t: item.time, 
                ...AnimationController.createPresetAnimation(item.effect, { duration: item.duration })
            }
        }else{
            return {t:item.time,...item}
        }
    })
    const animationController = new AnimationController(animates,{},textBox);
    
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
                scaleY: scaleFactor
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

