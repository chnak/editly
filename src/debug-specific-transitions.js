import { VideoMaker } from "./index.js";
import { transitionManager } from "./transitions/TransitionManager.js";

/**
 * 调试特定过渡效果
 * 测试 fade、旋转、3D翻转效果
 */
async function debugSpecificTransitions() {
  console.log("开始调试特定过渡效果...");
  
  try {
    // 创建测试过渡效果
    const testTransitions = {
      // 测试淡入淡出
      fadeTest: {
        type: 'opacity',
        from: { opacity: 1 },
        to: { opacity: 0 },
        easing: 'linear'
      },
      
      // 测试旋转
      rotationTest: {
        type: 'rotation',
        from: { angle: 0 },
        to: { angle: 360 },
        easing: 'linear'
      },
      
      // 测试3D翻转
      flip3DTest: {
        type: '3d',
        axis: 'y',
        angle: 180,
        easing: 'linear'
      }
    };

    // 注册测试过渡效果
    Object.entries(testTransitions).forEach(([name, config]) => {
      transitionManager.addTransition(name, config);
    });

    console.log("注册的测试过渡效果:", Object.keys(testTransitions));

    const videoMaker = new VideoMaker({
      outPath: "output/debug-specific-transitions.mp4",
      width: 1280,
      height: 720,
      fps: 30,
       elements: [
         // 场景 1 - 红色场景
         {
           type: "shape",
           shape: "rect",
           width: '100%',
           height: '100%',
           x: '50%',
           y: '50%',
           fillColor: "#e74c3c",
           duration: 3,
           startTime: 0
         },
         {
           type: "title",
           text: "场景1 - 红色",
           textColor: "#ffffff",
           fontSize: 48,
           duration: 3,
           startTime: 0,
           x: '50%',
           y: '50%',
           textAlign: "center",
           width: '100%',
           height: '100%'
         },
         
         // 场景 2 - 蓝色场景
         {
           type: "shape",
           shape: "rect",
           width: '100%',
           height: '100%',
           x: '50%',
           y: '50%',
           fillColor: "#3498db",
           duration: 3,
           startTime: 4
         },
         {
           type: "title",
           text: "场景2 - 蓝色",
           textColor: "#ffffff",
           fontSize: 48,
           duration: 3,
           startTime: 4,
           x: '50%',
           y: '50%',
           textAlign: "center",
           width: '100%',
           height: '100%'
         },
         
         // 场景 3 - 绿色场景
         {
           type: "shape",
           shape: "rect",
           width: '100%',
           height: '100%',
           x: '50%',
           y: '50%',
           fillColor: "#2ecc71",
           duration: 3,
           startTime: 8
         },
         {
           type: "title",
           text: "场景3 - 绿色",
           textColor: "#ffffff",
           fontSize: 48,
           duration: 3,
           startTime: 8,
           x: '50%',
           y: '50%',
           textAlign: "center",
           width: '100%',
           height: '100%'
         },
         
         // 场景 4 - 紫色场景
         {
           type: "shape",
           shape: "rect",
           width: '100%',
           height: '100%',
           x: '50%',
           y: '50%',
           fillColor: "#9b59b6",
           duration: 3,
           startTime: 12
         },
         {
           type: "title",
           text: "场景4 - 紫色",
           textColor: "#ffffff",
           fontSize: 48,
           duration: 3,
           startTime: 12,
           x: '50%',
           y: '50%',
           textAlign: "center",
           width: '100%',
           height: '100%'
         }
       ],
       transitions: [
         {
           type: "fadeTest",
           startTime: 3.0,  // 场景1结束时开始过渡
           duration: 1.0    // 过渡到场景2开始
         },
         {
           type: "rotationTest",
           startTime: 7.0,  // 场景2结束时开始过渡
           duration: 1.0    // 过渡到场景3开始
         },
         {
           type: "flip3DTest",
           startTime: 11.0, // 场景3结束时开始过渡
           duration: 1.0    // 过渡到场景4开始
         }
       ]
    });

    const outputPath = await videoMaker.start();
    console.log(`调试特定过渡效果已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("调试特定过渡效果完成！");
    
  } catch (error) {
    console.error("调试特定过渡效果失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  debugSpecificTransitions();
}

export { debugSpecificTransitions };
