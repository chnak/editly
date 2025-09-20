import { VideoMaker } from '../index.js';

/**
 * Composition 元素使用示例
 * Composition 是一个容器元素，可以包含多个子元素并作为一个整体进行变换和动画
 */
async function compositionExample() {
  console.log('🎬 Composition 元素使用示例');
  
  try {
    // 示例1: 基础 Composition 使用
    console.log('\n📝 示例1: 基础 Composition 使用');
    await basicCompositionExample();
    
    // 示例2: 带动画的 Composition
    console.log('\n🎨 示例2: 带动画的 Composition');
    await animatedCompositionExample();
    
    // 示例3: 嵌套 Composition
    console.log('\n🔗 示例3: 嵌套 Composition');
    await nestedCompositionExample();
    
    // 示例4: 复杂 Composition 场景
    console.log('\n🌟 示例4: 复杂 Composition 场景');
    await complexCompositionExample();
    
    console.log('\n🎉 所有 Composition 示例完成！');
    
  } catch (error) {
    console.error('❌ Composition 示例失败:', error);
    throw error;
  }
}

/**
 * 基础 Composition 示例
 */
async function basicCompositionExample() {
  const videoMaker = new VideoMaker({
    outPath: "output/composition-basic.mp4",
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
        duration: 8,
        zIndex: 0
      },
      
      // 基础 Composition - 包含多个文本元素
      {
        type: "composition",
        x: 640,
        y: 360,
        originX: "center",
        originY: "center",
        startTime: 1,
        duration: 6,
        zIndex: 1,
        elements: [
          // 主标题
          {
            type: "title",
            text: "主标题",
            fontSize: 48,
            textColor: "#ffffff",
            x: 0,
            y: -50,
            originX: "center",
            originY: "center",
            startTime: 0,
            duration: 6,
            zIndex: 1,
            animations: ["fadeIn"]
          },
          // 副标题
          {
            type: "title",
            text: "副标题",
            fontSize: 32,
            textColor: "#4ecdc4",
            x: 0,
            y: 0,
            originX: "center",
            originY: "center",
            startTime: 1,
            duration: 5,
            zIndex: 1,
            animations: ["slideInLeft"]
          },
          // 描述文本
          {
            type: "title",
            text: "这是一个组合元素",
            fontSize: 24,
            textColor: "#bdc3c7",
            x: 0,
            y: 50,
            originX: "center",
            originY: "center",
            startTime: 2,
            duration: 4,
            zIndex: 1,
            animations: ["slideInRight"]
          }
        ]
      }
    ]
  });
  
  await videoMaker.start();
  console.log('✅ 基础 Composition 示例完成');
}

/**
 * 带动画的 Composition 示例
 */
async function animatedCompositionExample() {
  const videoMaker = new VideoMaker({
    outPath: "output/composition-animated.mp4",
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
        duration: 10,
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
        duration: 8,
        zIndex: 1,
        // Composition 本身的动画
        animations: [
          {
            property: "scaleX",
            from: 0.5,
            to: 1,
            duration: 1,
            startTime: 0,
            easing: "easeOut"
          },
          {
            property: "scaleY",
            from: 0.5,
            to: 1,
            duration: 1,
            startTime: 0,
            easing: "easeOut"
          },
          {
            property: "rotation",
            from: -10,
            to: 10,
            duration: 2,
            startTime: 2,
            easing: "easeInOut"
          },
          {
            property: "rotation",
            from: 10,
            to: -10,
            duration: 2,
            startTime: 4,
            easing: "easeInOut"
          },
          {
            property: "rotation",
            from: -10,
            to: 0,
            duration: 1,
            startTime: 6,
            easing: "easeOut"
          }
        ],
        elements: [
          // 背景形状
          {
            type: "shape",
            shape: "rectangle",
            fillColor: "rgba(52, 152, 219, 0.2)",
            strokeColor: "#3498db",
            strokeWidth: 2,
            x: 0,
            y: 0,
            width: 400,
            height: 200,
            originX: "center",
            originY: "center",
            startTime: 0,
            duration: 8,
            zIndex: 0
          },
          // 标题
          {
            type: "title",
            text: "动画组合",
            fontSize: 36,
            textColor: "#ffffff",
            x: 0,
            y: -30,
            originX: "center",
            originY: "center",
            startTime: 0.5,
            duration: 7,
            zIndex: 1,
            animations: ["fadeIn"]
          },
          // 描述
          {
            type: "title",
            text: "整体动画效果",
            fontSize: 24,
            textColor: "#3498db",
            x: 0,
            y: 30,
            originX: "center",
            originY: "center",
            startTime: 1,
            duration: 6,
            zIndex: 1,
            animations: ["slideInBottom"]
          }
        ]
      }
    ]
  });
  
  await videoMaker.start();
  console.log('✅ 带动画的 Composition 示例完成');
}

