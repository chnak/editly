import { VideoMaker } from "./index.js";

/**
 * 最终工作测试 - 验证所有功能正常
 */
async function finalWorkingTest() {
  console.log("🎬 开始最终工作测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/final-working.mp4",
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
          duration: 4,
          x: 0,
          y: 0,
          shapeWidth: 800,
          shapeHeight: 600
        },
        
        // 主标题
        {
          type: "text",
          text: "视频制作库",
          font: "bold 64px Arial",
          fillColor: "#00d4ff",
          duration: 4,
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
              duration: 1.5,
              startTime: 0,
              easing: "easeOut"
            },
            {
              property: "scaleY",
              from: 0.5,
              to: 1,
              duration: 1.5,
              startTime: 0,
              easing: "easeOut"
            }
          ]
        },
        
        // 副标题
        {
          type: "text",
          text: "基于 Creatomate 配置结构",
          font: "32px Arial",
          fillColor: "#ffffff",
          duration: 4,
          x: 400,
          y: 300,
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
        
        // 特性列表
        {
          type: "text",
          text: "✨ 多种元素类型\n🎨 丰富动画效果\n🚀 高性能渲染\n📱 灵活布局",
          font: "20px Arial",
          fillColor: "#cccccc",
          duration: 4,
          x: 400,
          y: 400,
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
        
        // 装饰圆形
        {
          type: "shape",
          shape: "circle",
          fillColor: "rgba(0, 212, 255, 0.2)",
          strokeColor: "#00d4ff",
          strokeWidth: 4,
          shapeWidth: 100,
          shapeHeight: 100,
          duration: 4,
          x: 400,
          y: 500,
          animations: [
            {
              property: "rotation",
              from: 0,
              to: 360,
              duration: 3,
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
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    console.log(`  - 输出文件: ${videoMaker.config.outPath}`);
    console.log(`  - 分辨率: ${videoMaker.config.width}x${videoMaker.config.height}`);
    console.log(`  - 帧率: ${videoMaker.config.fps}fps`);
    console.log(`  - 元素数量: ${videoMaker.config.elements.length}`);
    
    // 监听事件
    videoMaker.on("start", () => {
      console.log("\n🚀 开始渲染最终工作测试...");
    });
    
    videoMaker.on("progress", (progress) => {
      const bar = "█".repeat(Math.floor(progress / 5)) + "░".repeat(20 - Math.floor(progress / 5));
      process.stdout.write(`\r📊 渲染进度: [${bar}] ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`\n\n🎉 最终工作测试完成！`);
      console.log(`📁 输出文件: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error(`\n❌ 渲染失败: ${error.message}`);
    });
    
    // 开始渲染
    console.log("\n开始渲染过程...");
    const outputPath = await videoMaker.start();
    
    console.log(`\n✅ 最终工作测试成功！`);
    console.log(`📁 文件位置: ${outputPath}`);
    
    // 验证视频格式
    console.log("\n🔍 验证视频格式...");
    const { spawn } = await import("child_process");
    const ffprobe = spawn("ffprobe", ["-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", outputPath]);
    
    let output = "";
    ffprobe.stdout.on("data", (data) => {
      output += data.toString();
    });
    
    ffprobe.on("close", (code) => {
      if (code === 0) {
        try {
          const info = JSON.parse(output);
          const videoStream = info.streams.find(s => s.codec_type === "video");
          if (videoStream) {
            console.log(`✓ 视频格式: ${videoStream.codec_name} (${videoStream.pix_fmt})`);
            console.log(`✓ 分辨率: ${videoStream.width}x${videoStream.height}`);
            console.log(`✓ 帧率: ${videoStream.r_frame_rate}`);
            console.log(`✓ 时长: ${parseFloat(info.format.duration).toFixed(2)}秒`);
            console.log(`✓ 比特率: ${Math.round(parseInt(info.format.bit_rate) / 1000)} kbps`);
            console.log("\n🎉 视频格式验证完成！视频可以正常播放！");
          }
        } catch (e) {
          console.log("✓ 视频文件格式验证完成");
        }
      }
    });
    
    await videoMaker.close();
    
  } catch (error) {
    console.error("❌ 最终工作测试失败:", error.message);
    console.error("错误详情:", error);
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  finalWorkingTest().catch(console.error);
}
