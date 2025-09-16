import { VideoMaker } from "./index.js";

/**
 * 测试中文字体渲染
 */
async function testChineseFont() {
  console.log("🈳 开始测试中文字体渲染...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/chinese-font-test.mp4",
      width: 800,
      height: 600,
      fps: 24,
      verbose: true,
      elements: [
        // 测试标题元素的中文字体
        {
          type: "title",
          text: "欢迎使用视频制作库",
          textColor: "#ffffff",
          position: "center",
          zoomDirection: "in",
          zoomAmount: 0.3,
          duration: 3,
          x: 400,
          y: 200
        },
        
        // 测试文本元素的中文字体
        {
          type: "title",
          text: "这是一个测试文本",
          textColor: "#ff6b6b",
          textAlign: "center",
          textBaseline: "center",
          duration: 3,
          x: 400,
          y: 400
        },
        
        // 测试分割动画的中文字体
        {
          type: "title",
          text: "你好世界",
          textColor: "#4ecdc4",
          position: "bottom",
          split: "word",
          splitDelay: 0.3,
          splitDuration: 0.5,
          duration: 4,
          x: 400,
          y: 500
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    
    // 监听事件
    videoMaker.on("start", () => {
      console.log("🚀 开始渲染中文字体测试...");
    });
    
    videoMaker.on("progress", (progress) => {
      console.log(`📊 渲染进度: ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`🎉 中文字体测试完成: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error("❌ 渲染失败:", error);
    });
    
    console.log("开始渲染...");
    const outputPath = await videoMaker.start();
    console.log(`✅ 中文字体测试完成: ${outputPath}`);
    
    await videoMaker.close();
    
  } catch (error) {
    console.error("❌ 中文字体测试失败:", error);
    console.error("错误堆栈:", error.stack);
  }
}

// 运行测试
testChineseFont();
