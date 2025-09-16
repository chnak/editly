import { VideoMaker } from "./index.js";
import fsExtra from "fs-extra";

/**
 * 功能演示 - 展示视频制作库的核心功能
 */
async function runDemo() {
  console.log("🎬 视频制作库功能演示");
  console.log("=" .repeat(50));
  
  try {
    // 确保输出目录存在
    await fsExtra.ensureDir("output");
    console.log("✓ 输出目录准备完成");
    
    // 创建视频制作器实例
    const videoMaker = new VideoMaker({
      outPath: "output/demo-video.mp4",
      width: 800,
      height: 600,
      fps: 24,
      verbose: true,
      elements: [
        // 背景
        {
          type: "shape",
          shape: "rectangle",
          fillColor: "#1a1a2e",
          duration: 5,
          x: 0,
          y: 0,
          shapeWidth: 800,
          shapeHeight: 600
        },
        
        // 主标题
        {
          type: "text",
          text: "视频制作库演示",
          font: "bold 48px Arial",
          fillColor: "#00d4ff",
          duration: 5,
          x: 400,
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
          text: "基于 Creatomate 配置结构",
          font: "24px Arial",
          fillColor: "#ffffff",
          duration: 5,
          x: 400,
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
            },
            {
              property: "x",
              from: 600,
              to: 400,
              duration: 1.5,
              startTime: 0.5,
              easing: "easeOut"
            }
          ]
        },
        
        // 特性列表
        {
          type: "text",
          text: "✨ 多种元素类型\n🎨 丰富动画效果\n🚀 高性能渲染\n📱 灵活布局",
          font: "18px Arial",
          fillColor: "#cccccc",
          duration: 5,
          x: 400,
          y: 350,
          textAlign: "center",
          lineHeight: 1.5,
          animations: [
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 2,
              startTime: 1,
              easing: "easeIn"
            }
          ]
        },
        
        // 装饰圆形
        {
          type: "shape",
          shape: "circle",
          fillColor: "rgba(0, 212, 255, 0.2)",
          strokeColor: "#00d4ff",
          strokeWidth: 3,
          shapeWidth: 100,
          shapeHeight: 100,
          duration: 5,
          x: 400,
          y: 450,
          animations: [
            {
              property: "rotation",
              from: 0,
              to: 360,
              duration: 3,
              startTime: 1.5,
              easing: "linear"
            },
            {
              property: "scaleX",
              from: 0,
              to: 1,
              duration: 1,
              startTime: 1.5,
              easing: "bounce"
            },
            {
              property: "scaleY",
              from: 0,
              to: 1,
              duration: 1,
              startTime: 1.5,
              easing: "bounce"
            }
          ]
        }
      ]
    });
    
    console.log("✓ 视频制作器配置完成");
    console.log(`  - 输出文件: ${videoMaker.config.outPath}`);
    console.log(`  - 分辨率: ${videoMaker.config.width}x${videoMaker.config.height}`);
    console.log(`  - 帧率: ${videoMaker.config.fps}fps`);
    console.log(`  - 元素数量: ${videoMaker.config.elements.length}`);
    
    // 设置事件监听
    videoMaker.on("start", () => {
      console.log("\n🚀 开始渲染视频...");
    });
    
    videoMaker.on("progress", (progress) => {
      const bar = "█".repeat(Math.floor(progress / 5)) + "░".repeat(20 - Math.floor(progress / 5));
      process.stdout.write(`\r📊 渲染进度: [${bar}] ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`\n\n🎉 视频渲染完成！`);
      console.log(`📁 输出文件: ${outputPath}`);
      console.log(`📏 文件大小: ${getFileSize(outputPath)}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error(`\n❌ 渲染失败: ${error.message}`);
    });
    
    console.log("✓ 事件监听器设置完成");
    
    // 开始渲染
    console.log("\n开始渲染过程...");
    const outputPath = await videoMaker.start();
    
    console.log(`\n✅ 演示完成！视频已保存到: ${outputPath}`);
    
  } catch (error) {
    console.error("❌ 演示失败:", error.message);
    console.error("错误详情:", error);
  } finally {
    // 清理资源
    if (videoMaker) {
      await videoMaker.close();
    }
  }
}

/**
 * 获取文件大小
 */
function getFileSize(filePath) {
  try {
    const fs = require('fs');
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    return `${fileSizeInMB} MB`;
  } catch (error) {
    return "未知";
  }
}

// 运行演示
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo().catch(console.error);
}
