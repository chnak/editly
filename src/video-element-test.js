import { VideoMaker } from "./index.js";

/**
 * 测试视频元素的大小和位置功能
 */
async function testVideoElement() {
  console.log("开始测试视频元素功能...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/video-element-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 5,
          x: "0%",
          y: "0%",
          imageWidth: 1280,
          imageHeight: 720,
          fit: "cover"
        },
        
        // 测试不同大小的视频
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 5,
          x: "100px",
          y: "100px",
          videoWidth: 300,
          videoHeight: 200,
          fit: "contain"
        },
        
        {
          type: "video",
          source: "./assets/lofoten.mp4",
          duration: 5,
          x: "50%",
          y: "20%",
          videoWidth: 400,
          videoHeight: 300,
          fit: "cover"
        },
        
        // 测试不同位置
        {
          type: "video",
          source: "./assets/palawan.mp4",
          duration: 5,
          x: "80vw",
          y: "80vh",
          videoWidth: 250,
          videoHeight: 180,
          fit: "fill"
        },
        
        // 测试缩放
        {
          type: "video",
          source: "./assets/tungestolen.mp4",
          duration: 5,
          x: "50%",
          y: "50%",
          videoWidth: 500,
          videoHeight: 350,
          scaleX: 0.6,
          scaleY: 0.6,
          fit: "contain"
        },
        
        // 测试预定义位置
        {
          type: "video",
          source: "./assets/kohlipe1.mp4",
          duration: 5,
          position: "top-right",
          videoWidth: 200,
          videoHeight: 150,
          fit: "cover"
        },
        
        // 测试混合单位
        {
          type: "video",
          source: "./assets/kohlipe2.mp4",
          duration: 5,
          x: "50% + 100px",
          y: "50% - 50px",
          videoWidth: 300,
          videoHeight: 200,
          fit: "scale-down"
        },
        
        // 测试动画
        {
          type: "video",
          source: "./assets/kohlipe3.mp4",
          duration: 5,
          x: "20%",
          y: "60%",
          videoWidth: 350,
          videoHeight: 250,
          fit: "contain",
          animations: [
            {
              property: "scaleX",
              from: 0.5,
              to: 1.2,
              duration: 2,
              easing: "easeOut"
            },
            {
              property: "scaleY",
              from: 0.5,
              to: 1.2,
              duration: 2,
              easing: "easeOut"
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 视频元素测试完成: output/video-element-test.mp4");
    
  } catch (error) {
    console.error("❌ 视频元素测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testVideoElement();
}

export { testVideoElement };
