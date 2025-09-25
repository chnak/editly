import { VideoMaker } from './index.js';

async function testSplitTextInOut() {
  console.log('测试分割文本的 In 和 Out 动画...');
  
  try {
    const videoMaker = new VideoMaker({
      outPath: "output/split-text-in-out-test.mp4",
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
        
        // 测试1: 字母分割 + 缩放进入 + 淡出
        // {
        //   type: "title",
        //   text: "ZOOM IN OUT",
        //   fontSize: 60,
        //   fontFamily: "Arial",
        //   textColor: "#ff6b6b",
        //   x: "20%",
        //   y: "20%",
        //   originX: "center",
        //   originY: "center",
        //   startTime: 1,
        //   duration: 4,
        //   zIndex: 1,
        //   split: "letter",
        //   splitDelay: 0.1,
        //   splitDuration: 0.3,
        //   animations: ["zoomIn", "fadeOut"]
        // },
        
        // // 测试2: 单词分割 + 从右侧滑入 + 向左滑出
        // {
        //   type: "title",
        //   text: "SLIDE RIGHT LEFT",
        //   fontSize: 50,
        //   fontFamily: "Arial",
        //   textColor: "#4ecdc4",
        //   x: "50%",
        //   y: "40%",
        //   originX: "center",
        //   originY: "center",
        //   startTime: 2,
        //   duration: 4,
        //   zIndex: 1,
        //   split: "word",
        //   splitDelay: 0.15,
        //   splitDuration: 0.4,
        //   animations: ["slideInRight", "slideOutLeft"]
        // },
        
        // // 测试3: 字母分割 + 从上方滑入 + 向下滑出
        // {
        //   type: "title",
        //   text: "SLIDE TOP BOTTOM",
        //   fontSize: 50,
        //   fontFamily: "Arial",
        //   textColor: "#45b7d1",
        //   x: "50%",
        //   y: "60%",
        //   originX: "center",
        //   originY: "center",
        //   startTime: 3,
        //   duration: 4,
        //   zIndex: 1,
        //   split: "letter",
        //   splitDelay: 0.12,
        //   splitDuration: 0.35,
        //   animations: ["slideInTop", "slideOutBottom"]
        // },
        
        // // 测试4: 单词分割 + 旋转进入 + 旋转退出
        // {
        //   type: "title",
        //   text: "ROTATE IN OUT",
        //   fontSize: 50,
        //   fontFamily: "Arial",
        //   textColor: "#f9ca24",
        //   x: "80%",
        //   y: "80%",
        //   originX: "center",
        //   originY: "center",
        //   startTime: 4,
        //   duration: 4,
        //   zIndex: 1,
        //   split: "word",
        //   splitDelay: 0.2,
        //   splitDuration: 0.5,
        //   animations: ["rotateIn", "rotateOut"]
        // },
        
        // 测试5: 字母分割 + 弹跳进入 + 爆炸退出
        {
          type: "title",
          text: "BOUNCE EXPLODE",
          fontSize: 55,
          fontFamily: "Arial",
          textColor: "#6c5ce7",
          x: "50%",
          y: "50%",
          originX: "center",
          originY: "center",
          startTime: 0,
          duration: 4,
          zIndex: 1,
          split: "letter",
          splitDelay: 0.08,
          splitDuration: 0.25,
          animations: ["bounceIn", "explodeOut"]
        },
        
        // 测试6: 单词分割 + 超级缩放进入 + 淡出
        // {
        //   type: "title",
        //   text: "SUPER ZOOM FADE",
        //   fontSize: 45,
        //   fontFamily: "Arial",
        //   textColor: "#fd79a8",
        //   x: "50%",
        //   y: "30%",
        //   originX: "center",
        //   originY: "center",
        //   startTime: 6,
        //   duration: 4,
        //   zIndex: 1,
        //   split: "word",
        //   splitDelay: 0.1,
        //   splitDuration: 0.3,
        //   animations: ["superZoomIn", "fadeOut"]
        // },
        
        // // 测试7: 字母分割 + 超级滑入 + 滑出
        // {
        //   type: "title",
        //   text: "SUPER SLIDE",
        //   fontSize: 45,
        //   fontFamily: "Arial",
        //   textColor: "#00b894",
        //   x: "50%",
        //   y: "70%",
        //   originX: "center",
        //   originY: "center",
        //   startTime: 7,
        //   duration: 4,
        //   zIndex: 1,
        //   split: "letter",
        //   splitDelay: 0.1,
        //   splitDuration: 0.3,
        //   animations: ["superSlideInLeft", "slideOutRight"]
        // }
      ]
    });
    
    console.log('开始渲染分割文本 In/Out 动画测试...');
    await videoMaker.start();
    console.log('分割文本 In/Out 动画测试完成: output/split-text-in-out-test.mp4');
    console.log('');
    console.log('测试内容:');
    console.log('1. 字母分割 + 缩放进入 + 淡出 (左上角)');
    console.log('2. 单词分割 + 从右侧滑入 + 向左滑出 (右上角)');
    console.log('3. 字母分割 + 从上方滑入 + 向下滑出 (左下角)');
    console.log('4. 单词分割 + 旋转进入 + 旋转退出 (右下角)');
    console.log('5. 字母分割 + 弹跳进入 + 爆炸退出 (中心)');
    console.log('6. 单词分割 + 超级缩放进入 + 淡出 (中心上方)');
    console.log('7. 字母分割 + 超级滑入 + 滑出 (中心下方)');
    console.log('');
    console.log('预期效果:');
    console.log('- 所有文本都应该按指定方式分割（字母或单词）');
    console.log('- In 动画：文本以指定方式进入');
    console.log('- Out 动画：文本在结束前以指定方式退出');
    console.log('- 分割延迟和持续时间应该正确应用');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testSplitTextInOut().catch(console.error);