import { SceneManager } from '../scenes/SceneManager.js';
import { SceneTemplateManager } from '../scenes/SceneTemplates.js';

/**
 * 场景使用示例
 */
async function sceneExample() {
  console.log('🎬 场景系统使用示例');
  
  try {
    // 创建场景管理器
    const sceneManager = new SceneManager({
      width: 1920,
      height: 1080,
      fps: 30
    });

    // 创建模板管理器
    const templateManager = new SceneTemplateManager();

    // 示例1: 使用模板创建场景
    console.log('\n📝 示例1: 使用模板创建场景');
    
    // 创建标题场景
    const titleScene = templateManager.createSceneFromTemplate(
      sceneManager, 
      'intro', 
      'title',
      {
        texts: {
          '主标题': '欢迎使用场景系统',
          '副标题': '强大的视频制作工具'
        },
        colors: {
          primary: '#3498db',
          secondary: '#e74c3c',
          background: '#2c3e50'
        }
      }
    );

    // 创建产品展示场景
    const productScene = templateManager.createSceneFromTemplate(
      sceneManager,
      'product',
      'product',
      {
        texts: {
          '产品名称': '智能视频编辑器',
          '产品描述信息': '支持多种场景模板和动画效果'
        }
      }
    );

    // 创建数据展示场景
    const dataScene = templateManager.createSceneFromTemplate(
      sceneManager,
      'data',
      'data',
      {
        texts: {
          '数据统计': '产品数据',
          '用户数量: 1,234,567': '用户数量: 10,000+',
          '销售额: ¥9,876,543': '下载量: 50,000+',
          '增长率: +25.6%': '满意度: 98%'
        }
      }
    );

    // 创建结尾场景
    const endingScene = templateManager.createSceneFromTemplate(
      sceneManager,
      'ending',
      'ending',
      {
        texts: {
          '感谢观看': '谢谢观看',
          '联系我们': '了解更多信息'
        }
      }
    );

    // 添加场景过渡
    sceneManager.addSceneTransition('intro', 'product', {
      type: 'fade',
      duration: 1.0,
      color: '#000000'
    });

    sceneManager.addSceneTransition('product', 'data', {
      type: 'slide',
      duration: 1.5,
      color: '#34495e'
    });

    sceneManager.addSceneTransition('data', 'ending', {
      type: 'fade',
      duration: 1.0,
      color: '#1a1a2e'
    });

    // 示例2: 手动创建自定义场景
    console.log('\n🎨 示例2: 手动创建自定义场景');
    
    const customScene = sceneManager.createScene('custom', {
      name: '自定义场景'
    });

    // 添加自定义元素
    customScene.addElement({
      type: "shape",
      shape: "rectangle",
      fillColor: "#8e44ad",
      x: 0,
      y: 0,
      width: "100%",
      height: "100%",
      originX: "left",
      originY: "top",
      startTime: 0,
      duration: 6,
      zIndex: 0
    });

    customScene.addElement({
      type: "title",
      text: "自定义场景",
      fontSize: 48,
      textColor: "#ffffff",
      x: "50%",
      y: "30%",
      originX: "center",
      originY: "center",
      startTime: 0.5,
      duration: 2,
      zIndex: 1,
      animations: ["fadeIn", "zoomIn"]
    });

    customScene.addElement({
      type: "title",
      text: "完全自定义的内容",
      fontSize: 32,
      textColor: "#f39c12",
      x: "50%",
      y: "50%",
      originX: "center",
      originY: "center",
      startTime: 2,
      duration: 3,
      zIndex: 1,
      split: "word",
      splitDelay: 0.2,
      splitDuration: 0.4,
      animations: ["slideInLeft"]
    });

    // 添加装饰元素
    customScene.addElement({
      type: "shape",
      shape: "circle",
      fillColor: "rgba(255, 255, 255, 0.1)",
      x: "50%",
      y: "70%",
      shapeWidth: 150,
      shapeHeight: 150,
      originX: "center",
      originY: "center",
      startTime: 3,
      duration: 3,
      zIndex: 1,
      animations: [
        {
          property: "scaleX",
          from: 0,
          to: 1,
          duration: 1,
          startTime: 0,
          easing: "easeOut"
        },
        {
          property: "scaleY",
          from: 0,
          to: 1,
          duration: 1,
          startTime: 0,
          easing: "easeOut"
        },
        {
          property: "rotation",
          from: 0,
          to: 360,
          duration: 2,
          startTime: 1,
          easing: "linear"
        }
      ]
    });

    // 示例3: 渲染单个场景
    console.log('\n🎥 示例3: 渲染单个场景');
    
    await sceneManager.renderScene('intro', 'output/scene-intro.mp4');
    console.log('✅ 标题场景渲染完成');

    await sceneManager.renderScene('custom', 'output/scene-custom.mp4');
    console.log('✅ 自定义场景渲染完成');

    // 示例4: 渲染所有场景为连续视频
    console.log('\n🎬 示例4: 渲染所有场景为连续视频');
    
    await sceneManager.renderAllScenes('output/scene-complete.mp4', {
      includeTransitions: true,
      transitionDuration: 1.0,
      defaultTransition: 'fade'
    });
    console.log('✅ 完整视频渲染完成');

    // 示例5: 获取场景信息
    console.log('\n📊 示例5: 场景信息');
    const scenesInfo = sceneManager.getScenesInfo();
    console.log('场景列表:', scenesInfo);

    // 示例6: 预览场景
    console.log('\n👀 示例6: 预览场景');
    await customScene.preview('output/scene-custom-preview.mp4', 3);
    console.log('✅ 场景预览完成');

    console.log('\n🎉 所有场景示例完成！');

  } catch (error) {
    console.error('❌ 场景示例失败:', error);
    throw error;
  }
}

// 运行示例
if (import.meta.url === `file://${process.argv[1]}`) {
  sceneExample().catch(console.error);
}

export { sceneExample };
