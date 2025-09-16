import { VideoMaker } from "./index.js";

/**
 * 时间线测试
 */
async function timelineTest() {
  console.log("🔍 开始时间线测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/timeline-test.mp4",
      width: 100,
      height: 100,
      fps: 2,
      verbose: true,
      elements: [
        {
          type: "shape",
          shape: "rectangle",
          fillColor: "#ff0000",
          duration: 1,
          x: 0,
          y: 0,
          shapeWidth: 100,
          shapeHeight: 100
        }
      ]
    });
    
    console.log("✓ 视频配置创建成功");
    
    // 解析配置
    const { ConfigParser } = await import("./configParser.js");
    const configParser = new ConfigParser(videoMaker.config);
    const parsedConfig = await configParser.parse();
    
    console.log("解析后的配置:", parsedConfig);
    console.log("元素数量:", parsedConfig.elements.length);
    
    if (parsedConfig.elements.length > 0) {
      const element = parsedConfig.elements[0];
      console.log("第一个元素:", element);
      console.log("元素类型:", element.constructor.name);
      console.log("开始时间:", element.startTime);
      console.log("结束时间:", element.endTime);
      console.log("持续时间:", element.duration);
      
      // 测试时间线
      const { Timeline } = await import("./timeline.js");
      const timeline = new Timeline(parsedConfig, videoMaker.config);
      
      console.log("时间线元素数量:", timeline.elements.length);
      
      // 测试获取活跃元素
      const activeElements = timeline.getActiveElementsAtTime(0);
      console.log("时间0的活跃元素数量:", activeElements.length);
      
      if (activeElements.length > 0) {
        console.log("活跃元素:", activeElements[0]);
        
        // 测试读取帧
        const frameData = await activeElements[0].readNextFrame(0, null);
        console.log("帧数据:", frameData ? "存在" : "不存在");
        if (frameData) {
          console.log("帧数据大小:", frameData.data ? frameData.data.length : "无数据");
        }
      } else {
        console.log("❌ 没有活跃元素");
      }
    } else {
      console.log("❌ 没有解析到元素");
    }
    
  } catch (error) {
    console.error("❌ 时间线测试失败:", error);
    console.error("错误堆栈:", error.stack);
  }
}

// 运行测试
timelineTest();
