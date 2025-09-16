import { VideoMaker } from "./index.js";

/**
 * 视频循环功能测试
 */
async function testVideoLoop() {
  console.log("开始视频循环功能测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/video-loop-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 6,
          x: "0%",
          y: "0%",
          imageWidth: 1280,
          imageHeight: 720,
          fit: "cover"
        },
        
        // 测试短视频循环播放 - 视频只有2秒，但元素需要播放6秒
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 6, // 元素播放6秒
          x: "10%",
          y: "10%",
          videoWidth: 300,
          videoHeight: 200,
          fit: "contain",
          cutFrom: 0,  // 从开始
          cutTo: 2,    // 只播放2秒
          loop: true   // 启用循环
        },
        
        // 测试视频截取后循环播放
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 4, // 元素播放4秒
          x: "60%",
          y: "10%",
          videoWidth: 300,
          videoHeight: 200,
          fit: "contain",
          cutFrom: 1,  // 从第1秒开始
          cutTo: 2,    // 到第2秒结束（只有1秒视频）
          loop: true   // 启用循环
        },
        
        // 测试慢速循环播放
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 5, // 元素播放5秒
          x: "10%",
          y: "60%",
          videoWidth: 300,
          videoHeight: 200,
          fit: "contain",
          cutFrom: 0.5, // 从第0.5秒开始
          cutTo: 1.5,   // 到第1.5秒结束（只有1秒视频）
          speedFactor: 0.5, // 0.5倍速播放
          loop: true    // 启用循环
        },
        
        // 测试不循环的视频（对比）
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 2, // 元素播放2秒
          x: "60%",
          y: "60%",
          videoWidth: 300,
          videoHeight: 200,
          fit: "contain",
          cutFrom: 0,  // 从开始
          cutTo: 2,    // 播放2秒
          loop: false  // 不循环
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 视频循环功能测试完成: output/video-loop-test.mp4");
    
  } catch (error) {
    console.error("❌ 视频循环功能测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testVideoLoop();
}

export { testVideoLoop };
