import Editly from "./core/index.js";

const data = {
  outPath: "rotation_animation_test.mp4",
  width: 1280,
  height: 720,
  fps: 24,
  fast: true, // 启用快速模式
  verbose: true,
  tracks: {
    "1": {
      type: "track",
      elements: [
        // 测试1: 旋转进入动画
        {
          type: "scene",
          startTime: 0,
          duration: 3,
          elements: [
            {
              duration: 3,
              type: "image",
              path: "./assets/img1.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 2,
              type: "title",
              text: "旋转进入测试",
              textColor: "#ffffff",
              position: "center",
              animate: [
                { time: 'in', effect: 'rotateIn' }
              ]
            }
          ]
        },

        // 测试2: 旋转退出动画
        {
          type: "scene",
          startTime: 3,
          duration: 3,
          elements: [
            {
              duration: 3,
              type: "image",
              path: "./assets/img2.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 2,
              type: "title",
              text: "旋转退出测试",
              textColor: "#ff0000",
              position: "center",
              animate: [
                { time: 'in', effect: 'fadeIn' },
                { time: 'out', effect: 'rotateOut' }
              ]
            }
          ]
        },

        // 测试3: 组合旋转动画
        {
          type: "scene",
          startTime: 6,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img3.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "组合旋转动画",
              textColor: "#00ff00",
              position: "center",
              animate: [
                { time: 'in', effect: 'rotateIn' },
                { time: 0.3, from: { angle: 0 }, to: { angle: 360 }, ease: 'easeInOutQuad', duration: 0.5 },
                { time: 0.8, from: { angle: 360 }, to: { angle: 0 }, ease: 'easeInOutQuad', duration: 0.5 },
                { time: 'out', effect: 'rotateOut' }
              ]
            }
          ]
        },

        // 测试4: 自定义旋转角度
        {
          type: "scene",
          startTime: 10,
          duration: 3,
          elements: [
            {
              duration: 3,
              type: "image",
              path: "./assets/img1.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 2,
              type: "title",
              text: "自定义旋转",
              textColor: "#ffff00",
              position: "center",
              animate: [
                { time: 'in', effect: 'fadeIn' },
                { time: 0.2, from: { angle: 0 }, to: { angle: 720 }, ease: 'easeOutCubic', duration: 1.0 },
                { time: 'out', effect: 'fadeOut' }
              ]
            }
          ]
        }
      ]
    }
  }
};

async function main() {
  console.log("🔄 开始旋转动画测试...");
  console.log("📊 测试内容:");
  console.log("  1. rotateIn - 旋转进入动画");
  console.log("  2. rotateOut - 旋转退出动画");
  console.log("  3. 组合旋转动画 - 多段旋转");
  console.log("  4. 自定义旋转角度 - 720度旋转");
  
  const editly = new Editly(data);
  editly.start();
  
  editly.on("start", () => {
    console.log("✅ 开始生成视频");
  });
  
  editly.on("progress", (value) => {
    console.log(`📈 进度: ${(value * 100).toFixed(1)}%`);
  });
  
  editly.on("complete", (value) => {
    console.log(`🎉 完成: ${value}`);
    console.log("🔍 检查生成的视频文件 rotation_animation_test.mp4");
    console.log("💡 如果旋转动画仍然没有效果，可能需要进一步调试");
  });
  
  editly.on("error", (error) => {
    console.error(`❌ 错误: ${error}`);
  });
}

main();
