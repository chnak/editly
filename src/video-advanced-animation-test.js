import { VideoMaker } from "./index.js";

/**
 * 视频元素高级动画功能测试
 */
async function testVideoAdvancedAnimation() {
  console.log("开始视频元素高级动画功能测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/video-advanced-animation-test.mp4",
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
        
        // 测试3D旋转动画
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 4,
          x: "20%",
          y: "20%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              property: "rotationX",
              from: 0,
              to: 360,
              duration: 4,
              startTime: 0,
              easing: "linear"
            },
            {
              property: "rotationY",
              from: 0,
              to: 180,
              duration: 4,
              startTime: 0,
              easing: "easeInOut"
            }
          ]
        },
        
        // 测试Z轴移动动画
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 4,
          x: "60%",
          y: "20%",
          videoWidth: 200,
          videoHeight: 150,
          fit: "contain",
          animations: [
            {
              property: "translateZ",
              from: -100,
              to: 100,
              duration: 2,
              startTime: 0,
              easing: "easeInOut"
            },
            {
              property: "translateZ",
              from: 100,
              to: -100,
              duration: 2,
              startTime: 2,
              easing: "easeInOut"
            }
          ]
        },
        
        // 测试复杂组合动画
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 5,
          x: "40%",
          y: "50%",
          videoWidth: 250,
          videoHeight: 180,
          fit: "contain",
          animations: [
            // 淡入
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 0.5,
              startTime: 0,
              easing: "easeIn"
            },
            // 缩放进入
            {
              property: "scaleX",
              from: 0.3,
              to: 1.2,
              duration: 1,
              startTime: 0.5,
              easing: "bounceOut"
            },
            {
              property: "scaleY",
              from: 0.3,
              to: 1.2,
              duration: 1,
              startTime: 0.5,
              easing: "bounceOut"
            },
            // 旋转
            {
              property: "rotation",
              from: 0,
              to: 180,
              duration: 2,
              startTime: 1.5,
              easing: "easeInOut"
            },
            // 移动
            {
              property: "x",
              from: "40%",
              to: "10%",
              duration: 1.5,
              startTime: 2,
              easing: "elasticOut"
            },
            // 淡出
            {
              property: "opacity",
              from: 1,
              to: 0,
              duration: 1,
              startTime: 4,
              easing: "easeOut"
            }
          ]
        },
        
        // 测试视频循环+动画组合
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 6,
          x: "70%",
          y: "60%",
          videoWidth: 150,
          videoHeight: 100,
          fit: "contain",
          cutFrom: 0,
          cutTo: 1, // 只播放1秒视频
          loop: true, // 循环播放
          animations: [
            {
              property: "rotation",
              from: 0,
              to: 720, // 旋转2圈
              duration: 6,
              startTime: 0,
              easing: "linear"
            },
            {
              property: "scaleX",
              from: 0.5,
              to: 1.5,
              duration: 3,
              startTime: 0,
              easing: "easeInOut"
            },
            {
              property: "scaleX",
              from: 1.5,
              to: 0.5,
              duration: 3,
              startTime: 3,
              easing: "easeInOut"
            }
          ]
        },
        
        // 测试弹性动画
        {
          type: "video",
          source: "./assets/changi.mp4",
          duration: 4,
          x: "10%",
          y: "60%",
          videoWidth: 180,
          videoHeight: 120,
          fit: "contain",
          animations: [
            {
              property: "x",
              from: "10%",
              to: "80%",
              duration: 2,
              startTime: 0,
              easing: "elasticInOut"
            },
            {
              property: "y",
              from: "60%",
              to: "20%",
              duration: 2,
              startTime: 0,
              easing: "elasticInOut"
            },
            {
              property: "rotation",
              from: 0,
              to: 360,
              duration: 2,
              startTime: 0,
              easing: "elasticInOut"
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 视频高级动画功能测试完成: output/video-advanced-animation-test.mp4");
    
  } catch (error) {
    console.error("❌ 视频高级动画功能测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testVideoAdvancedAnimation();
}

export { testVideoAdvancedAnimation };
