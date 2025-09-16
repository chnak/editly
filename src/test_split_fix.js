import { VideoMaker } from "./index.js";

/**
 * 测试分割效果修复
 */
async function testSplitFix() {
  console.log("🔧 测试分割效果修复...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/split-fix-test.mp4",
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
        
        // 测试1: 按字符分割
        {
          type: "title",
          text: "ABC",
          duration: 2,
          x: "20%",
          y: "30%",
          fontSize: 64,
          color: "#FFFFFF",
          fontFamily: "Arial",
          animations: [
            {
              type: "split",
              split: "char",
              segmentDelay: 0.2,
              segmentDuration: 0.5
            }
          ]
        },
        
        // 测试2: 按单词分割
        {
          type: "title",
          text: "Hello World",
          duration: 2,
          x: "20%",
          y: "60%",
          fontSize: 48,
          color: "#FF6B6B",
          fontFamily: "Arial",
          animations: [
            {
              type: "split",
              split: "word",
              segmentDelay: 0.3,
              segmentDuration: 0.6
            }
          ]
        },
        
        // 测试3: 波浪分割
        {
          type: "title",
          text: "Wave Split",
          duration: 2,
          x: "60%",
          y: "30%",
          fontSize: 48,
          color: "#4ECDC4",
          fontFamily: "Arial",
          animations: [
            {
              type: "waveSplit",
              split: "word",
              segmentDelay: 0.2,
              segmentDuration: 0.4
            }
          ]
        },
        
        // 测试4: 旋转分割
        {
          type: "title",
          text: "Rotate Split",
          duration: 2,
          x: "60%",
          y: "60%",
          fontSize: 48,
          color: "#45B7D1",
          fontFamily: "Arial",
          animations: [
            {
              type: "rotateSplit",
              split: "word",
              segmentDelay: 0.25,
              segmentDuration: 0.5
            }
          ]
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 分割效果修复测试完成: output/split-fix-test.mp4");
    
  } catch (error) {
    console.error("❌ 分割效果修复测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testSplitFix();
}

export { testSplitFix };
