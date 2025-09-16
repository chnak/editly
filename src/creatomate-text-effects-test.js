import { VideoMaker } from "./index.js";

/**
 * Creatomate 风格文本动画特效测试
 */
async function testCreatomateTextEffects() {
  console.log("开始 Creatomate 风格文本动画特效测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/creatomate-text-effects-test.mp4",
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
        
        // 基础进入动画
        {
          type: "title",
          text: "Fade In",
          duration: 2,
          x: "10%",
          y: "10%",
          fontSize: 48,
          color: "#FFFFFF",
          fontFamily: "Arial",
          animations: [
            {
              preset: "fadeIn",
              duration: 1,
              startTime: 0
            }
          ]
        },
        
        {
          type: "title",
          text: "Slide In Left",
          duration: 2,
          x: "50%",
          y: "10%",
          fontSize: 48,
          color: "#FF6B6B",
          fontFamily: "Arial",
          animations: [
            {
              preset: "slideInLeft",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        {
          type: "title",
          text: "Zoom In",
          duration: 2,
          x: "10%",
          y: "30%",
          fontSize: 48,
          color: "#4ECDC4",
          fontFamily: "Arial",
          animations: [
            {
              preset: "zoomIn",
              duration: 1.2,
              startTime: 0
            }
          ]
        },
        
        {
          type: "title",
          text: "Bounce In",
          duration: 2,
          x: "50%",
          y: "30%",
          fontSize: 48,
          color: "#45B7D1",
          fontFamily: "Arial",
          animations: [
            {
              preset: "bounceIn",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        // 高级特效
        {
          type: "title",
          text: "Typewriter",
          duration: 3,
          x: "10%",
          y: "50%",
          fontSize: 48,
          color: "#96CEB4",
          fontFamily: "Arial",
          animations: [
            {
              preset: "typewriter",
              duration: 2.5,
              startTime: 0
            }
          ]
        },
        
        {
          type: "title",
          text: "Reveal",
          duration: 2,
          x: "50%",
          y: "50%",
          fontSize: 48,
          color: "#FFEAA7",
          fontFamily: "Arial",
          animations: [
            {
              preset: "reveal",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        {
          type: "title",
          text: "Wipe",
          duration: 2,
          x: "10%",
          y: "70%",
          fontSize: 48,
          color: "#DDA0DD",
          fontFamily: "Arial",
          animations: [
            {
              preset: "wipe",
              duration: 1.2,
              startTime: 0
            }
          ]
        },
        
        {
          type: "title",
          text: "Split",
          duration: 2,
          x: "50%",
          y: "70%",
          fontSize: 48,
          color: "#98D8C8",
          fontFamily: "Arial",
          animations: [
            {
              preset: "split",
              duration: 1.2,
              startTime: 0
            }
          ]
        },
        
        // 3D 效果
        {
          type: "title",
          text: "3D Flip",
          duration: 2,
          x: "70%",
          y: "10%",
          fontSize: 48,
          color: "#F7DC6F",
          fontFamily: "Arial",
          animations: [
            {
              preset: "flip3D",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        {
          type: "title",
          text: "3D Scale",
          duration: 2,
          x: "70%",
          y: "30%",
          fontSize: 48,
          color: "#BB8FCE",
          fontFamily: "Arial",
          animations: [
            {
              preset: "scale3D",
              duration: 1.2,
              startTime: 0
            }
          ]
        },
        
        {
          type: "title",
          text: "Perspective",
          duration: 2,
          x: "70%",
          y: "50%",
          fontSize: 48,
          color: "#85C1E9",
          fontFamily: "Arial",
          animations: [
            {
              preset: "perspective",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        // 特殊效果
        {
          type: "title",
          text: "Shake",
          duration: 2,
          x: "70%",
          y: "70%",
          fontSize: 48,
          color: "#F8C471",
          fontFamily: "Arial",
          animations: [
            {
              preset: "shake",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        // 缓动函数测试
        {
          type: "title",
          text: "Spring",
          duration: 2,
          x: "10%",
          y: "90%",
          fontSize: 36,
          color: "#82E0AA",
          fontFamily: "Arial",
          animations: [
            {
              preset: "spring",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        {
          type: "title",
          text: "Elastic",
          duration: 2,
          x: "30%",
          y: "90%",
          fontSize: 36,
          color: "#F1948A",
          fontFamily: "Arial",
          animations: [
            {
              preset: "elasticIn",
              duration: 1.5,
              startTime: 0
            }
          ]
        },
        
        {
          type: "title",
          text: "Back",
          duration: 2,
          x: "50%",
          y: "90%",
          fontSize: 36,
          color: "#85C1E9",
          fontFamily: "Arial",
          animations: [
            {
              property: "scaleX",
              from: 0,
              to: 1,
              duration: 1.5,
              startTime: 0,
              easing: "back"
            }
          ]
        },
        
        {
          type: "title",
          text: "Expo",
          duration: 2,
          x: "70%",
          y: "90%",
          fontSize: 36,
          color: "#F7DC6F",
          fontFamily: "Arial",
          animations: [
            {
              property: "scaleX",
              from: 0,
              to: 1,
              duration: 1.5,
              startTime: 0,
              easing: "expo"
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ Creatomate 风格文本动画特效测试完成: output/creatomate-text-effects-test.mp4");
    
  } catch (error) {
    console.error("❌ Creatomate 风格文本动画特效测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testCreatomateTextEffects();
}

export { testCreatomateTextEffects };
