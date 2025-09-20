import { SceneManager } from './scenes/SceneManager.js';
import { SceneTemplateManager } from './scenes/SceneTemplates.js';

/**
 * 场景系统测试
 */
async function testScenes() {
  console.log('🧪 开始测试场景系统...');
  
  try {
    // 测试1: 场景管理器基础功能
    console.log('\n📝 测试1: 场景管理器基础功能');
    await testSceneManager();
    
    // 测试2: 场景模板系统
    console.log('\n🎨 测试2: 场景模板系统');
    await testSceneTemplates();
    
    // 测试3: 场景渲染
    console.log('\n🎥 测试3: 场景渲染');
    await testSceneRendering();
    
    // 测试4: 场景过渡
    console.log('\n🔄 测试4: 场景过渡');
    await testSceneTransitions();
    
    console.log('\n✅ 所有场景测试完成！');
    
  } catch (error) {
    console.error('❌ 场景测试失败:', error);
    throw error;
  }
}

/**
 * 测试场景管理器
 */
async function testSceneManager() {
  const sceneManager = new SceneManager({
    width: 1280,
    height: 720,
    fps: 30
  });

  // 创建场景
  const scene1 = sceneManager.createScene('test1', {
    name: '测试场景1'
  });

  // 添加元素
  scene1.addElement({
    type: "shape",
    shape: "rectangle",
    fillColor: "#3498db",
    x: 0,
    y: 0,
    width: "100%",
    height: "100%",
    originX: "left",
    originY: "top",
    startTime: 0,
    duration: 3,
    zIndex: 0
  });

  scene1.addElement({
    type: "title",
    text: "测试场景1",
    fontSize: 48,
    textColor: "#ffffff",
    x: "50%",
    y: "50%",
    originX: "center",
    originY: "center",
    startTime: 0.5,
    duration: 2,
    zIndex: 1,
    animations: ["fadeIn"]
  });

  // 测试场景信息
  const scenesInfo = sceneManager.getScenesInfo();
  console.log('✅ 场景信息:', scenesInfo);

  // 测试场景渲染
  await sceneManager.renderScene('test1', 'output/test-scene1.mp4');
  console.log('✅ 场景1渲染完成');

  // 清理
  sceneManager.destroy();
}

/**
 * 测试场景模板
 */
async function testSceneTemplates() {
  const templateManager = new SceneTemplateManager();
  const sceneManager = new SceneManager();

  // 获取所有模板
  const templates = templateManager.getAllTemplates();
  console.log('✅ 可用模板:', templates);

  // 使用模板创建场景
  const titleScene = templateManager.createSceneFromTemplate(
    sceneManager,
    'template-test',
    'title',
    {
      texts: {
        '主标题': '模板测试',
        '副标题': '自定义文本'
      },
      colors: {
        primary: '#e74c3c',
        secondary: '#f39c12'
      }
    }
  );

  console.log('✅ 模板场景创建成功');
  console.log('场景元素数量:', titleScene.getElementCount());
  console.log('场景持续时间:', titleScene.getDuration());

  // 清理
  sceneManager.destroy();
}

/**
 * 测试场景渲染
 */
async function testSceneRendering() {
  const sceneManager = new SceneManager({
    width: 1280,
    height: 720,
    fps: 30
  });

  // 创建多个场景
  const scene1 = sceneManager.createScene('render1', { name: '渲染测试1' });
  scene1.addElement({
    type: "shape",
    shape: "rectangle",
    fillColor: "#e74c3c",
    x: 0,
    y: 0,
    width: "100%",
    height: "100%",
    originX: "left",
    originY: "top",
    startTime: 0,
    duration: 2,
    zIndex: 0
  });
  scene1.addElement({
    type: "title",
    text: "场景1",
    fontSize: 36,
    textColor: "#ffffff",
    x: "50%",
    y: "50%",
    originX: "center",
    originY: "center",
    startTime: 0.5,
    duration: 1,
    zIndex: 1,
    animations: ["fadeIn"]
  });

  const scene2 = sceneManager.createScene('render2', { name: '渲染测试2' });
  scene2.addElement({
    type: "shape",
    shape: "rectangle",
    fillColor: "#2ecc71",
    x: 0,
    y: 0,
    width: "100%",
    height: "100%",
    originX: "left",
    originY: "top",
    startTime: 0,
    duration: 2,
    zIndex: 0
  });
  scene2.addElement({
    type: "title",
    text: "场景2",
    fontSize: 36,
    textColor: "#ffffff",
    x: "50%",
    y: "50%",
    originX: "center",
    originY: "center",
    startTime: 0.5,
    duration: 1,
    zIndex: 1,
    animations: ["zoomIn"]
  });

  // 渲染单个场景
  await sceneManager.renderScene('render1', 'output/render-scene1.mp4');
  console.log('✅ 单个场景渲染完成');

  // 渲染所有场景
  await sceneManager.renderAllScenes('output/render-all-scenes.mp4', {
    includeTransitions: true,
    transitionDuration: 0.5
  });
  console.log('✅ 多场景渲染完成');

  // 清理
  sceneManager.destroy();
}

/**
 * 测试场景过渡
 */
async function testSceneTransitions() {
  const sceneManager = new SceneManager({
    width: 1280,
    height: 720,
    fps: 30
  });

  // 创建场景
  const scene1 = sceneManager.createScene('transition1', { name: '过渡场景1' });
  scene1.addElement({
    type: "shape",
    shape: "rectangle",
    fillColor: "#9b59b6",
    x: 0,
    y: 0,
    width: "100%",
    height: "100%",
    originX: "left",
    originY: "top",
    startTime: 0,
    duration: 3,
    zIndex: 0
  });
  scene1.addElement({
    type: "title",
    text: "场景A",
    fontSize: 48,
    textColor: "#ffffff",
    x: "50%",
    y: "50%",
    originX: "center",
    originY: "center",
    startTime: 0.5,
    duration: 2,
    zIndex: 1,
    animations: ["fadeIn"]
  });

  const scene2 = sceneManager.createScene('transition2', { name: '过渡场景2' });
  scene2.addElement({
    type: "shape",
    shape: "rectangle",
    fillColor: "#f39c12",
    x: 0,
    y: 0,
    width: "100%",
    height: "100%",
    originX: "left",
    originY: "top",
    startTime: 0,
    duration: 3,
    zIndex: 0
  });
  scene2.addElement({
    type: "title",
    text: "场景B",
    fontSize: 48,
    textColor: "#ffffff",
    x: "50%",
    y: "50%",
    originX: "center",
    originY: "center",
    startTime: 0.5,
    duration: 2,
    zIndex: 1,
    animations: ["slideInLeft"]
  });

  // 添加过渡
  sceneManager.addSceneTransition('transition1', 'transition2', {
    type: 'fade',
    duration: 1.0,
    color: '#000000'
  });

  // 渲染带过渡的场景
  await sceneManager.renderAllScenes('output/transition-test.mp4', {
    includeTransitions: true,
    transitionDuration: 1.0
  });
  console.log('✅ 场景过渡测试完成');

  // 清理
  sceneManager.destroy();
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testScenes().catch(console.error);
}

export { testScenes };
