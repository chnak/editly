import { VideoMaker } from "./index.js";

/**
 * 修复后的文本渲染测试
 */
async function fixedTextTest() {
  console.log("🔧 开始修复后的文本渲染测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/fixed-text-test.mp4",
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
          duration: 3,
          x: 0,
          y: 0,
          shapeWidth: 800,
          shapeHeight: 600
        },
        
        // 主标题
        {
          type: "text",
          text: "修复后的文本渲染",
          font: "bold 48px Arial",
          fillColor: "#00d4ff",
          duration: 3,
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
            }
          ]
        },
        
        // 副标题
        {
          type: "text",
          text: "现在应该可以正常显示了！",
          font: "24px Arial",
          fillColor: "#ffffff",
          duration: 3,
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
            }
          ]
        },
        
        // 多行文本测试
        {
          type: "text",
          text: "多行文本测试\n第二行文本\n第三行文本",
          font: "20px Arial",
          fillColor: "#cccccc",
          duration: 3,
          x: 400,
          y: 400,
          textAlign: "center",
          lineHeight: 1.5,
          animations: [
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 1,
              startTime: 1,
              easing: "easeIn"
            }
          ]
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    
    // 监听事件
    videoMaker.on("start", () => {
      console.log("\n🚀 开始渲染修复后的文本测试...");
    });
    
    videoMaker.on("progress", (progress) => {
      const bar = "█".repeat(Math.floor(progress / 5)) + "░".repeat(20 - Math.floor(progress / 5));
      process.stdout.write(`\r📊 渲染进度: [${bar}] ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`\n\n🎉 修复后的文本测试完成！`);
      console.log(`📁 输出文件: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error(`\n❌ 渲染失败: ${error.message}`);
    });
    
    // 开始渲染
    console.log("\n开始渲染过程...");
    const outputPath = await videoMaker.start();
    
    console.log(`\n✅ 修复后的文本测试成功！`);
    console.log(`📁 文件位置: ${outputPath}`);
    
    await videoMaker.close();
    
  } catch (error) {
    console.error("❌ 修复后的文本测试失败:", error.message);
    console.error("错误详情:", error);
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  fixedTextTest().catch(console.error);
}
