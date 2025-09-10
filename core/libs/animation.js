// animationLib.js - 通用动画库
import * as EasingFunctions from './easings.js'
// 缓动函数集合
// const EasingFunctions = {
//     linear: t => t,
//     easeInQuad: t => t * t,
//     easeOutQuad: t => t * (2 - t),
//     easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
//     easeInCubic: t => t * t * t,
//     easeOutCubic: t => (--t) * t * t + 1,
//     easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
//     easeInQuart: t => t * t * t * t,
//     easeOutQuart: t => 1 - (--t) * t * t * t,
//     easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
//     easeInQuint: t => t * t * t * t * t,
//     easeOutQuint: t => 1 + (--t) * t * t * t * t,
//     easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
//     easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
//     easeOutSine: t => Math.sin(t * Math.PI / 2),
//     easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
//     easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
//     easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
//     easeInOutExpo: t => {
//         if (t === 0) return 0;
//         if (t === 1) return 1;
//         if ((t *= 2) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
//         return 0.5 * (2 - Math.pow(2, -10 * (t - 1)));
//     },
//     easeInCirc: t => 1 - Math.sqrt(1 - t * t),
//     easeOutCirc: t => Math.sqrt(1 - (--t) * t),
//     easeInOutCirc: t => {
//         if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
//         return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
//     },
//     easeInElastic: t => {
//         if (t === 0) return 0;
//         if (t === 1) return 1;
//         return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
//     },
//     easeOutElastic: t => {
//         if (t === 0) return 0;
//         if (t === 1) return 1;
//         return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
//     },
//     easeInOutElastic: t => {
//         if (t === 0) return 0;
//         if ((t *= 2) === 2) return 1;
//         if (t < 1) return -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
//         return 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1;
//     },
//     easeInBack: t => {
//         const s = 1.70158;
//         return t * t * ((s + 1) * t - s);
//     },
//     easeOutBack: t => {
//         const s = 1.70158;
//         return --t * t * ((s + 1) * t + s) + 1;
//     },
//     easeInOutBack: t => {
//         let s = 1.70158;
//         if ((t *= 2) < 1) return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
//         return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
//     },
//     easeInBounce: t => 1 - EasingFunctions.easeOutBounce(1 - t),
//     easeOutBounce: t => {
//         if (t < (1 / 2.75)) {
//             return 7.5625 * t * t;
//         } else if (t < (2 / 2.75)) {
//             return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
//         } else if (t < (2.5 / 2.75)) {
//             return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
//         } else {
//             return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
//         }
//     },
//     easeInOutBounce: t => {
//         if (t < 0.5) return EasingFunctions.easeInBounce(t * 2) * 0.5;
//         return EasingFunctions.easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
//     }
// };

const effects={
    fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
        ease: 'easeOutQuad',
        duration: 0.3
    },
    fadeOut: {
        from: { opacity: 1 },
        to: { opacity: 0 },
        ease: 'easeInQuad',
        duration: 0.3
    },
    slideInLeft: {
        from: { opacity: 0, left: -200 },
        to: { opacity: 1, left: 0 },
        ease: 'easeOutBack',
        duration: 0.5
    },
    slideInRight: {
        from: { opacity: 0, left: 200 },
        to: { opacity: 1, left: 0 },
        ease: 'easeOutBack',
        duration: 0.5
    },
    slideOutLeft: {
        from: { opacity: 1, left: 0 },
        to: { opacity: 0, left: -200 },
        ease: 'easeInBack',
        duration: 0.5
    },
    slideOutRight: {
        from: { opacity: 1, left: 0 },
        to: { opacity: 0, left: 200 },
        ease: 'easeOutQuart',
        duration: 0.5
    },
    zoomIn: {
        from: { opacity: 0, scaleX: 0.5, scaleY: 0.5 },
        to: { opacity: 1, scaleX: 1, scaleY: 1 },
        ease: 'easeOutBack',
        duration: 0.5
    },
    zoomOut: {
        from: { opacity: 1, scaleX: 1, scaleY: 1 },
        to: { opacity: 0, scaleX: 1.5, scaleY: 1.5 },
        ease: 'easeOutQuart',
        duration: 0.5
    },
    bounce: {
        from: { scaleX: 1, scaleY: 1 },
        to: { scaleX: 1.2, scaleY: 1.2 },
        ease: 'easeOutBounce',
        duration: 0.4
    }
};

