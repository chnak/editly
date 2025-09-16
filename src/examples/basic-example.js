import { VideoMaker } from "../index.js";

/**
 * 基础示例 - 创建一个简单的视频
 */
async function createBasicVideo() {
  const videoMaker = new VideoMaker({
    outPath: "output/basic-example.mp4",
    width: 1920,
    height: 1080,
    fps: 30,
    elements: [
      // 背景图像
      {
        type: "image",
        source: "../assets/img1.jpg",
        duration: 6,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1
      },
      
      {
        type: "title",
        text: "欢迎使用视频制作库",
        textColor: "#ffffff",
        position: "center",
        zoomDirection: "in",
        zoomAmount: 0.3,
        duration: 3,
        x: 400,
        y: 200
      },
      
      // 测试文本元素的中文字体
      {
        type: "title",
        text: "这是一个测试文本",
        textColor: "#ff6b6b",
        textAlign: "center",
        textBaseline: "center",
        duration: 3,
        x: 400,
        y: 400
      },
      
      // 测试分割动画的中文字体
      {
        type: "title",
        text: "你好世界",
        textColor: "#4ecdc4",
        position: "bottom",
        split: "word",
        splitDelay: 0.3,
        splitDuration: 0.5,
        duration: 6,
        x: 400,
        y: 500
      }
    ]
  });
  // 监听事件
  videoMaker.on("start", () => {
    console.log("开始渲染视频...");
  });

  videoMaker.on("progress", (progress) => {
    console.log(`渲染进度: ${progress}%`);
  });

  videoMaker.on("complete", (outputPath) => {
    console.log(`视频渲染完成: ${outputPath}`);
  });

  videoMaker.on("error", (error) => {
    console.error("渲染失败:", error);
  });

  try {
    const outputPath = await videoMaker.start();
    console.log(`视频已保存到: ${outputPath}`);
  } catch (error) {
    console.error("创建视频失败:", error);
  } finally {
    await videoMaker.close();
  }
}

// 运行示例
createBasicVideo().catch(console.error);
