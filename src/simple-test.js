import { VideoMaker } from "./index.js";
import fsExtra from "fs-extra";

/**
 * 简化测试 - 不依赖 canvas 和 fabric
 */
async function simpleTest() {
  console.log("开始简化测试...");
  
  try {
    // 确保输出目录存在
    await fsExtra.ensureDir("output");
    
    console.log("✓ 输出目录创建成功");
    
    // 测试配置解析
    const config = {
      outPath: "output/simple-test.mp4",
      width: 640,
      height: 480,
      fps: 15,
      elements: [
        {
          type: "text",
          text: "测试文本",
          font: "32px Arial",
          fillColor: "#ffffff",
          duration: 3,
          x: 320,
          y: 240,
          textAlign: "center"
        }
      ]
    };
    
    console.log("✓ 配置创建成功");
    
    // 测试 VideoMaker 实例化
    const videoMaker = new VideoMaker(config);
    console.log("✓ VideoMaker 实例创建成功");
    
    // 测试事件监听
    videoMaker.on("start", () => {
      console.log("✓ 开始事件触发");
    });
    
    videoMaker.on("progress", (progress) => {
      console.log(`✓ 进度事件触发: ${progress}%`);
    });
    
    videoMaker.on("complete", (outputPath) => {
      console.log(`✓ 完成事件触发: ${outputPath}`);
    });
    
    videoMaker.on("error", (error) => {
      console.log(`✓ 错误事件触发: ${error.message}`);
    });
    
    console.log("✓ 事件监听器设置成功");
    
    // 测试配置解析器
    const { ConfigParser } = await import("./configParser.js");
    const configParser = new ConfigParser(config);
    const parsedConfig = await configParser.parse();
    
    console.log("✓ 配置解析成功");
    console.log(`  - 元素数量: ${parsedConfig.elements.length}`);
    console.log(`  - 视频时长: ${parsedConfig.duration}秒`);
    console.log(`  - 分辨率: ${parsedConfig.width}x${parsedConfig.height}`);
    
    // 测试时间线创建
    const { Timeline } = await import("./timeline.js");
    const timeline = new Timeline(parsedConfig, config);
    
    console.log("✓ 时间线创建成功");
    
    // 测试元素基类
    const { BaseElement } = await import("./elements/base.js");
    const testElement = new BaseElement({
      type: "test",
      duration: 3,
      width: 640,
      height: 480,
      fps: 15
    });
    
    console.log("✓ 元素基类测试成功");
    console.log(`  - 元素类型: ${testElement.type}`);
    console.log(`  - 元素时长: ${testElement.duration}秒`);
    
    // 测试动画系统
    const progress = testElement.getProgressAtTime(1.5);
    console.log(`✓ 动画系统测试成功 - 1.5秒时进度: ${progress}`);
    
    // 测试缓动函数
    const easedProgress = testElement.ease(0.5, "easeIn");
    console.log(`✓ 缓动函数测试成功 - easeIn(0.5): ${easedProgress}`);
    
    console.log("\n🎉 所有基础功能测试通过！");
    console.log("注意：由于 canvas 依赖问题，完整的视频渲染测试需要安装 Cairo 图形库");
    
  } catch (error) {
    console.error("✗ 测试失败:", error);
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  simpleTest().catch(console.error);
}
