import { VideoMaker } from '../index.js';

/**
 * Composition 功能演示
 */
async function compositionDemo() {
  console.log('🎬 Composition 功能演示');
  
  try {
    // 演示1: 基础 Composition
    console.log('\n📝 演示1: 基础 Composition');
    await basicCompositionDemo();
    
    // 演示2: 带动画的 Composition
    console.log('\n🎨 演示2: 带动画的 Composition');
    await animatedCompositionDemo();
    
    // 演示3: 文本分割 Composition
    console.log('\n✂️ 演示3: 文本分割 Composition');
    await textSplitCompositionDemo();
    
    // 演示4: 复杂层级 Composition
    console.log('\n🏗️ 演示4: 复杂层级 Composition');
    await layeredCompositionDemo();
    
    console.log('\n🎉 所有 Composition 演示完成！');
    
  } catch (error) {
    console.error('❌ Composition 演示失败:', error);
    throw error;
  }
}

/**
 * 基础 Composition 演示
 */
async function basicCompositionDemo() {
  const videoMaker = new VideoMaker({
    outPath: "output/composition-demo-basic.mp4",
    width: 1280,
    height: 720,
    fps: 30,
    elements: [
      // 背景
      {
        type: "shape",
        shape: "rectangle",
        fillColor: "#2c3e50",
        x: 0,
        y: 0,
        width: "100%",
        height: "100%",
        originX: "left",
        originY: "top",
        startTime: 0,
        duration: 6,
        zIndex: 0
      },
      
      // 基础 Composition
      {
        type: "composition",
        x: 640,
        y: 360,
        originX: "center",
        originY: "center",
        startTime: 1,
        duration: 4,
        zIndex: 1,
        elements: [
          // 背景形状
          {
            type: "shape",
            shape: "rectangle",
            fillColor: "rgba(52, 152, 219, 0.3)",
            strokeColor: "#3498db",
            strokeWidth: 3,
            x: 0,
            y: 0,
            width: 400,
            height: 200,
            originX: "center",
            originY: "center",
            startTime: 0,
            duration: 4,
            zIndex: 0
          },
          // 主标题
          {
            type: "title",
            text: "基础组合",
            fontSize: 36,
            textColor: "#ffffff",
            x: 0,
            y: -30,
            originX: "center",
            originY: "center",
            startTime: 0.5,
            duration: 3,
            zIndex: 1,
            animations: ["fadeIn"]
          },
          // 副标题
          {
            type: "title",
            text: "包含多个元素",
            fontSize: 24,
            textColor: "#3498db",
            x: 0,
            y: 30,
            originX: "center",
            originY: "center",
            startTime: 1,
            duration: 2,
            zIndex: 1,
            animations: ["slideInBottom"]
          }
        ]
      }
    ]
  });
  
  await videoMaker.start();
  console.log('✅ 基础 Composition 演示完成');
}

/**
 * 带动画的 Composition 演示
 */
async function animatedCompositionDemo() {
  const videoMaker = new VideoMaker({
    outPath: "output/composition-demo-animated.mp4",
    width: 1280,
    height: 720,
    fps: 30,
    elements: [
      // 背景
      {
        type: "shape",
        shape: "rectangle",
        fillColor: "#1a1a2e",
        x: 0,
        y: 0,
        width: "100%",
        height: "100%",
        originX: "left",
        originY: "top",
        startTime: 0,
        duration: 8,
        zIndex: 0
      },
      
      // 带动画的 Composition
      {
        type: "composition",
        x: 640,
        y: 360,
        originX: "center",
        originY: "center",
        startTime: 1,
        duration: 6,
        zIndex: 1,
        // Composition 本身的动画
        animations: [
          {
            property: "scaleX",
            from: 0.5,
            to: 1.2,
            duration: 1,
            startTime: 0,
            easing: "easeOut"
          },
          {
            property: "scaleY",
            from: 0.5,
            to: 1.2,
            duration: 1,
            startTime: 0,
            easing: "easeOut"
          },
          {
            property: "rotation",
            from: 0,
            to: 360,
            duration: 4,
            startTime: 1,
            easing: "linear"
          }
        ],
        elements: [
          // 背景圆形
          {
            type: "shape",
            shape: "circle",
            fillColor: "rgba(231, 76, 60, 0.3)",
            strokeColor: "#e74c3c",
            strokeWidth: 3,
            x: 0,
            y: 0,
            shapeWidth: 200,
            shapeHeight: 200,
            originX: "center",
            originY: "center",
            startTime: 0,
            duration: 6,
            zIndex: 0
          },
          // 标题
          {
            type: "title",
            text: "动画组合",
            fontSize: 32,
            textColor: "#ffffff",
            x: 0,
            y: 0,
            originX: "center",
            originY: "center",
            startTime: 0.5,
            duration: 5,
            zIndex: 1,
            animations: ["fadeIn"]
          }
        ]
      }
    ]
  });
  
  await videoMaker.start();
  console.log('✅ 带动画的 Composition 演示完成');
}

/**
 * 文本分割 Composition 演示
 */
