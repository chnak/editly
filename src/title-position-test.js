import { VideoMaker } from "./index.js";

/**
 * 测试 title 元素的 x, y 定位功能
 */
async function testTitlePositioning() {
  console.log("开始测试 title 元素的 x, y 定位功能...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/title-position-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 3,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1
        },
        
        // 测试不同位置的 title 元素
        {
          type: "title",
          text: "左上角",
          textColor: "#ff0000",
          fontSize: 48,
          duration: 3,
          x: 100,
          y: 100
        },
        
        {
          type: "title",
          text: "右上角",
          textColor: "#00ff00",
          fontSize: 48,
          duration: 3,
          x: 1180,
          y: 100
        },
        
        {
          type: "title",
          text: "左下角",
          textColor: "#0000ff",
          fontSize: 48,
          duration: 3,
          x: 100,
          y: 620
        },
        
        {
          type: "title",
          text: "右下角",
          textColor: "#ffff00",
          fontSize: 48,
          duration: 3,
          x: 1180,
          y: 620
        },
        
        {
          type: "title",
          text: "中心",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 3,
          x: 640,
          y: 360
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ title 定位测试完成: output/title-position-test.mp4");
    
  } catch (error) {
    console.error("❌ title 定位测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testTitlePositioning();
}

export { testTitlePositioning };
