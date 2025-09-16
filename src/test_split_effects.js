import { VideoMaker } from "./index.js";

/**
 * 测试文本分割特效
 */
async function testSplitEffects() {
  console.log("🎬 开始测试文本分割特效...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/split-effects-test.mp4",
      width: 1920,
      height: 1080,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 25,
          x: "0%",
          y: "0%",
          imageWidth: 1920,
          imageHeight: 1080,
          fit: "cover"
        },
        
        // 默认效果（不分割）
        {
          type: "title",
          text: "Default Effect",
          duration: 2,
          x: "10%",
          y: "10%",
          fontSize: 48,
          color: "#FFFFFF",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "default"
            }
          ]
        },
        
        // 按字符分割
        {
          type: "title",
          text: "Character Split",
          duration: 3,
          x: "50%",
          y: "10%",
          fontSize: 48,
          color: "#FF6B6B",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "char"
            }
          ]
        },
        
        // 按单词分割
        {
          type: "title",
          text: "Word Split Effect",
          duration: 3,
          x: "10%",
          y: "30%",
          fontSize: 48,
          color: "#4ECDC4",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "word"
            }
          ]
        },
        
        // 按空格分割
        {
          type: "title",
          text: "Space Split Effect",
          duration: 3,
          x: "50%",
          y: "30%",
          fontSize: 48,
          color: "#45B7D1",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "space"
            }
          ]
        },
        
        // 按行分割
        {
          type: "title",
          text: "Line 1\nLine 2\nLine 3",
          duration: 4,
          x: "10%",
          y: "50%",
          fontSize: 36,
          color: "#96CEB4",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "line"
            }
          ]
        },
        
        // 按句子分割
        {
          type: "title",
          text: "First sentence. Second sentence! Third sentence?",
          duration: 4,
          x: "50%",
          y: "50%",
          fontSize: 36,
          color: "#FFEAA7",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "sentence"
            }
          ]
        },
        
        // 按短语分割
        {
          type: "title",
          text: "First phrase, second phrase; third phrase",
          duration: 4,
          x: "10%",
          y: "70%",
          fontSize: 36,
          color: "#DDA0DD",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "phrase"
            }
          ]
        },
        
        // 中文按字符分割
        {
          type: "title",
          text: "中文字符分割",
          duration: 3,
          x: "50%",
          y: "70%",
          fontSize: 48,
          color: "#98D8C8",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "char"
            }
          ]
        },
        
        // 中文按单词分割（实际按字符）
        {
          type: "title",
          text: "中文单词分割",
          duration: 3,
          x: "10%",
          y: "10%",
          fontSize: 48,
          color: "#F7DC6F",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "word"
            }
          ]
        },
        
        // 混合文本按单词分割
        {
          type: "title",
          text: "Hello 世界 World",
          duration: 3,
          x: "50%",
          y: "10%",
          fontSize: 48,
          color: "#BB8FCE",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "word"
            }
          ]
        },
        
        // 擦除效果按单词分割
        {
          type: "title",
          text: "Wipe Word Split",
          duration: 3,
          x: "10%",
          y: "30%",
          fontSize: 48,
          color: "#F1948A",
          fontFamily: "Arial",
          animations: [
            {
              type: "wipe",
              split: "word",
              wipeDirection: "left"
            }
          ]
        },
        
        // 逐字显示按单词分割
        {
          type: "title",
          text: "Reveal Word Split",
          duration: 3,
          x: "50%",
          y: "30%",
          fontSize: 48,
          color: "#85C1E9",
          fontFamily: "Arial",
          animations: [
            {
              type: "reveal",
              split: "word"
            }
          ]
        },
        
        // 分割效果按单词分割
        {
          type: "title",
          text: "Split Word Effect",
          duration: 3,
          x: "10%",
          y: "50%",
          fontSize: 48,
          color: "#F8C471",
          fontFamily: "Arial",
          animations: [
            {
              type: "split",
              split: "word"
            }
          ]
        },
        
        // 波浪分割按单词分割
        {
          type: "title",
          text: "Wave Word Split",
          duration: 3,
          x: "50%",
          y: "50%",
          fontSize: 48,
          color: "#82E0AA",
          fontFamily: "Arial",
          animations: [
            {
              type: "waveSplit",
              split: "word"
            }
          ]
        },
        
        // 旋转分割按单词分割
        {
          type: "title",
          text: "Rotate Word Split",
          duration: 3,
          x: "10%",
          y: "70%",
          fontSize: 48,
          color: "#F7DC6F",
          fontFamily: "Arial",
          animations: [
            {
              type: "rotateSplit",
              split: "word"
            }
          ]
        },
        
        // 缩放分割按单词分割
        {
          type: "title",
          text: "Scale Word Split",
          duration: 3,
          x: "50%",
          y: "70%",
          fontSize: 48,
          color: "#D7BDE2",
          fontFamily: "Arial",
          animations: [
            {
              type: "scaleSplit",
              split: "word"
            }
          ]
        },
        
        // 淡入分割按单词分割
        {
          type: "title",
          text: "Fade Word Split",
          duration: 3,
          x: "10%",
          y: "10%",
          fontSize: 48,
          color: "#A9DFBF",
          fontFamily: "Arial",
          animations: [
            {
              type: "fadeSplit",
              split: "word"
            }
          ]
        },
        
        // 滑动分割按单词分割
        {
          type: "title",
          text: "Slide Word Split",
          duration: 3,
          x: "50%",
          y: "10%",
          fontSize: 48,
          color: "#F9E79F",
          fontFamily: "Arial",
          animations: [
            {
              type: "slideSplit",
              split: "word",
              direction: "left"
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 文本分割特效测试完成: output/split-effects-test.mp4");
    
  } catch (error) {
    console.error("❌ 文本分割特效测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testSplitEffects();
}

export { testSplitEffects };
