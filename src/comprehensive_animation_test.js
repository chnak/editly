import { VideoMaker } from "./index.js";

/**
 * 综合动画测试 - 展示所有动画库功能
 */
async function testComprehensiveAnimation() {
  console.log("🎬 开始综合动画测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/comprehensive-animation-test.mp4",
      width: 1920,
      height: 1080,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 12,
          x: "0%",
          y: "0%",
          imageWidth: 1920,
          imageHeight: 1080,
          fit: "cover"
        },
        
        // 场景1: 基础缩放动画
        {
          type: "title",
          text: "基础缩放动画",
          duration: 2,
          x: "50%",
          y: "30%",
          fontSize: 72,
          color: "#FFFFFF",
          fontFamily: "Arial",
          zoomDirection: "in",
          zoomAmount: 0.3
        },
        
        // 场景2: 分割动画 - 按词
        {
          type: "title",
          text: "Welcome to the New Animation System",
          duration: 3,
          x: "50%",
          y: "50%",
          fontSize: 56,
          color: "#FF6B6B",
          fontFamily: "Arial",
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.4,
          zoomDirection: "in",
          zoomAmount: 0.2
        },
        
        // 场景3: 分割动画 - 按行
        {
          type: "title",
          text: "第一行文本\n第二行文本\n第三行文本",
          duration: 3,
          x: "50%",
          y: "70%",
          fontSize: 48,
          color: "#4ECDC4",
          fontFamily: "Arial",
          split: "line",
          splitDelay: 0.25,
          splitDuration: 0.5,
          zoomDirection: "out",
          zoomAmount: 0.2
        },
        
        // 场景4: 中文文本测试
        {
          type: "title",
          text: "动画系统重构完成",
          duration: 2,
          x: "50%",
          y: "30%",
          fontSize: 64,
          color: "#45B7D1",
          fontFamily: "Arial",
          zoomDirection: "in",
          zoomAmount: 0.25
        },
        
        // 场景5: 大文本测试
        {
          type: "title",
          text: "Big Text Test",
          duration: 2,
          x: "50%",
          y: "50%",
          fontSize: 96,
          color: "#F39C12",
          fontFamily: "Arial",
          zoomDirection: "in",
          zoomAmount: 0.4
        },
        
        // 场景6: 多行分割测试
        {
          type: "title",
          text: "Line 1\nLine 2\nLine 3\nLine 4",
          duration: 4,
          x: "50%",
          y: "70%",
          fontSize: 42,
          color: "#E74C3C",
          fontFamily: "Arial",
          split: "line",
          splitDelay: 0.2,
          splitDuration: 0.6,
          zoomDirection: "in",
          zoomAmount: 0.15
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 综合动画测试完成: output/comprehensive-animation-test.mp4");
    
  } catch (error) {
    console.error("❌ 综合动画测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testComprehensiveAnimation();
}

export { testComprehensiveAnimation };
