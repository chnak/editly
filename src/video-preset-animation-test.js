import { VideoMaker } from "./index.js";

/**
 * 视频元素预设动画功能测试
 */
async function testVideoPresetAnimation() {
  console.log("开始视频元素预设动画功能测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/video-preset-animation-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 8,
          x: "0%",
          y: "0%",
          imageWidth: 1280,
          imageHeight: 720,
          fit: "cover"
        },
        
        // 测试 fadeIn 预设
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 2,
          x: "10%",
          y: "10%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              preset: "fadeIn",
              duration: 1,
              startTime: 0
            }
          ]
        },
        
        // 测试 slideInLeft 预设
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 2,
          x: "40%",
          y: "10%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              preset: "slideInLeft",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        // 测试 slideInRight 预设
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 2,
          x: "70%",
          y: "10%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              preset: "slideInRight",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        // 测试 slideInTop 预设
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 2,
          x: "10%",
          y: "40%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              preset: "slideInTop",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        // 测试 slideInBottom 预设
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 2,
          x: "40%",
          y: "40%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              preset: "slideInBottom",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        // 测试 zoomIn 预设
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 2,
          x: "70%",
          y: "40%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              preset: "zoomIn",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        // 测试 zoomOut 预设
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 2,
          x: "10%",
          y: "70%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              preset: "zoomOut",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        // 测试 bounceIn 预设
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 2,
          x: "40%",
          y: "70%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              preset: "bounceIn",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        // 测试 elasticIn 预设
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 2,
          x: "70%",
          y: "70%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              preset: "elasticIn",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        // 测试组合预设动画
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 4,
          x: "50%",
          y: "50%",
          videoWidth: 250,
          videoHeight: 180,
          fit: "contain",
          animations: [
            {
              preset: "zoomIn",
              duration: 1,
              startTime: 0
            },
            {
              preset: "fadeOut",
              duration: 1,
              startTime: 3
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 视频预设动画功能测试完成: output/video-preset-animation-test.mp4");
    
  } catch (error) {
    console.error("❌ 视频预设动画功能测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testVideoPresetAnimation();
}

export { testVideoPresetAnimation };