class MacroProcessor {
    constructor(context = {}) {
        this.context = context;
    }
    
    // 解析宏字符串，支持数学表达式
    parseMacro(value) {
        if (typeof value !== 'string') return value;
        
        // 替换所有宏变量为实际值
        let expression = value.replace(/\{(\w+)\}/g, (match, key) => {
            return this.context[key] !== undefined ? this.context[key] : match;
        });
        
        // 检查是否还有未解析的宏变量
        if (expression.includes('{')) {
            return value; // 返回原始值，因为存在未定义的变量
        }
        
        // 安全地计算数学表达式
        try {
            // 使用Function构造函数避免使用eval
            return new Function('return ' + expression)();
        } catch (e) {
            console.error('Error evaluating expression:', e);
            return value; // 如果计算失败，返回原始值
        }
    }

    // 处理对象中的宏
    processObject(obj) {
        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'string' && value.includes('{')) {
                    result[key] = this.parseMacro(value);
                } else if (typeof value === 'object' && value !== null) {
                    result[key] = this.processObject(value); // 递归处理嵌套对象
                } else {
                    result[key] = value;
                }
            }
        }
        return result;
    }
    
    // 更新上下文
    updateContext(newContext) {
        this.context = { ...this.context, ...newContext };
    }
}

// 动画控制器类
class AnimationController {
    constructor(keyframes = [],context={},targetObject) {
        this.keyframes = keyframes.sort((a, b) => a.t - b.t);
        this.currentAnimations = new Map();
        this.macroProcessor = new MacroProcessor(context);
        this.processedKeyframes = this.processKeyframes();
        //console.log( this.processedKeyframes)
        if(targetObject){
            this.update(0,targetObject)
        }
    }
    


   

    processKeyframes() {
        // 首先处理宏
        const macroProcessed = this.keyframes.map(keyframe => ({
            ...keyframe,
            from: this.macroProcessor.processObject(keyframe.from || {}),
            to: this.macroProcessor.processObject(keyframe.to || {})
        }));
        
        // 然后处理特殊时间标识符
        return macroProcessed.map(keyframe => {
            const processed = { ...keyframe };
            
            // 处理特殊时间标识符
            if (processed.t === 'in') {
                // 进入动画：从0开始
                processed.actualStartTime = 0;
                processed.actualEndTime = processed.duration || 0.3;
                processed.isSpecial = true;
            } else if (processed.t === 'out') {
                // 退出动画：从1-duration开始
                const duration = processed.duration || 0.3;
                processed.actualStartTime = 1 - duration;
                processed.actualEndTime = 1;
                processed.isSpecial = true;
            } else {
                // 普通时间点动画
                processed.actualStartTime = processed.t;
                processed.actualEndTime = processed.t + (processed.duration || 0.1);
                processed.isSpecial = false;
            }
            
            return processed;
        });
    }
    
    // 添加关键帧
    addKeyframe(keyframe) {
        this.keyframes.push(keyframe);
        this.processedKeyframes = this.processKeyframes();
        return this;
    }
    
    // 移除关键帧
    removeKeyframe(time) {
        this.keyframes = this.keyframes.filter(kf => kf.t !== time);
        this.processedKeyframes = this.processKeyframes();
        return this;
    }
    
