import { VideoMaker } from "./index.js";

/**
 * 简单视频元素测试
 */
async function testSimpleVideo() {
  console.log("开始简单视频元素测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/simple-video-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 3,
          x: "0%",
          y: "0%",
          imageWidth: 1280,
          imageHeight: 720,
          fit: "cover"
        },
        
        // 测试一个视频元素
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "50%",
          y: "50%",
          videoWidth: 400,
          videoHeight: 300,
          fit: "contain"
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 简单视频测试完成: output/simple-video-test.mp4");
    
  } catch (error) {
    console.error("❌ 简单视频测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testSimpleVideo();
}

export { testSimpleVideo };