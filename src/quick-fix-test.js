/**
 * 快速修复测试
 */

console.log("🔧 开始快速修复测试...");

async function quickFixTest() {
  try {
    console.log("1. 导入模块...");
    const { VideoMaker } = await import("./index.js");
    console.log("✓ 模块导入成功");

    console.log("2. 创建简单视频...");
    const videoMaker = new VideoMaker({
      outPath: "output/quick-fix.mp4",
      width: 320,
      height: 240,
      fps: 15,
      elements: [
        {
          type: "text",
          text: "Quick Fix Test",
          font: "24px Arial",
          fillColor: "#ffffff",
          duration: 2,
          x: 160,
          y: 120,
          textAlign: "center"
        }
      ]
    });
    console.log("✓ 视频配置创建成功");

    console.log("3. 设置事件监听...");
    videoMaker.on("start", () => console.log("🚀 开始渲染..."));
    videoMaker.on("progress", (p) => process.stdout.write(`\r📊 进度: ${p}%`));
    videoMaker.on("complete", (path) => console.log(`\n🎉 完成: ${path}`));
    videoMaker.on("error", (err) => console.error(`\n❌ 错误: ${err.message}`));
    console.log("✓ 事件监听设置成功");

    console.log("4. 开始渲染...");
    const result = await videoMaker.start();
    console.log(`✓ 渲染完成: ${result}`);

  } catch (error) {
    console.error("❌ 测试失败:", error.message);
    console.error("错误堆栈:", error.stack);
  }
}

quickFixTest();
