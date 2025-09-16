import { VideoMaker } from "./index.js";

/**
 * 简单文本动画测试
 */
async function testSimpleTextAnimation() {
  console.log("开始简单文本动画测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/simple-text-animation-test.mp4",
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
          text: "Hello World",
          duration: 3,
          x: "50%",
          y: "50%",
          fontSize: 72,
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
        },
        
        // 测试缩放动画
        {
          type: "title",
          text: "Scale Test",
          duration: 3,
          x: "50%",
          y: "30%",
          fontSize: 48,
          color: "#FF6B6B",
          fontFamily: "Arial",
          animations: [
            {
              property: "scaleX",
              from: 0.5,
              to: 1.5,
              duration: 2,
              startTime: 0,
              easing: "easeInOut"
            },
            {
              property: "scaleY",
              from: 0.5,
              to: 1.5,
              duration: 2,
              startTime: 0,
              easing: "easeInOut"
            }
          ]
        },
        
        // 测试移动动画
        {
          type: "title",
          text: "Move Test",
          duration: 3,
          x: "50%",
          y: "70%",
          fontSize: 48,
          color: "#4ECDC4",
          fontFamily: "Arial",
          animations: [
            {
              property: "x",
              from: "10%",
              to: "90%",
              duration: 2,
              startTime: 0,
              easing: "easeInOut"
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 简单文本动画测试完成: output/simple-text-animation-test.mp4");
    
  } catch (error) {
    console.error("❌ 简单文本动画测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testSimpleTextAnimation();
}

export { testSimpleTextAnimation };
