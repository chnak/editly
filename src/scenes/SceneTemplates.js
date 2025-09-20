/**
 * 场景模板库 - 预定义的场景模板
 */

/**
 * 标题场景模板
 */
export const titleSceneTemplate = {
  name: "标题场景",
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
      duration: 5,
      zIndex: 0
    },
    // 主标题
    {
      type: "title",
      text: "主标题",
      fontSize: 64,
      textColor: "#ffffff",
      x: "50%",
      y: "40%",
      originX: "center",
      originY: "center",
      startTime: 0.5,
      duration: 4,
      zIndex: 1,
      split: "letter",
      splitDelay: 0.1,
      splitDuration: 0.3,
      animations: ["fadeIn", "zoomIn"]
    },
    // 副标题
    {
      type: "title",
      text: "副标题",
      fontSize: 36,
      textColor: "#4ecdc4",
      x: "50%",
      y: "60%",
      originX: "center",
      originY: "center",
      startTime: 2,
      duration: 3,
      zIndex: 1,
      split: "word",
      splitDelay: 0.2,
      splitDuration: 0.4,
      animations: ["slideInLeft"]
    }
  ]
};

/**
 * 产品展示场景模板
 */
export const productSceneTemplate = {
  name: "产品展示场景",
  elements: [
    // 背景
    {
      type: "shape",
      shape: "rectangle",
      fillColor: "#f8f9fa",
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
    // 产品标题
    {
      type: "title",
      text: "产品名称",
      fontSize: 48,
      textColor: "#2c3e50",
      x: "50%",
      y: "20%",
      originX: "center",
      originY: "center",
      startTime: 0.5,
      duration: 2,
      zIndex: 1,
      animations: ["fadeIn"]
    },
    // 产品描述
    {
      type: "title",
      text: "产品描述信息",
      fontSize: 24,
      textColor: "#7f8c8d",
      x: "50%",
      y: "80%",
      originX: "center",
      originY: "center",
      startTime: 2.5,
      duration: 5,
      zIndex: 1,
      animations: ["slideInBottom"]
    },
    // 装饰圆形
    {
      type: "shape",
      shape: "circle",
      fillColor: "rgba(52, 152, 219, 0.1)",
      strokeColor: "#3498db",
      strokeWidth: 3,
      x: "50%",
      y: "50%",
      shapeWidth: 200,
      shapeHeight: 200,
      originX: "center",
      originY: "center",
      startTime: 1,
      duration: 6,
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
          duration: 4,
          startTime: 1,
          easing: "linear"
        }
      ]
    }
  ]
};

/**
 * 数据展示场景模板
 */
export const dataSceneTemplate = {
  name: "数据展示场景",
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
      duration: 10,
      zIndex: 0
    },
    // 标题
    {
      type: "title",
      text: "数据统计",
      fontSize: 42,
      textColor: "#ffffff",
      x: "50%",
      y: "15%",
      originX: "center",
      originY: "center",
      startTime: 0.5,
      duration: 2,
      zIndex: 1,
      animations: ["fadeIn"]
    },
    // 数据项1
    {
      type: "title",
      text: "用户数量: 1,234,567",
      fontSize: 32,
      textColor: "#3498db",
      x: "25%",
      y: "40%",
      originX: "center",
      originY: "center",
      startTime: 2,
      duration: 2,
      zIndex: 1,
      animations: ["slideInLeft", "zoomIn"]
    },
    // 数据项2
    {
      type: "title",
      text: "销售额: ¥9,876,543",
      fontSize: 32,
      textColor: "#e74c3c",
      x: "75%",
      y: "40%",
      originX: "center",
      originY: "center",
      startTime: 3,
      duration: 2,
      zIndex: 1,
      animations: ["slideInRight", "zoomIn"]
    },
    // 数据项3
    {
      type: "title",
      text: "增长率: +25.6%",
      fontSize: 32,
      textColor: "#2ecc71",
      x: "50%",
      y: "60%",
      originX: "center",
      originY: "center",
      startTime: 4,
      duration: 2,
      zIndex: 1,
      animations: ["bounceIn"]
    },
    // 图表装饰
    {
      type: "shape",
      shape: "rectangle",
      fillColor: "rgba(52, 152, 219, 0.2)",
      x: "50%",
      y: "80%",
      width: 400,
      height: 100,
      originX: "center",
      originY: "center",
      startTime: 5,
      duration: 4,
      zIndex: 1,
      animations: [
        {
          property: "scaleX",
          from: 0,
          to: 1,
          duration: 1,
          startTime: 0,
          easing: "easeOut"
        }
      ]
    }
  ]
};

/**
 * 过渡场景模板
 */
