import { VideoMaker } from "./src/index.js";

/**
 * 测试字体回退到 PatuaOne-Regular.ttf
 */
async function testFontFallbackPatua() {
  console.log("开始测试字体回退到 PatuaOne-Regular.ttf...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/font-fallback-patua-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        {
            type: "shape",
            shape: "rectangle",
            fillColor: "#1a1a2e",
            x: "50%",
            y: "50%",
            width: "100%",
            height: "100%",
            originX: "center",
            originY: "center",
            startTime: 0,
            duration: 12,
            zIndex: 0
        },
        // 测试1: 不存在的字体文件，应该回退到 PatuaOne-Regular.ttf
        {
          type: "subtitle",
          text: "不存在的字体文件 - 应该回退到 PatuaOne-Regular.ttf",
          textColor: "#ffffff",
          backgroundColor: "rgba(255,0,0,0.7)",
          fontPath: "src/fonts/NonExistentFont.ttf", // 不存在的字体文件
          fontSize: 48,
          position: "center",
          startTime: 0,
          duration: 3,
          position: "bottom"
        },
        
        // 测试2: 不存在的系统字体，应该回退到 PatuaOne-Regular.ttf
        {
          type: "subtitle",
          text: "不存在的系统字体 - 应该回退到 PatuaOne-Regular.ttf",
          textColor: "#ffff00",
          backgroundColor: "rgba(0,255,0,0.7)",
          fontFamily: "NonExistentFont", // 不存在的系统字体
          fontSize: 48,
          position: "bottom",
          duration: 3,
          position: "top",
          startTime: 1
        },
        
        // 测试3: 正常的 PatuaOne-Regular.ttf 作为对比
        {
          type: "subtitle",
          text: "正常的 PatuaOne-Regular.ttf 字体",
          textColor: "#00ff00",
          backgroundColor: "rgba(0,0,255,0.7)",
          fontPath: "src/fonts/PatuaOne-Regular.ttf",
          fontSize: 48,
          position: "top-left",
          duration: 3,
          position: "center",
          startTime: 2
        },
        
        // 测试4: 使用 text 元素测试字体回退
        {
          type: "text",
          text: "Text 元素字体回退测试",
          fillColor: "#ff00ff",
          fontFamily: "NonExistentFont", // 不存在的系统字体
          fontSize: 48,
          duration: 3,
          position: "top-right",
          textAlign: "center",
          startTime: 3
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染字体回退测试...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`字体回退测试完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`字体回退测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("字体回退测试完成！");
    
  } catch (error) {
    console.error("字体回退测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testFontFallbackPatua();
}

export { testFontFallbackPatua };