import { VideoMaker } from "./index.js";

/**
 * 测试分割动画时间计算
 */
async function testSplitTiming() {
  console.log("开始测试分割动画时间计算...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/split-timing-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      verbose: false,
      elements: [
        // 背景图片
        {
          type: "image",
          source: "../assets/img1.jpg",
          x: 0,
          y: 0,
          width: 1280,
          height: 720,
          duration: 3,
          startTime: 0,
          zIndex: 0
        },
        
        // 测试分割动画时间
        {
          type: "title",
          text: "测试分割",
          x: 640,
          y: 360,
          fontSize: 60,
          fontFamily: "楷体",
          textColor: "#ffffff",
          duration: 2,
          startTime: 0,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.1,
          splitDuration: 0.3,
          animations: ["fadeIn", "slideInLeft"]
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染分割时间测试视频...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`分割时间测试视频渲染完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`分割时间测试视频已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("分割时间测试完成！");
    
  } catch (error) {
    console.error("分割时间测试失败:", error);
  }
}

// 运行测试
testSplitTiming().catch(console.error);