/**
 * 嵌套 Composition 示例
 */
async function nestedCompositionExample() {
  const videoMaker = new VideoMaker({
    outPath: "output/composition-nested.mp4",
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
        duration: 12,
        zIndex: 0
      },
      
      // 外层 Composition
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
            property: "scaleX",
            from: 0.8,
            to: 1.2,
            duration: 2,
            startTime: 0,
            easing: "easeOut"
          },
          {
            property: "scaleX",
            from: 1.2,
            to: 1,
            duration: 1,
            startTime: 2,
            easing: "easeIn"
          }
        ],
        elements: [
          // 外层背景
          {
            type: "shape",
            shape: "rectangle",
            fillColor: "rgba(231, 76, 60, 0.1)",
            strokeColor: "#e74c3c",
            strokeWidth: 3,
            x: 0,
            y: 0,
            width: 500,
            height: 300,
            originX: "center",
            originY: "center",
            startTime: 0,
            duration: 10,
            zIndex: 0
          },
          // 外层标题
          {
            type: "title",
            text: "外层组合",
            fontSize: 32,
            textColor: "#e74c3c",
            x: 0,
            y: -100,
            originX: "center",
            originY: "center",
            startTime: 0.5,
            duration: 9,
            zIndex: 1,
            animations: ["fadeIn"]
          },
          
          // 内层 Composition
          {
            type: "composition",
            x: 0,
            y: 0,
            originX: "center",
            originY: "center",
            startTime: 2,
            duration: 6,
            zIndex: 1,
            animations: [
              {
                property: "rotation",
                from: 0,
                to: 360,
                duration: 4,
                startTime: 0,
                easing: "linear"
              }
            ],
            elements: [
              // 内层背景
              {
                type: "shape",
                shape: "circle",
                fillColor: "rgba(46, 204, 113, 0.2)",
                strokeColor: "#2ecc71",
                strokeWidth: 2,
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
              // 内层文本
              {
                type: "title",
                text: "内层组合",
                fontSize: 24,
                textColor: "#2ecc71",
                x: 0,
                y: 0,
                originX: "center",
                originY: "center",
                startTime: 0.5,
                duration: 5,
                zIndex: 1,
                animations: ["zoomIn"]
              }
            ]
          }
        ]
      }
    ]
  });
  
  await videoMaker.start();
  console.log('✅ 嵌套 Composition 示例完成');
}

/**
 * 复杂 Composition 场景示例
 */
