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
        // 场景 1 - 淡入淡出测试
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#e74c3c",
          duration: 4,
          startTime: 0
        },
        {
          type: "title",
          text: "淡入淡出测试",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 4,
          startTime: 0,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 2 - 旋转测试
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#3498db",
          duration: 4,
          startTime: 4
        },
        {
          type: "title",
          text: "旋转测试",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 4,
          startTime: 8,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 3 - 3D翻转测试
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#2ecc71",
          duration: 4,
          startTime: 8
        },
        {
          type: "title",
          text: "3D翻转测试",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 4,
          startTime: 8,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
         // 场景 3 - 3D翻转测试
         {
            type: "shape",
            shape: "rect",
            width: '100%',
            height: '100%',
            x: '50%',
            y: '50%',
            fillColor: "#2ecc71",
            duration: 4,
            startTime: 12
          },
          {
            type: "title",
            text: "场景4",
            textColor: "#ffffff",
            fontSize: 48,
            duration: 4,
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
          startTime: 3.5,
          duration: 1.0
        },
        {
          type: "rotationTest",
          startTime: 7.5,
          duration: 1.0
        },
        {
          type: "flip3DTest",
          startTime: 11.5,
          duration: 1.0
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
