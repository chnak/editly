import { VideoMaker } from "./index.js";
import { transitionManager } from "./transitions/TransitionManager.js";
import { allTransitions, transitionPresets } from "./transitions/transition-configs.js";

/**
 * 简化过渡效果配置测试
 * 展示如何使用新的简化配置系统
 */
async function testSimpleTransitions() {
  console.log("开始简化过渡效果配置测试...");
  
  try {
    // 注册自定义过渡效果
    console.log("注册自定义过渡效果...");
    Object.entries(allTransitions).forEach(([name, config]) => {
      transitionManager.addTransition(name, config);
    });
    
    console.log("可用的过渡效果:", transitionManager.getAvailableTransitions());
    
    const videoMaker = new VideoMaker({
      outPath: "output/test-simple-transitions.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 场景 1 - 蓝色背景
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#3498db",
          duration: 2,
          startTime: 0
        },
        {
          type: "title",
          text: "场景 1 - 基础淡入淡出",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 0,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 2 - 绿色背景
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#2ecc71",
          duration: 2,
          startTime: 2
        },
        {
          type: "title",
          text: "场景 2 - 左滑效果",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 2,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 3 - 红色背景
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#e74c3c",
          duration: 2,
          startTime: 4
        },
        {
          type: "title",
          text: "场景 3 - 缩放效果",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 4,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 4 - 紫色背景
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#9b59b6",
          duration: 2,
          startTime: 6
        },
        {
          type: "title",
          text: "场景 4 - 旋转效果",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 6,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 5 - 橙色背景
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#f39c12",
          duration: 2,
          startTime: 8
        },
        {
          type: "title",
          text: "场景 5 - 3D翻转效果",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 8,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        }
      ],
      // 使用简化的过渡效果配置
      transitions: [
        {
          type: "fade",
          startTime: 1.5,
          duration: 1.0
        },
        {
          type: "slideLeft",
          startTime: 3.5,
          duration: 1.0
        },
        {
          type: "zoomIn",
          startTime: 5.5,
          duration: 1.0
        },
        {
          type: "rotateClockwise",
          startTime: 7.5,
          duration: 1.0
        },
        {
          type: "flipY",
          startTime: 9.5,
          duration: 1.0
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染简化过渡效果测试...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`简化过渡效果测试完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`简化过渡效果测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("简化过渡效果测试完成！");
    
  } catch (error) {
    console.error("简化过渡效果测试失败:", error);
  }
}

/**
 * 测试自定义过渡效果配置
 */
async function testCustomTransitions() {
  console.log("开始自定义过渡效果配置测试...");
  
  try {
    // 创建自定义过渡效果
    const customTransitions = {
      // 自定义淡入淡出 - 使用弹跳缓动
      customFade: {
        type: 'opacity',
        from: { opacity: 1 },
        to: { opacity: 0 },
        easing: 'bounce'
      },
      
      // 自定义滑动 - 对角线滑动
      customSlide: {
        type: 'position',
        from: { x: 0, y: 0 },
        to: { x: 1, y: -1 },
        easing: 'elastic'
      },
      
      // 自定义缩放 - 弹性缩放
      customZoom: {
        type: 'scale',
        from: { scale: 1 },
        to: { scale: 1.8 },
        easing: 'elastic'
      }
    };
    
    // 注册自定义过渡效果
    Object.entries(customTransitions).forEach(([name, config]) => {
      transitionManager.addTransition(name, config);
    });
    
    const videoMaker = new VideoMaker({
      outPath: "output/test-custom-transitions.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 场景 1
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#e67e22",
          duration: 2,
          startTime: 0
        },
        {
          type: "title",
          text: "自定义弹跳淡入淡出",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 0,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 2
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#8e44ad",
          duration: 2,
          startTime: 2
        },
        {
          type: "title",
          text: "自定义弹性滑动",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 2,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 3
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#27ae60",
          duration: 2,
          startTime: 4
        },
        {
          type: "title",
          text: "自定义弹性缩放",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 4,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        }
      ],
      transitions: [
        {
          type: "customFade",
          startTime: 1.5,
          duration: 1.0
        },
        {
          type: "customSlide",
          startTime: 3.5,
          duration: 1.0
        },
        {
          type: "customZoom",
          startTime: 5.5,
          duration: 1.0
        }
      ]
    });

    const outputPath = await videoMaker.start();
    console.log(`自定义过渡效果测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("自定义过渡效果测试完成！");
    
  } catch (error) {
    console.error("自定义过渡效果测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  // 运行基础测试
  testSimpleTransitions().then(() => {
    // 运行自定义测试
    return testCustomTransitions();
  });
}

export { testSimpleTransitions, testCustomTransitions };
