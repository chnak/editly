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
          duration: 15,
          startTime: 0,
          x: '50%',
          y: '50%',
          width: '100%',
          height: '100%',
          zIndex: 1,
          elements: [
            {
              type:"composition",
              duration: 5,
              startTime: 0,
              x: '50%',
              y: '50%',
              width: '100%',
              height: '100%',
              zIndex: 1,
              elements:[
                
                {
                  type: "shape",
                  shape: "rect",
                  width: '100%',
                  height: '100%',
                  x: '50%',
                  y: '50%',
                  fillColor: "#3498db",
                  duration: 5,
                  startTime: 0
                },
                {
                  type: "title",
                  text: "场景一",
                  textColor: "#ffffff",
                  fontSize: 50,
                  duration: 5,
                  x: '50%',
                  y: '50%',
                  textAlign: "center",
                  animations: ["zoomIn","zoomOut"] 
                }
              ]
            },
            {
              type:"composition",
              duration: 5,
              startTime: 5,
              x: '50%',
              y: '50%',
              width: '100%',
              height: '100%',
              zIndex: 1,
              elements:[
                
                {
                  type: "shape",
                  shape: "rect",
                  width: '100%',
                  height: '100%',
                  x: '50%',
                  y: '50%',
                  fillColor: "#ff6b6b",
                  duration: 5,
                  startTime: 0
                },
                {
                  type: "title",
                  text: "场景二",
                  textColor: "#ffffff",
                  fontSize: 50,
                  duration: 5,
                  x: '50%',
                  y: '50%',
                  textAlign: "center",
                  animations: ["zoomIn","zoomOut"] 
                }
              ]
            },
            {
              type:"composition",
              duration: 5,
              startTime: 10,
              x: '50%',
              y: '50%',
              width: '100%',
              height: '100%',
              zIndex: 1,
              elements:[
                
                {
                  type: "shape",
                  shape: "rect",
                  width: '100%',
                  height: '100%',
                  x: '50%',
                  y: '50%',
                  fillColor: "#9b59b6",
                  duration: 5,
                  startTime: 0
                },
                {
                  type: "title",
                  text: "场景三",
                  textColor: "#ffffff",
                  fontSize: 50,
                  duration: 5,
                  x: '50%',
                  y: '50%',
                  textAlign: "center",
                  animations: ["zoomIn","zoomOut"] 
                }
              ]
            }
            
          ]
        },
        {
          type: "composition",
          duration: 15,
          startTime: 0,
          x: '50%',
          y: '50%',
          width: '100%',
          height: '100%',
          zIndex: 2,
          elements: [
            {
              type: "title",
              text: "轨道二",
              textColor: "#ffffff",
              fontSize: 24,
              duration: 15,
              x: '50%',
              y: '20%',
              textAlign: "center",
              animations: ["zoomIn","zoomOut"] 
            }
          ]
        },
        {
          type: "composition",
          startTime: 0,
          duration: 15,
          x: '50%',
          y: '50%',
          width: '100%',
          height: '100%',
          zIndex: 1,
          animations: ["slideInLeft"],
          elements: [
            {
              type: "title",
              text: "图片 + 文本组合 轨道三",
              textColor: "#ffffff",
              fontSize: 24,
              duration: 15,
              x: '50%',
              y: '70%',
              textAlign: "center",
              animations: ["fadeIn","fadeOut"] 
            }
          ]
        },
        
      ],
      transitions: [
        {
          name: "directional-left",
          startTime: 4.5, // 在场景 1 结束前 0.5 秒开始
          duration: 1.0   // 过渡持续 1 秒
        },
        {
          name: "fade",
          startTime: 9.5, // 在场景 1 结束前 0.5 秒开始
          duration: 1.0   // 过渡持续 1 秒
        }
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
