import { VideoMaker } from "./index.js";

/**
 * 文本分割特效使用示例
 */
async function splitUsageExample() {
  console.log("📚 文本分割特效使用示例...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/split-usage-example.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 15,
          x: "0%",
          y: "0%",
          imageWidth: 1280,
          imageHeight: 720,
          fit: "cover"
        },
        
        // 示例1: 默认效果（不分割）
        {
          type: "title",
          text: "默认效果",
          duration: 2,
          x: "10%",
          y: "20%",
          fontSize: 48,
          color: "#FFFFFF",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "default"  // 整个文本一起显示
            }
          ]
        },
        
        // 示例2: 按字符分割
        {
          type: "title",
          text: "字符分割",
          duration: 3,
          x: "50%",
          y: "20%",
          fontSize: 48,
          color: "#FF6B6B",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "char",    // 按字符分割
              charDelay: 0.1
            }
          ]
        },
        
        // 示例3: 按单词分割
        {
          type: "title",
          text: "Word Split Effect",
          duration: 3,
          x: "10%",
          y: "40%",
          fontSize: 48,
          color: "#4ECDC4",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "word",    // 按单词分割
              charDelay: 0.2
            }
          ]
        },
        
        // 示例4: 按空格分割
        {
          type: "title",
          text: "Space Split Effect",
          duration: 3,
          x: "50%",
          y: "40%",
          fontSize: 48,
          color: "#45B7D1",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "space",   // 按空格分割
              charDelay: 0.15
            }
          ]
        },
        
        // 示例5: 按行分割
        {
          type: "title",
          text: "第一行\n第二行\n第三行",
          duration: 4,
          x: "10%",
          y: "60%",
          fontSize: 36,
          color: "#96CEB4",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "line",    // 按行分割
              charDelay: 0.3
            }
          ]
        },
        
        // 示例6: 按句子分割
        {
          type: "title",
          text: "第一句话。第二句话！第三句话？",
          duration: 4,
          x: "50%",
          y: "60%",
          fontSize: 36,
          color: "#FFEAA7",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "sentence", // 按句子分割
              charDelay: 0.4
            }
          ]
        },
        
        // 示例7: 擦除效果按单词分割
        {
          type: "title",
          text: "Wipe Word Split",
          duration: 3,
          x: "10%",
          y: "20%",
          fontSize: 48,
          color: "#DDA0DD",
          fontFamily: "Arial",
          animations: [
            {
              type: "wipe",
              split: "word",    // 按单词分割擦除
              wipeDirection: "left"
            }
          ]
        },
        
        // 示例8: 逐字显示按单词分割
        {
          type: "title",
          text: "Reveal Word Split",
          duration: 3,
          x: "50%",
          y: "20%",
          fontSize: 48,
          color: "#98D8C8",
          fontFamily: "Arial",
          animations: [
            {
              type: "reveal",
              split: "word",    // 按单词分割逐字显示
              charDelay: 0.2
            }
          ]
        },
        
        // 示例9: 分割效果按单词分割
        {
          type: "title",
          text: "Split Word Effect",
          duration: 3,
          x: "10%",
          y: "40%",
          fontSize: 48,
          color: "#F7DC6F",
          fontFamily: "Arial",
          animations: [
            {
              type: "split",
              split: "word",    // 按单词分割
              segmentDelay: 0.1,
              segmentDuration: 0.3
            }
          ]
        },
        
        // 示例10: 波浪分割按单词分割
        {
          type: "title",
          text: "Wave Word Split",
          duration: 3,
          x: "50%",
          y: "40%",
          fontSize: 48,
          color: "#BB8FCE",
          fontFamily: "Arial",
          animations: [
            {
              type: "waveSplit",
              split: "word",    // 按单词分割波浪效果
              segmentDelay: 0.1,
              segmentDuration: 0.3
            }
          ]
        },
        
        // 示例11: 旋转分割按单词分割
        {
          type: "title",
          text: "Rotate Word Split",
          duration: 3,
          x: "10%",
          y: "60%",
          fontSize: 48,
          color: "#F1948A",
          fontFamily: "Arial",
          animations: [
            {
              type: "rotateSplit",
              split: "word",    // 按单词分割旋转效果
              segmentDelay: 0.12,
              segmentDuration: 0.4
            }
          ]
        },
        
        // 示例12: 缩放分割按单词分割
        {
          type: "title",
          text: "Scale Word Split",
          duration: 3,
          x: "50%",
          y: "60%",
          fontSize: 48,
          color: "#85C1E9",
          fontFamily: "Arial",
          animations: [
            {
              type: "scaleSplit",
              split: "word",    // 按单词分割缩放效果
              segmentDelay: 0.08,
              segmentDuration: 0.3
            }
          ]
        },
        
        // 示例13: 淡入分割按单词分割
        {
          type: "title",
          text: "Fade Word Split",
          duration: 3,
          x: "10%",
          y: "20%",
          fontSize: 48,
          color: "#F8C471",
          fontFamily: "Arial",
          animations: [
            {
              type: "fadeSplit",
              split: "word",    // 按单词分割淡入效果
              segmentDelay: 0.1,
              segmentDuration: 0.5
            }
          ]
        },
        
        // 示例14: 滑动分割按单词分割
        {
          type: "title",
          text: "Slide Word Split",
          duration: 3,
          x: "50%",
          y: "20%",
          fontSize: 48,
          color: "#82E0AA",
          fontFamily: "Arial",
          animations: [
            {
              type: "slideSplit",
              split: "word",    // 按单词分割滑动效果
              direction: "left",
              segmentDelay: 0.1,
              segmentDuration: 0.4
            }
          ]
        },
        
        // 示例15: 中文按字符分割
        {
          type: "title",
          text: "中文字符分割",
          duration: 3,
          x: "10%",
          y: "40%",
          fontSize: 48,
          color: "#D7BDE2",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "char",    // 中文按字符分割
              charDelay: 0.1
            }
          ]
        },
        
        // 示例16: 混合文本按单词分割
        {
          type: "title",
          text: "Hello 世界 World",
          duration: 3,
          x: "50%",
          y: "40%",
          fontSize: 48,
          color: "#A9DFBF",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "word",    // 混合文本按单词分割
              charDelay: 0.15
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 文本分割特效使用示例完成: output/split-usage-example.mp4");
    
  } catch (error) {
    console.error("❌ 文本分割特效使用示例失败:", error);
  }
}

// 运行示例
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  splitUsageExample();
}

export { splitUsageExample };
