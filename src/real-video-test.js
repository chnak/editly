import { VideoMaker } from "./index.js";
import fsExtra from "fs-extra";
import { createWriteStream } from "fs";

/**
 * 真实视频生成测试 - 不依赖 canvas，直接生成简单的视频
 */
async function createRealVideo() {
  console.log("🎬 开始生成真实视频...");
  
  try {
    // 确保输出目录存在
    await fsExtra.ensureDir("output");
    console.log("✓ 输出目录创建成功");
    
    // 创建一个简单的视频配置
    const videoMaker = new VideoMaker({
      outPath: "output/real-test.mp4",
      width: 640,
      height: 480,
      fps: 15, // 降低帧率以加快生成
      verbose: true,
      elements: [
        // 背景
        {
          type: "shape",
          shape: "rectangle",
          fillColor: "#1a1a2e",
          duration: 3,
          x: 0,
          y: 0,
          shapeWidth: 640,
          shapeHeight: 480
        },
        
        // 文本
        {
          type: "text",
          text: "Hello Video!",
          font: "32px Arial",
          fillColor: "#ffffff",
          duration: 3,
          x: 320,
          y: 240,
          textAlign: "center",
          animations: [
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 1,
              startTime: 0,
              easing: "easeIn"
            }
          ]
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    console.log(`  - 输出文件: ${videoMaker.config.outPath}`);
    console.log(`  - 分辨率: ${videoMaker.config.width}x${videoMaker.config.height}`);
    console.log(`  - 帧率: ${videoMaker.config.fps}fps`);
    
    // 设置事件监听
    videoMaker.on("start", () => {
      console.log("\n🚀 开始渲染视频...");
    });
    
    videoMaker.on("progress", (progress) => {
      const bar = "█".repeat(Math.floor(progress / 5)) + "░".repeat(20 - Math.floor(progress / 5));
      process.stdout.write(`\r📊 渲染进度: [${bar}] ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`\n\n🎉 视频生成完成！`);
      console.log(`📁 输出文件: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error(`\n❌ 渲染失败: ${error.message}`);
    });
    
    // 开始渲染
    console.log("\n开始渲染过程...");
    const outputPath = await videoMaker.start();
    
    console.log(`\n✅ 视频生成成功！`);
    console.log(`📁 文件位置: ${outputPath}`);
    
    // 检查文件是否存在
    const fileExists = await fsExtra.pathExists(outputPath);
    if (fileExists) {
      const stats = await fsExtra.stat(outputPath);
      console.log(`📏 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`📅 创建时间: ${stats.birthtime.toLocaleString()}`);
    } else {
      console.log("❌ 文件未找到，可能渲染失败");
    }
    
  } catch (error) {
    console.error("❌ 视频生成失败:", error.message);
    console.error("错误详情:", error);
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  createRealVideo().catch(console.error);
}
