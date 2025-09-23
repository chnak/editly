import { VideoMaker } from "./index.js";

/**
 * 测试过渡效果修复
 * 验证多个过渡效果能够正确应用
 */
async function testTransitionFix() {
  console.log("开始测试过渡效果修复...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/transition-fix-test.mp4",
      width: 640,
      height: 360,
      fps: 30,
      elements: [
        // 场景1 - 蓝色背景
        {
          type: "shape",
          shape: "rectangle",
          x: 0,
          y: 0,
          width: 640,
          height: 360,
          fillColor: "#3498db",
          duration: 3,
          startTime: 0,
          zIndex: 0
        },
        {
          type: "title",
          text: "场景1",
          x: 320,
          y: 100,
          fontSize: 40,
          textColor: "#ffffff",
          duration: 3,
          startTime: 0,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 场景2 - 红色背景
        {
          type: "shape",
          shape: "rectangle",
          x: 0,
          y: 0,
          width: 640,
          height: 360,
          fillColor: "#e74c3c",
          duration: 3,
          startTime: 3,
          zIndex: 0
        },
        {
          type: "title",
          text: "场景2",
          x: 320,
          y: 100,
          fontSize: 40,
          textColor: "#ffffff",
          duration: 3,
          startTime: 3,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 场景3 - 绿色背景
        {
          type: "shape",
          shape: "rectangle",
          x: 0,
          y: 0,
          width: 640,
          height: 360,
          fillColor: "#2ecc71",
          duration: 3,
          startTime: 6,
          zIndex: 0
        },
        {
          type: "title",
          text: "场景3",
          x: 320,
          y: 100,
          fontSize: 40,
          textColor: "#ffffff",
          duration: 3,
          startTime: 6,
          zIndex: 1,
          animations: ["fadeIn"]
        }
      ],
      transitions: [
        // 第一个过渡效果：directional-left
        {
          name: "directional-left",
          startTime: 2.5,
          duration: 1.0
        },
        // 第二个过渡效果：fade
        {
          name: "fade",
          startTime: 5.5,
          duration: 1.0
        }
      ]
    });

    console.log("开始渲染过渡效果修复测试...");
    await videoMaker.start();
    console.log("过渡效果修复测试完成:", videoMaker.outPath);
    
    // 显示过渡效果配置
    console.log("\n=== 过渡效果配置 ===");
    videoMaker.timeline.transitions.forEach((transition, index) => {
      console.log(`过渡效果 ${index + 1}: ${transition.name}`);
      console.log(`  开始时间: ${transition.startTime}s`);
      console.log(`  结束时间: ${transition.endTime}s`);
      console.log(`  持续时间: ${transition.duration}s`);
    });
    
  } catch (error) {
    console.error("过渡效果修复测试失败:", error);
  }
}

// 运行测试
testTransitionFix().catch(console.error);
