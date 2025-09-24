import { VideoMaker } from "./index.js";

/**
 * 测试系统字体支持
 */
async function testSystemFonts() {
  console.log("开始测试系统字体支持...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/system-fonts-test.mp4",
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
        
        // 测试各种系统字体
        {
          type: "title",
          text: "Arial 字体测试",
          x: 640,
          y: 100,
          fontSize: 50,
          fontFamily: "Arial", // 系统字体
          textColor: "#ffffff",
          duration: 2,
          startTime: 0,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        {
          type: "title",
          text: "Times New Roman 字体测试",
          x: 640,
          y: 200,
          fontSize: 50,
          fontFamily: "Times New Roman", // 系统字体
          textColor: "#ff6b6b",
          duration: 2,
          startTime: 1,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        {
          type: "title",
          text: "Helvetica 字体测试",
          x: 640,
          y: 300,
          fontSize: 50,
          fontFamily: "Helvetica", // 系统字体
          textColor: "#4ecdc4",
          duration: 2,
          startTime: 2,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        {
          type: "title",
          text: "Georgia 字体测试",
          x: 640,
          y: 400,
          fontSize: 50,
          fontFamily: "Georgia", // 系统字体
          textColor: "#ffe66d",
          duration: 2,
          startTime: 3,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        {
          type: "title",
          text: "Verdana 字体测试",
          x: 640,
          y: 500,
          fontSize: 50,
          fontFamily: "Verdana", // 系统字体
          textColor: "#ff9ff3",
          duration: 2,
          startTime: 4,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        {
          type: "title",
          text: "Courier New 字体测试",
          x: 640,
          y: 600,
          fontSize: 50,
          fontFamily: "Courier New", // 系统字体
          textColor: "#54a0ff",
          duration: 2,
          startTime: 5,
          zIndex: 1,
          animations: ["fadeIn"]
        }
      ]
    });

    console.log("开始渲染系统字体测试...");
    await videoMaker.start();
    console.log("系统字体测试完成");
    
  } catch (error) {
    console.error("系统字体测试失败:", error);
  }
}

// 运行测试
testSystemFonts().catch(console.error);
