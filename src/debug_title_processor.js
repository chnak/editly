import { createTitleElement } from "./elements/titleProcessor.js";
import { createCanvas } from "canvas";

/**
 * 调试 titleProcessor 的分割效果
 */
async function debugTitleProcessor() {
  console.log("🔍 调试 titleProcessor 分割效果...");
  
  try {
    // 创建画布
    const canvas = createCanvas(800, 600);
    const fabricCanvas = new (await import("fabric/node")).Canvas(canvas);
    
    // 测试分割效果
    const titleElement = await createTitleElement({
      text: "Hello World",
      fontSize: 48,
      color: "#FFFFFF",
      fontFamily: "Arial",
      x: 100,
      y: 100,
      width: 800,
      height: 600,
      animations: [
        {
          type: "split",
          split: "word",
          segmentDelay: 0.2,
          segmentDuration: 0.5
        }
      ]
    });
    
    console.log("📝 测试不同进度:");
    
    // 测试不同进度
    for (let progress = 0; progress <= 1; progress += 0.2) {
      console.log(`\n进度 ${progress.toFixed(1)}:`);
      
      try {
        const frame = await titleElement.readNextFrame(progress, fabricCanvas);
        if (frame) {
          console.log(`  帧数据: ${frame.data ? frame.data.length : 0} 字节`);
          console.log(`  尺寸: ${frame.width}x${frame.height}`);
        } else {
          console.log("  无帧数据");
        }
      } catch (error) {
        console.error(`  错误: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error("❌ 调试失败:", error);
  }
}

// 运行调试
debugTitleProcessor();
