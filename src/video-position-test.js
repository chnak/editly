import { VideoMaker } from "./index.js";

/**
 * 视频元素位置测试
 */
async function testVideoPosition() {
  console.log("开始视频元素位置测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/video-position-test.mp4",
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
        
        // 测试不同位置的视频元素
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "10%",
          y: "10%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain"
        },
        
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "70%",
          y: "10%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain"
        },
        
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "10%",
          y: "60%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain"
        },
        
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "70%",
          y: "60%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain"
        },
        
        // 测试中心位置
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "50%",
          y: "50%",
          videoWidth: 300,
          videoHeight: 200,
          fit: "cover"
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 视频位置测试完成: output/video-position-test.mp4");
    
  } catch (error) {
    console.error("❌ 视频位置测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testVideoPosition();
}

export { testVideoPosition };
