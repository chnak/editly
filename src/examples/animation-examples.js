import { VideoMaker } from "../index.js";
import { createAnimationBuilder, createPresetBuilder, quickPreset } from "../animations/AnimationBuilder.js";

/**
 * 动画系统使用示例
 * 展示如何使用新的通用动画管理系统
 */

/**
 * 示例1: 使用预设动画
 */
async function presetAnimationExample() {
  console.log("=== 预设动画示例 ===");
  
  const videoMaker = new VideoMaker({
    outPath: "output/preset-animations.mp4",
    width: 1280,
    height: 720,
    fps: 30,
    elements: [
      // 背景
      {
        type: "image",
        source: "./assets/img1.jpg",
        duration: 8,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1
      },
      
      // 文本1 - 淡入效果
      {
        type: "title",
        text: "淡入文本",
        textColor: "#ffffff",
        fontSize: 48,
        duration: 3,
        x: 640,
        y: 200,
        animations: ["fadeIn"]
      },
      
      // 文本2 - 从左侧滑入
      {
        type: "title",
        text: "从左侧滑入",
        textColor: "#ff6b6b",
        fontSize: 48,
        duration: 3,
        x: 640,
        y: 300,
        startTime: 1,
        animations: ["slideInLeft"]
      },
      
      // 文本3 - 缩放进入
      {
        type: "title",
        text: "缩放进入",
        textColor: "#4ecdc4",
        fontSize: 48,
        duration: 3,
        x: 640,
        y: 400,
        startTime: 2,
        animations: ["zoomIn"]
      },
      
      // 文本4 - 弹跳进入
      {
        type: "title",
        text: "弹跳进入",
        textColor: "#ffe66d",
        fontSize: 48,
        duration: 3,
        x: 640,
        y: 500,
        startTime: 3,
        animations: ["bounceIn"]
      }
    ]
  });

  try {
    const outputPath = await videoMaker.start();
    console.log(`预设动画视频已保存到: ${outputPath}`);
  } catch (error) {
    console.error("创建预设动画视频失败:", error);
  } finally {
    await videoMaker.close();
  }
}

/**
 * 示例2: 使用动画构建器
 */
async function animationBuilderExample() {
  console.log("=== 动画构建器示例 ===");
  
  const builder = createAnimationBuilder();
  
  // 创建复杂的动画序列
  const animations = builder
    .animate('opacity')
      .from(0)
      .to(1)
      .duration(0.5)
      .easing('easeOut')
      .end()
    .animate('x')
      .from(-200)
      .to(640)
      .duration(1)
      .delay(0.5)
      .easing('easeOut')
      .end()
    .animate('scaleX')
      .from(0.5)
      .to(1)
      .duration(0.8)
      .delay(1)
      .easing('bounce')
      .end()
    .getAnimations();

  const videoMaker = new VideoMaker({
    outPath: "output/animation-builder.mp4",
    width: 1280,
    height: 720,
    fps: 30,
    elements: [
      // 背景
      {
        type: "image",
        source: "./assets/img2.jpg",
        duration: 6,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1
      },
      
      // 使用构建器创建的动画
      {
        type: "title",
        text: "动画构建器示例",
        textColor: "#ffffff",
        fontSize: 64,
        fontWeight: "bold",
        duration: 6,
        x: 640,
        y: 360,
        animations: animations
      }
    ]
  });

  try {
    const outputPath = await videoMaker.start();
    console.log(`动画构建器视频已保存到: ${outputPath}`);
  } catch (error) {
    console.error("创建动画构建器视频失败:", error);
  } finally {
    await videoMaker.close();
  }
}

/**
 * 示例3: 使用预设构建器
 */
async function presetBuilderExample() {
  console.log("=== 预设构建器示例 ===");
  
  const presetBuilder = createPresetBuilder();
  
  // 创建预设动画组合
  const animations = presetBuilder
    .fadeIn({ duration: 0.5 })
    .slideInLeft({ duration: 1, delay: 0.5 })
    .zoomIn({ duration: 0.8, delay: 1.5 })
    .bounceIn({ duration: 1, delay: 2.3 })
    .getAnimations();

  const videoMaker = new VideoMaker({
    outPath: "output/preset-builder.mp4",
    width: 1280,
    height: 720,
    fps: 30,
    elements: [
      // 背景
      {
        type: "image",
        source: "./assets/img3.jpg",
        duration: 8,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1
      },
      
      // 文本1
      {
        type: "title",
        text: "预设构建器",
        textColor: "#ffffff",
        fontSize: 48,
        duration: 8,
        x: 640,
        y: 200,
        animations: animations
      },
      
      // 文本2 - 使用快速预设
      {
        type: "title",
        text: "快速预设",
        textColor: "#ff6b6b",
        fontSize: 48,
        duration: 8,
        x: 640,
        y: 300,
        startTime: 2,
        animations: [quickPreset('elasticIn', { duration: 1.5 })]
      }
    ]
  });

  try {
    const outputPath = await videoMaker.start();
    console.log(`预设构建器视频已保存到: ${outputPath}`);
  } catch (error) {
    console.error("创建预设构建器视频失败:", error);
  } finally {
    await videoMaker.close();
  }
}

/**
 * 示例4: 关键帧动画
 */
