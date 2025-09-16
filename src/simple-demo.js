/**
 * 简单演示 - 展示库的核心功能
 */

console.log("🎬 视频制作库功能演示");
console.log("=" .repeat(50));

// 模拟配置
const config = {
  outPath: "output/demo-video.mp4",
  width: 800,
  height: 600,
  fps: 24,
  elements: [
    {
      type: "text",
      text: "视频制作库演示",
      font: "bold 48px Arial",
      fillColor: "#00d4ff",
      duration: 5,
      x: 400,
      y: 200,
      textAlign: "center",
      animations: [
        {
          property: "opacity",
          from: 0,
          to: 1,
          duration: 1,
          startTime: 0,
          easing: "easeIn"
        }
      ]
    }
  ]
};

console.log("✓ 配置创建成功");
console.log(`  - 输出文件: ${config.outPath}`);
console.log(`  - 分辨率: ${config.width}x${config.height}`);
console.log(`  - 帧率: ${config.fps}fps`);
console.log(`  - 元素数量: ${config.elements.length}`);

// 模拟元素基类
class Element {
  constructor(config) {
    this.type = config.type;
    this.duration = config.duration;
    this.startTime = config.startTime || 0;
    this.endTime = this.startTime + this.duration;
    this.animations = config.animations || [];
  }

  getProgressAtTime(time) {
    const elementTime = time - this.startTime;
    return Math.max(0, Math.min(elementTime / this.duration, 1));
  }

  getTransformAtTime(time) {
    const progress = this.getProgressAtTime(time);
    let opacity = 1;

    // 应用动画
    for (const animation of this.animations) {
      const animProgress = this.getAnimationProgress(time, animation);
      if (animProgress >= 0 && animProgress <= 1) {
        const easedProgress = this.ease(animProgress, animation.easing || 'linear');
        
        if (animation.property === 'opacity') {
          opacity = this.lerp(animation.from || opacity, animation.to || opacity, easedProgress);
        }
      }
    }

    return { opacity };
  }

  getAnimationProgress(time, animation) {
    const animStartTime = this.startTime + (animation.startTime || 0);
    const animDuration = animation.duration || this.duration;
    const animEndTime = animStartTime + animDuration;
    
    if (time < animStartTime || time > animEndTime) {
      return -1;
    }
    
    return (time - animStartTime) / animDuration;
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  ease(t, type) {
    switch (type) {
      case 'easeIn':
        return t * t;
      case 'easeOut':
        return 1 - (1 - t) * (1 - t);
      case 'easeInOut':
        return t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
      case 'linear':
      default:
        return t;
    }
  }
}

// 创建元素
const element = new Element(config.elements[0]);
console.log("✓ 元素创建成功");
console.log(`  - 元素类型: ${element.type}`);
console.log(`  - 元素时长: ${element.duration}秒`);

// 测试动画
console.log("\n🎨 动画系统测试:");
for (let time = 0; time <= 5; time += 0.5) {
  const transform = element.getTransformAtTime(time);
  console.log(`  时间 ${time}s: 透明度 ${transform.opacity.toFixed(2)}`);
}

// 模拟渲染过程
console.log("\n🎬 模拟渲染过程:");
const totalFrames = Math.ceil(5 * config.fps); // 使用固定时长
console.log(`  总帧数: ${totalFrames}`);

for (let frame = 0; frame < totalFrames; frame += Math.floor(totalFrames / 10)) {
  const time = frame / config.fps;
  const progress = Math.floor((frame / totalFrames) * 100);
  const transform = element.getTransformAtTime(time);
  
  console.log(`  帧 ${frame}/${totalFrames} (${time.toFixed(2)}s): 进度 ${progress}%, 透明度 ${transform.opacity.toFixed(2)}`);
}

console.log("\n🎉 演示完成！");
console.log("库的核心功能包括:");
console.log("  ✨ 配置解析 - 支持 Creatomate 风格的 JSON 配置");
console.log("  🎨 动画系统 - 支持多种缓动函数和属性动画");
console.log("  📐 时间管理 - 精确的元素时间轴控制");
console.log("  🎬 渲染流程 - 逐帧渲染和合成");
console.log("  🔧 扩展性 - 易于添加新元素类型和效果");

console.log("\n要运行完整的视频渲染，需要:");
console.log("  1. 安装 canvas 和 fabric 依赖");
console.log("  2. 安装 FFmpeg");
console.log("  3. 运行: node demo.js");
