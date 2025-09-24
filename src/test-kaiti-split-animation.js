import { VideoMaker } from "./index.js";

/**
 * 测试楷体分割文本动画功能
 */
async function testKaitiSplitAnimation() {
  console.log("开始测试楷体分割文本动画功能...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/kaiti-split-animation-test.mp4",
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
          duration: 12,
          startTime: 0,
          zIndex: 0
        },
        
        // 测试楷体字母分割动画
        {
          type: "title",
          text: "楷体字母分割",
          x: 640,
          y: 150,
          fontSize: 60,
          fontFamily: "楷体", // 使用楷体
          textColor: "#ffffff",
          duration: 3,
          startTime: 0,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.08,
          splitDuration: 0.15,
          animations: ["slideInLeft"]
        },
        
        // 测试楷体单词分割动画
        {
          type: "title",
          text: "楷体单词分割测试",
          x: 640,
          y: 250,
          fontSize: 50,
          fontFamily: "楷体", // 使用楷体
          textColor: "#ff6b6b",
          duration: 3,
          startTime: 1,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.08,
          splitDuration: 0.15,
          animations: ["fadeIn","slideOutRight"]
        },
        
        // 测试楷体行分割动画
        {
          type: "title",
          text: "楷体行分割\n多行文本\n测试效果",
          x: 640,
          y: 350,
          fontSize: 45,
          fontFamily: "楷体", // 使用楷体
          textColor: "#4ecdc4",
          duration: 3,
          startTime: 2,
          zIndex: 1,
          split: "lines", // 行分割
          splitDelay: 0.08,
          splitDuration: 0.15,
          animations: ["fadeIn"]
        },
        
        // 测试楷体打字机效果
        {
          type: "title",
          text: "楷体打字机效果测试",
          x: 640,
          y: 500,
          fontSize: 40,
          fontFamily: "楷体", // 使用楷体
          textColor: "#ffe66d",
          duration: 4,
          startTime: 3,
          zIndex: 1,
          typewriter: true, // 启用打字机效果
          typewriterSpeed: 150, // 打字速度
          animations: ["fadeIn","slideOutBottom"]
        },
        
        // 测试楷体复杂动画组合
        {
          type: "title",
          text: "楷体复杂动画",
          x: 640,
          y: 600,
          fontSize: 50,
          fontFamily: "楷体", // 使用楷体
          textColor: "#ff9ff3",
          duration: 3,
          startTime: 5,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.08,
          splitDuration: 0.15,
          animations: [
            "fadeIn",
            "slideInTop",
            "zoomIn"
          ]
        },
        
        // 测试楷体与英文字体对比
        {
          type: "title",
          text: "楷体 vs Arial 对比",
          x: 640,
          y: 100,
          fontSize: 35,
          fontFamily: "楷体", // 楷体
          textColor: "#54a0ff",
          duration: 2,
          startTime: 7,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.08,
          splitDuration: 0.15,
          animations: ["fadeIn","slideInTop"]
        },
        
        {
          type: "title",
          text: "Kaiti vs Arial Comparison",
          x: 640,
          y: 140,
          fontSize: 35,
          fontFamily: "Arial", // Arial 对比
          textColor: "#54a0ff",
          duration: 2,
          startTime: 7.5,
          zIndex: 1,
          split: "word",
          splitDelay: 0.08,
          splitDuration: 0.15,
          animations: ["fadeIn","slideInTop"]
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染楷体分割动画测试视频...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`楷体分割动画测试视频渲染完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`楷体分割动画测试视频已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("楷体分割动画测试完成！");
    
  } catch (error) {
    console.error("楷体分割动画测试失败:", error);
  }
}

// 运行测试
testKaitiSplitAnimation().catch(console.error);
