import { VideoMaker } from "./index.js";
import { transitionManager } from "./transitions/TransitionManager.js";
import { TransitionBuilder, TransitionPresetBuilder, createTransition, createPreset } from "./transitions/TransitionBuilder.js";

/**
 * 过渡效果构建器测试
 * 展示如何使用链式 API 创建过渡效果
 */
async function testTransitionBuilder() {
  console.log("开始过渡效果构建器测试...");
  
  try {
    // 使用 TransitionBuilder 创建自定义过渡效果
    console.log("创建自定义过渡效果...");
    
    // 方法1: 链式调用
    const customFade = new TransitionBuilder()
      .type('opacity')
      .from({ opacity: 1 })
      .to({ opacity: 0 })
      .easing('bounce')
      .build();

    const customSlide = new TransitionBuilder()
      .type('position')
      .from({ x: 0, y: 0 })
      .to({ x: -1, y: 0 })
      .easing('elastic')
      .build();

    const customZoom = new TransitionBuilder()
      .type('scale')
      .from({ scale: 1 })
      .to({ scale: 1.8 })
      .easing('elastic')
      .build();

    // 方法2: 静态方法
    const quickFade = TransitionBuilder.fade('easeInOut');
    const leftSlide = TransitionBuilder.slide('left', 'easeInOut');
    const zoomIn = TransitionBuilder.zoom('in', 'easeOut');
    const rotate = TransitionBuilder.rotate(360, 'easeInOut');
    const wipeLeft = TransitionBuilder.wipe('left', 'linear');
    const flip3D = TransitionBuilder.flip3D('y', 180, 'easeInOut');

    // 方法3: 便捷函数
    const simpleFade = createTransition('opacity', {
      from: { opacity: 1 },
      to: { opacity: 0 },
      easing: 'linear'
    });

    // 注册所有自定义过渡效果
    const customTransitions = {
      customFade,
      customSlide,
      customZoom,
      quickFade,
      leftSlide,
      zoomIn,
      rotate,
      wipeLeft,
      flip3D,
      simpleFade
    };

    Object.entries(customTransitions).forEach(([name, config]) => {
      transitionManager.addTransition(name, config);
    });

    console.log("注册的过渡效果:", Object.keys(customTransitions));

    const videoMaker = new VideoMaker({
      outPath: "output/test-transition-builder.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 场景 1
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#e74c3c",
          duration: 2,
          startTime: 0
        },
        {
          type: "title",
          text: "自定义弹跳淡入淡出",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 0,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 2
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#3498db",
          duration: 2,
          startTime: 2
        },
        {
          type: "title",
          text: "弹性左滑效果",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 2,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 3
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#2ecc71",
          duration: 2,
          startTime: 4
        },
        {
          type: "title",
          text: "弹性缩放效果",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 4,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 4
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#f39c12",
          duration: 2,
          startTime: 6
        },
        {
          type: "title",
          text: "旋转效果",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 6,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 5
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#9b59b6",
          duration: 2,
          startTime: 8
        },
        {
          type: "title",
          text: "3D翻转效果",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 8,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        }
      ],
      transitions: [
        {
          type: "customFade",
          startTime: 1.5,
          duration: 1.0
        },
        {
          type: "customSlide",
          startTime: 3.5,
          duration: 1.0
        },
        {
          type: "customZoom",
          startTime: 5.5,
          duration: 1.0
        },
        {
          type: "rotate",
          startTime: 7.5,
          duration: 1.0
        },
        {
          type: "flip3D",
          startTime: 9.5,
          duration: 1.0
        }
      ]
    });

    const outputPath = await videoMaker.start();
    console.log(`过渡效果构建器测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("过渡效果构建器测试完成！");
    
  } catch (error) {
    console.error("过渡效果构建器测试失败:", error);
  }
}

/**
 * 测试预设生成器
 */
async function testPresetBuilder() {
  console.log("开始预设生成器测试...");
  
  try {
    // 使用 TransitionPresetBuilder 创建预设
    console.log("创建预设过渡效果...");
    
    // 方法1: 链式调用
    const customPreset = new TransitionPresetBuilder()
      .fade(1.5, 1.0, 'bounce')
      .slide('left', 3.5, 1.0, 'elastic')
      .zoom('in', 5.5, 1.0, 'easeOut')
      .rotate(7.5, 1.0, 'easeInOut')
      .flip3D('y', 9.5, 1.0, 'easeInOut')
      .build();

    // 方法2: 静态预设
    const cinematicPreset = TransitionPresetBuilder.cinematic(4, 2);
    const modernPreset = TransitionPresetBuilder.modern(4, 2);
    const creativePreset = TransitionPresetBuilder.creative(4, 2);

    console.log("自定义预设:", customPreset);
    console.log("电影风格预设:", cinematicPreset);
    console.log("现代风格预设:", modernPreset);
    console.log("创意风格预设:", creativePreset);

    // 使用自定义预设创建视频
    const videoMaker = new VideoMaker({
      outPath: "output/test-preset-builder.mp4",
      width: 1280,
      height: 720,
      fps: 30,
      elements: [
        // 场景 1
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#e74c3c",
          duration: 2,
          startTime: 0
        },
        {
          type: "title",
          text: "场景 1",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 0,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 2
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#3498db",
          duration: 2,
          startTime: 2
        },
        {
          type: "title",
          text: "场景 2",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 2,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 3
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#2ecc71",
          duration: 2,
          startTime: 4
        },
        {
          type: "title",
          text: "场景 3",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 4,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        },
        
        // 场景 4
        {
          type: "shape",
          shape: "rect",
          width: '100%',
          height: '100%',
          x: '50%',
          y: '50%',
          fillColor: "#f39c12",
          duration: 2,
          startTime: 6
        },
        {
          type: "title",
          text: "场景 4",
          textColor: "#ffffff",
          fontSize: 48,
          duration: 2,
          startTime: 6,
          x: '50%',
          y: '50%',
          textAlign: "center",
          width: '100%',
          height: '100%'
        }
      ],
      transitions: customPreset
    });

    const outputPath = await videoMaker.start();
    console.log(`预设生成器测试已保存到: ${outputPath}`);
    
    await videoMaker.close();
    console.log("预设生成器测试完成！");
    
  } catch (error) {
    console.error("预设生成器测试失败:", error);
  }
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  testTransitionBuilder().then(() => {
    return testPresetBuilder();
  });
}

export { testTransitionBuilder, testPresetBuilder };
