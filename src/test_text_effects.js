import { VideoMaker } from "./index.js";

/**
 * 测试Fabric.js文字特效
 * 展示各种文字特效效果
 */
async function testTextEffects() {
  console.log("开始测试Fabric.js文字特效...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/text-effects-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      verbose: true,
      elements: [
        // 背景图片
        {
          type: "image",
          source: "../assets/img1.jpg",
          x: 0,
          y: 0,
          width: 1280,
          height: 720,
          duration: 15,
          startTime: 0,
          zIndex: 0
        },
        
        // 测试1: 线性渐变效果
        {
          type: "title",
          text: "线性渐变效果",
          x: 640,
          y: 100,
          fontSize: 50,
          duration: 2,
          startTime: 0,
          zIndex: 1,
          gradient: true,
          gradientType: 'linear',
          gradientColors: ['#ff0000', '#00ff00', '#0000ff'],
          gradientDirection: 'horizontal',
          animations: ["fadeIn"]
        },
        
        // 测试2: 径向渐变效果
        {
          type: "title",
          text: "径向渐变效果",
          x: 640,
          y: 180,
          fontSize: 50,
          duration: 2,
          startTime: 1,
          zIndex: 1,
          gradient: true,
          gradientType: 'radial',
          gradientColors: ['#ffff00', '#ff00ff'],
          animations: ["fadeIn"]
        },
        
        // 测试3: 文字装饰效果
        {
          type: "title",
          text: "文字装饰效果",
          x: 640,
          y: 260,
          fontSize: 50,
          textColor: "#ffffff",
          duration: 2,
          startTime: 2,
          zIndex: 1,
          underline: true,
          linethrough: true,
          overline: true,
          animations: ["fadeIn"]
        },
        
        // 测试4: 发光效果
        {
          type: "title",
          text: "发光效果",
          x: 640,
          y: 340,
          fontSize: 50,
          textColor: "#ffffff",
          duration: 2,
          startTime: 3,
          zIndex: 1,
          glow: true,
          glowColor: "#00ffff",
          glowBlur: 15,
          animations: ["fadeIn"]
        },
        
        // 测试5: 文字变形效果
        {
          type: "title",
          text: "文字变形效果",
          x: 640,
          y: 420,
          fontSize: 50,
          textColor: "#ffffff",
          duration: 2,
          startTime: 4,
          zIndex: 1,
          skewX: 0.3,
          skewY: 0.1,
          animations: ["fadeIn"]
        },
        
        // 测试6: 组合效果 - 渐变 + 阴影 + 边框
        {
          type: "title",
          text: "组合效果",
          x: 640,
          y: 500,
          fontSize: 50,
          duration: 2,
          startTime: 5,
          zIndex: 1,
          gradient: true,
          gradientType: 'linear',
          gradientColors: ['#ff0000', '#ffff00', '#00ff00'],
          gradientDirection: 'diagonal',
          shadow: true,
          shadowColor: "#000000",
          shadowBlur: 10,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          stroke: true,
          strokeColor: "#ffffff",
          strokeWidth: 3,
          animations: ["fadeIn"]
        },
        
        // 测试7: 分割文本 + 渐变效果
        {
          type: "title",
          text: "分割渐变效果",
          x: 640,
          y: 580,
          fontSize: 45,
          duration: 2,
          startTime: 6,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.08,
          splitDuration: 0.2,
          gradient: true,
          gradientType: 'linear',
          gradientColors: ['#ff00ff', '#00ffff'],
          gradientDirection: 'vertical',
          animations: ["zoomIn"]
        },
        
        // 测试8: 强烈发光效果
        {
          type: "title",
          text: "强烈发光效果",
          x: 640,
          y: 100,
          fontSize: 50,
          textColor: "#ffffff",
          duration: 2,
          startTime: 7,
          zIndex: 1,
          glow: true,
          glowColor: "#ff0000",
          glowBlur: 25,
          shadow: true,
          shadowColor: "#000000",
          shadowBlur: 15,
          shadowOffsetX: 8,
          shadowOffsetY: 8,
          animations: ["fadeIn"]
        },
        
        // 测试9: 多重装饰效果
        {
          type: "title",
          text: "多重装饰效果",
          x: 640,
          y: 180,
          fontSize: 50,
          textColor: "#ffff00",
          duration: 2,
          startTime: 8,
          zIndex: 1,
          underline: true,
          stroke: true,
          strokeColor: "#ff0000",
          strokeWidth: 4,
          glow: true,
          glowColor: "#ffffff",
          glowBlur: 12,
          animations: ["fadeIn"]
        },
        
        // 测试10: 复杂组合效果
        {
          type: "title",
          text: "复杂组合效果",
          x: 640,
          y: 260,
          fontSize: 45,
          duration: 2,
          startTime: 9,
          zIndex: 1,
          split: "word",
          splitDelay: 0.1,
          splitDuration: 0.3,
          gradient: true,
          gradientType: 'radial',
          gradientColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'],
          shadow: true,
          shadowColor: "#000000",
          shadowBlur: 15,
          shadowOffsetX: 6,
          shadowOffsetY: 6,
          stroke: true,
          strokeColor: "#ffffff",
          strokeWidth: 3,
          glow: true,
          glowColor: "#ff00ff",
          glowBlur: 8,
          skewX: 0.2,
          skewY: 0.1,
          animations: ["zoomIn", "fadeIn"]
        }
      ]
    });

    console.log("开始渲染文字特效测试...");
    await videoMaker.start();
    console.log("文字特效测试完成");
    
  } catch (error) {
    console.error("文字特效测试失败:", error);
  }
}

// 运行测试
testTextEffects().catch(console.error);