async function complexCompositionExample() {
  const videoMaker = new VideoMaker({
    outPath: "output/composition-complex.mp4",
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
        duration: 15,
        zIndex: 0
      },
      
      // 左侧 Composition
      {
        type: "composition",
        x: 320,
        y: 180,
        originX: "center",
        originY: "center",
        startTime: 1,
        duration: 6,
        zIndex: 1,
        animations: [
          {
            property: "x",
            from: -200,
            to: 320,
            duration: 1,
            startTime: 0,
            easing: "easeOut"
          }
        ],
        elements: [
          {
            type: "shape",
            shape: "rectangle",
            fillColor: "rgba(52, 152, 219, 0.2)",
            strokeColor: "#3498db",
            strokeWidth: 2,
            x: 0,
            y: 0,
            width: 300,
            height: 200,
            originX: "center",
            originY: "center",
            startTime: 0,
            duration: 6,
            zIndex: 0
          },
          {
            type: "title",
            text: "左侧组合",
            fontSize: 28,
            textColor: "#3498db",
            x: 0,
            y: -30,
            originX: "center",
            originY: "center",
            startTime: 0.5,
            duration: 5,
            zIndex: 1,
            animations: ["fadeIn"]
          },
          {
            type: "title",
            text: "功能模块A",
            fontSize: 20,
            textColor: "#ffffff",
            x: 0,
            y: 30,
            originX: "center",
            originY: "center",
            startTime: 1,
            duration: 4,
            zIndex: 1,
            animations: ["slideInLeft"]
          }
        ]
      },
      
      // 右侧 Composition
      {
        type: "composition",
        x: 960,
        y: 180,
        originX: "center",
        originY: "center",
        startTime: 2,
        duration: 6,
        zIndex: 1,
        animations: [
          {
            property: "x",
            from: 1480,
            to: 960,
            duration: 1,
            startTime: 0,
            easing: "easeOut"
          }
        ],
        elements: [
          {
            type: "shape",
            shape: "rectangle",
            fillColor: "rgba(231, 76, 60, 0.2)",
            strokeColor: "#e74c3c",
            strokeWidth: 2,
            x: 0,
            y: 0,
            width: 300,
            height: 200,
            originX: "center",
            originY: "center",
            startTime: 0,
            duration: 6,
            zIndex: 0
          },
          {
            type: "title",
            text: "右侧组合",
            fontSize: 28,
            textColor: "#e74c3c",
            x: 0,
            y: -30,
            originX: "center",
            originY: "center",
            startTime: 0.5,
            duration: 5,
            zIndex: 1,
            animations: ["fadeIn"]
          },
          {
            type: "title",
            text: "功能模块B",
            fontSize: 20,
            textColor: "#ffffff",
            x: 0,
            y: 30,
            originX: "center",
            originY: "center",
            startTime: 1,
            duration: 4,
            zIndex: 1,
            animations: ["slideInRight"]
          }
        ]
      },
      
      // 底部 Composition
      {
        type: "composition",
        x: 640,
        y: 500,
        originX: "center",
        originY: "center",
        startTime: 4,
        duration: 8,
        zIndex: 1,
        animations: [
          {
            property: "y",
            from: 800,
            to: 500,
            duration: 1,
            startTime: 0,
            easing: "easeOut"
          },
          {
            property: "scaleX",
            from: 0.5,
            to: 1,
            duration: 1,
            startTime: 0,
            easing: "easeOut"
          },
          {
            property: "scaleY",
            from: 0.5,
            to: 1,
            duration: 1,
            startTime: 0,
            easing: "easeOut"
          }
        ],
        elements: [
          {
            type: "shape",
            shape: "rectangle",
            fillColor: "rgba(46, 204, 113, 0.2)",
            strokeColor: "#2ecc71",
            strokeWidth: 2,
            x: 0,
            y: 0,
            width: 600,
            height: 150,
            originX: "center",
            originY: "center",
            startTime: 0,
            duration: 8,
            zIndex: 0
          },
          {
            type: "title",
            text: "底部组合",
            fontSize: 32,
            textColor: "#2ecc71",
            x: 0,
            y: -20,
            originX: "center",
            originY: "center",
            startTime: 0.5,
            duration: 7,
            zIndex: 1,
            animations: ["fadeIn"]
          },
          {
            type: "title",
            text: "综合功能展示",
            fontSize: 24,
            textColor: "#ffffff",
            x: 0,
            y: 20,
            originX: "center",
            originY: "center",
            startTime: 1,
            duration: 6,
            zIndex: 1,
            animations: ["slideInBottom"]
          }
        ]
      }
    ]
  });
  
  await videoMaker.start();
  console.log('✅ 复杂 Composition 场景示例完成');
}
compositionExample().catch(console.error);
// 运行示例
if (import.meta.url === `file://${process.argv[1]}`) {
  compositionExample().catch(console.error);
}

export { compositionExample };
