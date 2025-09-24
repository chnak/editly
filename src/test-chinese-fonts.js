import { VideoMaker } from "./index.js";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

/**
 * 中文字体测试 - 展示如何正确使用中文字体
 */
async function testChineseFonts() {
  console.log("开始测试中文字体支持...");
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/chinese-fonts-test.mp4",
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
        
        // 测试1: 使用自定义中文字体文件（推荐方式）
        {
          type: "title",
          text: "自定义中文字体测试",
          x: 640,
          y: 100,
          fontSize: 50,
          fontPath: resolve(__dirname, "./fonts/PatuaOne-Regular.ttf"), // 使用字体文件路径
          textColor: "#ffffff",
          duration: 2,
          startTime: 0,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试2: 使用系统字体（可能不支持中文）
        {
          type: "title",
          text: "系统字体测试 Arial",
          x: 640,
          y: 200,
          fontSize: 50,
          fontFamily: "Arial", // 系统字体，可能不支持中文
          textColor: "#ff6b6b",
          duration: 2,
          startTime: 1,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试3: 中英文混合文本
        {
          type: "title",
          text: "中英文混合 Mixed Text 测试",
          x: 640,
          y: 300,
          fontSize: 45,
          fontPath: resolve(__dirname, "./fonts/PatuaOne-Regular.ttf"),
          textColor: "#4ecdc4",
          duration: 2,
          startTime: 2,
          zIndex: 1,
          animations: ["zoomIn"]
        },
        
        // 测试4: 分割动画 + 中文字体
        {
          type: "title",
          text: "分割动画中文字体",
          x: 640,
          y: 400,
          fontSize: 45,
          fontPath: resolve(__dirname, "./fonts/PatuaOne-Regular.ttf"),
          textColor: "#ffe66d",
          duration: 3,
          startTime: 3,
          zIndex: 1,
          split: "letter", // 按字符分割
          splitDelay: 0.1,
          splitDuration: 0.3,
          animations: ["bounceIn"]
        },
        
        // 测试5: 长文本测试
        {
          type: "title",
          text: "这是一个很长的中文文本用来测试字体渲染效果和换行处理",
          x: 640,
          y: 500,
          fontSize: 35,
          fontPath: resolve(__dirname, "./fonts/PatuaOne-Regular.ttf"),
          textColor: "#ff9ff3",
          duration: 2,
          startTime: 5,
          zIndex: 1,
          animations: ["slideInFromLeft"]
        },
        
        // 测试6: 特殊字符测试
        {
          type: "title",
          text: "特殊字符：！@#￥%……&*（）——+{}|：\"<>?[]\\;',./",
          x: 640,
          y: 600,
          fontSize: 40,
          fontPath: resolve(__dirname, "./fonts/PatuaOne-Regular.ttf"),
          textColor: "#54a0ff",
          duration: 2,
          startTime: 6,
          zIndex: 1,
          animations: ["slideInFromRight"]
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染中文字体测试视频...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`中文字体测试视频渲染完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`中文字体测试视频已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("中文字体测试完成！");
    
  } catch (error) {
    console.error("中文字体测试失败:", error);
  }
}

// 运行测试
testChineseFonts().catch(console.error);
