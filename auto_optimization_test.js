import Editly from "./core/index.js";

// 测试不同复杂度的视频配置
const testConfigs = [
  {
    name: "简单视频 - 纯色背景",
    outPath: "auto_simple.mp4",
    width: 1920,
    height: 1080,
    fps: 30,
    autoOptimize: true,
    tracks: {
      "1": {
        type: "track",
        elements: [
          {
            duration: 8,
            type: "fill-color",
            color: "#1a1a2e"
          },
          {
            startTime: 1,
            duration: 6,
            type: "title",
            text: "简单视频",
            position: "center",
            fontSize: 64,
            textColor: "#ffffff"
          }
        ]
      }
    }
  },
  {
    name: "中等复杂度 - 渐变背景",
    outPath: "auto_medium.mp4",
    width: 1920,
    height: 1080,
    fps: 30,
    autoOptimize: true,
    tracks: {
      "1": {
        type: "track",
        elements: [
          {
            duration: 12,
            type: "linear-gradient",
            colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"],
            angle: 45
          },
          {
            startTime: 1,
            duration: 10,
            type: "title",
            text: "中等复杂度",
            position: { y: 0.3 },
            fontSize: 72,
            textColor: "#ffffff",
            animate: [
              { time: "in", effect: "fadeIn", duration: 0.5 },
              { time: "out", effect: "fadeOut", duration: 0.5 }
            ]
          },
          {
            startTime: 3,
            duration: 6,
            type: "fill-color",
            color: "#ffd93d",
            width: 100,
            height: 100,
            left: 0.1,
            top: 0.5,
            originX: "center",
            originY: "center",
            animate: [
              { time: 0, left: 0.1, top: 0.5 },
              { time: 1, left: 0.9, top: 0.2 },
              { time: 2, left: 0.5, top: 0.8 },
              { time: 3, left: 0.9, top: 0.5 }
            ]
          }
        ]
      }
    }
  },
  {
    name: "高复杂度 - 多元素动画",
    outPath: "auto_complex.mp4",
    width: 1920,
    height: 1080,
    fps: 30,
    autoOptimize: true,
    tracks: {
      "1": {
        type: "track",
        elements: [
          {
            duration: 15,
            type: "linear-gradient",
            colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#f39c12"],
            angle: 45
          },
          {
            startTime: 1,
            duration: 13,
            type: "title",
            text: "高复杂度视频",
            position: { y: 0.2 },
            fontSize: 72,
            textColor: "#ffffff",
            animate: [
              { time: "in", effect: "fadeIn", duration: 0.8 },
              { time: "out", effect: "fadeOut", duration: 0.8 }
            ]
          },
          {
            startTime: 2,
            duration: 10,
            type: "fill-color",
            color: "#ffd93d",
            width: 120,
            height: 120,
            left: 0.1,
            top: 0.3,
            originX: "center",
            originY: "center",
            animate: [
              { time: 0, left: 0.1, top: 0.3, rotate: 0 },
              { time: 1, left: 0.9, top: 0.2, rotate: 90 },
              { time: 2, left: 0.5, top: 0.8, rotate: 180 },
              { time: 3, left: 0.9, top: 0.5, rotate: 270 },
              { time: 4, left: 0.1, top: 0.3, rotate: 360 }
            ]
          },
          {
            startTime: 4,
            duration: 8,
            type: "title",
            text: "多元素动画",
            position: { y: 0.7 },
            fontSize: 48,
            textColor: "#2c3e50",
            animate: [
              { time: "in", effect: "slideInLeft", duration: 1.0 },
              { time: "out", effect: "slideOutRight", duration: 1.0 }
            ]
          },
          {
            startTime: 6,
            duration: 6,
            type: "radial-gradient",
            colors: ["#e74c3c", "#f39c12"],
            centerX: 0.5,
            centerY: 0.5,
            radius: 0.3
          }
        ]
      },
      "2": {
        type: "track",
        elements: [
          {
            startTime: 8,
            duration: 4,
            type: "fill-color",
            color: "#9b59b6",
            width: 80,
            height: 80,
            left: 0.5,
            top: 0.5,
            originX: "center",
            originY: "center",
            animate: [
              { time: 0, scaleX: 0.5, scaleY: 0.5 },
              { time: 1, scaleX: 1.5, scaleY: 1.5 },
              { time: 2, scaleX: 0.8, scaleY: 0.8 }
            ]
          }
        ]
      }
    }
  }
];

