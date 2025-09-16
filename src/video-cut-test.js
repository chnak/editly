import { VideoMaker } from "./index.js";

/**
 * 视频截取功能测试
 */
async function testVideoCut() {
  console.log("开始视频截取功能测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/video-cut-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 4,
          x: "0%",
          y: "0%",
          imageWidth: 1280,
          imageHeight: 720,
          fit: "cover"
        },
        
        // 测试视频截取 - 从第1秒开始，播放2秒
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 2,
          x: "10%",
          y: "10%",
          videoWidth: 300,
          videoHeight: 200,
          fit: "contain",
          cutFrom: 1, // 从第1秒开始
          cutTo: 3    // 到第3秒结束
        },
        
        // 测试视频截取 - 从第2秒开始，播放1.5秒
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 1.5,
          x: "60%",
          y: "10%",
          videoWidth: 300,
          videoHeight: 200,
          fit: "contain",
          cutFrom: 2, // 从第2秒开始
          cutTo: 3.5  // 到第3.5秒结束
        },
        
        // 测试慢速播放
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 2,
          x: "10%",
          y: "60%",
          videoWidth: 300,
          videoHeight: 200,
          fit: "contain",
          cutFrom: 0.5, // 从第0.5秒开始
          cutTo: 2.5,   // 到第2.5秒结束
          speedFactor: 0.5 // 0.5倍速播放
        },
        
        // 测试快速播放
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 1,
          x: "60%",
          y: "60%",
          videoWidth: 300,
          videoHeight: 200,
          fit: "contain",
          cutFrom: 1,   // 从第1秒开始
          cutTo: 3,     // 到第3秒结束
          speedFactor: 2 // 2倍速播放
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 视频截取功能测试完成: output/video-cut-test.mp4");
    
  } catch (error) {
    console.error("❌ 视频截取功能测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testVideoCut();
}

export { testVideoCut };
