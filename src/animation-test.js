import { VideoMaker, createAnimationBuilder, createPresetBuilder, quickPreset } from "./index.js";

/**
 * 简单的动画系统测试
 */
async function testAnimationSystem() {
  console.log("开始测试动画系统...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/animation-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "../assets/img1.jpg",
          duration: 5,
          x: '50%',
          y: '50%',
          // width:"50%",
          // height:"50%",
          fit:"contain-blur"
        },
        
        // 测试预设动画
        {
          type: "title",
          text: "预设动画测试",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 5,
          x: 640,
          y: 200,
          animations: ["fadeIn"]
        },
        
        // 测试动画构建器
        {
          type: "title",
          text: "构建器测试",
          textColor: "#ff6b6b",
          fontSize: 48,
          duration: 5,
          x: 640,
          y: 300,
          startTime: 1,
          animations: [
            {
              property: 'x',
              from: -200,
              to: 640,
              duration: 1,
              easing: 'easeOut'
            },
            {
              property: 'scaleX',
              from: 0.5,
              to: 1,
              duration: 1,
              easing: 'bounce'
            }
          ]
        },
        
        // 测试快速预设
        {
          type: "title",
          text: "快速预设测试",
          textColor: "#4ecdc4",
          fontSize: 48,
          duration: 5,
          x: 640,
          y: 400,
          startTime: 2,
          animations: [quickPreset('zoomIn', { duration: 1.5 })]
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染动画测试视频...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`动画测试视频渲染完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`动画测试视频已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("动画系统测试完成！");
    
  } catch (error) {
    console.error("动画系统测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testAnimationSystem();
}

export { testAnimationSystem };
