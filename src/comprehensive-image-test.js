import { VideoMaker } from "./index.js";

/**
 * 全面的图片测试
 * 测试图片的位置、宽高、动画等功能
 */
async function comprehensiveImageTest() {
  console.log("开始全面图片测试...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/comprehensive-image-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 测试1: 百分比位置和尺寸
        {
          type: "image",
          source: "../assets/img1.jpg",
          duration: 4,
          x: "25%",
          y: "25%",
          width: "30%",
          height: "30%",
          fit: "cover",
          zIndex: 1
        },
        
        // 测试2: 像素位置和尺寸
        {
          type: "image",
          source: "../assets/img2.jpg",
          duration: 4,
          x: 600,
          y: 100,
          width: 200,
          height: 150,
          fit: "contain",
          zIndex: 2,
          startTime: 0.5
        },
        
        // 测试3: 中心定位
        {
          type: "image",
          source: "../assets/img3.jpg",
          duration: 4,
          position: "center",
          width: "25%",
          height: "25%",
          fit: "cover",
          zIndex: 3,
          startTime: 1
        },
        
        // 测试4: 位置动画
        {
          type: "image",
          source: "../assets/img1.jpg",
          duration: 4,
          x: 100,
          y: 500,
          width: 150,
          height: 100,
          fit: "cover",
          zIndex: 4,
          startTime: 1.5,
          animations: [
            {
              property: 'x',
              from: 100,
              to: 1000,
              duration: 2,
              easing: 'easeInOut'
            },
            {
              property: 'y',
              from: 500,
              to: 200,
              duration: 2,
              easing: 'easeInOut'
            }
          ]
        },
        
        // 测试5: 缩放动画
        {
          type: "image",
          source: "../assets/img2.jpg",
          duration: 4,
          x: 800,
          y: 400,
          width: 100,
          height: 100,
          fit: "cover",
          zIndex: 5,
          startTime: 2,
          animations: [
            {
              property: 'scaleX',
              from: 0.5,
              to: 2,
              duration: 2,
              easing: 'bounce'
            },
            {
              property: 'scaleY',
              from: 0.5,
              to: 2,
              duration: 2,
              easing: 'bounce'
            }
          ]
        },
        
        // 测试6: 旋转和透明度动画
        {
          type: "image",
          source: "../assets/img3.jpg",
          duration: 4,
          x: 400,
          y: 300,
          width: 120,
          height: 120,
          fit: "cover",
          zIndex: 6,
          startTime: 2.5,
          animations: [
            {
              property: 'rotation',
              from: 0,
              to: 360,
              duration: 3,
              easing: 'linear'
            },
            {
              property: 'opacity',
              from: 0,
              to: 1,
              duration: 1,
              easing: 'easeIn'
            }
          ]
        },
        
        // 测试7: 视口单位
        {
          type: "image",
          source: "../assets/img1.jpg",
          duration: 4,
          x: "10vw",
          y: "10vh",
          width: "20vw",
          height: "20vh",
          fit: "contain",
          zIndex: 7,
          startTime: 3
        },
        
        // 测试8: 混合单位表达式
        {
          type: "image",
          source: "../assets/img2.jpg",
          duration: 4,
          x: "50% + 100px",
          y: "50% - 50px",
          width: "15% + 50px",
          height: "15% + 50px",
          fit: "cover",
          zIndex: 8,
          startTime: 3.5
        },
        
        // 标签
        {
          type: "title",
          text: "全面图片测试",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 6,
          x: 640,
          y: 50,
          animations: ["fadeIn"]
        },
        {
          type: "title",
          text: "百分比位置/尺寸",
          textColor: "#ff6b6b",
          fontSize: 20,
          duration: 4,
          x: 200,
          y: 100
        },
        {
          type: "title",
          text: "像素位置/尺寸",
          textColor: "#4ecdc4",
          fontSize: 20,
          duration: 4,
          x: 600,
          y: 80,
          startTime: 0.5
        },
        {
          type: "title",
          text: "中心定位",
          textColor: "#45b7d1",
          fontSize: 20,
          duration: 4,
          x: 640,
          y: 200,
          startTime: 1
        },
        {
          type: "title",
          text: "位置动画",
          textColor: "#f39c12",
          fontSize: 20,
          duration: 4,
          x: 100,
          y: 450,
          startTime: 1.5
        },
        {
          type: "title",
          text: "缩放动画",
          textColor: "#e74c3c",
          fontSize: 20,
          duration: 4,
          x: 800,
          y: 350,
          startTime: 2
        },
        {
          type: "title",
          text: "旋转动画",
          textColor: "#9b59b6",
          fontSize: 20,
          duration: 4,
          x: 400,
          y: 250,
          startTime: 2.5
        },
        {
          type: "title",
          text: "视口单位",
          textColor: "#1abc9c",
          fontSize: 20,
          duration: 4,
          x: 50,
          y: 50,
          startTime: 3
        },
        {
          type: "title",
          text: "混合单位",
          textColor: "#34495e",
          fontSize: 20,
          duration: 4,
          x: 640,
          y: 400,
          startTime: 3.5
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染全面图片测试...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`全面图片测试完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`全面图片测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("全面图片测试完成！");
    
  } catch (error) {
    console.error("全面图片测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  comprehensiveImageTest();
}

export { comprehensiveImageTest };
