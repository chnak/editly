import { VideoMaker } from './index.js';

async function testSplitTextAnimations() {
  console.log('开始测试各种分割文本动画...');
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/split-text-animations-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "shape",
          shape: "rectangle",
          fillColor: "#2c3e50",
          x: 640,
          y: 360,
          width: "100%",
          height: "100%",
          originX: "center",
          originY: "center",
          startTime: 0,
          duration: 20,
          zIndex: 0
        },
        
        // 标题
        {
          type: "title",
          text: "分割文本动画测试",
          fontSize: 60,
          fontFamily: "Arial",
          textColor: "#ffffff",
          x: 640,
          y: 100,
          originX: "center",
          originY: "center",
          startTime: 0.5,
          duration: 2,
          zIndex: 1,
          animations: ["fadeIn"]
        },
        
        // 1. 英文单词分割 - 淡入效果
        {
          type: "title",
          text: "Word by Word Animation",
          fontSize: 45,
          fontFamily: "Arial",
          textColor: "#ff6b6b",
          x: 640,
          y: 180,
          originX: "center",
          originY: "center",
          startTime: 2,
          duration: 3,
          zIndex: 1,
          split: "word",
          splitDelay: 0.2,
          splitDuration: 0.5,
          animations: ["fadeIn"]
        },
        
        // 2. 英文字符分割 - 缩放进入
        {
          type: "title",
          text: "Character Animation",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#4ecdc4",
          x: 640,
          y: 250,
          originX: "center",
          originY: "center",
          startTime: 3.5,
          duration: 3,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.1,
          splitDuration: 0.3,
          animations: ["zoomIn"]
        },
        
        // 3. 中文字符分割 - 从左滑入
        {
          type: "title",
          text: "中文字符动画效果",
          fontSize: 50,
          fontFamily: "Arial",
          textColor: "#ffe66d",
          x: 640,
          y: 320,
          originX: "center",
          originY: "center",
          startTime: 5,
          duration: 3,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.08,
          splitDuration: 0.2,
          animations: ["slideInLeft"]
        },
        
        // 4. 英文单词分割 - 从右滑入
        {
          type: "title",
          text: "Slide In From Right",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#ff9ff3",
          x: 640,
          y: 390,
          originX: "center",
          originY: "center",
          startTime: 6.5,
          duration: 3,
          zIndex: 1,
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.4,
          animations: ["slideInRight"]
        },
        
        // 5. 中文字符分割 - 弹跳进入
        {
          type: "title",
          text: "弹跳动画效果",
          fontSize: 45,
          fontFamily: "Arial",
          textColor: "#54a0ff",
          x: 640,
          y: 460,
          originX: "center",
          originY: "center",
          startTime: 8,
          duration: 3,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.1,
          splitDuration: 0.25,
          animations: ["bounceIn"]
        },
        
        // 6. 英文单词分割 - 旋转进入
        {
          type: "title",
          text: "Rotating Words Effect",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#ff7675",
          x: 640,
          y: 530,
          originX: "center",
          originY: "center",
          startTime: 9.5,
          duration: 3,
          zIndex: 1,
          split: "word",
          splitDelay: 0.2,
          splitDuration: 0.5,
          animations: ["rotateIn"]
        },
        
        // 7. 中文字符分割 - 3D翻转
        {
          type: "title",
          text: "3D翻转效果",
          fontSize: 50,
          fontFamily: "Arial",
          textColor: "#a29bfe",
          x: 640,
          y: 600,
          originX: "center",
          originY: "center",
          startTime: 11,
          duration: 3,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.12,
          splitDuration: 0.3,
          animations: ["flip3D"]
        },
        
        // 8. 混合文本 - 单词分割
        {
          type: "title",
          text: "Mixed 中英文 Text 测试",
          fontSize: 45,
          fontFamily: "Arial",
          textColor: "#fd79a8",
          x: 640,
          y: 670,
          originX: "center",
          originY: "center",
          startTime: 12.5,
          duration: 4,
          zIndex: 1,
          split: "word",
          splitDelay: 0.18,
          splitDuration: 0.4,
          animations: ["zoomIn"]
        },
        
        // 9. 长文本 - 字符分割
        {
          type: "title",
          text: "This is a very long sentence to test character by character animation with different timing",
          fontSize: 35,
          fontFamily: "Arial",
          textColor: "#00b894",
          x: 640,
          y: 200,
          originX: "center",
          originY: "center",
          startTime: 14,
          duration: 5,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.05,
          splitDuration: 0.15,
          animations: ["slideInLeft"]
        },
        
        // 10. 特殊字符测试
        {
          type: "title",
          text: "Special @#$%^&*() Characters!",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#e17055",
          x: 640,
          y: 300,
          originX: "center",
          originY: "center",
          startTime: 16,
          duration: 3,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.1,
          splitDuration: 0.2,
          animations: ["bounceIn"]
        }
      ]
    });
    
    console.log('开始渲染分割文本动画测试...');
    await videoMaker.start();
    console.log('分割文本动画测试完成: output/split-text-animations-test.mp4');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testSplitTextAnimations().catch(console.error);