async function textSplitCompositionDemo() {
  const videoMaker = new VideoMaker({
    outPath: "output/composition-demo-text-split.mp4",
    width: 1280,
    height: 720,
    fps: 30,
    elements: [
      // 背景
      {
        type: "shape",
        shape: "rectangle",
        fillColor: "#34495e",
        x: 0,
        y: 0,
        width: "100%",
        height: "100%",
        originX: "left",
        originY: "top",
        startTime: 0,
        duration: 10,
        zIndex: 0
      },
      
      // 文本分割 Composition
      {
        type: "composition",
        x: 640,
        y: 360,
        originX: "center",
        originY: "center",
        startTime: 1,
        duration: 8,
        zIndex: 1,
        elements: [
          // 背景
          {
            type: "shape",
            shape: "rectangle",
            fillColor: "rgba(46, 204, 113, 0.2)",
            strokeColor: "#2ecc71",
            strokeWidth: 2,
            x: 0,
            y: 0,
            width: 600,
            height: 300,
            originX: "center",
            originY: "center",
            startTime: 0,
            duration: 8,
            zIndex: 0
          },
          // 按字母分割的标题
          {
            type: "title",
            text: "字母分割效果",
            fontSize: 36,
            textColor: "#2ecc71",
            x: 0,
            y: -50,
            originX: "center",
            originY: "center",
            startTime: 0.5,
            duration: 4,
            zIndex: 1,
            split: "letter",
            splitDelay: 0.1,
            splitDuration: 0.3,
            animations: ["fadeIn"]
          },
          // 按单词分割的副标题
          {
            type: "title",
            text: "单词分割效果",
            fontSize: 24,
            textColor: "#ffffff",
            x: 0,
            y: 0,
            originX: "center",
            originY: "center",
            startTime: 2,
            duration: 4,
            zIndex: 1,
            split: "word",
            splitDelay: 0.3,
            splitDuration: 0.5,
            animations: ["slideInLeft"]
          },
          // 普通文本
          {
            type: "title",
            text: "普通文本显示",
            fontSize: 20,
            textColor: "#bdc3c7",
            x: 0,
            y: 50,
            originX: "center",
            originY: "center",
            startTime: 4,
            duration: 3,
            zIndex: 1,
            animations: ["slideInBottom"]
          }
        ]
      }
    ]
  });
  
  await videoMaker.start();
  console.log('✅ 文本分割 Composition 演示完成');
}

/**
 * 复杂层级 Composition 演示
 */
async function layeredCompositionDemo() {
  const videoMaker = new VideoMaker({
    outPath: "output/composition-demo-layered.mp4",
    width: 1280,
    height: 720,
    fps: 30,
    elements: [
      // 背景
      {
        type: "shape",
        shape: "rectangle",
        fillColor: "#2c3e50",
        x: 0,
        y: 0,
        width: "100%",
        height: "100%",
        originX: "left",
        originY: "top",
        startTime: 0,
        duration: 12,
        zIndex: 0
      },
      
      // 复杂层级 Composition
      {
        type: "composition",
        x: 640,
        y: 360,
        originX: "center",
        originY: "center",
        startTime: 1,
        duration: 10,
        zIndex: 1,
        animations: [
          {
            property: "opacity",
            from: 0,
            to: 1,
            duration: 1,
            startTime: 0,
            easing: "easeIn"
          }
        ],
        elements: [
          // 底层背景
          {
            type: "shape",
            shape: "rectangle",
            fillColor: "rgba(52, 152, 219, 0.1)",
            strokeColor: "#3498db",
            strokeWidth: 1,
            x: 0,
            y: 0,
            width: 500,
            height: 400,
            originX: "center",
            originY: "center",
            startTime: 0,
            duration: 10,
            zIndex: 0
          },
          // 中层装饰
          {
            type: "shape",
            shape: "circle",
            fillColor: "rgba(231, 76, 60, 0.2)",
            strokeColor: "#e74c3c",
            strokeWidth: 2,
            x: 0,
            y: 0,
            shapeWidth: 300,
            shapeHeight: 300,
            originX: "center",
            originY: "center",
            startTime: 1,
            duration: 8,
            zIndex: 1,
            animations: [
              {
                property: "rotation",
                from: 0,
                to: 360,
                duration: 6,
                startTime: 0,
                easing: "linear"
              }
            ]
          },
          // 顶层文本
          {
            type: "title",
            text: "层级组合",
            fontSize: 48,
            textColor: "#ffffff",
            x: 0,
            y: -50,
            originX: "center",
            originY: "center",
            startTime: 2,
            duration: 6,
            zIndex: 2,
            animations: ["fadeIn"]
          },
          // 中层文本
          {
            type: "title",
            text: "复杂层级演示",
            fontSize: 32,
            textColor: "#3498db",
            x: 0,
            y: 0,
            originX: "center",
            originY: "center",
            startTime: 3,
            duration: 5,
            zIndex: 2,
            animations: ["slideInLeft"]
          },
          // 底层文本
          {
            type: "title",
            text: "多层元素展示",
            fontSize: 24,
            textColor: "#e74c3c",
            x: 0,
            y: 50,
            originX: "center",
            originY: "center",
            startTime: 4,
            duration: 4,
            zIndex: 2,
            animations: ["slideInBottom"]
          }
        ]
      }
    ]
  });
  
  await videoMaker.start();
  console.log('✅ 复杂层级 Composition 演示完成');
}
compositionDemo().catch(console.error);
// 运行演示
if (import.meta.url === `file://${process.argv[1]}`) {
  compositionDemo().catch(console.error);
}

export { compositionDemo };
