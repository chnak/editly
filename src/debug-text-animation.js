import { VideoMaker } from "./index.js";

/**
 * 调试文本动画效果
 */
async function debugTextAnimation() {
  console.log("开始调试文本动画效果...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/debug-text-animation.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 3,
          x: "0%",
          y: "0%",
          imageWidth: 1280,
          imageHeight: 720,
          fit: "cover"
        },
        
        // 测试简单的淡入动画
        {
          type: "title",
          text: "Test Fade In",
          duration: 3,
          x: "50%",
          y: "50%",
          fontSize: 48,
          color: "#FFFFFF",
          fontFamily: "Arial",
          animations: [
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 2,
              startTime: 0,
              easing: "easeInOut"
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 调试文本动画完成: output/debug-text-animation.mp4");
    
  } catch (error) {
    console.error("❌ 调试文本动画失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  debugTextAnimation();
}

export { debugTextAnimation };
