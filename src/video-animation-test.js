import { VideoMaker } from "./index.js";

/**
 * 视频元素动画功能测试
 */
async function testVideoAnimation() {
  console.log("开始视频元素动画功能测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/video-animation-test.mp4",
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
        
        // 测试视频淡入动画
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "10%",
          y: "10%",
          videoWidth: 250,
          videoHeight: 180,
          fit: "contain",
          animations: [
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 1,
              startTime: 0,
              easing: "easeInOut"
            }
          ]
        },
        
        // 测试视频缩放动画
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "60%",
          y: "10%",
          videoWidth: 250,
          videoHeight: 180,
          fit: "contain",
          animations: [
            {
              property: "scaleX",
              from: 0.5,
              to: 1,
              duration: 1.5,
              startTime: 0,
              easing: "bounceOut"
            },
            {
              property: "scaleY",
              from: 0.5,
              to: 1,
              duration: 1.5,
              startTime: 0,
              easing: "bounceOut"
            }
          ]
        },
        
        // 测试视频旋转动画
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "10%",
          y: "60%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              property: "rotation",
              from: 0,
              to: 360,
              duration: 3,
              startTime: 0,
              easing: "linear"
            }
          ]
        },
        
        // 测试视频移动动画
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "60%",
          y: "60%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              property: "x",
              from: "60%",
              to: "10%",
              duration: 2,
              startTime: 0,
              easing: "easeInOut"
            },
            {
              property: "y",
              from: "60%",
              to: "10%",
              duration: 2,
              startTime: 0,
              easing: "easeInOut"
            }
          ]
        },
        
        // 测试视频预设动画
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "35%",
          y: "35%",
          videoWidth: 200,
          videoHeight: 150,
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
              startTime: 2
            }
          ]
        },
        
        // 测试视频关键帧动画
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 3,
          x: "35%",
          y: "60%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              property: "opacity",
              keyframes: [
                { time: 0, value: 0 },
                { time: 0.5, value: 1 },
                { time: 1.5, value: 1 },
                { time: 2, value: 0 }
              ],
              easing: "easeInOut"
            },
            {
              property: "scaleX",
              keyframes: [
                { time: 0, value: 0.5 },
                { time: 0.5, value: 1.2 },
                { time: 1.5, value: 1.2 },
                { time: 2, value: 0.5 }
              ],
              easing: "elasticOut"
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 视频动画功能测试完成: output/video-animation-test.mp4");
    
  } catch (error) {
    console.error("❌ 视频动画功能测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testVideoAnimation();
}

export { testVideoAnimation };
