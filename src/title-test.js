import { VideoMaker } from "./index.js";

/**
 * 测试标题元素
 */
async function testTitleElement() {
  console.log("🎬 开始测试标题元素...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/title-test.mp4",
      width: 800,
      height: 600,
      fps: 24,
      verbose: true,
      elements: [
        // 基础标题
        {
          type: "title",
          text: "欢迎使用视频制作库",
          textColor: "#ffffff",
          position: "center",
          zoomDirection: "in",
          zoomAmount: 0.3,
          duration: 3,
          x: 400,
          y: 300
        },
        
        // 分割动画标题
        {
          type: "title",
          text: "Hello World",
          textColor: "#ff6b6b",
          position: "top",
          split: "word",
          splitDelay: 0.2,
          splitDuration: 0.5,
          duration: 4,
          x: 400,
          y: 150
        },
        
        // 多行标题
        {
          type: "title",
          text: "第一行\n第二行\n第三行",
          textColor: "#4ecdc4",
          position: "bottom",
          split: "line",
          splitDelay: 0.3,
          splitDuration: 0.4,
          duration: 5,
          x: 400,
          y: 450
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    
    // 监听事件
    videoMaker.on("start", () => {
      console.log("🚀 开始渲染标题测试...");
    });
    
    videoMaker.on("progress", (progress) => {
      console.log(`📊 渲染进度: ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`🎉 标题测试完成: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.error("❌ 渲染失败:", error);
    });
    
    console.log("开始渲染...");
    const outputPath = await videoMaker.start();
    console.log(`✅ 标题测试完成: ${outputPath}`);
    
    await videoMaker.close();
    
  } catch (error) {
    console.error("❌ 标题测试失败:", error);
    console.error("错误堆栈:", error.stack);
  }
}

// 运行测试
testTitleElement();
