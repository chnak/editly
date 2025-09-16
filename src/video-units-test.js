import { VideoMaker } from "./index.js";

/**
 * 视频元素位置单位测试
 */
async function testVideoUnits() {
  console.log("开始视频元素位置单位测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/video-units-test.mp4",
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
        
        // 测试像素单位
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "100px",
          y: "100px",
          videoWidth: 150,
          videoHeight: 100,
          fit: "contain"
        },
        
        // 测试百分比单位
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "75%",
          y: "25%",
          videoWidth: 150,
          videoHeight: 100,
          fit: "contain"
        },
        
        // 测试 vw/vh 单位
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "10vw",
          y: "60vh",
          videoWidth: 150,
          videoHeight: 100,
          fit: "contain"
        },
        
        // 测试位置表达式
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "50% + 100px",
          y: "50% - 50px",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain"
        },
        
        // 测试预定义位置
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          position: "top-right",
          videoWidth: 150,
          videoHeight: 100,
          fit: "contain"
        },
        
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          position: "bottom-left",
          videoWidth: 150,
          videoHeight: 100,
          fit: "contain"
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 视频位置单位测试完成: output/video-units-test.mp4");
    
  } catch (error) {
    console.error("❌ 视频位置单位测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testVideoUnits();
}

export { testVideoUnits };
