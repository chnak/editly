import { VideoMaker } from "./index.js";
import fsExtra from "fs-extra";

/**
 * 丰富视频测试 - 包含多种元素和动画
 */
async function richVideoTest() {
  console.log("🎬 开始生成丰富视频...");
  
  try {
    // 确保输出目录存在
    await fsExtra.ensureDir("output");
    
    const videoMaker = new VideoMaker({
      outPath: "output/rich-video.mp4",
      width: 800,
      height: 600,
      fps: 24,
      verbose: true,
      elements: [
        // 背景渐变
        {
          type: "shape",
          shape: "rectangle",
          fillColor: "#1a1a2e",
          duration: 6,
          x: 0,
          y: 0,
          shapeWidth: 800,
          shapeHeight: 600
        },
        
        // 主标题 - 带缩放和淡入动画
        {
          type: "text",
          text: "视频制作库演示",
          font: "bold 64px Arial",
          fillColor: "#00d4ff",
          duration: 6,
          x: 400,
          y: 150,
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
              from: 0.3,
              to: 1,
              duration: 1.5,
              startTime: 0,
              easing: "easeOut"
            },
            {
              property: "scaleY",
              from: 0.3,
              to: 1,
              duration: 1.5,
              startTime: 0,
              easing: "easeOut"
            }
          ]
        },
        
        // 副标题 - 带滑动动画
        {
          type: "text",
          text: "基于 Creatomate 配置结构",
          font: "32px Arial",
          fillColor: "#ffffff",
          duration: 6,
          x: 400,
          y: 250,
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
              duration: 2,
              startTime: 0.5,
              easing: "easeOut"
            }
          ]
        },
        
        // 特性列表 - 逐行显示
        {
          type: "text",
          text: "✨ 多种元素类型\n🎨 丰富动画效果\n🚀 高性能渲染\n📱 灵活布局",
          font: "20px Arial",
          fillColor: "#cccccc",
          duration: 6,
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
              startTime: 1.5,
              easing: "easeIn"
            }
          ]
        },
        
        // 装饰圆形 - 带旋转和弹跳动画
        {
          type: "shape",
          shape: "circle",
          fillColor: "rgba(0, 212, 255, 0.2)",
          strokeColor: "#00d4ff",
          strokeWidth: 4,
          shapeWidth: 120,
          shapeHeight: 120,
          duration: 6,
          x: 400,
          y: 450,
          animations: [
            {
              property: "rotation",
              from: 0,
              to: 720,
              duration: 4,
              startTime: 2,
              easing: "linear"
            },
            {
              property: "scaleX",
              from: 0,
              to: 1,
              duration: 0.8,
              startTime: 2,
              easing: "bounce"
            },
            {
              property: "scaleY",
              from: 0,
              to: 1,
              duration: 0.8,
              startTime: 2,
              easing: "bounce"
            }
          ]
        },
        
        // 底部信息 - 带淡入动画
        {
          type: "text",
          text: "基于 Node.js 和 Canvas 技术",
          font: "16px Arial",
          fillColor: "#888888",
          duration: 6,
          x: 400,
          y: 550,
          textAlign: "center",
          animations: [
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 2,
              startTime: 3,
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
    console.log(`  - 元素数量: ${videoMaker.config.elements.length}`);
    
    // 设置事件监听
    videoMaker.on("start", () => {
      console.log("\n🚀 开始渲染丰富视频...");
    });
    
    videoMaker.on("progress", (progress) => {
      const bar = "█".repeat(Math.floor(progress / 5)) + "░".repeat(20 - Math.floor(progress / 5));
      process.stdout.write(`\r📊 渲染进度: [${bar}] ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`\n\n🎉 丰富视频生成完成！`);
      console.log(`📁 输出文件: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error(`\n❌ 渲染失败: ${error.message}`);
    });
    
    // 开始渲染
    console.log("\n开始渲染过程...");
    const outputPath = await videoMaker.start();
    
    console.log(`\n✅ 丰富视频生成成功！`);
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
  richVideoTest().catch(console.error);
}
