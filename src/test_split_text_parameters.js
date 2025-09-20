import { VideoMaker } from './index.js';

async function testSplitTextParameters() {
  console.log('开始测试分割文本参数组合...');
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/split-text-parameters-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "shape",
          shape: "rectangle",
          fillColor: "#1a1a2e",
          x: 640,
          y: 360,
          width: "100%",
          height: "100%",
          originX: "center",
          originY: "center",
          startTime: 0,
          duration: 15,
          zIndex: 0
        },
        
        // 标题
        {
          type: "title",
          text: "分割参数测试",
          fontSize: 50,
          fontFamily: "Arial",
          textColor: "#ffffff",
          x: 640,
          y: 80,
          originX: "center",
          originY: "center",
          startTime: 0.5,
          duration: 2,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试1: 快速分割 (短延迟)
        {
          type: "title",
          text: "快速分割效果",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#ff6b6b",
          x: 640,
          y: 150,
          originX: "center",
          originY: "center",
          startTime: 2,
          duration: 2,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.03,
          splitDuration: 0.1,
          animations: ["zoomIn"]
        },
        
        // 测试2: 慢速分割 (长延迟)
        {
          type: "title",
          text: "慢速分割效果",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#4ecdc4",
          x: 640,
          y: 220,
          originX: "center",
          originY: "center",
          startTime: 3.5,
          duration: 3,
          zIndex: 1,
          split: "word",
          splitDelay: 0.5,
          splitDuration: 0.8,
          animations: ["slideInLeft"]
        },
        
        // 测试3: 中等速度分割
        {
          type: "title",
          text: "中等速度分割",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#ffe66d",
          x: 640,
          y: 290,
          originX: "center",
          originY: "center",
          startTime: 5,
          duration: 2.5,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.1,
          splitDuration: 0.3,
          animations: ["bounceIn"]
        },
        
        // 测试4: 单词分割 + 长持续时间
        {
          type: "title",
          text: "单词分割长持续时间",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#ff9ff3",
          x: 640,
          y: 360,
          originX: "center",
          originY: "center",
          startTime: 6.5,
          duration: 3,
          zIndex: 1,
          split: "word",
          splitDelay: 0.2,
          splitDuration: 1.0,
          animations: ["rotateIn"]
        },
        
        // 测试5: 字符分割 + 短持续时间
        {
          type: "title",
          text: "字符分割短持续时间",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#54a0ff",
          x: 640,
          y: 430,
          originX: "center",
          originY: "center",
          startTime: 8,
          duration: 2,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.08,
          splitDuration: 0.15,
          animations: ["slideInRight"]
        },
        
        // 测试6: 无分割动画对比
        {
          type: "title",
          text: "无分割动画对比",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#ff7675",
          x: 640,
          y: 500,
          originX: "center",
          originY: "center",
          startTime: 9.5,
          duration: 2,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 测试7: 混合分割参数
        {
          type: "title",
          text: "混合参数测试",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#a29bfe",
          x: 640,
          y: 570,
          originX: "center",
          originY: "center",
          startTime: 11,
          duration: 3,
          zIndex: 1,
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.6,
          animations: ["flip3D"]
        },
        
        // 测试8: 长文本分割
        {
          type: "title",
          text: "这是一个很长的中文文本用来测试分割效果在不同参数下的表现",
          fontSize: 35,
          fontFamily: "Arial",
          textColor: "#fd79a8",
          x: 640,
          y: 640,
          originX: "center",
          originY: "center",
          startTime: 12.5,
          duration: 2.5,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.05,
          splitDuration: 0.2,
          animations: ["zoomIn"]
        }
      ]
    });
    
    console.log('开始渲染分割文本参数测试...');
    await videoMaker.start();
    console.log('分割文本参数测试完成: output/split-text-parameters-test.mp4');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testSplitTextParameters().catch(console.error);
