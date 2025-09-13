import { Textbox, FabricText } from "fabric/node";
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
        animate=[],
        split = null, // 新增split参数：'word' 或 'line'
        splitDelay = 0.1, // 分割动画延迟
        splitDuration = 0.3 // 分割动画持续时间
    } = params;
    const fontSize = Math.round(Math.min(width, height) * 0.1);
    
    // 文本分割辅助函数
    function splitText(text, splitType) {
        if (!splitType) return [text];
        
        if (splitType === 'word') {
            // 按词分割（支持中英文）
            // 对于中文，按字符分割；对于英文，按单词分割
            const chineseRegex = /[\u4e00-\u9fff]/;
            if (chineseRegex.test(text)) {
                // 包含中文，按字符分割
                return text.split('').filter(char => char.trim());
            } else {
                // 纯英文，按单词分割
                return text.split(/\s+/).filter(word => word.trim());
            }
        } else if (splitType === 'line') {
            // 按行分割
            return text.split('\n').filter(item => item.trim());
        }
        return [text];
    }
    
    // 创建文本对象
    const textBox = new Textbox(text, {
        fill: textColor,
        fontFamily,
        fontSize,
        textAlign: "center",
        width: width * 0.8
    });
    
    // 如果启用了分割动画，创建分割后的文本片段
    let textSegments = [];
    if (split) {
        const segments = splitText(text, split);
        textSegments = segments.map((segment, index) => {
            const segmentText = new FabricText(segment, {
                fill: textColor,
                fontFamily,
                fontSize,
                textAlign: "center"
            });
            return {
                text: segmentText,
                index,
                startTime: index * splitDelay,
                endTime: index * splitDelay + splitDuration
            };
        });
    }
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
            const { left, top, originX, originY } = getPositionProps({ position, width, height });
            
            if (split && textSegments.length > 0) {
                // 处理分割动画
                // 计算所有文本的总宽度，用于居中
                let totalWidth = 0;
                if (split === 'word') {
                    totalWidth = textSegments.reduce((sum, segment) => {
                        return sum + segment.text.width + fontSize * 0.2;
                    }, 0) - fontSize * 0.2; // 减去最后一个间距
                }
                
                let currentX = left - totalWidth / 2; // 居中起始位置
                let currentY = top;
                
                for (const segment of textSegments) {
                    const segmentProgress = Math.max(0, Math.min(1, (progress - segment.startTime) / (segment.endTime - segment.startTime)));
                    
                    if (segmentProgress > 0) {
                        // 计算分割文本的位置
                        let segmentLeft = currentX;
                        let segmentTop = currentY;
                        
                        if (split === 'word') {
                            // 水平排列单词/字符
                            segmentLeft = currentX;
                            currentX += segment.text.width + fontSize * 0.2; // 添加间距
                        } else if (split === 'line') {
                            // 垂直排列行
                            segmentTop = currentY + segment.index * (fontSize * 1.5);
                        }
                        
                        // 应用动画效果
                        const animatedProps = {
                            originX: "center",
                            originY: "center",
                            left: segmentLeft + translationParams,
                            top: segmentTop,
                            scaleX: scaleFactor,
                            scaleY: scaleFactor,
                            opacity: segmentProgress
                        };
                        
                        // 如果有自定义动画，应用动画控制器
                        if (animate.length > 0) {
                            const segmentAnimationController = new AnimationController(
                                animate.map(item => ({
                                    t: item.time,
                                    ...(item.effect ? AnimationController.createPresetAnimation(item.effect, { duration: item.duration }) : item)
                                })),
                                {},
                                segment.text
                            );
                            
                            segmentAnimationController.update(progress, segment.text, {
                                left: segmentLeft,
                                top: segmentTop,
                                width: width,
                                height: height
                            });
                        }
                        
                        segment.text.set(animatedProps);
                        canvas.add(segment.text);
                    }
                }
            } else {
                // 处理普通文本动画
                const textImage = textBox;
                const textProps = {
                    originX,
                    originY,
                    left: left + translationParams,
                    top,
                    scaleX: scaleFactor,
                    scaleY: scaleFactor
                };
                
                textImage.set(textProps);
                
                animationController.update(progress, textImage, {
                    left: left, 
                    top: top,
                    width: width,
                    height: height
                });
                
                canvas.add(textImage);
            }
        },
    };
});

