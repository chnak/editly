import { VideoMaker } from "./index.js";

/**
 * 文本渲染测试
 */
async function textRenderTest() {
  console.log("📝 开始文本渲染测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/text-render-test.mp4",
      width: 640,
      height: 480,
      fps: 15,
      verbose: true,
      elements: [
        // 背景
        {
          type: "shape",
          shape: "rectangle",
          fillColor: "#000000",
          duration: 3,
          x: 0,
          y: 0,
          shapeWidth: 640,
          shapeHeight: 480
        },
        
        // 测试文本
        {
          type: "text",
          text: "文本渲染测试",
          font: "48px Arial",
          fillColor: "#ffffff",
          duration: 3,
          x: 320,
          y: 240,
          textAlign: "center"
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    
    // 监听事件
    videoMaker.on("start", () => {
      console.log("🚀 开始渲染文本测试...");
    });
    
    videoMaker.on("progress", (progress) => {
      console.log(`📊 渲染进度: ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`🎉 文本测试完成: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error("❌ 渲染失败:", error);
    });
    
    console.log("开始渲染...");
    const outputPath = await videoMaker.start();
    console.log(`✅ 文本测试视频已保存到: ${outputPath}`);
    
    await videoMaker.close();
    
  } catch (error) {
    console.error("❌ 文本渲染测试失败:", error);
    console.error("错误堆栈:", error.stack);
  }
}

// 运行测试
textRenderTest();
