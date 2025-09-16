import { VideoMaker } from "./index.js";

/**
 * 动画方式对比测试 - 展示直接参数 vs animations 参数的区别
 */
async function testAnimationComparison() {
  console.log("🎬 开始动画方式对比测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/animation-comparison-test.mp4",
      width: 1920,
      height: 1080,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 8,
          x: "0%",
          y: "0%",
          imageWidth: 1920,
          imageHeight: 1080,
          fit: "cover"
        },
        
        // 方式1: 使用直接参数 (zoomDirection, zoomAmount)
        {
          type: "title",
          text: "直接参数方式",
          duration: 2,
          x: "25%",
          y: "30%",
          fontSize: 48,
          color: "#FFFFFF",
          fontFamily: "Arial",
          zoomDirection: "in",
          zoomAmount: 0.3
        },
        
        // 方式2: 使用 animations 参数实现相同效果
        {
          type: "title",
          text: "animations 方式",
          duration: 2,
          x: "75%",
          y: "30%",
          fontSize: 48,
          color: "#FF6B6B",
          fontFamily: "Arial",
          animations: [
            {
              property: "scaleX",
              from: 1,
              to: 1.3,
              duration: 2,
              startTime: 0,
              easing: "easeOut"
            },
            {
              property: "scaleY",
              from: 1,
              to: 1.3,
              duration: 2,
              startTime: 0,
              easing: "easeOut"
            }
          ]
        },
        
        // 方式1: 使用直接参数 (split)
        {
          type: "title",
          text: "Hello World",
          duration: 3,
          x: "25%",
          y: "50%",
          fontSize: 36,
          color: "#4ECDC4",
          fontFamily: "Arial",
          split: "word",
          splitDelay: 0.2,
          splitDuration: 0.5,
          zoomDirection: "in",
          zoomAmount: 0.2
        },
        
        // 方式2: 使用 animations 参数实现分割效果
        {
          type: "title",
          text: "Hello World",
          duration: 3,
          x: "75%",
          y: "50%",
          fontSize: 36,
          color: "#45B7D1",
          fontFamily: "Arial",
          animations: [
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 0.5,
              startTime: 0,
              easing: "easeOut"
            },
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 0.5,
              startTime: 0.2,
              easing: "easeOut"
            },
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 0.5,
              startTime: 0.4,
              easing: "easeOut"
            },
            {
              property: "scaleX",
              from: 1,
              to: 1.2,
              duration: 3,
              startTime: 0,
              easing: "easeOut"
            },
            {
              property: "scaleY",
              from: 1,
              to: 1.2,
              duration: 3,
              startTime: 0,
              easing: "easeOut"
            }
          ]
        },
        
        // 方式1: 使用直接参数 (zoomDirection: "out")
        {
          type: "title",
          text: "退出动画",
          duration: 2,
          x: "25%",
          y: "70%",
          fontSize: 48,
          color: "#F39C12",
          fontFamily: "Arial",
          zoomDirection: "out",
          zoomAmount: 0.3
        },
        
        // 方式2: 使用 animations 参数实现退出效果
        {
          type: "title",
          text: "退出动画",
          duration: 2,
          x: "75%",
          y: "70%",
          fontSize: 48,
          color: "#E74C3C",
          fontFamily: "Arial",
          animations: [
            {
              property: "scaleX",
              from: 1.3,
              to: 1,
              duration: 2,
              startTime: 0,
              easing: "easeIn"
            },
            {
              property: "scaleY",
              from: 1.3,
              to: 1,
              duration: 2,
              startTime: 0,
              easing: "easeIn"
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 动画方式对比测试完成: output/animation-comparison-test.mp4");
    
  } catch (error) {
    console.error("❌ 动画方式对比测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testAnimationComparison();
}

export { testAnimationComparison };
