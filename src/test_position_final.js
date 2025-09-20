import { VideoMaker } from "./index.js";

/**
 * 测试文本位置最终修复
 */
async function testPositionFinal() {
  console.log("开始测试文本位置最终修复...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/position-final-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "shape",
          shape: "rectangle",
          fillColor: "#2c3e50",
          width: "100%",
          height: "100%",
          duration: 5,
          startTime: 0,
          x: '50%',
          y: '50%'
        },
        
        // 测试1: 普通文本 - 左上角
        {
          type: "title",
          text: "普通文本左上角",
          textColor: "#ff6b6b",
          fontSize: 40,
          duration: 5,
          x: 200,
          y: 100,
          startTime: 0
        },
        
        // 测试2: 普通文本 - 中心
        {
          type: "title",
          text: "普通文本中心",
          textColor: "#4ecdc4",
          fontSize: 40,
          duration: 5,
          x: 640,
          y: 360,
          startTime: 0
        },
        
        // 测试3: 分割文本 - 右上角
        {
          type: "title",
          text: "分割文本右上角",
          textColor: "#45b7d1",
          fontSize: 40,
          duration: 5,
          x: 1080,
          y: 100,
          startTime: 0,
          split: "word",
          splitDelay: 0.1,
          splitDuration: 0.3
        },
        
        // 测试4: 分割文本 - 中心
        {
          type: "title",
          text: "分割文本中心",
          textColor: "#f39c12",
          fontSize: 40,
          duration: 5,
          x: 640,
          y: 200,
          startTime: 0,
          split: "word",
          splitDelay: 0.1,
          splitDuration: 0.3
        },
        
        // 测试5: 带动画的分割文本
        {
          type: "title",
          text: "动画分割文本",
          textColor: "#e74c3c",
          fontSize: 50,
          duration: 5,
          x: 640,
          y: 500,
          startTime: 0,
          split: "word",
          splitDelay: 0.2,
          splitDuration: 0.5,
          animations: ["rotateIn"]
        }
      ]
    });

    console.log("开始渲染位置测试...");
    await videoMaker.render();
    console.log("位置测试完成: output/position-final-test.mp4");
    
  } catch (error) {
    console.error("位置测试失败:", error);
  }
}

testPositionFinal().catch(console.error);
