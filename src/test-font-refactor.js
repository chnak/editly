import { VideoMaker } from "./index.js";

/**
 * 测试字体重构后的功能
 */
async function testFontRefactor() {
  console.log("开始测试字体重构后的功能...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/font-refactor-test.mp4",
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
        
        // 测试 title 元素使用中文字体
        {
          type: "title",
          text: "Title 元素中文字体测试",
          x: 640,
          y: 150,
          fontSize: 50,
          fontFamily: "微软雅黑", // 使用 BaseElement 的字体处理
          textColor: "#ffffff",
          duration: 2,
          startTime: 0,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试 text 元素使用中文字体
        {
          type: "text",
          text: "Text 元素中文字体测试",
          x: 640,
          y: 250,
          fontSize: 40,
          fontFamily: "楷体", // 使用 BaseElement 的字体处理
          fillColor: "#ff6b6b",
          duration: 2,
          startTime: 1,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试自定义字体文件
        {
          type: "title",
          text: "自定义字体文件测试",
          x: 640,
          y: 350,
          fontSize: 45,
          fontPath: "./fonts/PatuaOne-Regular.ttf", // 使用 BaseElement 的字体处理
          textColor: "#4ecdc4",
          duration: 2,
          startTime: 2,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试英文字体
        {
          type: "title",
          text: "English Font Test",
          x: 640,
          y: 450,
          fontSize: 45,
          fontFamily: "Arial", // 使用 BaseElement 的字体处理
          textColor: "#ffe66d",
          duration: 2,
          startTime: 3,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试字体大小单位
        {
          type: "title",
          text: "字体大小单位测试",
          x: 640,
          y: 550,
          fontSize: "5%", // 使用百分比单位
          fontFamily: "宋体", // 使用 BaseElement 的字体处理
          textColor: "#ff9ff3",
          duration: 2,
          startTime: 4,
          zIndex: 1,
          animations: ["fadeIn"]
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染字体重构测试视频...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`字体重构测试视频渲染完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`字体重构测试视频已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("字体重构测试完成！");
    
  } catch (error) {
    console.error("字体重构测试失败:", error);
  }
}

// 运行测试
testFontRefactor().catch(console.error);
