import { VideoMaker } from './index.js';

async function testInOutAnimations() {
  console.log('测试 In 和 Out 动画同时使用效果...');
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/in-out-animations-test.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 背景
        {
          type: "shape",
          shape: "rectangle",
          fillColor: "#1a1a2e",
          x: "50%",
          y: "50%",
          width: "100%",
          height: "100%",
          originX: "center",
          originY: "center",
          startTime: 0,
          duration: 12,
          zIndex: 0
        },
        
        // 测试1: 缩放进入 + 淡出
        {
          type: "title",
          text: "ZOOM IN + FADE OUT",
          fontSize: 50,
          fontFamily: "Arial",
          textColor: "#ff6b6b",
          x: "50%",
          y: "20%",
          originX: "center",
          originY: "center",
          startTime: 1,
          duration: 3,
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.4,
          zIndex: 1,
          animations: ["zoomIn", "fadeOut"]
        },
        
        // 测试2: 从右侧滑入 + 向左滑出
        {
          type: "title",
          text: "SLIDE RIGHT + LEFT",
          fontSize: 45,
          fontFamily: "Arial",
          textColor: "#4ecdc4",
          x: "50%",
          y: "30%",
          originX: "center",
          originY: "center",
          startTime: 2,
          duration: 3,
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.4,
          zIndex: 1,
          animations: ["slideInRight", "fadeOut"]
        },
        
        // 测试3: 从上方滑入 + 向下滑出
        {
          type: "title",
          text: "SLIDE TOP + BOTTOM",
          fontSize: 45,
          fontFamily: "Arial",
          textColor: "#ffe66d",
          x: "50%",
          y: "40%",
          originX: "center",
          originY: "center",
          startTime: 3,
          duration: 3,
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.4,
          zIndex: 1,
          animations: ["slideInTop", "fadeOut"]
        },
        
        // 测试4: 旋转进入 + 旋转退出
        {
          type: "title",
          text: "ROTATE IN + OUT",
          fontSize: 45,
          fontFamily: "Arial",
          textColor: "#a8e6cf",
          x: "50%",
          y: "50%",
          originX: "center",
          originY: "center",
          startTime: 4,
          duration: 3,
          zIndex: 1,
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.4,
          animations: ["rotateIn", "fadeOut"]
        },
        
        // 测试5: 弹跳进入 + 爆炸退出
        {
          type: "title",
          text: "BOUNCE + EXPLODE",
          fontSize: 50,
          fontFamily: "Arial",
          textColor: "#ff9ff3",
          x: "50%",
          y: "60%",
          originX: "center",
          originY: "center",
          startTime: 5,
          duration: 3,
          zIndex: 1,
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.4,
          animations: ["bounceIn", "zoomOut"]
        },
        
        // 测试6: 分割文本 + In/Out 动画
        {
          type: "title",
          text: "SPLIT TEXT EFFECT",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#54a0ff",
          x: "50%",
          y: "70%",
          originX: "center",
          originY: "center",
          startTime: 6,
          duration: 3,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.1,
          splitDuration: 0.3,
          animations: ["superZoomIn", "fadeOut"]
        },
        
        // 测试7: 分割文本 + 滑入滑出
        {
          type: "title",
          text: "SPLIT SLIDE EFFECT",
          fontSize: 40,
          fontFamily: "Arial",
          textColor: "#ff7675",
          x: "50%",
          y: "80%",
          originX: "center",
          originY: "center",
          startTime: 7,
          duration: 3,
          zIndex: 1,
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.4,
          animations: ["superSlideInLeft", "fadeOut"]
        },
        
        // 测试8: 弹性进入 + 溶解退出
        {
          type: "title",
          text: "ELASTIC + DISSOLVE",
          fontSize: 45,
          fontFamily: "Arial",
          textColor: "#fdcb6e",
          x: "50%",
          y: "90%",
          originX: "center",
          originY: "center",
          startTime: 8,
          duration: 3,
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.4,
          zIndex: 1,
          animations: ["elasticIn", "dissolveOut"]
        },
        
        // 测试9: 弹簧进入 + 弹簧退出
        {
          type: "title",
          text: "SPRING IN + OUT",
          fontSize: 45,
          fontFamily: "Arial",
          textColor: "#6c5ce7",
          x: "70%",
          y: "50%",
          originX: "center",
          originY: "center",
          startTime: 9,
          duration: 3,
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.4,
          zIndex: 1,
          animations: ["superSpring", "fadeOut"]
        },
        
        // 测试10: 3D翻转进入 + 淡出
        {
          type: "title",
          text: "3D FLIP EFFECT",
          fontSize: 50,
          fontFamily: "Arial",
          textColor: "#00b894",
          x: "50%",
          y: "15%",
          originX: "center",
          originY: "center",
          startTime: 10,
          duration: 2,
          split: "word",
          splitDelay: 0.15,
          splitDuration: 0.4,
          zIndex: 1,
          animations: ["flip3D", "fadeOut"]
        }
      ]
    });
    
    console.log('开始渲染 In/Out 动画组合测试...');
    await videoMaker.start();
    console.log('In/Out 动画组合测试完成: output/in-out-animations-test.mp4');
    console.log('');
    console.log('测试内容:');
    console.log('1. 缩放进入 + 淡出 (左上角)');
    console.log('2. 从右侧滑入 + 向左滑出 (右上角)');
    console.log('3. 从上方滑入 + 向下滑出 (左下角)');
    console.log('4. 旋转进入 + 旋转退出 (右下角)');
    console.log('5. 弹跳进入 + 爆炸退出 (中心)');
    console.log('6. 分割文本 + 超级缩放进入 + 淡出 (中心上方)');
    console.log('7. 分割文本 + 超级滑入 + 滑出 (中心下方)');
    console.log('8. 弹性进入 + 溶解退出 (左侧中心)');
    console.log('9. 弹簧进入 + 弹簧退出 (右侧中心)');
    console.log('10. 3D翻转进入 + 淡出 (顶部中心)');
    console.log('');
    console.log('所有坐标都使用百分比，确保不超出屏幕外');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testInOutAnimations().catch(console.error);