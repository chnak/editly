import { VideoMaker } from "./index.js";

/**
 * 最小化调试测试
 */
async function minimalDebug() {
  console.log("🔍 开始最小化调试测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/minimal-debug.mp4",
      width: 200,
      height: 200,
      fps: 5,
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
          shapeWidth: 200,
          shapeHeight: 200
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    
    // 监听事件
    videoMaker.on("start", () => {
      console.log("🚀 开始最小化调试...");
    });
    
    videoMaker.on("progress", (progress) => {
      console.log(`📊 渲染进度: ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`🎉 最小化调试完成: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error("❌ 渲染失败:", error);
    });
    
    console.log("开始渲染...");
    const outputPath = await videoMaker.start();
    console.log(`✅ 最小化调试完成: ${outputPath}`);
    
    await videoMaker.close();
    
  } catch (error) {
    console.error("❌ 最小化调试失败:", error);
    console.error("错误堆栈:", error.stack);
  }
}

// 运行调试
minimalDebug();
