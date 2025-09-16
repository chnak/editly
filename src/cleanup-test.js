import { VideoMaker } from "./index.js";
import fsExtra from "fs-extra";

/**
 * 缓存清理测试
 */
async function cleanupTest() {
  console.log("🧹 开始缓存清理测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/cleanup-test.mp4",
      width: 320,
      height: 240,
      fps: 15,
      elements: [
        {
          type: "text",
          text: "Cleanup Test",
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
    
    // 设置事件监听
    videoMaker.on("start", () => console.log("🚀 开始渲染..."));
    videoMaker.on("progress", (p) => process.stdout.write(`\r📊 进度: ${p}%`));
    videoMaker.on("complete", (path) => console.log(`\n🎉 完成: ${path}`));
    videoMaker.on("error", (err) => console.error(`\n❌ 错误: ${err.message}`));
    
    // 开始渲染
    console.log("开始渲染...");
    const result = await videoMaker.start();
    console.log(`渲染完成: ${result}`);
    
    // 手动关闭以触发清理
    console.log("关闭渲染器...");
    await videoMaker.close();
    console.log("✓ 渲染器已关闭，缓存应该已清理");
    
  } catch (error) {
    console.error("❌ 测试失败:", error.message);
  }
}

cleanupTest();
