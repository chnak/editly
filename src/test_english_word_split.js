import { VideoMaker } from "./index.js";

/**
 * 测试英文单词分割修复
 */
async function testEnglishWordSplit() {
  console.log("开始测试英文单词分割修复...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/english-word-split-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 英文单词分割测试
        {
            type: "shape",
            shape: "rectangle",
            fillColor: "#2c3e50",
            width: "100%",
            height: "100%",
            duration: 10,
            startTime: 0,
            x: '50%',
            y: '50%'
        },
        {
          type: "title",
          text: "Hello World Test",
          textColor: "#ff6b6b",
          fontSize: '30%',
          duration: 3,
          x: 640,
          y: 200,
          startTime: 0,
          split: "word",
          splitDelay: 0.2,
          splitDuration: 0.5,
          animations: ["rotateIn"] 
        },
        
        // 英文句子分割测试
        {
          type: "title",
          text: "This is a test sentence",
          textColor: "#4ecdc4",
          fontSize: 36,
          duration: 3,
          x: 640,
          y: 300,
          startTime: 1,
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.4,
          animations: ["fadeIn"] 
        },
        
        // 中英文混合单词分割测试
        {
          type: "title",
          text: "Hello 世界 World",
          textColor: "#ffd93d",
          fontSize: 40,
          duration: 3,
          x: 640,
          y: 400,
          startTime: 2,
          split: "word",
          splitDelay: 0.18,
          splitDuration: 0.6,
          animations: ["zoomIn"] 
        },
        
        // 带标点符号的英文测试
        {
          type: "title",
          text: "Hello, World! How are you?",
          textColor: "#ff9ff3",
          fontSize: 38,
          duration: 3,
          x: 640,
          y: 500,
          startTime: 3,
          split: "word",
          splitDelay: 0.12,
          splitDuration: 0.4
        },
        
        // 长英文句子测试
        {
          type: "title",
          text: "The quick brown fox jumps over the lazy dog",
          textColor: "#54a0ff",
          fontSize: 32,
          duration: 3,
          x: 640,
          y: 600,
          startTime: 4,
          split: "word",
          splitDelay: 0.1,
          splitDuration: 0.3
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染英文单词分割测试...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`英文单词分割测试完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`英文单词分割测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("英文单词分割测试完成！");
    
  } catch (error) {
    console.error("英文单词分割测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testEnglishWordSplit();
}

export { testEnglishWordSplit };