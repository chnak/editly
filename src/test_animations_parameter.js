import { VideoMaker } from "./index.js";

/**
 * 测试 animations 参数 - 展示如何使用 animations 数组实现动画效果
 */
async function testAnimationsParameter() {
  console.log("🎬 开始测试 animations 参数...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/animations-parameter-test.mp4",
      width: 1920,
      height: 1080,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 10,
          x: "0%",
          y: "0%",
          imageWidth: 1920,
          imageHeight: 1080,
          fit: "cover"
        },
        
        // 场景1: 使用 animations 实现缩放动画
        {
          type: "title",
          text: "缩放动画 (animations)",
          duration: 2,
          x: "50%",
          y: "30%",
          fontSize: 72,
          color: "#FFFFFF",
          fontFamily: "Arial",
          animations: [
            {
              property: "scaleX",
              from: 1,
              to: 1.3,
              duration: 2,
              startTime: 0,
              easing: "easeOut"
            },
            {
              property: "scaleY",
              from: 1,
              to: 1.3,
              duration: 2,
              startTime: 0,
              easing: "easeOut"
            }
          ]
        },
        
        // 场景2: 使用 animations 实现位移动画
        {
          type: "title",
          text: "位移动画 (animations)",
          duration: 2,
          x: "50%",
          y: "50%",
          fontSize: 56,
          color: "#FF6B6B",
          fontFamily: "Arial",
          animations: [
            {
              property: "x",
              from: "10%",
              to: "90%",
              duration: 2,
              startTime: 0,
              easing: "easeInOut"
            }
          ]
        },
        
        // 场景3: 使用 animations 实现淡入淡出
        {
          type: "title",
          text: "淡入淡出 (animations)",
          duration: 3,
          x: "50%",
          y: "70%",
          fontSize: 48,
          color: "#4ECDC4",
          fontFamily: "Arial",
          animations: [
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 1,
              startTime: 0,
              easing: "easeIn"
            },
            {
              property: "opacity",
              from: 1,
              to: 0,
              duration: 1,
              startTime: 2,
              easing: "easeOut"
            }
          ]
        },
        
        // 场景4: 使用 animations 实现旋转动画
        {
          type: "title",
          text: "旋转动画 (animations)",
          duration: 2,
          x: "50%",
          y: "30%",
          fontSize: 64,
          color: "#45B7D1",
          fontFamily: "Arial",
          animations: [
            {
              property: "rotation",
              from: -180,
              to: 0,
              duration: 2,
              startTime: 0,
              easing: "easeOut"
            }
          ]
        },
        
        // 场景5: 使用 animations 实现组合动画
        {
          type: "title",
          text: "组合动画 (animations)",
          duration: 3,
          x: "50%",
          y: "50%",
          fontSize: 56,
          color: "#F39C12",
          fontFamily: "Arial",
          animations: [
            {
              property: "scaleX",
              from: 0.5,
              to: 1.2,
              duration: 1.5,
              startTime: 0,
              easing: "easeOut"
            },
            {
              property: "scaleY",
              from: 0.5,
              to: 1.2,
              duration: 1.5,
              startTime: 0,
              easing: "easeOut"
            },
            {
              property: "x",
              from: "20%",
              to: "80%",
              duration: 2,
              startTime: 0.5,
              easing: "easeInOut"
            },
            {
              property: "opacity",
              from: 0,
              to: 1,
              duration: 1,
              startTime: 0,
              easing: "easeIn"
            }
          ]
        },
        
        // 场景6: 使用 animations 实现弹跳动画
        {
          type: "title",
          text: "弹跳动画 (animations)",
          duration: 2,
          x: "50%",
          y: "70%",
          fontSize: 48,
          color: "#E74C3C",
          fontFamily: "Arial",
          animations: [
            {
              property: "scaleX",
              from: 0,
              to: 1,
              duration: 1.5,
              startTime: 0,
              easing: "bounce"
            },
            {
              property: "scaleY",
              from: 0,
              to: 1,
              duration: 1.5,
              startTime: 0,
              easing: "bounce"
            }
          ]
        },
        
        // 场景7: 使用 animations 实现弹性动画
        {
          type: "title",
          text: "弹性动画 (animations)",
          duration: 2,
          x: "50%",
          y: "30%",
          fontSize: 56,
          color: "#9B59B6",
          fontFamily: "Arial",
          animations: [
            {
              property: "scaleX",
              from: 0,
              to: 1,
              duration: 2,
              startTime: 0,
              easing: "elastic"
            },
            {
              property: "scaleY",
              from: 0,
              to: 1,
              duration: 2,
              startTime: 0,
              easing: "elastic"
            }
          ]
        },
        
        // 场景8: 使用 animations 实现摇摆动画
        {
          type: "title",
          text: "摇摆动画 (animations)",
          duration: 2,
          x: "50%",
          y: "50%",
          fontSize: 48,
          color: "#1ABC9C",
          fontFamily: "Arial",
          animations: [
            {
              property: "rotation",
              from: -15,
              to: 15,
              duration: 0.5,
              startTime: 0,
              easing: "easeInOut",
              repeat: "reverse"
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ animations 参数测试完成: output/animations-parameter-test.mp4");
    
  } catch (error) {
    console.error("❌ animations 参数测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testAnimationsParameter();
}

export { testAnimationsParameter };
