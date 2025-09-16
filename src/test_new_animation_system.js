import { VideoMaker } from "./index.js";

/**
 * 测试新的动画系统 - 展示动画库效果
 */
async function testNewAnimationSystem() {
  console.log("🎬 开始测试新的动画系统...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/new-animation-system-test.mp4",
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
        
        // 测试1: 基础缩放动画 (使用新的动画库)
        {
          type: "title",
          text: "缩放动画测试",
          duration: 2,
          x: "50%",
          y: "20%",
          fontSize: 64,
          color: "#FFFFFF",
          fontFamily: "Arial",
          zoomDirection: "in",
          zoomAmount: 0.3
        },
        
        // 测试2: 分割动画 - 按词
        {
          type: "title",
          text: "Welcome to Editly",
          duration: 3,
          x: "50%",
          y: "40%",
          fontSize: 48,
          color: "#FF6B6B",
          fontFamily: "Arial",
          split: "word",
          splitDelay: 0.2,
          splitDuration: 0.5,
          zoomDirection: "in",
          zoomAmount: 0.2
        },
        
        // 测试3: 分割动画 - 按行
        {
          type: "title",
          text: "第一行\n第二行\n第三行",
          duration: 3,
          x: "50%",
          y: "60%",
          fontSize: 36,
          color: "#4ECDC4",
          fontFamily: "Arial",
          split: "line",
          splitDelay: 0.3,
          splitDuration: 0.6,
          zoomDirection: "out",
          zoomAmount: 0.2
        },
        
        // 测试4: 中文文本测试
        {
          type: "title",
          text: "动画系统重构完成",
          duration: 2,
          x: "50%",
          y: "80%",
          fontSize: 48,
          color: "#45B7D1",
          fontFamily: "Arial",
          zoomDirection: "in",
          zoomAmount: 0.25
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 新动画系统测试完成: output/new-animation-system-test.mp4");
    
  } catch (error) {
    console.error("❌ 新动画系统测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testNewAnimationSystem();
}

export { testNewAnimationSystem };
