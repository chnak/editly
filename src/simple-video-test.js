/**
 * 简单视频测试 - 逐步调试
 */

console.log("🎬 简单视频测试开始...");

async function simpleVideoTest() {
  try {
    console.log("1. 导入模块...");
    const { VideoMaker } = await import("./index.js");
    console.log("✓ 模块导入成功");

    console.log("2. 创建 VideoMaker 实例...");
    const videoMaker = new VideoMaker({
      outPath: "output/simple-test.mp4",
      width: 320,
      height: 240,
      fps: 10,
      elements: [
        {
          type: "text",
          text: "Hello!",
          font: "24px Arial",
          fillColor: "#ffffff",
          duration: 2,
          x: 160,
          y: 120,
          textAlign: "center"
        }
      ]
    });
    console.log("✓ VideoMaker 实例创建成功");

    console.log("3. 设置事件监听...");
    videoMaker.on("start", () => {
      console.log("🚀 开始渲染...");
    });
    
    videoMaker.on("progress", (progress) => {
      console.log(`📊 进度: ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`🎉 完成: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error(`❌ 错误: ${error.message}`);
    });
    console.log("✓ 事件监听设置成功");

    console.log("4. 开始渲染...");
    const result = await videoMaker.start();
    console.log(`✓ 渲染完成: ${result}`);

  } catch (error) {
    console.error("❌ 测试失败:", error.message);
    console.error("错误堆栈:", error.stack);
  }
}

simpleVideoTest();
