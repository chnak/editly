import { VideoMaker } from "../index.js";

/**
 * Creatomate 风格示例 - 模仿 Creatomate 的配置结构
 */
async function createCreatomateStyleVideo() {
  const videoMaker = new VideoMaker({
    outPath: "output/creatomate-style.mp4",
    width: 1280,
    height: 720,
    fps: 30,
    elements: [
      // 视频1
      {
        type: "video",
        source: "https://creatomate-static.s3.amazonaws.com/demo/video1.mp4",
        track: 1,
        duration: 3
      },
      
      // 视频2，带过渡效果
      {
        type: "video",
        source: "https://creatomate-static.s3.amazonaws.com/demo/video2.mp4",
        track: 1,
        duration: 3,
        startTime: 3,
        transition: {
          duration: 1,
          name: "fade"
        }
      },
      
      // 文本叠加
      {
        type: "title",
        text: "你的文本叠加在这里",
        font: "bold 48px Arial",
        fillColor: "#ffffff",
        strokeColor: "rgba(0,0,0,0.65)",
        strokeWidth: 2,
        duration: 6,
        x: 640, // 50% 宽度
        y: 600, // 底部
        textAlign: "center",
        // 模拟 Creatomate 的样式
        xPadding: "3 vmin",
        yPadding: "8 vmin",
        xAlignment: "50%",
        yAlignment: "100%",
        animations: [
          {
            property: "opacity",
            from: 0,
            to: 1,
            duration: 0.5,
            startTime: 0.5,
            easing: "easeIn"
          }
        ]
      }
    ]
  });

  // 监听事件
  videoMaker.on("start", () => {
    console.log("开始渲染 Creatomate 风格视频...");
  });

  videoMaker.on("progress", (progress) => {
    console.log(`渲染进度: ${progress}%`);
  });

  videoMaker.on("complete", (outputPath) => {
    console.log(`Creatomate 风格视频渲染完成: ${outputPath}`);
  });

  videoMaker.on("error", (error) => {
    console.error("渲染失败:", error);
  });

  try {
    const outputPath = await videoMaker.start();
    console.log(`Creatomate 风格视频已保存到: ${outputPath}`);
  } catch (error) {
    console.error("创建 Creatomate 风格视频失败:", error);
  } finally {
    await videoMaker.close();
  }
}

// 运行示例
if (import.meta.url === `file://${process.argv[1]}`) {
  createCreatomateStyleVideo();
}