    // 计算动画进度（修改后支持特殊时间标识符）
    calculateAnimationProgress(progress, keyframe) {
        let startTime, endTime;
        
        if (keyframe.isSpecial) {
            // 特殊动画使用预处理的时间
            startTime = keyframe.actualStartTime;
            endTime = keyframe.actualEndTime;
        } else {
            // 普通动画使用原始时间
            startTime = keyframe.t;
            endTime = keyframe.t + (keyframe.duration || 0.1);
        }
        
        if (progress < startTime) return 0;
        if (progress > endTime) return 1;
        
        return (progress - startTime) / (endTime - startTime);
    }
    
    // 插值计算
    interpolate(from, to, progress, baseValues = {}) {
        const result = {};
        
        for (const key in from) {
            if (typeof from[key] === 'number' && typeof to[key] === 'number') {
                // 处理相对位置值（以%结尾的值）
                if (key === 'left' || key === 'top') {
                    const fromValue = this.parsePositionValue(from[key], baseValues[key]);
                    const toValue = this.parsePositionValue(to[key], baseValues[key]);
                    result[key] = fromValue + (toValue - fromValue) * progress;
                } else {
                    result[key] = from[key] + (to[key] - from[key]) * progress;
                }
            } else {
                result[key] = to[key];
            }
        }
        
        return result;
    }

    // 解析位置值（支持相对值和绝对值）
    parsePositionValue(value, baseValue = 0) {
        if (typeof value === 'string' && value.endsWith('%')) {
            // 相对值计算（基于基准值）
            const percentage = parseFloat(value) / 100;
            return baseValue * percentage;
        }
        // 绝对值
        return baseValue+Number(value);
    }
    
    // 更新动画状态
    update(progress, targetObject, baseValues = {}) {
        const activeAnimations = [];
        
        for (const keyframe of this.processedKeyframes) {
            const animationProgress = this.calculateAnimationProgress(progress, keyframe);
            
            if (animationProgress > 0 && animationProgress <= 1) {
                const easeType = keyframe.ease || 'linear';
                const easedProgress = EasingFunctions[easeType](animationProgress);
                const animatedProps = this.interpolate(
                    keyframe.from, 
                    keyframe.to, 
                    easedProgress,
                    baseValues
                );
                
                activeAnimations.push({
                    keyframe,
                    progress: animationProgress,
                    easedProgress,
                    properties: animatedProps
                });
                
                // 应用到目标对象
                if (targetObject) {
                    targetObject.set(animatedProps);
                }
            }
        }
        
        return activeAnimations;
    }
    
    // 重置动画状态
    reset() {
        this.currentAnimations.clear();
    }
    
    // 创建预定义动画
    static createPresetAnimation(type, options = {}) {
        const presets = effects
        
        const preset = presets[type];
        if (!preset) {
            throw new Error(`Preset animation "${type}" not found`);
        }
        
        return { ...preset, ...options };
    }
}

// 工具函数
export const AnimationUtils = {
    // 创建动画序列
    createSequence(animations, options = {}) {
        let currentTime = 0;
        const keyframes = [];
        
        animations.forEach(anim => {
            const duration = anim.duration || 0.5;
            keyframes.push({
                t: currentTime,
                from: anim.from,
                to: anim.to,
                ease: anim.ease || 'linear',
                duration: duration
            });
            
            currentTime += duration + (anim.delay || 0);
        });
        
        return new AnimationController(keyframes);
    },
    
    // 创建并行动画
    createParallel(animations, options = {}) {
        const keyframes = [];
        const startTime = options.startTime || 0;
        
        animations.forEach(anim => {
            keyframes.push({
                t: startTime,
                from: anim.from,
                to: anim.to,
                ease: anim.ease || 'linear',
                duration: anim.duration || 0.5
            });
        });
        
        return new AnimationController(keyframes);
    },
    
    // 延迟执行
    delay(duration) {
        return new Promise(resolve => setTimeout(resolve, duration * 1000));
    }
};

// 默认导出
export default AnimationController;