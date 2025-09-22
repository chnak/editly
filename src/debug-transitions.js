import { VideoMaker } from "./index.js";

/**
 * 调试过渡效果
 * 添加详细的调试信息来检查过渡效果问题
 */
async function debugTransitions() {
  console.log("开始调试过渡效果...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/debug-transitions.mp4",
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
          fillColor: "#3498db",
          duration: 2,
          startTime: 0
        },
        // 文本层 - 场景 1
        {
          type: "title",
          text: "场景 1",
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
        
        // 背景层 - 场景 2
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#2c3e50",
          duration: 2,
          startTime: 2
        },
        // 文本层 - 场景 2
        {
          type: "title",
          text: "场景 2",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 2,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        }
      ],
      // 过渡效果配置
      transitions: [
        {
          type: "fade",
          startTime: 1.5, // 在场景 1 结束前 0.5 秒开始
          duration: 1.0   // 过渡持续 1 秒
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染调试过渡效果...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`调试过渡效果完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`调试过渡效果已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("调试过渡效果完成！");
    
  } catch (error) {
    console.error("调试过渡效果失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  debugTransitions();
}

export { debugTransitions };
