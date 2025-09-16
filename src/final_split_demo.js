import { VideoMaker } from "./index.js";

/**
 * 最终分割效果演示
 */
async function finalSplitDemo() {
  console.log("🎬 最终分割效果演示...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/final-split-demo.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 12,
          x: "0%",
          y: "0%",
          imageWidth: 1280,
          imageHeight: 720,
          fit: "cover"
        },
        
        // 1. 默认效果（不分割）
        {
          type: "title",
          text: "默认效果",
          duration: 2,
          x: "10%",
          y: "15%",
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
        
        // 2. 按字符分割
        {
          type: "title",
          text: "字符分割",
          duration: 2,
          x: "50%",
          y: "15%",
          fontSize: 48,
          color: "#FF6B6B",
          fontFamily: "Arial",
          animations: [
            {
              type: "split",
              split: "char",
              segmentDelay: 0.15,
              segmentDuration: 0.4
            }
          ]
        },
        
        // 3. 按单词分割
        {
          type: "title",
          text: "Word Split",
          duration: 2,
          x: "10%",
          y: "35%",
          fontSize: 48,
          color: "#4ECDC4",
          fontFamily: "Arial",
          animations: [
            {
              type: "split",
              split: "word",
              segmentDelay: 0.2,
              segmentDuration: 0.5
            }
          ]
        },
        
        // 4. 按空格分割
        {
          type: "title",
          text: "Space Split",
          duration: 2,
          x: "50%",
          y: "35%",
          fontSize: 48,
          color: "#45B7D1",
          fontFamily: "Arial",
          animations: [
            {
              type: "split",
              split: "space",
              segmentDelay: 0.2,
              segmentDuration: 0.5
            }
          ]
        },
        
        // 5. 波浪分割
        {
          type: "title",
          text: "Wave Split",
          duration: 2,
          x: "10%",
          y: "55%",
          fontSize: 48,
          color: "#96CEB4",
          fontFamily: "Arial",
          animations: [
            {
              type: "waveSplit",
              split: "word",
              segmentDelay: 0.15,
              segmentDuration: 0.4
            }
          ]
        },
        
        // 6. 旋转分割
        {
          type: "title",
          text: "Rotate Split",
          duration: 2,
          x: "50%",
          y: "55%",
          fontSize: 48,
          color: "#FFEAA7",
          fontFamily: "Arial",
          animations: [
            {
              type: "rotateSplit",
              split: "word",
              segmentDelay: 0.2,
              segmentDuration: 0.5
            }
          ]
        },
        
        // 7. 缩放分割
        {
          type: "title",
          text: "Scale Split",
          duration: 2,
          x: "10%",
          y: "75%",
          fontSize: 48,
          color: "#DDA0DD",
          fontFamily: "Arial",
          animations: [
            {
              type: "scaleSplit",
              split: "word",
              segmentDelay: 0.1,
              segmentDuration: 0.3
            }
          ]
        },
        
        // 8. 淡入分割
        {
          type: "title",
          text: "Fade Split",
          duration: 2,
          x: "50%",
          y: "75%",
          fontSize: 48,
          color: "#98D8C8",
          fontFamily: "Arial",
          animations: [
            {
              type: "fadeSplit",
              split: "word",
              segmentDelay: 0.15,
              segmentDuration: 0.6
            }
          ]
        },
        
        // 9. 滑动分割（从左）
        {
          type: "title",
          text: "Slide Left",
          duration: 2,
          x: "10%",
          y: "15%",
          fontSize: 48,
          color: "#F7DC6F",
          fontFamily: "Arial",
          animations: [
            {
              type: "slideSplit",
              split: "word",
              direction: "left",
              segmentDelay: 0.15,
              segmentDuration: 0.4
            }
          ]
        },
        
        // 10. 滑动分割（从右）
        {
          type: "title",
          text: "Slide Right",
          duration: 2,
          x: "50%",
          y: "15%",
          fontSize: 48,
          color: "#BB8FCE",
          fontFamily: "Arial",
          animations: [
            {
              type: "slideSplit",
              split: "word",
              direction: "right",
              segmentDelay: 0.15,
              segmentDuration: 0.4
            }
          ]
        },
        
        // 11. 中文按字符分割
        {
          type: "title",
          text: "中文字符",
          duration: 2,
          x: "10%",
          y: "35%",
          fontSize: 48,
          color: "#F1948A",
          fontFamily: "Arial",
          animations: [
            {
              type: "split",
              split: "char",
              segmentDelay: 0.1,
              segmentDuration: 0.3
            }
          ]
        },
        
        // 12. 混合文本按单词分割
        {
          type: "title",
          text: "Hello 世界",
          duration: 2,
          x: "50%",
          y: "35%",
          fontSize: 48,
          color: "#85C1E9",
          fontFamily: "Arial",
          animations: [
            {
              type: "split",
              split: "word",
              segmentDelay: 0.15,
              segmentDuration: 0.4
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 最终分割效果演示完成: output/final-split-demo.mp4");
    
  } catch (error) {
    console.error("❌ 最终分割效果演示失败:", error);
  }
}

// 运行演示
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  finalSplitDemo();
}

export { finalSplitDemo };
