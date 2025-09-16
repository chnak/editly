import { VideoMaker, createAnimationBuilder, createPresetBuilder, quickPreset } from "./index.js";

/**
 * 动画系统演示
 * 展示类似 Creatomate 的通用动画管理功能
 */
async function animationDemo() {
  console.log("🎬 开始动画系统演示...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/animation-demo.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 8,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1
        },
        
        // 标题 - 使用预设动画
        {
          type: "title",
          text: "通用动画管理系统",
          textColor: "#ffffff",
          fontSize: 64,
          fontWeight: "bold",
          textAlign: "center",
          duration: 8,
          x: 640,
          y: 150,
          animations: ["fadeIn"]
        },
        
        // 副标题 - 使用动画构建器
        {
          type: "title",
          text: "类似 Creatomate 的强大功能",
          textColor: "#ff6b6b",
          fontSize: 36,
          textAlign: "center",
          duration: 8,
          x: 640,
          y: 250,
          startTime: 0.5,
          animations: [
            {
              property: 'y',
              from: 300,
              to: 250,
              duration: 1,
              easing: 'easeOut'
            },
            {
              property: 'opacity',
              from: 0,
              to: 1,
              duration: 1,
              easing: 'easeOut'
            }
          ]
        },
        
        // 功能列表 - 使用预设构建器
        {
          type: "title",
          text: "✨ 20+ 预设动画",
          textColor: "#4ecdc4",
          fontSize: 28,
          duration: 8,
          x: 200,
          y: 350,
          startTime: 1,
          animations: ["slideInLeft"]
        },
        
        {
          type: "title",
          text: "🔧 链式API构建器",
          textColor: "#ffe66d",
          fontSize: 28,
          duration: 8,
          x: 200,
          y: 400,
          startTime: 1.5,
          animations: ["slideInLeft"]
        },
        
        {
          type: "title",
          text: "🎯 关键帧动画",
          textColor: "#ff9ff3",
          fontSize: 28,
          duration: 8,
          x: 200,
          y: 450,
          startTime: 2,
          animations: ["slideInLeft"]
        },
        
        {
          type: "title",
          text: "⚡ 15+ 缓动函数",
          textColor: "#54a0ff",
          fontSize: 28,
          duration: 8,
          x: 200,
          y: 500,
          startTime: 2.5,
          animations: ["slideInLeft"]
        },
        
        // 装饰元素 - 使用快速预设
        {
          type: "shape",
          shape: "circle",
          fillColor: "#4ecdc4",
          width: 80,
          height: 80,
          duration: 8,
          x: 1000,
          y: 350,
          startTime: 3,
          animations: [quickPreset('bounceIn', { duration: 1.5 })]
        },
        
        {
          type: "shape",
          shape: "rect",
          fillColor: "#ff6b6b",
          width: 80,
          height: 80,
          duration: 8,
          x: 1000,
          y: 450,
          startTime: 3.5,
          animations: [quickPreset('elasticIn', { duration: 1.5 })]
        },
        
        // 底部文本 - 复杂动画组合
        {
          type: "title",
          text: "开始创建精彩的视频动画吧！",
          textColor: "#ffffff",
          fontSize: 32,
          fontWeight: "bold",
          textAlign: "center",
          duration: 8,
          x: 640,
          y: 600,
          startTime: 4,
          animations: [
            {
              property: 'opacity',
              from: 0,
              to: 1,
              duration: 0.5,
              easing: 'easeOut'
            },
            {
              property: 'scaleX',
              from: 0.8,
              to: 1,
              duration: 0.5,
              easing: 'bounce'
            },
            {
              property: 'scaleY',
              from: 0.8,
              to: 1,
              duration: 0.5,
              easing: 'bounce'
            }
          ]
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("🚀 开始渲染动画演示视频...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`📊 渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`✅ 动画演示视频渲染完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("❌ 渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`🎉 动画演示视频已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("✨ 动画系统演示完成！");
    
  } catch (error) {
    console.error("❌ 动画系统演示失败:", error);
  }
}

// 运行演示
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  animationDemo();
}

export { animationDemo };