async function keyframeAnimationExample() {
  console.log("=== 关键帧动画示例 ===");
  
  const videoMaker = new VideoMaker({
    outPath: "output/keyframe-animations.mp4",
    width: 1280,
    height: 720,
    fps: 30,
    elements: [
      // 背景
      {
        type: "image",
        source: "./assets/img1.jpg",
        duration: 8,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1
      },
      
      // 关键帧动画文本
      {
        type: "title",
        text: "关键帧动画",
        textColor: "#ffffff",
        fontSize: 64,
        fontWeight: "bold",
        duration: 8,
        x: 640,
        y: 360,
        animations: [
          {
            property: 'x',
            keyframes: [
              { time: 0, value: -200, easing: 'easeOut' },
              { time: 0.3, value: 640, easing: 'easeOut' },
              { time: 0.7, value: 640, easing: 'linear' },
              { time: 1, value: 1480, easing: 'easeIn' }
            ],
            duration: 4
          },
          {
            property: 'scaleX',
            keyframes: [
              { time: 0, value: 0.5, easing: 'easeOut' },
              { time: 0.2, value: 1.2, easing: 'easeOut' },
              { time: 0.4, value: 1, easing: 'easeOut' },
              { time: 0.8, value: 1, easing: 'linear' },
              { time: 1, value: 0.5, easing: 'easeIn' }
            ],
            duration: 4
          },
          {
            property: 'rotation',
            keyframes: [
              { time: 0, value: -180, easing: 'easeOut' },
              { time: 0.5, value: 0, easing: 'easeOut' },
              { time: 0.8, value: 0, easing: 'linear' },
              { time: 1, value: 180, easing: 'easeIn' }
            ],
            duration: 4
          }
        ]
      }
    ]
  });

  try {
    const outputPath = await videoMaker.start();
    console.log(`关键帧动画视频已保存到: ${outputPath}`);
  } catch (error) {
    console.error("创建关键帧动画视频失败:", error);
  } finally {
    await videoMaker.close();
  }
}

/**
 * 示例5: 复杂动画组合
 */
async function complexAnimationExample() {
  console.log("=== 复杂动画组合示例 ===");
  
  const videoMaker = new VideoMaker({
    outPath: "output/complex-animations.mp4",
    width: 1280,
    height: 720,
    fps: 30,
    elements: [
      // 背景视频
      {
        type: "video",
        source: "./assets/changi.mp4",
        duration: 10,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1
      },
      
      // 标题文本 - 复杂的进入动画
      {
        type: "title",
        text: "复杂动画组合",
        textColor: "#ffffff",
        fontSize: 72,
        fontWeight: "bold",
        textAlign: "center",
        duration: 10,
        x: 640,
        y: 200,
        animations: [
          // 淡入 + 缩放
          {
            property: 'opacity',
            from: 0,
            to: 1,
            duration: 1,
            easing: 'easeOut'
          },
          {
            property: 'scaleX',
            from: 0,
            to: 1,
            duration: 1,
            easing: 'bounce'
          },
          {
            property: 'scaleY',
            from: 0,
            to: 1,
            duration: 1,
            easing: 'bounce'
          },
          // 延迟的旋转动画
          {
            property: 'rotation',
            from: -10,
            to: 0,
            duration: 0.5,
            startTime: 1,
            easing: 'elastic'
          }
        ]
      },
      
      // 副标题 - 从下方滑入
      {
        type: "title",
        text: "展示强大的动画系统",
        textColor: "#ff6b6b",
        fontSize: 36,
        textAlign: "center",
        duration: 10,
        x: 640,
        y: 300,
        startTime: 1.5,
        animations: ["slideInBottom"]
      },
      
      // 装饰元素 - 脉冲动画
      {
        type: "shape",
        shape: "circle",
        fillColor: "#4ecdc4",
        width: 100,
        height: 100,
        duration: 10,
        x: 640,
        y: 500,
        startTime: 2,
        animations: [
          {
            property: 'scaleX',
            from: 0.5,
            to: 1.5,
            duration: 2,
            easing: 'easeInOut',
            repeat: 'loop'
          },
          {
            property: 'scaleY',
            from: 0.5,
            to: 1.5,
            duration: 2,
            easing: 'easeInOut',
            repeat: 'loop'
          },
          {
            property: 'opacity',
            from: 0.8,
            to: 0.2,
            duration: 2,
            easing: 'easeInOut',
            repeat: 'loop'
          }
        ]
      },
      
      // 底部文本 - 闪烁效果
      {
        type: "title",
        text: "点击了解更多",
        textColor: "#ffe66d",
        fontSize: 24,
        textAlign: "center",
        duration: 10,
        x: 640,
        y: 600,
        startTime: 3,
        animations: ["blink"]
      }
    ]
  });

  try {
    const outputPath = await videoMaker.start();
    console.log(`复杂动画组合视频已保存到: ${outputPath}`);
  } catch (error) {
    console.error("创建复杂动画组合视频失败:", error);
  } finally {
    await videoMaker.close();
  }
}

/**
 * 运行所有示例
 */
async function runAllExamples() {
  try {
    await presetAnimationExample();
    await animationBuilderExample();
    await presetBuilderExample();
    await keyframeAnimationExample();
    await complexAnimationExample();
    
    console.log("\n=== 所有动画示例完成 ===");
  } catch (error) {
    console.error("运行示例时出错:", error);
  }
}

// 如果直接运行此文件，则执行所有示例
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}

export {
  presetAnimationExample,
  animationBuilderExample,
  presetBuilderExample,
  keyframeAnimationExample,
  complexAnimationExample,
  runAllExamples
};
