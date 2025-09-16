import { VideoMaker } from "./index.js";

/**
 * 综合位置系统测试 - 测试所有元素类型的位置单位支持
 */
async function testComprehensivePositioning() {
  console.log("开始综合位置系统测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/comprehensive-position-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景图像 - 使用百分比定位
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 5,
          x: "0%",
          y: "0%",
          scaleX: 1,
          scaleY: 1
        },
        
        // 标题元素 - 测试各种单位
        {
          type: "title",
          text: "像素单位 (100px, 100px)",
          textColor: "#ff0000",
          fontSize: 24,
          duration: 5,
          x: "100px",
          y: "100px"
        },
        
        {
          type: "title",
          text: "百分比单位 (50%, 20%)",
          textColor: "#00ff00",
          fontSize: 24,
          duration: 5,
          x: "50%",
          y: "20%"
        },
        
        {
          type: "title",
          text: "vw 单位 (80vw, 30%)",
          textColor: "#0000ff",
          fontSize: 24,
          duration: 5,
          x: "80vw",
          y: "30%"
        },
        
        {
          type: "title",
          text: "vh 单位 (20%, 80vh)",
          textColor: "#ffff00",
          fontSize: 24,
          duration: 5,
          x: "20%",
          y: "80vh"
        },
        
        {
          type: "title",
          text: "混合单位 (50% + 100px, 50% - 50px)",
          textColor: "#ff00ff",
          fontSize: 24,
          duration: 5,
          x: "50% + 100px",
          y: "50% - 50px"
        },
        
        // 测试预定义位置
        {
          type: "title",
          text: "左上角",
          textColor: "#00ffff",
          fontSize: 32,
          duration: 5,
          position: "top-left"
        },
        
        {
          type: "title",
          text: "右上角",
          textColor: "#ffffff",
          fontSize: 32,
          duration: 5,
          position: "top-right"
        },
        
        {
          type: "title",
          text: "左下角",
          textColor: "#ff8800",
          fontSize: 32,
          duration: 5,
          position: "bottom-left"
        },
        
        {
          type: "title",
          text: "右下角",
          textColor: "#8800ff",
          fontSize: 32,
          duration: 5,
          position: "bottom-right"
        },
        
        // 中心位置
        {
          type: "title",
          text: "中心位置",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 5,
          position: "center",
          textColor: "#ffffff"
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 综合位置系统测试完成: output/comprehensive-position-test.mp4");
    
  } catch (error) {
    console.error("❌ 综合位置系统测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testComprehensivePositioning();
}

export { testComprehensivePositioning };
