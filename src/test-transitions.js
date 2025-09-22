import { VideoMaker } from "./index.js";

/**
 * 过渡效果测试
 * 测试各种过渡效果的功能
 */
async function testTransitions() {
  console.log("开始过渡效果测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/test-transitions.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景层 - 场景 1
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fill: "#ff6b6b",
          duration: 3,
          startTime: 0
        },
        // 文本层 - 场景 1
        {
          type: "title",
          text: "场景 1 - 淡入淡出",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 3,
          startTime: 0,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%',
          animations: ["fadeIn"]
        },
        
        // 背景层 - 场景 2
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fill: "#4ecdc4",
          duration: 3,
          startTime: 3
        },
        // 文本层 - 场景 2
        {
          type: "title",
          text: "场景 2 - 滑动效果",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 3,
          startTime: 3,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%',
          animations: ["fadeIn"]
        },
        
        // 背景层 - 场景 3
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fill: "#45b7d1",
          duration: 3,
          startTime: 6
        },
        // 文本层 - 场景 3
        {
          type: "title",
          text: "场景 3 - 缩放效果",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 3,
          startTime: 6,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%',
          animations: ["fadeIn"]
        },
        
        // 背景层 - 场景 4
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fill: "#9b59b6",
          duration: 3,
          startTime: 9
        },
        // 文本层 - 场景 4
        {
          type: "title",
          text: "场景 4 - 旋转效果",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 3,
          startTime: 9,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%',
          animations: ["fadeIn"]
        }
      ],
      // 过渡效果配置
      transitions: [
        {
          type: "fade",
          startTime: 2.5, // 场景 1 到场景 2
          duration: 1.0
        },
        {
          type: "slideLeft",
          startTime: 5.5, // 场景 2 到场景 3
          duration: 1.0
        },
        {
          type: "zoomIn",
          startTime: 8.5, // 场景 3 到场景 4
          duration: 1.0
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染过渡效果测试...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`过渡效果测试完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`过渡效果测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("过渡效果测试完成！");
    
  } catch (error) {
    console.error("过渡效果测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testTransitions();
}

export { testTransitions };
