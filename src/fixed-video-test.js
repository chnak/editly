import { VideoMaker } from "./index.js";
import fsExtra from "fs-extra";

/**
 * 修复的视频测试 - 使用兼容的格式
 */
async function fixedVideoTest() {
  console.log("🎬 开始生成修复的视频...");
  
  try {
    // 确保输出目录存在
    await fsExtra.ensureDir("output");
    
    const videoMaker = new VideoMaker({
      outPath: "output/fixed-test.mp4",
      width: 640,
      height: 480,
      fps: 24,
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
        
        // 主标题
        {
          type: "text",
          text: "修复的视频测试",
          font: "bold 48px Arial",
          fillColor: "#00d4ff",
          duration: 3,
          x: 320,
          y: 200,
          textAlign: "center",
          animations: [
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 1,
              startTime: 0,
              easing: "easeIn"
            },
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
            }
          ]
        },
        
        // 副标题
        {
          type: "text",
          text: "使用 yuv420p 格式",
          font: "24px Arial",
          fillColor: "#ffffff",
          duration: 3,
          x: 320,
          y: 280,
          textAlign: "center",
          animations: [
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
        
        // 装饰圆形
        {
          type: "shape",
          shape: "circle",
          fillColor: "rgba(0, 212, 255, 0.3)",
          strokeColor: "#00d4ff",
          strokeWidth: 3,
          shapeWidth: 80,
          shapeHeight: 80,
          duration: 3,
          x: 320,
          y: 350,
          animations: [
            {
              property: "rotation",
              from: 0,
              to: 360,
              duration: 2,
              startTime: 1,
              easing: "linear"
            },
            {
              property: "scaleX",
              from: 0,
              to: 1,
              duration: 0.5,
              startTime: 1,
              easing: "bounce"
            },
            {
              property: "scaleY",
              from: 0,
              to: 1,
              duration: 0.5,
              startTime: 1,
              easing: "bounce"
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
      console.log("\n🚀 开始渲染修复的视频...");
    });
    
    videoMaker.on("progress", (progress) => {
      const bar = "█".repeat(Math.floor(progress / 5)) + "░".repeat(20 - Math.floor(progress / 5));
      process.stdout.write(`\r📊 渲染进度: [${bar}] ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`\n\n🎉 修复视频生成完成！`);
      console.log(`📁 输出文件: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error(`\n❌ 渲染失败: ${error.message}`);
    });
    
    // 开始渲染
    console.log("\n开始渲染过程...");
    const outputPath = await videoMaker.start();
    
    console.log(`\n✅ 修复视频生成成功！`);
    console.log(`📁 文件位置: ${outputPath}`);
    
    // 检查文件
    const fileExists = await fsExtra.pathExists(outputPath);
    if (fileExists) {
      const stats = await fsExtra.stat(outputPath);
      console.log(`📏 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`📅 创建时间: ${stats.birthtime.toLocaleString()}`);
    }
    
  } catch (error) {
    console.error("❌ 视频生成失败:", error.message);
    console.error("错误详情:", error);
  } finally {
    if (videoMaker) {
      await videoMaker.close();
    }
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  fixedVideoTest().catch(console.error);
}
