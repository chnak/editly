import { VideoMaker } from "./index.js";

/**
 * 简单的文本分割特效测试
 */
async function testSimpleSplitVideo() {
  console.log("🎬 开始简单文本分割特效测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/simple-split-test.mp4",
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
              split: "default"
            }
          ]
        },
        
        // 示例2: 按字符分割
        {
          type: "title",
          text: "字符分割",
          duration: 2,
          x: "50%",
          y: "20%",
          fontSize: 48,
          color: "#FF6B6B",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "char",
              charDelay: 0.1
            }
          ]
        },
        
        // 示例3: 按单词分割
        {
          type: "title",
          text: "Word Split",
          duration: 2,
          x: "10%",
          y: "50%",
          fontSize: 48,
          color: "#4ECDC4",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "word",
              charDelay: 0.2
            }
          ]
        },
        
        // 示例4: 按空格分割
        {
          type: "title",
          text: "Space Split",
          duration: 2,
          x: "50%",
          y: "50%",
          fontSize: 48,
          color: "#45B7D1",
          fontFamily: "Arial",
          animations: [
            {
              type: "typewriter",
              split: "space",
              charDelay: 0.15
            }
          ]
        },
        
        // 示例5: 擦除效果按单词分割
        {
          type: "title",
          text: "Wipe Word",
          duration: 2,
          x: "10%",
          y: "20%",
          fontSize: 48,
          color: "#DDA0DD",
          fontFamily: "Arial",
          animations: [
            {
              type: "wipe",
              split: "word",
              wipeDirection: "left"
            }
          ]
        },
        
        // 示例6: 分割效果按单词分割
        {
          type: "title",
          text: "Split Word",
          duration: 2,
          x: "50%",
          y: "20%",
          fontSize: 48,
          color: "#F7DC6F",
          fontFamily: "Arial",
          animations: [
            {
              type: "split",
              split: "word",
              segmentDelay: 0.1,
              segmentDuration: 0.3
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 简单文本分割特效测试完成: output/simple-split-test.mp4");
    
  } catch (error) {
    console.error("❌ 简单文本分割特效测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testSimpleSplitVideo();
}

export { testSimpleSplitVideo };
