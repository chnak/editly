import { VideoMaker } from './index.js';

async function testMultiPropertyAnimations() {
  console.log('开始测试多属性酷炫动画...');
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/multi-property-animations-test.mp4",
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
          duration: 12,
          zIndex: 0
        },
        
        // 测试超级缩放进入
        {
          type: "title",
          text: "SUPER ZOOM IN",
          fontSize: 60,
          fontFamily: "Arial",
          textColor: "#ff6b6b",
          x: 640,
          y: 200,
          originX: "center",
          originY: "center",
          startTime: 0.5,
          duration: 1.5,
          zIndex: 1,
          animations: ["superZoomIn"]
        },
        
        // 测试超级滑入左侧
        {
          type: "title",
          text: "SUPER SLIDE LEFT",
          fontSize: 50,
          fontFamily: "Arial",
          textColor: "#4ecdc4",
          x: 0,
          y: 0,
          originX: "left",
          originY: "top",
          startTime: 2,
          duration: 1.5,
          zIndex: 1,
          animations: ["superSlideInLeft"]
        },
        
        // 测试超级旋转进入
        {
          type: "title",
          text: "SUPER ROTATE",
          fontSize: 55,
          fontFamily: "Arial",
          textColor: "#ffe66d",
          x: '50%',
          y: 500,
          originX: "left",
          originY: "top",
          startTime: 3.5,
          duration: 1.5,
          zIndex: 1,
          animations: ["superRotateIn"]
        },
        
        // 测试超级弹跳进入
        {
          type: "title",
          text: "SUPER BOUNCE",
          fontSize: 50,
          fontFamily: "Arial",
          textColor: "#ff9ff3",
          x: 0,
          y: 500,
          originX: "left",
          originY: "top",
          startTime: 5,
          duration: 1.5,
          zIndex: 1,
          animations: ["superBounceIn"]
        },
        
        // 测试超级爆炸效果
        {
          type: "title",
          text: "SUPER EXPLODE",
          fontSize: 60,
          fontFamily: "Arial",
          textColor: "#54a0ff",
          x: 640,
          y: 200,
          originX: "center",
          originY: "center",
          startTime: 6.5,
          duration: 1.5,
          zIndex: 1,
          animations: ["superExplode"]
        },
        
        // 测试超级螺旋效果
        {
          type: "title",
          text: "SUPER SPIRAL",
          fontSize: 55,
          fontFamily: "Arial",
          textColor: "#a29bfe",
          x: 640,
          y: 300,
          originX: "center",
          originY: "center",
          startTime: 8,
          duration: 1.5,
          zIndex: 1,
          animations: ["superSpiral"]
        },
        
        // 测试超级弹簧效果
        {
          type: "title",
          text: "SUPER SPRING",
          fontSize: 50,
          fontFamily: "Arial",
          textColor: "#fd79a8",
          x: 640,
          y: 400,
          originX: "center",
          originY: "center",
          startTime: 9.5,
          duration: 1.5,
          zIndex: 1,
          animations: ["superSpring"]
        },
        
        // 测试超级摇摆效果
        {
          type: "title",
          text: "SUPER SWING",
          fontSize: 45,
          fontFamily: "Arial",
          textColor: "#00b894",
          x: 640,
          y: 500,
          originX: "center",
          originY: "center",
          startTime: 11,
          duration: 1.5,
          zIndex: 1,
          animations: ["superSwing"]
        }
      ]
    });
    
    console.log('开始渲染多属性酷炫动画测试...');
    await videoMaker.start();
    console.log('多属性酷炫动画测试完成: output/multi-property-animations-test.mp4');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testMultiPropertyAnimations().catch(console.error);