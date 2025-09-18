import { VideoMaker } from "./index.js";

/**
 * 简化的视频位置和大小测试
 * 快速验证基本功能
 */
async function simpleVideoPositionTest() {
  console.log("开始简化视频位置和大小测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/simple-video-position-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "../assets/img1.jpg",
          duration: 8,
          x: '50%',
          y: '50%',
          width: "100%",
          height: "100%"
        },
        
        // 测试1: 左上角 - 像素单位
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 2,
          x: 50,
          y: 50,
          width: 200,
          height: 150,
          fit: "cover"
        },
        
        // 测试2: 右上角 - 百分比单位
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 2,
          x: "85%",
          y: "10%",
          width: "15%",
          height: "20%",
          fit: "contain",
          startTime: 2
        },
        
        // 测试3: 中心 - 预定义位置
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 2,
          position: "center",
          width: "30%",
          height: "25%",
          fit: "cover",
          startTime: 4
        },
        
        // 测试4: 底部 - 混合单位
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 2,
          x: "50% + 100px",
          y: "80%",
          width: "20%",
          height: "15%",
          fit: "fill",
          startTime: 6
        },
        
        // 标签
        {
          type: "title",
          text: "视频位置测试",
          textColor: "#ffffff",
          fontSize: 36,
          duration: 8,
          x: 640,
          y: 50,
          animations: ["fadeIn"]
        },
        {
          type: "title",
          text: "像素单位",
          textColor: "#ff6b6b",
          fontSize: 20,
          duration: 2,
          x: 50,
          y: 30
        },
        {
          type: "title",
          text: "百分比单位",
          textColor: "#4ecdc4",
          fontSize: 20,
          duration: 2,
          x: "85%",
          y: "5%",
          startTime: 2
        },
        {
          type: "title",
          text: "预定义位置",
          textColor: "#45b7d1",
          fontSize: 20,
          duration: 2,
          x: "50%",
          y: "15%",
          startTime: 4
        },
        {
          type: "title",
          text: "混合单位",
          textColor: "#f9ca24",
          fontSize: 20,
          duration: 2,
          x: "50%",
          y: "70%",
          startTime: 6
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染简化视频位置测试...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`简化视频位置测试完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`简化视频位置测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("简化视频位置测试完成！");
    
  } catch (error) {
    console.error("简化视频位置测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  simpleVideoPositionTest();
}

export { simpleVideoPositionTest };
