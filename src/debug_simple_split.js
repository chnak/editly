import { VideoMaker } from "./index.js";

/**
 * 调试简单分割效果
 */
async function debugSimpleSplit() {
  console.log("🔍 调试简单分割效果...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/debug-simple-split.mp4",
      width: 800,
      height: 600,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 4,
          x: "0%",
          y: "0%",
          imageWidth: 800,
          imageHeight: 600,
          fit: "cover"
        },
        
        // 测试1: 简单的分割效果
        {
          type: "title",
          text: "ABC",
          duration: 2,
          x: "50%",
          y: "50%",
          fontSize: 72,
          color: "#FFFFFF",
          fontFamily: "Arial",
          animations: [
            {
              type: "split",
              split: "char",
              segmentDelay: 0.3,
              segmentDuration: 0.6
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 调试简单分割效果完成: output/debug-simple-split.mp4");
    
  } catch (error) {
    console.error("❌ 调试简单分割效果失败:", error);
  }
}

// 运行调试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  debugSimpleSplit();
}

export { debugSimpleSplit };
