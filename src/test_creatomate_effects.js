import { VideoMaker } from "./index.js";

/**
 * 测试 Creatomate 风格文本特效
 */
async function testCreatomateEffects() {
  console.log("🎬 开始测试 Creatomate 风格文本特效...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/creatomate-effects-test.mp4",
      width: 1920,
      height: 1080,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 20,
          x: "0%",
          y: "0%",
          imageWidth: 1920,
          imageHeight: 1080,
          fit: "cover"
        },
        
        // 打字机效果
        {
          type: "title",
          text: "Typewriter Effect",
          duration: 3,
          x: "10%",
          y: "10%",
          fontSize: 48,
          color: "#FFFFFF",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              charDelay: 0.1
            }
          ]
        },
        
        // 逐字显示效果
        {
          type: "title",
          text: "Reveal Effect",
          duration: 3,
          x: "50%",
          y: "10%",
          fontSize: 48,
          color: "#FF6B6B",
          fontFamily: "Arial",
          animations: [
            {
              type: "reveal",
              charDelay: 0.15
            }
          ]
        },
        
        // 擦除效果
        {
          type: "title",
          text: "Wipe Effect",
          duration: 2,
          x: "10%",
          y: "30%",
          fontSize: 48,
          color: "#4ECDC4",
          fontFamily: "Arial",
          animations: [
            {
              type: "wipe",
              wipeDirection: "left"
            }
          ]
        },
        
        // 分割效果
        {
          type: "title",
          text: "Split Effect",
          duration: 3,
          x: "50%",
          y: "30%",
          fontSize: 48,
          color: "#45B7D1",
          fontFamily: "Arial",
          animations: [
            {
              type: "split",
              splitType: "word"
            }
          ]
        },
        
        // 故障效果
        {
          type: "title",
          text: "Glitch Effect",
          duration: 2,
          x: "10%",
          y: "50%",
          fontSize: 48,
          color: "#96CEB4",
          fontFamily: "Arial",
          animations: [
            {
              type: "glitch"
            }
          ]
        },
        
        // 震动效果
        {
          type: "title",
          text: "Shake Effect",
          duration: 2,
          x: "50%",
          y: "50%",
          fontSize: 48,
          color: "#FFEAA7",
          fontFamily: "Arial",
          animations: [
            {
              type: "shake"
            }
          ]
        },
        
        // 脉冲效果
        {
          type: "title",
          text: "Pulse Effect",
          duration: 2,
          x: "10%",
          y: "70%",
          fontSize: 48,
          color: "#DDA0DD",
          fontFamily: "Arial",
          animations: [
            {
              type: "pulse"
            }
          ]
        },
        
        // 波浪效果
        {
          type: "title",
          text: "Wave Effect",
          duration: 2,
          x: "50%",
          y: "70%",
          fontSize: 48,
          color: "#98D8C8",
          fontFamily: "Arial",
          animations: [
            {
              type: "wave"
            }
          ]
        },
        
        // 弹簧效果
        {
          type: "title",
          text: "Spring Effect",
          duration: 2,
          x: "10%",
          y: "10%",
          fontSize: 48,
          color: "#F7DC6F",
          fontFamily: "Arial",
          animations: [
            {
              type: "spring"
            }
          ]
        },
        
        // 3D翻转效果
        {
          type: "title",
          text: "3D Flip Effect",
          duration: 2,
          x: "50%",
          y: "10%",
          fontSize: 48,
          color: "#BB8FCE",
          fontFamily: "Arial",
          animations: [
            {
              type: "flip3D"
            }
          ]
        },
        
        // 爆炸效果
        {
          type: "title",
          text: "Explode Effect",
          duration: 2,
          x: "10%",
          y: "30%",
          fontSize: 48,
          color: "#F1948A",
          fontFamily: "Arial",
          animations: [
            {
              type: "explode"
            }
          ]
        },
        
        // 溶解效果
        {
          type: "title",
          text: "Dissolve Effect",
          duration: 2,
          x: "50%",
          y: "30%",
          fontSize: 48,
          color: "#85C1E9",
          fontFamily: "Arial",
          animations: [
            {
              type: "dissolve"
            }
          ]
        },
        
        // 螺旋效果
        {
          type: "title",
          text: "Spiral Effect",
          duration: 2,
          x: "10%",
          y: "50%",
          fontSize: 48,
          color: "#F8C471",
          fontFamily: "Arial",
          animations: [
            {
              type: "spiral"
            }
          ]
        },
        
        // 摇摆效果
        {
          type: "title",
          text: "Wobble Effect",
          duration: 2,
          x: "50%",
          y: "50%",
          fontSize: 48,
          color: "#82E0AA",
          fontFamily: "Arial",
          animations: [
            {
              type: "wobble"
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ Creatomate 风格文本特效测试完成: output/creatomate-effects-test.mp4");
    
  } catch (error) {
    console.error("❌ Creatomate 风格文本特效测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testCreatomateEffects();
}

export { testCreatomateEffects };
