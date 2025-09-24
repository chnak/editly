import { VideoMaker } from "./index.js";

/**
 * 测试 font-finder 系统字体支持
 */
async function testFontFinder() {
  console.log("开始测试 font-finder 系统字体支持...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/font-finder-test.mp4",
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
        
        // 测试中文字体 - 微软雅黑
        {
          type: "title",
          text: "微软雅黑字体测试",
          x: 640,
          y: 100,
          fontSize: 50,
          fontFamily: "微软雅黑", // 使用 font-finder 查找系统字体
          textColor: "#ffffff",
          duration: 2,
          startTime: 0,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试中文字体 - 楷体
        {
          type: "title",
          text: "楷体字体测试",
          x: 640,
          y: 200,
          fontSize: 50,
          fontFamily: "楷体", // 使用 font-finder 查找系统字体
          textColor: "#ff6b6b",
          duration: 2,
          startTime: 1,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试中文字体 - 宋体
        {
          type: "title",
          text: "宋体字体测试",
          x: 640,
          y: 300,
          fontSize: 50,
          fontFamily: "宋体", // 使用 font-finder 查找系统字体
          textColor: "#4ecdc4",
          duration: 2,
          startTime: 2,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试英文字体 - Arial
        {
          type: "title",
          text: "Arial Font Test",
          x: 640,
          y: 400,
          fontSize: 50,
          fontFamily: "Arial", // 使用 font-finder 查找系统字体
          textColor: "#ffe66d",
          duration: 2,
          startTime: 3,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试英文字体 - Times New Roman
        {
          type: "title",
          text: "Times New Roman Test",
          x: 640,
          y: 500,
          fontSize: 50,
          fontFamily: "Times New Roman", // 使用 font-finder 查找系统字体
          textColor: "#ff9ff3",
          duration: 2,
          startTime: 4,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试中英文混合
        {
          type: "title",
          text: "中英文混合 Mixed Text 测试",
          x: 640,
          y: 600,
          fontSize: 45,
          fontFamily: "微软雅黑", // 使用 font-finder 查找系统字体
          textColor: "#54a0ff",
          duration: 2,
          startTime: 5,
          zIndex: 1,
          animations: ["fadeIn"]
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染 font-finder 测试视频...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`font-finder 测试视频渲染完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`font-finder 测试视频已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("font-finder 测试完成！");
    
  } catch (error) {
    console.error("font-finder 测试失败:", error);
  }
}

// 运行测试
testFontFinder().catch(console.error);