export const transitionSceneTemplate = {
  name: "过渡场景",
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
      duration: 3,
      zIndex: 0
    },
    // 过渡文本
    {
      type: "title",
      text: "接下来...",
      fontSize: 48,
      textColor: "#ffffff",
      x: "50%",
      y: "50%",
      originX: "center",
      originY: "center",
      startTime: 0.5,
      duration: 2,
      zIndex: 1,
      animations: [
        {
          property: "opacity",
          from: 0,
          to: 1,
          duration: 0.5,
          startTime: 0,
          easing: "easeIn"
        },
        {
          property: "opacity",
          from: 1,
          to: 0,
          duration: 0.5,
          startTime: 1.5,
          easing: "easeOut"
        }
      ]
    }
  ]
};

/**
 * 结尾场景模板
 */
export const endingSceneTemplate = {
  name: "结尾场景",
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
      duration: 5,
      zIndex: 0
    },
    // 感谢文本
    {
      type: "title",
      text: "感谢观看",
      fontSize: 56,
      textColor: "#ffffff",
      x: "50%",
      y: "40%",
      originX: "center",
      originY: "center",
      startTime: 0.5,
      duration: 3,
      zIndex: 1,
      animations: ["fadeIn", "zoomIn"]
    },
    // 联系方式
    {
      type: "title",
      text: "联系我们",
      fontSize: 24,
      textColor: "#bdc3c7",
      x: "50%",
      y: "60%",
      originX: "center",
      originY: "center",
      startTime: 2,
      duration: 3,
      zIndex: 1,
      animations: ["slideInBottom"]
    },
    // 装饰元素
    {
      type: "shape",
      shape: "circle",
      fillColor: "rgba(255, 255, 255, 0.1)",
      x: "50%",
      y: "50%",
      shapeWidth: 300,
      shapeHeight: 300,
      originX: "center",
      originY: "center",
      startTime: 1,
      duration: 4,
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
          to: 180,
          duration: 3,
          startTime: 1,
          easing: "linear"
        }
      ]
    }
  ]
};

/**
 * 模板管理器
 */
export class SceneTemplateManager {
  constructor() {
    this.templates = new Map();
    this.registerDefaultTemplates();
  }

  /**
   * 注册默认模板
   */
  registerDefaultTemplates() {
    this.templates.set('title', titleSceneTemplate);
    this.templates.set('product', productSceneTemplate);
    this.templates.set('data', dataSceneTemplate);
    this.templates.set('transition', transitionSceneTemplate);
    this.templates.set('ending', endingSceneTemplate);
  }

  /**
   * 注册自定义模板
   */
  registerTemplate(templateId, template) {
    this.templates.set(templateId, template);
  }

  /**
   * 获取模板
   */
  getTemplate(templateId) {
    return this.templates.get(templateId);
  }

  /**
   * 获取所有模板
   */
  getAllTemplates() {
    return Array.from(this.templates.entries()).map(([id, template]) => ({
      id,
      name: template.name,
      elementCount: template.elements.length,
      duration: Math.max(...template.elements.map(e => (e.startTime || 0) + (e.duration || 4)))
    }));
  }

  /**
   * 从模板创建场景
   */
  createSceneFromTemplate(sceneManager, sceneId, templateId, customizations = {}) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`模板不存在: ${templateId}`);
    }

    // 应用自定义配置
    const customizedTemplate = this.applyCustomizations(template, customizations);
    
    // 创建场景
    const scene = sceneManager.createScene(sceneId, {
      name: customizedTemplate.name
    });

    // 添加元素
    scene.addElements(customizedTemplate.elements);

    return scene;
  }

  /**
   * 应用自定义配置
   */
  applyCustomizations(template, customizations) {
    const customized = JSON.parse(JSON.stringify(template));
    
    // 应用文本自定义
    if (customizations.texts) {
      customized.elements.forEach(element => {
        if (element.type === 'title' && customizations.texts[element.text]) {
          element.text = customizations.texts[element.text];
        }
      });
    }

    // 应用颜色自定义
    if (customizations.colors) {
      customized.elements.forEach(element => {
        if (customizations.colors.primary && element.textColor === '#ffffff') {
          element.textColor = customizations.colors.primary;
        }
        if (customizations.colors.secondary && element.textColor === '#4ecdc4') {
          element.textColor = customizations.colors.secondary;
        }
        if (customizations.colors.background && element.fillColor === '#1a1a2e') {
          element.fillColor = customizations.colors.background;
        }
      });
    }

    // 应用时间自定义
    if (customizations.duration) {
      customized.elements.forEach(element => {
        element.duration = customizations.duration;
      });
    }

    return customized;
  }
}

export default SceneTemplateManager;
