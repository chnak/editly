import { VideoMaker } from "../index.js";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

/**
 * 字体使用示例 - 展示如何使用自定义字体
 */
async function createFontExample() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  const videoMaker = new VideoMaker({
    outPath: "output/font-example.mp4",
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
        duration: 10,
        startTime: 0,
        zIndex: 0
      },
      
      // 示例1: 使用系统字体（Arial）
      {
        type: "title",
        text: "系统字体 Arial",
        x: 640,
        y: 100,
        fontSize: 50,
        fontFamily: "Arial", // 直接指定系统字体族名
        textColor: "#ffffff",
        duration: 2,
        startTime: 0,
        zIndex: 1,
        animations: ["fadeIn"]
      },
      
      // 示例1.5: 使用其他系统字体
      {
        type: "title",
        text: "系统字体 Times New Roman",
        x: 640,
        y: 150,
        fontSize: 45,
        fontFamily: "Times New Roman", // 使用其他系统字体
        textColor: "#ff6b6b",
        duration: 2,
        startTime: 0.5,
        zIndex: 1,
        animations: ["fadeIn"]
      },
      
      // 示例2: 使用自定义字体文件（PatuaOne）
      {
        type: "title",
        text: "自定义字体 PatuaOne",
        x: 640,
        y: 200,
        fontSize: 50,
        fontPath: resolve(__dirname, "../fonts/PatuaOne-Regular.ttf"), // 指定字体文件路径
        textColor: "#ff6b6b",
        duration: 2,
        startTime: 2,
        zIndex: 1,
        animations: ["zoomIn"]
      },
      
      // 示例3: 使用自定义字体 + 分割动画
      {
        type: "title",
        text: "分割动画效果",
        x: 640,
        y: 300,
        fontSize: 45,
        fontPath: resolve(__dirname, "../fonts/PatuaOne-Regular.ttf"),
        textColor: "#4ecdc4",
        duration: 3,
        startTime: 4,
        zIndex: 1,
        split: "letter", // 按字符分割
        splitDelay: 0.1, // 分割延迟
        splitDuration: 0.3, // 分割持续时间
        animations: ["bounceIn"]
      },
      
      // 示例4: 使用自定义字体 + 阴影效果
      {
        type: "title",
        text: "阴影效果字体",
        x: 640,
        y: 400,
        fontSize: 50,
        fontPath: resolve(__dirname, "../fonts/PatuaOne-Regular.ttf"),
        textColor: "#ffe66d",
        duration: 2,
        startTime: 7,
        zIndex: 1,
        shadow: true,
        shadowColor: "#000000",
        shadowBlur: 10,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        animations: ["slideInFromLeft"]
      },
      
      // 示例5: 使用自定义字体 + 边框效果
      {
        type: "title",
        text: "边框效果字体",
        x: 640,
        y: 500,
        fontSize: 50,
        fontPath: resolve(__dirname, "../fonts/PatuaOne-Regular.ttf"),
        textColor: "#ff9ff3",
        duration: 2,
        startTime: 8,
        zIndex: 1,
        stroke: true,
        strokeColor: "#ffffff",
        strokeWidth: 3,
        animations: ["slideInFromRight"]
      },
      
      // 示例6: 使用自定义字体 + 渐变效果
      {
        type: "title",
        text: "渐变效果字体",
        x: 640,
        y: 600,
        fontSize: 50,
        fontPath: resolve(__dirname, "../fonts/PatuaOne-Regular.ttf"),
        textColor: "#54a0ff",
        duration: 2,
        startTime: 9,
        zIndex: 1,
        gradient: true,
        gradientType: "linear",
        gradientColors: ["#ff0000", "#00ff00", "#0000ff"],
        gradientDirection: "horizontal",
        animations: ["fadeIn"]
      }
    ]
  });

  // 监听事件
  videoMaker.on("start", () => {
    console.log("开始渲染字体示例视频...");
  });

  videoMaker.on("progress", (progress) => {
    console.log(`渲染进度: ${progress}%`);
  });

  videoMaker.on("complete", (outputPath) => {
    console.log(`字体示例视频渲染完成: ${outputPath}`);
  });

  videoMaker.on("error", (error) => {
    console.error("渲染失败:", error);
  });

  try {
    const outputPath = await videoMaker.start();
    console.log(`字体示例视频已保存到: ${outputPath}`);
  } catch (error) {
    console.error("创建字体示例视频失败:", error);
  } finally {
    await videoMaker.close();
  }
}

// 运行示例
createFontExample().catch(console.error);
