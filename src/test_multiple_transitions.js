import { VideoMaker } from "./index.js";

/**
 * 测试多个过渡效果
 * 验证多个过渡效果能够正确应用
 */
async function testMultipleTransitions() {
  console.log("开始测试多个过渡效果...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/multiple-transitions-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 场景1 - 蓝色背景
        {
          type: "shape",
          shape: "rectangle",
          x: 0,
          y: 0,
          width: 1280,
          height: 720,
          fillColor: "#3498db",
          duration: 5,
          startTime: 0,
          zIndex: 0
        },
        {
          type: "title",
          text: "场景1 - 蓝色",
          x: 640,
          y: 200,
          fontSize: 60,
          textColor: "#ffffff",
          duration: 5,
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
          width: 1280,
          height: 720,
          fillColor: "#e74c3c",
          duration: 5,
          startTime: 5,
          zIndex: 0
        },
        {
          type: "title",
          text: "场景2 - 红色",
          x: 640,
          y: 200,
          fontSize: 60,
          textColor: "#ffffff",
          duration: 5,
          startTime: 5,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 场景3 - 绿色背景
        {
          type: "shape",
          shape: "rectangle",
          x: 0,
          y: 0,
          width: 1280,
          height: 720,
          fillColor: "#2ecc71",
          duration: 5,
          startTime: 10,
          zIndex: 0
        },
        {
          type: "title",
          text: "场景3 - 绿色",
          x: 640,
          y: 200,
          fontSize: 60,
          textColor: "#ffffff",
          duration: 5,
          startTime: 10,
          zIndex: 1,
          animations: ["fadeIn"]
        }
      ],
      transitions: [
        // 第一个过渡效果：从场景1到场景2
        {
          name: "directional-left",
          startTime: 4.5, // 在场景1结束前0.5秒开始
          duration: 1.0   // 过渡持续1秒
        },
        // 第二个过渡效果：从场景2到场景3
        {
          name: "fade",
          startTime: 9.5, // 在场景2结束前0.5秒开始
          duration: 1.0   // 过渡持续1秒
        }
      ]
    });

    console.log("开始渲染多个过渡效果测试...");
    await videoMaker.start();
    console.log("多个过渡效果测试完成:", videoMaker.outPath);
    
    // 显示过渡效果配置
    console.log("\n=== 过渡效果配置 ===");
    videoMaker.timeline.transitions.forEach((transition, index) => {
      console.log(`过渡效果 ${index + 1}: ${transition.name}`);
      console.log(`  开始时间: ${transition.startTime}s`);
      console.log(`  结束时间: ${transition.endTime}s`);
      console.log(`  持续时间: ${transition.duration}s`);
      console.log(`  缓动函数: ${transition.easing}`);
    });
    
  } catch (error) {
    console.error("多个过渡效果测试失败:", error);
  }
}

// 运行测试
testMultipleTransitions().catch(console.error);
