import { VideoMaker } from "./index.js";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

/**
 * 字体测试
 */
async function fontTest() {
  console.log("🔤 开始字体测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/font-test.mp4",
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
        
        // 使用默认字体的文本
        {
          type: "title",
          text: "默认字体 Arial",
          font: "48px Arial",
          fillColor: "#ffffff",
          duration: 3,
          x: 400,
          y: 200,
          textAlign: "center"
        },
        
        // 使用自定义字体的文本
        {
          type: "title",
          text: "Patua One 字体",
          font: "48px",
          fontPath: resolve(dirname(fileURLToPath(import.meta.url)), "./fonts/PatuaOne-Regular.ttf"),
          fillColor: "#00d4ff",
          duration: 3,
          x: 400,
          y: 300,
          textAlign: "center"
        },
        
        // 使用字体族的文本
        {
          type: "title",
          text: "字体族测试",
          font: "36px",
          fontFamily: "sans-serif",
          fillColor: "#ff6b6b",
          duration: 3,
          x: 400,
          y: 400,
          textAlign: "center"
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    
    // 监听事件
    videoMaker.on("start", () => {
      console.log("🚀 开始字体测试...");
    });
    
    videoMaker.on("progress", (progress) => {
      console.log(`📊 渲染进度: ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`🎉 字体测试完成: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error("❌ 渲染失败:", error);
    });
    
    console.log("开始渲染...");
    const outputPath = await videoMaker.start();
    console.log(`✅ 字体测试完成: ${outputPath}`);
    
    await videoMaker.close();
    
  } catch (error) {
    console.error("❌ 字体测试失败:", error);
    console.error("错误堆栈:", error.stack);
  }
}

// 运行测试
fontTest();
