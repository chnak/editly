import { VideoMaker } from "./index.js";

/**
 * 测试标题元素的阴影和边框功能
 */
async function testTitleShadowStroke() {
  console.log("开始测试标题阴影和边框功能...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/title-shadow-stroke-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      verbose: true,
      elements: [
        // 背景图片
        {
          type: "image",
          source: "../assets/img1.jpg",
          x: 0,
          y: 0,
          width: 1280,
          height: 720,
          duration: 8,
          startTime: 0,
          zIndex: 0
        },
        
        // 测试1: 基础阴影效果
        {
          type: "title",
          text: "阴影效果测试",
          x: 640,
          y: 150,
          fontSize: 60,
          textColor: "#ffffff",
          duration: 2,
          startTime: 0,
          zIndex: 1,
          shadow: true,
          shadowColor: "#000000",
          shadowBlur: 10,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          animations: ["fadeIn"]
        },
        
        // 测试2: 基础边框效果
        {
          type: "title",
          text: "边框效果测试",
          x: 640,
          y: 250,
          fontSize: 60,
          textColor: "#ffffff",
          duration: 2,
          startTime: 2,
          zIndex: 1,
          stroke: true,
          strokeColor: "#ff0000",
          strokeWidth: 3,
          animations: ["fadeIn"]
        },
        
        // 测试3: 阴影 + 边框组合
        {
          type: "title",
          text: "阴影+边框组合",
          x: 640,
          y: 350,
          fontSize: 60,
          textColor: "#ffff00",
          duration: 2,
          startTime: 4,
          zIndex: 1,
          shadow: true,
          shadowColor: "#000000",
          shadowBlur: 15,
          shadowOffsetX: 8,
          shadowOffsetY: 8,
          stroke: true,
          strokeColor: "#0000ff",
          strokeWidth: 4,
          animations: ["fadeIn"]
        },
        
        // 测试4: 分割文本 + 阴影 + 边框
        {
          type: "title",
          text: "分割文本效果",
          x: 640,
          y: 450,
          fontSize: 50,
          textColor: "#00ff00",
          duration: 2,
          startTime: 6,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.1,
          splitDuration: 0.3,
          shadow: true,
          shadowColor: "#ff0000",
          shadowBlur: 8,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          stroke: true,
          strokeColor: "#ffffff",
          strokeWidth: 2,
          animations: ["zoomIn"]
        }
      ]
    });

    console.log("开始渲染标题阴影和边框测试...");
    await videoMaker.start();
    console.log("标题阴影和边框测试完成");
    
  } catch (error) {
    console.error("标题阴影和边框测试失败:", error);
  }
}

// 运行测试
testTitleShadowStroke().catch(console.error);