async function testAutoOptimization() {
  console.log("🤖 自动优化测试");
  console.log("=" .repeat(60));
  
  const results = [];
  
  for (const config of testConfigs) {
    console.log(`\n🧪 测试: ${config.name}`);
    console.log("-".repeat(40));
    
    const startTime = Date.now();
    const editly = new Editly(config);
    
    // 监听优化完成事件
    editly.on("optimization-complete", (optimizedConfig) => {
      console.log(`\n📊 优化详情:`);
      console.log(`   进程数: ${optimizedConfig.maxWorkers}`);
      console.log(`   分块大小: ${optimizedConfig.chunkDuration}秒`);
      console.log(`   内存需求: ${optimizedConfig.totalMemoryNeeded.toFixed(2)} MB`);
      console.log(`   复杂度: ${optimizedConfig.complexity.toFixed(2)}`);
      console.log(`   置信度: ${optimizedConfig.confidence.toFixed(1)}%`);
    });
    
    editly.on("start", () => {
      console.log("🚀 开始渲染...");
    });
    
    editly.on("progress", (percent) => {
      process.stdout.write(`\r📈 进度: ${percent}%`);
    });
    
    editly.on("complete", (outPath) => {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      console.log(`\n✅ 完成: ${outPath}`);
      console.log(`⏱️  耗时: ${duration.toFixed(2)}秒`);
      
      results.push({
        name: config.name,
        duration: duration,
        success: true
      });
    });
    
    editly.on("error", (error) => {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      console.log(`\n❌ 错误: ${error.message}`);
      
      results.push({
        name: config.name,
        duration: duration,
        success: false,
        error: error.message
      });
    });
    
    try {
      await editly.start();
    } catch (error) {
      console.log(`❌ 渲染失败: ${error.message}`);
    }
    
    // 测试间隔
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 分析结果
  console.log("\n📊 测试结果分析");
  console.log("=" .repeat(60));
  
  const successfulResults = results.filter(r => r.success);
  const failedResults = results.filter(r => !r.success);
  
  console.log(`总测试数: ${results.length}`);
  console.log(`成功数: ${successfulResults.length}`);
  console.log(`失败数: ${failedResults.length}`);
  console.log(`成功率: ${(successfulResults.length / results.length * 100).toFixed(1)}%`);
  
  if (successfulResults.length > 0) {
    const avgDuration = successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length;
    console.log(`平均耗时: ${avgDuration.toFixed(2)}秒`);
    
    const fastest = successfulResults.reduce((fastest, current) => 
      current.duration < fastest.duration ? current : fastest
    );
    const slowest = successfulResults.reduce((slowest, current) => 
      current.duration > slowest.duration ? current : slowest
    );
    
    console.log(`最快: ${fastest.name} (${fastest.duration.toFixed(2)}秒)`);
    console.log(`最慢: ${slowest.name} (${slowest.duration.toFixed(2)}秒)`);
  }
  
  if (failedResults.length > 0) {
    console.log("\n❌ 失败详情:");
    failedResults.forEach(result => {
      console.log(`   ${result.name}: ${result.error}`);
    });
  }
  
  console.log("\n🎉 自动优化测试完成！");
}

// 测试自动优化器独立功能
async function testOptimizerStandalone() {
  console.log("\n🔧 自动优化器独立测试");
  console.log("=" .repeat(50));
  
  const AutoOptimizer = (await import('./core/autoOptimizer.js')).default;
  const optimizer = new AutoOptimizer();
  
  // 测试不同视频配置
  const testCases = [
    {
      name: "短视频",
      videoConfig: { width: 1920, height: 1080, fps: 30, duration: 5 },
      tracks: {
        "1": {
          elements: [
            { type: "fill-color", duration: 5 },
            { type: "title", duration: 3 }
          ]
        }
      }
    },
    {
      name: "长视频",
      videoConfig: { width: 1920, height: 1080, fps: 30, duration: 60 },
      tracks: {
        "1": {
          elements: [
            { type: "linear-gradient", duration: 60 },
            { type: "title", duration: 50 },
            { type: "fill-color", duration: 40 }
          ]
        }
      }
    },
    {
      name: "高分辨率",
      videoConfig: { width: 2560, height: 1440, fps: 30, duration: 20 },
      tracks: {
        "1": {
          elements: [
            { type: "linear-gradient", duration: 20 },
            { type: "title", duration: 15 }
          ]
        }
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}:`);
    const config = optimizer.calculateOptimalConfig(testCase.videoConfig, testCase.tracks);
    console.log(`   推荐进程数: ${config.maxWorkers}`);
    console.log(`   推荐分块大小: ${config.chunkDuration}秒`);
    console.log(`   内存需求: ${config.totalMemoryNeeded.toFixed(2)} MB`);
    console.log(`   置信度: ${config.confidence.toFixed(1)}%`);
  }
}

async function main() {
  try {
    await testOptimizerStandalone();
    await testAutoOptimization();
  } catch (error) {
    console.error("测试失败:", error);
  }
}

main();
