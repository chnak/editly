import { VideoMaker } from "./index.js";

/**
 * 测试位置单位系统 - 支持 vw, vh, %, px 等单位
 */
async function testPositionUnits() {
  console.log("开始测试位置单位系统...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/position-units-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 4,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1
        },
        
        // 测试像素单位
        {
          type: "title",
          text: "像素单位",
          textColor: "#ff0000",
          fontSize: 32,
          duration: 4,
          x: "100px",
          y: "100px"
        },
        
        // 测试百分比单位
        {
          type: "title",
          text: "百分比单位",
          textColor: "#00ff00",
          fontSize: 32,
          duration: 4,
          x: "50%",
          y: "20%"
        },
        
        // 测试 vw 单位 (视口宽度)
        {
          type: "title",
          text: "vw 单位",
          textColor: "#0000ff",
          fontSize: 32,
          duration: 4,
          x: "80vw",
          y: "30%"
        },
        
        // 测试 vh 单位 (视口高度)
        {
          type: "title",
          text: "vh 单位",
          textColor: "#ffff00",
          fontSize: 32,
          duration: 4,
          x: "20%",
          y: "80vh"
        },
        
        // 测试混合单位表达式
        {
          type: "title",
          text: "混合单位",
          textColor: "#ff00ff",
          fontSize: 32,
          duration: 4,
          x: "50% + 100px",
          y: "50% - 50px"
        },
        
        // 测试预定义位置
        {
          type: "title",
          text: "预定义位置",
          textColor: "#00ffff",
          fontSize: 32,
          duration: 4,
          position: "bottom-right"
        },
        
        // 测试中心位置
        {
          type: "title",
          text: "中心位置",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 4,
          position: "center"
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 位置单位测试完成: output/position-units-test.mp4");
    
  } catch (error) {
    console.error("❌ 位置单位测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testPositionUnits();
}

export { testPositionUnits };
