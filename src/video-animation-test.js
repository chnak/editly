import { VideoMaker } from "./index.js";

/**
 * 视频动画测试
 * 专门测试视频元素的动画效果
 */
async function testVideoAnimation() {
  console.log("开始测试视频动画...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/video-animation-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "../assets/img1.jpg",
          duration: 8,
          x: '50%',
          y: '50%',
          width: "100%",
          height: "100%"
        },
        
        // 测试1: 位置动画
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 4,
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          fit: "cover",
          animations: [
            {
              property: 'x',
              from: 100,
              to: 1000,
              duration: 4,
              easing: 'easeInOut'
            },
            {
              property: 'y',
              from: 100,
              to: 500,
              duration: 4,
              easing: 'easeInOut'
            }
          ]
        },
        
        // 测试2: 缩放动画
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 4,
          x: 640,
          y: 360,
          width: 200,
          height: 150,
          fit: "cover",
          startTime: 4,
          animations: [
            {
              property: 'scaleX',
              from: 0.5,
              to: 2,
              duration: 4,
              easing: 'easeInOut'
            },
            {
              property: 'scaleY',
              from: 0.5,
              to: 2,
              duration: 4,
              easing: 'easeInOut'
            }
          ]
        },
        
        // 测试3: 旋转动画
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 4,
          x: 640,
          y: 200,
          width: 150,
          height: 100,
          fit: "cover",
          startTime: 0,
          animations: [
            {
              property: 'rotation',
              from: 0,
              to: 360,
              duration: 4,
              easing: 'linear'
            }
          ]
        },
        
        // 测试4: 透明度动画
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 4,
          x: 640,
          y: 500,
          width: 200,
          height: 150,
          fit: "cover",
          startTime: 0,
          animations: [
            {
              property: 'opacity',
              from: 0,
              to: 1,
              duration: 2,
              easing: 'easeIn'
            },
            {
              property: 'opacity',
              from: 1,
              to: 0,
              duration: 2,
              startTime: 2,
              easing: 'easeOut'
            }
          ]
        },
        
        // 测试5: 组合动画
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 6,
          x: 200,
          y: 200,
          width: 100,
          height: 100,
          fit: "cover",
          startTime: 2,
          animations: [
            {
              property: 'x',
              from: 200,
              to: 800,
              duration: 3,
              easing: 'easeInOut'
            },
            {
              property: 'y',
              from: 200,
              to: 400,
              duration: 3,
              easing: 'easeInOut'
            },
            {
              property: 'scaleX',
              from: 1,
              to: 1.5,
              duration: 3,
              easing: 'easeInOut'
            },
            {
              property: 'scaleY',
              from: 1,
              to: 1.5,
              duration: 3,
              easing: 'easeInOut'
            },
            {
              property: 'rotation',
              from: 0,
              to: 180,
              duration: 3,
              easing: 'easeInOut'
            }
          ]
        },
        
        // 标签
        {
          type: "title",
          text: "视频动画测试",
          textColor: "#ffffff",
          fontSize: 36,
          duration: 8,
          x: 640,
          y: 50,
          animations: ["fadeIn"]
        },
        {
          type: "title",
          text: "位置动画",
          textColor: "#ff6b6b",
          fontSize: 20,
          duration: 4,
          x: 100,
          y: 80
        },
        {
          type: "title",
          text: "缩放动画",
          textColor: "#4ecdc4",
          fontSize: 20,
          duration: 4,
          x: 640,
          y: 300,
          startTime: 4
        },
        {
          type: "title",
          text: "旋转动画",
          textColor: "#45b7d1",
          fontSize: 20,
          duration: 4,
          x: 640,
          y: 150
        },
        {
          type: "title",
          text: "透明度动画",
          textColor: "#f9ca24",
          fontSize: 20,
          duration: 4,
          x: 640,
          y: 450
        },
        {
          type: "title",
          text: "组合动画",
          textColor: "#6c5ce7",
          fontSize: 20,
          duration: 6,
          x: 200,
          y: 180,
          startTime: 2
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染视频动画测试...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`视频动画测试完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`视频动画测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("视频动画测试完成！");
    
  } catch (error) {
    console.error("视频动画测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testVideoAnimation();
}

export { testVideoAnimation };
