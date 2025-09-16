import { VideoMaker } from "./index.js";

/**
 * 详细调试测试
 */
async function detailedDebug() {
  console.log("🔍 开始详细调试测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/detailed-debug.mp4",
      width: 100,
      height: 100,
      fps: 2,
      verbose: true,
      elements: [
        // 只测试背景
        {
          type: "shape",
          shape: "rectangle",
          fillColor: "#ff0000", // 红色
          duration: 1,
          x: 0,
          y: 0,
          shapeWidth: 100,
          shapeHeight: 100
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    console.log("元素配置:", videoMaker.config.elements[0]);
    
    // 监听事件
    videoMaker.on("start", () => {
      console.log("🚀 开始详细调试...");
    });
    
    videoMaker.on("progress", (progress) => {
      console.log(`📊 渲染进度: ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`🎉 详细调试完成: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error("❌ 渲染失败:", error);
    });
    
    console.log("开始渲染...");
    const outputPath = await videoMaker.start();
    console.log(`✅ 详细调试完成: ${outputPath}`);
    
    await videoMaker.close();
    
  } catch (error) {
    console.error("❌ 详细调试失败:", error);
    console.error("错误堆栈:", error.stack);
  }
}

// 运行调试
detailedDebug();
