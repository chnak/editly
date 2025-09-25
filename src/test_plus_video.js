import { VideoMaker } from './index.js';

async function testPlusVideo() {
  console.log('测试 + 符号在视频中的表现...');
  
  const config = {
    width: 1280,
    height: 720,
    fps: 30,
    duration: 3,
    elements: [
      // 测试 + 符号
      {
        type: "title",
        text: "SPRING IN + OUT",
        fontSize: 60,
        fontFamily: "Arial",
        textColor: "#ffffff",
        x: "50%",
        y: "30%",
        originX: "center",
        originY: "center",
        startTime: 0,
        duration: 3,
        split: "word",
        splitDelay: 0.1,
        splitDuration: 0.4,
        zIndex: 1,
        animations: ["fadeIn"]
      },
      
      // 对比测试 - 没有 + 符号
      {
        type: "title",
        text: "SPRING IN OUT",
        fontSize: 60,
        fontFamily: "Arial",
        textColor: "#00ff00",
        x: "50%",
        y: "50%",
        originX: "center",
        originY: "center",
        startTime: 0,
        duration: 3,
        split: "word",
        splitDelay: 0.1,
        splitDuration: 0.4,
        zIndex: 1,
        animations: ["fadeIn"]
      },
      
      // 测试单独的 + 符号
      {
        type: "title",
        text: "+",
        fontSize: 60,
        fontFamily: "Arial",
        textColor: "#ff00ff",
        x: "50%",
        y: "70%",
        originX: "center",
        originY: "center",
        startTime: 0,
        duration: 3,
        split: "word",
        splitDelay: 0.1,
        splitDuration: 0.4,
        zIndex: 1,
        animations: ["fadeIn"]
      }
    ]
  };

  try {
    console.log('开始渲染 + 符号测试...');
    const videoMaker = new VideoMaker(config);
    const outputPath = await videoMaker.start();
    console.log(`+ 符号测试完成: ${outputPath}`);
    
    console.log('\n测试内容:');
    console.log('1. SPRING IN + OUT (包含 + 符号)');
    console.log('2. SPRING IN OUT (不包含 + 符号)');
    console.log('3. + (单独的 + 符号)');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testPlusVideo();

