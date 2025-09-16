import { VideoMaker } from "./index.js";

/**
 * 纯文本测试 - 只测试文本渲染
 */
async function textOnlyTest() {
  console.log("🔤 开始纯文本测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/text-only-test.mp4",
      width: 400,
      height: 200,
      fps: 12,
      verbose: true,
      elements: [
        // 只测试文本，不要背景
        {
          type: "text",
          text: "Hello World!",
          font: "32px Arial",
          fillColor: "#ff0000", // 红色文本
          duration: 2,
          x: 200, // 中心 X
          y: 100, // 中心 Y
          textAlign: "center",
          textBaseline: "center"
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    
    // 监听事件
    videoMaker.on("start", () => {
      console.log("🚀 开始纯文本测试...");
    });
    
    videoMaker.on("progress", (progress) => {
      console.log(`📊 渲染进度: ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`🎉 纯文本测试完成: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error("❌ 渲染失败:", error);
    });
    
    console.log("开始渲染...");
    const outputPath = await videoMaker.start();
    console.log(`✅ 纯文本测试完成: ${outputPath}`);
    
    await videoMaker.close();
    
  } catch (error) {
    console.error("❌ 纯文本测试失败:", error);
    console.error("错误堆栈:", error.stack);
  }
}

// 运行测试
textOnlyTest();
