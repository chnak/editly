import { VideoMaker } from "./index.js";

/**
 * 标题阴影和边框效果示例
 * 展示各种阴影和边框配置
 */
async function titleShadowStrokeExample() {
  console.log("开始标题阴影和边框效果示例...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/title-shadow-stroke-example.mp4",
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
          duration: 12,
          startTime: 0,
          zIndex: 0
        },
        
        // 示例1: 基础阴影效果
        {
          type: "title",
          text: "基础阴影效果",
          x: 640,
          y: 100,
          fontSize: 50,
          textColor: "#ffffff",
          duration: 2,
          startTime: 0,
          zIndex: 1,
          shadow: true,
          shadowColor: "#000000",
          shadowBlur: 8,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          animations: ["fadeIn"]
        },
        
        // 示例2: 强烈阴影效果
        {
          type: "title",
          text: "强烈阴影效果",
          x: 640,
          y: 180,
          fontSize: 50,
          textColor: "#ffff00",
          duration: 2,
          startTime: 1,
          zIndex: 1,
          shadow: true,
          shadowColor: "#ff0000",
          shadowBlur: 15,
          shadowOffsetX: 8,
          shadowOffsetY: 8,
          animations: ["fadeIn"]
        },
        
        // 示例3: 基础边框效果
        {
          type: "title",
          text: "基础边框效果",
          x: 640,
          y: 260,
          fontSize: 50,
          textColor: "#ffffff",
          duration: 2,
          startTime: 2,
          zIndex: 1,
          stroke: true,
          strokeColor: "#0000ff",
          strokeWidth: 2,
          animations: ["fadeIn"]
        },
        
        // 示例4: 粗边框效果
        {
          type: "title",
          text: "粗边框效果",
          x: 640,
          y: 340,
          fontSize: 50,
          textColor: "#00ff00",
          duration: 2,
          startTime: 3,
          zIndex: 1,
          stroke: true,
          strokeColor: "#ff0000",
          strokeWidth: 5,
          animations: ["fadeIn"]
        },
        
        // 示例5: 阴影 + 边框组合
        {
          type: "title",
          text: "阴影+边框组合",
          x: 640,
          y: 420,
          fontSize: 50,
          textColor: "#ffff00",
          duration: 2,
          startTime: 4,
          zIndex: 1,
          shadow: true,
          shadowColor: "#000000",
          shadowBlur: 10,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          stroke: true,
          strokeColor: "#0000ff",
          strokeWidth: 3,
          animations: ["fadeIn"]
        },
        
        // 示例6: 分割文本 + 阴影 + 边框
        {
          type: "title",
          text: "分割文本效果",
          x: 640,
          y: 500,
          fontSize: 45,
          textColor: "#ff00ff",
          duration: 2,
          startTime: 5,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.08,
          splitDuration: 0.2,
          shadow: true,
          shadowColor: "#00ffff",
          shadowBlur: 6,
          shadowOffsetX: 2,
          shadowOffsetY: 2,
          stroke: true,
          strokeColor: "#ffffff",
          strokeWidth: 2,
          animations: ["zoomIn"]
        },
        
        // 示例7: 多层阴影效果
        {
          type: "title",
          text: "多层阴影效果",
          x: 640,
          y: 580,
          fontSize: 45,
          textColor: "#ffffff",
          duration: 2,
          startTime: 6,
          zIndex: 1,
          shadow: true,
          shadowColor: "#ff0000",
          shadowBlur: 20,
          shadowOffsetX: 10,
          shadowOffsetY: 10,
          stroke: true,
          strokeColor: "#000000",
          strokeWidth: 4,
          animations: ["fadeIn"]
        },
        
        // 示例8: 彩色边框效果
        {
          type: "title",
          text: "彩色边框效果",
          x: 640,
          y: 100,
          fontSize: 45,
          textColor: "#000000",
          duration: 2,
          startTime: 7,
          zIndex: 1,
          stroke: true,
          strokeColor: "#ff00ff",
          strokeWidth: 6,
          animations: ["fadeIn"]
        },
        
        // 示例9: 柔和阴影效果
        {
          type: "title",
          text: "柔和阴影效果",
          x: 640,
          y: 180,
          fontSize: 45,
          textColor: "#ffffff",
          duration: 2,
          startTime: 8,
          zIndex: 1,
          shadow: true,
          shadowColor: "#000000",
          shadowBlur: 25,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          animations: ["fadeIn"]
        },
        
        // 示例10: 组合效果 - 阴影 + 粗边框 + 分割
        {
          type: "title",
          text: "终极组合效果",
          x: 640,
          y: 260,
          fontSize: 40,
          textColor: "#ffff00",
          duration: 2,
          startTime: 9,
          zIndex: 1,
          split: "word",
          splitDelay: 0.1,
          splitDuration: 0.3,
          shadow: true,
          shadowColor: "#ff0000",
          shadowBlur: 12,
          shadowOffsetX: 6,
          shadowOffsetY: 6,
          stroke: true,
          strokeColor: "#0000ff",
          strokeWidth: 4,
          animations: ["zoomIn", "fadeIn"]
        }
      ]
    });

    console.log("开始渲染标题阴影和边框效果示例...");
    await videoMaker.start();
    console.log("标题阴影和边框效果示例完成");
    
  } catch (error) {
    console.error("标题阴影和边框效果示例失败:", error);
  }
}

// 运行示例
titleShadowStrokeExample().catch(console.error);
