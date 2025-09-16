import { VideoMaker } from "../index.js";

/**
 * 高级示例 - 创建包含多种元素和动画的视频
 */
async function createAdvancedVideo() {
  const videoMaker = new VideoMaker({
    outPath: "output/advanced-example.mp4",
    width: 1920,
    height: 1080,
    fps: 30,
    elements: [
      // 背景渐变
      {
        type: "shape",
        shape: "rectangle",
        fillColor: "#1a1a2e",
        duration: 10,
        x: 0,
        y: 0,
        shapeWidth: 1920,
        shapeHeight: 1080
      },
      
      // 主标题 - 带缩放动画
      {
        type: "title",
        text: "高级视频制作",
        font: "bold 72px Arial",
        fillColor: "#00d4ff",
        duration: 10,
        x: 960,
        y: 300,
        textAlign: "center",
        animations: [
          {
            property: "scaleX",
            from: 0.5,
            to: 1,
            duration: 1,
            startTime: 0,
            easing: "easeOut"
          },
          {
            property: "scaleY",
            from: 0.5,
            to: 1,
            duration: 1,
            startTime: 0,
            easing: "easeOut"
          },
          {
            property: "opacity",
            from: 0,
            to: 1,
            duration: 1,
            startTime: 0,
            easing: "easeIn"
          }
        ]
      },
      
      // 副标题 - 带滑动动画
      {
        type: "title",
        text: "支持多种元素类型和动画效果",
        font: "32px Arial",
        fillColor: "#ffffff",
        duration: 10,
        x: 960,
        y: 400,
        textAlign: "center",
        animations: [
          {
            property: "x",
            from: 1200,
            to: 960,
            duration: 1.5,
            startTime: 0.5,
            easing: "easeOut"
          },
          {
            property: "opacity",
            from: 0,
            to: 1,
            duration: 1,
            startTime: 0.5,
            easing: "easeIn"
          }
        ]
      },
      
      // 装饰圆形 - 带旋转动画
      {
        type: "shape",
        shape: "circle",
        fillColor: "rgba(0, 212, 255, 0.2)",
        strokeColor: "#00d4ff",
        strokeWidth: 3,
        shapeWidth: 200,
        shapeHeight: 200,
        duration: 10,
        x: 960,
        y: 600,
        animations: [
          {
            property: "rotation",
            from: 0,
            to: 360,
            duration: 5,
            startTime: 1,
            easing: "linear"
          },
          {
            property: "scaleX",
            from: 0,
            to: 1,
            duration: 1,
            startTime: 1,
            easing: "easeOut"
          },
          {
            property: "scaleY",
            from: 0,
            to: 1,
            duration: 1,
            startTime: 1,
            easing: "easeOut"
          }
        ]
      },
      
      // 底部信息 - 带淡入动画
      {
        type: "title",
        text: "基于 Node.js 和 Canvas 技术",
        font: "20px Arial",
        fillColor: "#888888",
        duration: 10,
        x: 960,
        y: 800,
        textAlign: "center",
        animations: [
          {
            property: "opacity",
            from: 0,
            to: 1,
            duration: 2,
            startTime: 2,
            easing: "easeIn"
          }
        ]
      }
    ]
  });

  // 监听事件
  videoMaker.on("start", () => {
    console.log("开始渲染高级视频...");
  });

  videoMaker.on("progress", (progress) => {
    console.log(`渲染进度: ${progress}%`);
  });

  videoMaker.on("complete", (outputPath) => {
    console.log(`高级视频渲染完成: ${outputPath}`);
  });

  videoMaker.on("error", (error) => {
    console.error("渲染失败:", error);
  });

  try {
    const outputPath = await videoMaker.start();
    console.log(`高级视频已保存到: ${outputPath}`);
  } catch (error) {
    console.error("创建高级视频失败:", error);
  } finally {
    await videoMaker.close();
  }
}

// 运行示例
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdvancedVideo();
}
