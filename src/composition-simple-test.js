import { VideoMaker } from "./index.js";

/**
 * 简单的 Composition 测试
 * 测试包含图片和文本的组合元素
 */
async function compositionSimpleTest() {
  console.log("开始简单 Composition 测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/composition-simple-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 测试1: 基础组合 - 图片 + 文本
        {
          type: "composition",
          duration: 5,
          startTime: 0,
          x: '50%',
          y: '50%',
          width: '100%',
          height: '100%',
          zIndex: 1,
          animations: ["rotateIn"],
          elements: [
            {
              type: "image",
              source: "../assets/img1.jpg",
              duration: 4,
              x: '50%',
              y: '50%',
              width: '100%',
              height: '100%',
              fit: "cover"
            },
            {
              type: "title",
              text: "图片 + 文本组合",
              textColor: "#ffffff",
              fontSize: 24,
              duration: 4,
              x: '50%',
              y: '50%',
              textAlign: "center",
              animations: ["zoomIn","zoomOut"] 
            }
          ]
        },
        {
          type: "composition",
          startTime: 5,
          duration: 5,
          x: '50%',
          y: '50%',
          width: '100%',
          height: '100%',
          zIndex: 1,
          animations: ["slideInLeft"],
          elements: [
            {
              type: "image",
              source: "../assets/img1.jpg",
              duration: 4,
              x: '50%',
              y: '50%',
              width: '100%',
              height: '100%',
              fit: "cover"
            },
            {
              type: "title",
              text: "图片 + 文本组合",
              textColor: "#ffffff",
              fontSize: 24,
              duration: 4,
              x: '50%',
              y: '50%',
              textAlign: "center",
              animations: ["fadeIn","fadeOut"] 
            }
          ]
        },
        
        // 测试2: 使用默认宽高的组合
        // {
        //   type: "composition",
        //   duration: 4,
        //   x: 600,
        //   y: 100,
        //   // 不设置 width 和 height，应该使用 canvasWidth 和 canvasHeight
        //   zIndex: 2,
        //   startTime: 1,
        //   elements: [
        //     {
        //       type: "image",
        //       source: "../assets/img2.jpg",
        //       duration: 4,
        //       x: 0,
        //       y: 0,
        //       width: 1280, // 使用 canvasWidth
        //       height: 200,
        //       fit: "cover"
        //     },
        //     {
        //       type: "title",
        //       text: "默认宽高组合",
        //       textColor: "#ff6b6b",
        //       fontSize: 24,
        //       duration: 4,
        //       x: 640, // 使用 canvasWidth/2
        //       y: 250,
        //       textAlign: "center"
        //     }
        //   ]
        // },
        
        // // 测试3: 带动画的组合
        // {
        //   type: "composition",
        //   duration: 4,
        //   x: 100,
        //   y: 450,
        //   width: 300,
        //   height: 200,
        //   zIndex: 3,
        //   startTime: 2,
        //   animations: [
        //     {
        //       property: "scaleX",
        //       from: 0.5,
        //       to: 1,
        //       duration: 1,
        //       easing: "easeOut"
        //     },
        //     {
        //       property: "scaleY",
        //       from: 0.5,
        //       to: 1,
        //       duration: 1,
        //       easing: "easeOut"
        //     }
        //   ],
        //   elements: [
        //     {
        //       type: "image",
        //       source: "../assets/img3.jpg",
        //       duration: 4,
        //       x: 0,
        //       y: 0,
        //       width: 300,
        //       height: 150,
        //       fit: "cover"
        //     },
        //     {
        //       type: "title",
        //       text: "动画组合",
        //       textColor: "#4ecdc4",
        //       fontSize: 20,
        //       duration: 4,
        //       x: 150,
        //       y: 170,
        //       textAlign: "center"
        //     }
        //   ]
        // },
        
        // // 测试4: 位置变换的组合
        // {
        //   type: "composition",
        //   duration: 4,
        //   x: 500,
        //   y: 450,
        //   width: 300,
        //   height: 200,
        //   zIndex: 4,
        //   startTime: 3,
        //   animations: [
        //     {
        //       property: "x",
        //       from: 500,
        //       to: 800,
        //       duration: 2,
        //       easing: "easeInOut"
        //     },
        //     {
        //       property: "y",
        //       from: 450,
        //       to: 200,
        //       duration: 2,
        //       easing: "easeInOut"
        //     }
        //   ],
        //   elements: [
        //     {
        //       type: "image",
        //       source: "../assets/img1.jpg",
        //       duration: 4,
        //       x: 0,
        //       y: 0,
        //       width: 300,
        //       height: 150,
        //       fit: "cover"
        //     },
        //     {
        //       type: "title",
        //       text: "位置变换组合",
        //       textColor: "#9b59b6",
        //       fontSize: 20,
        //       duration: 4,
        //       x: 150,
        //       y: 170,
        //       textAlign: "center"
        //     }
        //   ]
        // },
        
        // // 主标题
        // {
        //   type: "title",
        //   text: "Composition 简单测试",
        //   textColor: "#ffffff",
        //   fontSize: 36,
        //   duration: 6,
        //   x: 640,
        //   y: 50,
        //   textAlign: "center",
        //   animations: ["fadeIn"]
        // },
        
        // // 说明文字
        // {
        //   type: "title",
        //   text: "基础组合",
        //   textColor: "#ffffff",
        //   fontSize: 16,
        //   duration: 4,
        //   x: 300,
        //   y: 80
        // },
        // {
        //   type: "title",
        //   text: "默认宽高组合",
        //   textColor: "#ff6b6b",
        //   fontSize: 16,
        //   duration: 4,
        //   x: 800,
        //   y: 80,
        //   startTime: 1
        // },
        // {
        //   type: "title",
        //   text: "动画组合",
        //   textColor: "#4ecdc4",
        //   fontSize: 16,
        //   duration: 4,
        //   x: 250,
        //   y: 430,
        //   startTime: 2
        // },
        // {
        //   type: "title",
        //   text: "位置变换组合",
        //   textColor: "#9b59b6",
        //   fontSize: 16,
        //   duration: 4,
        //   x: 650,
        //   y: 430,
        //   startTime: 3
        // }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染简单 Composition 测试...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`简单 Composition 测试完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`简单 Composition 测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("简单 Composition 测试完成！");
    
  } catch (error) {
    console.error("简单 Composition 测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  compositionSimpleTest();
}

export { compositionSimpleTest };
