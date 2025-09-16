import { VideoMaker } from "./index.js";

/**
 * 文本居中测试
 */
async function centerTest() {
  console.log("🎯 开始文本居中测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/center-test.mp4",
      width: 800,
      height: 600,
      fps: 24,
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
          shapeWidth: 800,
          shapeHeight: 600
        },
        
        // 测试文本 - 应该在屏幕中心
        {
          type: "text",
          text: "居中测试",
          font: "48px Arial",
          fillColor: "#ffffff",
          duration: 3,
          x: 400, // 屏幕中心 X
          y: 300, // 屏幕中心 Y
          textAlign: "center",
          textBaseline: "center"
        },
        
        // 参考点 - 标记中心位置
        {
          type: "shape",
          shape: "circle",
          fillColor: "#ff0000",
          shapeWidth: 10,
          shapeHeight: 10,
          duration: 3,
          x: 400,
          y: 300
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    
    // 监听事件
    videoMaker.on("start", () => {
      console.log("🚀 开始文本居中测试...");
    });
    
    videoMaker.on("progress", (progress) => {
      console.log(`📊 渲染进度: ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`🎉 文本居中测试完成: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error("❌ 渲染失败:", error);
    });
    
    console.log("开始渲染...");
    const outputPath = await videoMaker.start();
    console.log(`✅ 文本居中测试完成: ${outputPath}`);
    
    await videoMaker.close();
    
  } catch (error) {
    console.error("❌ 文本居中测试失败:", error);
    console.error("错误堆栈:", error.stack);
  }
}

// 运行测试
centerTest();
