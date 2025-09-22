import { VideoMaker } from "./index.js";

/**
 * Composition 和过渡效果结合测试
 * 测试 Composition 元素与过渡效果的配合
 */
async function testCompositionTransitions() {
  console.log("开始 Composition 和过渡效果结合测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/test-composition-transitions.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 第一个 Composition - 图片组合
        {
          type: "composition",
          duration: 4,
          startTime: 0,
          x: '50%',
          y: '50%',
          width: '100%',
          height: '100%',
          zIndex: 1,
          animations: ["fadeIn"],
          elements: [
            {
              type: "title",
              text: "Composition 1",
              textColor: "#ffffff",
              fontSize: 36,
              duration: 4,
              startTime: 0.5,
              x: '50%',
              y: '30%',
              textAlign: "center",
              backgroundColor: "#ff6b6b",
              width: '80%',
              height: '20%',
              animations: ["zoomIn"]
            },
            {
              type: "title",
              text: "包含多个子元素",
              textColor: "#ffffff",
              fontSize: 24,
              duration: 4,
              startTime: 1,
              x: '50%',
              y: '70%',
              textAlign: "center",
              backgroundColor: "#4ecdc4",
              width: '60%',
              height: '15%',
              animations: ["slideInLeft"]
            }
          ]
        },
        
        // 第二个 Composition - 不同组合
        {
          type: "composition",
          duration: 4,
          startTime: 4,
          x: '50%',
          y: '50%',
          width: '100%',
          height: '100%',
          zIndex: 1,
          animations: ["rotateIn"],
          elements: [
            {
              type: "title",
              text: "Composition 2",
              textColor: "#ffffff",
              fontSize: 36,
              duration: 4,
              startTime: 0.5,
              x: '50%',
              y: '30%',
              textAlign: "center",
              backgroundColor: "#45b7d1",
              width: '80%',
              height: '20%',
              animations: ["bounceIn"]
            },
            {
              type: "title",
              text: "带动画效果",
              textColor: "#ffffff",
              fontSize: 24,
              duration: 4,
              startTime: 1,
              x: '50%',
              y: '70%',
              textAlign: "center",
              backgroundColor: "#9b59b6",
              width: '60%',
              height: '15%',
              animations: ["slideInRight"]
            }
          ]
        },
        
        // 第三个 Composition - 复杂组合
        {
          type: "composition",
          duration: 4,
          startTime: 8,
          x: '50%',
          y: '50%',
          width: '100%',
          height: '100%',
          zIndex: 1,
          animations: ["zoomIn"],
          elements: [
            {
              type: "title",
              text: "Composition 3",
              textColor: "#ffffff",
              fontSize: 36,
              duration: 4,
              startTime: 0.5,
              x: '50%',
              y: '30%',
              textAlign: "center",
              backgroundColor: "#e74c3c",
              width: '80%',
              height: '20%',
              animations: ["fadeIn", "fadeOut"]
            },
            {
              type: "title",
              text: "复杂动画组合",
              textColor: "#ffffff",
              fontSize: 24,
              duration: 4,
              startTime: 1,
              x: '50%',
              y: '70%',
              textAlign: "center",
              backgroundColor: "#f39c12",
              width: '60%',
              height: '15%',
              animations: [
                {
                  property: "rotation",
                  keyframes: [
                    { time: 0, value: -10 },
                    { time: 0.5, value: 10 },
                    { time: 1, value: 0 }
                  ],
                  duration: 2,
                  easing: "easeInOut"
                }
              ]
            }
          ]
        }
      ],
      // 过渡效果配置
      transitions: [
        {
          type: "fade",
          startTime: 3.5, // Composition 1 到 Composition 2
          duration: 1.0
        },
        {
          type: "slideLeft",
          startTime: 7.5, // Composition 2 到 Composition 3
          duration: 1.0
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染 Composition 和过渡效果结合测试...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`Composition 和过渡效果结合测试完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`Composition 和过渡效果结合测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("Composition 和过渡效果结合测试完成！");
    
  } catch (error) {
    console.error("Composition 和过渡效果结合测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testCompositionTransitions();
}

export { testCompositionTransitions };
