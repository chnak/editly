import { VideoMaker } from './index.js';

async function testSplitPositionFix() {
  console.log('测试分割文本位置计算修复...');
  
  const config = {
    width: 1280,
    height: 720,
    fps: 30,
    duration: 3,
    elements: [
      // 测试1: 普通文本（word分割）
      {
        type: "title",
        text: "Hello World",
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
        splitDuration: 0.3,
        zIndex: 1,
        animations: ["elasticIn", "dissolveOut"]
      },
      
      // 测试2: 中文文本（letter分割）
      {
        type: "title",
        text: "你好世界",
        fontSize: 60,
        fontFamily: "Arial",
        textColor: "#00ff00",
        x: "50%",
        y: "50%",
        originX: "center",
        originY: "center",
        startTime: 0,
        duration: 3,
        split: "letter",
        splitDelay: 0.1,
        splitDuration: 0.3,
        zIndex: 1,
        animations: ["elasticIn", "dissolveOut"]
      },
      
      // 测试3: 带标点符号的文本（word分割）
      {
        type: "title",
        text: "Hello, World! How are you?",
        fontSize: 50,
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
        splitDuration: 0.3,
        zIndex: 1,
        animations: ["elasticIn", "dissolveOut"]
      }
    ]
  };

  try {
    console.log('开始渲染分割文本位置测试...');
    const videoMaker = new VideoMaker(config);
    const outputPath = await videoMaker.start();
    console.log(`分割文本位置测试完成: ${outputPath}`);
    
    console.log('\n测试内容:');
    console.log('1. 英文单词分割 (Hello World)');
    console.log('2. 中文字符分割 (你好世界)');
    console.log('3. 带标点符号的单词分割 (Hello, World! How are you?)');
    console.log('\n所有文本都应该居中显示，分割后的字符/单词位置应该正确');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testSplitPositionFix();