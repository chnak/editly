import { VideoMaker } from "./index.js";

/**
 * 测试图片元素的大小和位置功能
 */
async function testImageSizeAndPosition() {
  console.log("开始测试图片元素的大小和位置功能...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/image-size-position-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 5,
          x: "0%",
          y: "0%",
          imageWidth: 1280,
          imageHeight: 720,
          fit: "cover"
        },
        
        // 测试不同大小的图片
        {
          type: "image",
          source: "./assets/img2.jpg",
          duration: 5,
          x: "100px",
          y: "100px",
          imageWidth: 200,
          imageHeight: 150,
          fit: "contain"
        },
        
        {
          type: "image",
          source: "./assets/img3.jpg",
          duration: 5,
          x: "50%",
          y: "20%",
          imageWidth: 300,
          imageHeight: 200,
          fit: "cover"
        },
        
        // 测试不同位置
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 5,
          x: "80vw",
          y: "80vh",
          imageWidth: 150,
          imageHeight: 100,
          fit: "fill"
        },
        
        // 测试缩放
        {
          type: "image",
          source: "./assets/img2.jpg",
          duration: 5,
          x: "50%",
          y: "50%",
          imageWidth: 400,
          imageHeight: 300,
          scaleX: 0.5,
          scaleY: 0.5,
          fit: "contain"
        },
        
        // 测试预定义位置
        {
          type: "image",
          source: "./assets/img3.jpg",
          duration: 5,
          position: "top-right",
          imageWidth: 200,
          imageHeight: 150,
          fit: "cover"
        },
        
        // 测试混合单位
        {
          type: "image",
          source: "./assets/img1.jpg",
          duration: 5,
          x: "50% + 100px",
          y: "50% - 50px",
          imageWidth: 250,
          imageHeight: 180,
          fit: "scale-down"
        }
      ]
    });

    await videoMaker.start();
    console.log("✅ 图片大小和位置测试完成: output/image-size-position-test.mp4");
    
  } catch (error) {
    console.error("❌ 图片大小和位置测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testImageSizeAndPosition();
}

export { testImageSizeAndPosition };
