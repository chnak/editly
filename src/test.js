import { VideoMaker } from "./index.js";
import { createWriteStream } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fsExtra from "fs-extra";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 测试视频制作库
 */
async function testVideoMaker() {
  console.log("开始测试视频制作库...");
  
  // 确保输出目录存在
  await fsExtra.ensureDir("output");
  
  const videoMaker = new VideoMaker({
    outPath: "output/test-video.mp4",
    width: 640,
    height: 480,
    fps: 15, // 降低帧率以加快测试
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
        shapeWidth: 640,
        shapeHeight: 480
      },
      
      // 文本
      {
        type: "text",
        text: "测试视频",
        font: "32px Arial",
        fillColor: "#ffffff",
        duration: 3,
        x: 320,
        y: 240,
        textAlign: "center",
        animations: [
          {
            property: "opacity",
            from: 0,
            to: 1,
            duration: 1,
            startTime: 0,
            easing: "easeIn"
          }
        ]
      }
    ]
  });

  // 监听事件
  videoMaker.on("start", () => {
    console.log("✓ 开始渲染");
  });

  videoMaker.on("progress", (progress) => {
    console.log(`✓ 进度: ${progress}%`);
  });

  videoMaker.on("complete", (outputPath) => {
    console.log(`✓ 渲染完成: ${outputPath}`);
  });

  videoMaker.on("error", (error) => {
    console.error("✗ 渲染失败:", error);
  });

  try {
    const outputPath = await videoMaker.start();
    console.log(`✓ 测试成功！视频已保存到: ${outputPath}`);
  } catch (error) {
    console.error("✗ 测试失败:", error);
  } finally {
    await videoMaker.close();
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testVideoMaker().catch(console.error);
}
