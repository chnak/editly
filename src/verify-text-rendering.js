import { VideoMaker } from "./index.js";

/**
 * 验证文本渲染 - 创建明显的测试
 */
async function verifyTextRendering() {
  console.log("🔍 开始验证文本渲染...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/verify-text-rendering.mp4",
      width: 800,
      height: 600,
      fps: 24,
      verbose: true,
      elements: [
        // 明显的背景
        {
          type: "shape",
          shape: "rectangle",
          fillColor: "#ff0000", // 红色背景
          duration: 3,
          x: 0,
          y: 0,
          shapeWidth: 800,
          shapeHeight: 600
        },
        
        // 大号白色文本
        {
          type: "text",
          text: "HELLO WORLD!",
          font: "72px Arial",
          fillColor: "#ffffff", // 白色文本
          duration: 3,
          x: 400, // 中心 X
          y: 300, // 中心 Y
          textAlign: "center",
          textBaseline: "center"
        },
        
        // 小号黄色文本
        {
          type: "text",
          text: "测试文本",
          font: "48px Arial",
          fillColor: "#ffff00", // 黄色文本
          duration: 3,
          x: 400, // 中心 X
          y: 400, // 下方
          textAlign: "center",
          textBaseline: "center"
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    
    // 监听事件
    videoMaker.on("start", () => {
      console.log("🚀 开始验证文本渲染...");
    });
    
    videoMaker.on("progress", (progress) => {
      console.log(`📊 渲染进度: ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`🎉 验证完成: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error("❌ 渲染失败:", error);
    });
    
    console.log("开始渲染...");
    const outputPath = await videoMaker.start();
    console.log(`✅ 验证完成: ${outputPath}`);
    
    await videoMaker.close();
    
  } catch (error) {
    console.error("❌ 验证失败:", error);
    console.error("错误堆栈:", error.stack);
  }
}

// 运行验证
verifyTextRendering();
