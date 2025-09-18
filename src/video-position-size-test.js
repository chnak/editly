import { VideoMaker, createAnimationBuilder, createPresetBuilder, quickPreset } from "./index.js";

/**
 * 视频位置和大小测试
 * 测试各种位置单位、尺寸单位和定位方式
 */
async function testVideoPositionAndSize() {
  console.log("开始测试视频位置和大小...");
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/video-position-size-test.mp4",
      width: 1920,
      height: 1080,
      fps: 30,
      elements: [
        // 背景
        {
          type: "image",
          source: "../assets/img1.jpg",
          duration: 15,
          x: '50%',
          y: '50%',
          width: "100%",
          height: "100%"
        },
        
        // 测试1: 像素单位位置和大小
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 3,
          x: 100,
          y: 100,
          width: 400,
          height: 300,
          fit: "cover",
          startTime: 0
        },
        
        // 测试2: 百分比单位位置和大小
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 3,
          x: "50%",
          y: "20%",
          width: "30%",
          height: "25%",
          fit: "contain",
          startTime: 3
        },
        
        // 测试3: 视口单位位置和大小
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 3,
          x: "80vw",
          y: "60vh",
          width: "15vw",
          height: "20vh",
          fit: "fill",
          startTime: 6
        },
        
        // 测试4: 预定义位置
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 3,
          position: "top-right",
          width: "20%",
          height: "15%",
          fit: "cover",
          startTime: 9
        },
        
        // 测试5: 混合单位表达式
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 3,
          x: "50% + 100px",
          y: "50% - 50px",
          width: "25% + 50px",
          height: "20% - 20px",
          fit: "contain",
          startTime: 12
        },
        
        // 测试6: 不同的原点设置
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 3,
          x: 960, // 画布中心
          y: 540, // 画布中心
          width: 200,
          height: 150,
          originX: "left",
          originY: "top",
          fit: "cover",
          startTime: 15
        },
        
        // 测试7: 位置和大小动画
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 5,
          x: 200,
          y: 200,
          width: 100,
          height: 100,
          fit: "cover",
          startTime: 18,
          animations: [
            {
              property: 'x',
              from: 200,
              to: 1500,
              duration: 2,
              easing: 'easeInOut'
            },
            {
              property: 'y',
              from: 200,
              to: 800,
              duration: 2,
              easing: 'easeInOut'
            },
            {
              property: 'scaleX',
              from: 1,
              to: 2,
              duration: 2,
              easing: 'easeInOut'
            },
            {
              property: 'scaleY',
              from: 1,
              to: 2,
              duration: 2,
              easing: 'easeInOut'
            }
          ]
        },
        
        // 测试8: 旋转和位置组合
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 4,
          x: "50%",
          y: "70%",
          width: "15%",
          height: "20%",
          fit: "cover",
          startTime: 23,
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
        
        // 测试9: 不同适配模式对比
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 2,
          x: "10%",
          y: "10%",
          width: "15%",
          height: "15%",
          fit: "cover",
          startTime: 27
        },
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 2,
          x: "30%",
          y: "10%",
          width: "15%",
          height: "15%",
          fit: "contain",
          startTime: 27
        },
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 2,
          x: "50%",
          y: "10%",
          width: "15%",
          height: "15%",
          fit: "fill",
          startTime: 27
        },
        {
          type: "video",
          source: "../assets/changi.mp4",
          duration: 2,
          x: "70%",
          y: "10%",
          width: "15%",
          height: "15%",
          fit: "scale-down",
          startTime: 27
        },
        
        // 测试10: 标签说明
        {
          type: "title",
          text: "视频位置和大小测试",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 15,
          x: 960,
          y: 50,
          animations: ["fadeIn"]
        },
        
        // 像素单位标签
        {
          type: "title",
          text: "像素单位",
          textColor: "#ff6b6b",
          fontSize: 24,
          duration: 3,
          x: 100,
          y: 50,
          startTime: 0
        },
        
        // 百分比单位标签
        {
          type: "title",
          text: "百分比单位",
          textColor: "#4ecdc4",
          fontSize: 24,
          duration: 3,
          x: "50%",
          y: "10%",
          startTime: 3
        },
        
        // 视口单位标签
        {
          type: "title",
          text: "视口单位",
          textColor: "#45b7d1",
          fontSize: 24,
          duration: 3,
          x: "80vw",
          y: "40vh",
          startTime: 6
        },
        
        // 预定义位置标签
        {
          type: "title",
          text: "预定义位置",
          textColor: "#f9ca24",
          fontSize: 24,
          duration: 3,
          x: "80%",
          y: "5%",
          startTime: 9
        },
        
        // 混合单位标签
        {
          type: "title",
          text: "混合单位",
          textColor: "#6c5ce7",
          fontSize: 24,
          duration: 3,
          x: "50%",
          y: "30%",
          startTime: 12
        },
        
        // 原点设置标签
        {
          type: "title",
          text: "原点设置",
          textColor: "#a29bfe",
          fontSize: 24,
          duration: 3,
          x: 960,
          y: 400,
          startTime: 15
        },
        
        // 动画测试标签
        {
          type: "title",
          text: "位置大小动画",
          textColor: "#fd79a8",
          fontSize: 24,
          duration: 5,
          x: 200,
          y: 100,
          startTime: 18
        },
        
        // 旋转测试标签
        {
          type: "title",
          text: "旋转测试",
          textColor: "#e17055",
          fontSize: 24,
          duration: 4,
          x: "50%",
          y: "50%",
          startTime: 23
        },
        
        // 适配模式标签
        {
          type: "title",
          text: "适配模式对比",
          textColor: "#00b894",
          fontSize: 24,
          duration: 2,
          x: "50%",
          y: "5%",
          startTime: 27
        },
        {
          type: "title",
          text: "Cover",
          textColor: "#ffffff",
          fontSize: 16,
          duration: 2,
          x: "10%",
          y: "5%",
          startTime: 27
        },
        {
          type: "title",
          text: "Contain",
          textColor: "#ffffff",
          fontSize: 16,
          duration: 2,
          x: "30%",
          y: "5%",
          startTime: 27
        },
        {
          type: "title",
          text: "Fill",
          textColor: "#ffffff",
          fontSize: 16,
          duration: 2,
          x: "50%",
          y: "5%",
          startTime: 27
        },
        {
          type: "title",
          text: "Scale-down",
          textColor: "#ffffff",
          fontSize: 16,
          duration: 2,
          x: "70%",
          y: "5%",
          startTime: 27
        }
      ]
    });

    // 监听事件
    videoMaker.on("start", () => {
      console.log("开始渲染视频位置和大小测试...");
    });

    videoMaker.on("progress", (progress) => {
      console.log(`渲染进度: ${progress}%`);
    });

    videoMaker.on("complete", (outputPath) => {
      console.log(`视频位置和大小测试完成: ${outputPath}`);
    });

    videoMaker.on("error", (error) => {
      console.error("渲染失败:", error);
    });

    const outputPath = await videoMaker.start();
    console.log(`视频位置和大小测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("视频位置和大小测试完成！");
    
  } catch (error) {
    console.error("视频位置和大小测试失败:", error);
  }
}

/**
 * 测试位置解析函数
 */
function testPositionParsing() {
  console.log("测试位置解析函数...");
  
  const { parsePositionValue, getPositionProps } = require('./utils/positionUtils.js');
  
  // 测试像素单位
  console.log("像素单位测试:");
  console.log("100px ->", parsePositionValue("100px", 1920));
  console.log("200 ->", parsePositionValue(200, 1920));
  
  // 测试百分比单位
  console.log("百分比单位测试:");
  console.log("50% ->", parsePositionValue("50%", 1920));
  console.log("25% ->", parsePositionValue("25%", 1920));
  
  // 测试视口单位
  console.log("视口单位测试:");
  console.log("10vw ->", parsePositionValue("10vw", 1920));
  console.log("20vh ->", parsePositionValue("20vh", 1080));
  
  // 测试预定义位置
  console.log("预定义位置测试:");
  console.log("center ->", getPositionProps({ position: "center", width: 1920, height: 1080 }));
  console.log("top-left ->", getPositionProps({ position: "top-left", width: 1920, height: 1080 }));
  console.log("bottom-right ->", getPositionProps({ position: "bottom-right", width: 1920, height: 1080 }));
  
  // 测试自定义坐标
  console.log("自定义坐标测试:");
  console.log("x: 50%, y: 30% ->", getPositionProps({ 
    x: "50%", 
    y: "30%", 
    width: 1920, 
    height: 1080 
  }));
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testPositionParsing();
  testVideoPositionAndSize();
}

export { testVideoPositionAndSize, testPositionParsing };
