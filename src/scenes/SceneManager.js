import { VideoMaker } from "../index.js";
import { Transition } from "../transitions/transition.js";

/**
 * 场景管理器 - 管理多个场景的创建、切换和渲染
 */
export class SceneManager {
  constructor(config = {}) {
    this.scenes = new Map();
    this.currentScene = null;
    this.sceneTransitions = new Map();
    this.globalConfig = {
      width: config.width || 1920,
      height: config.height || 1080,
      fps: config.fps || 30,
      ...config
    };
  }

  /**
   * 创建场景
   */
  createScene(sceneId, config) {
    const scene = new Scene(sceneId, {
      ...this.globalConfig,
      ...config
    });
    
    this.scenes.set(sceneId, scene);
    return scene;
  }

  /**
   * 获取场景
   */
  getScene(sceneId) {
    return this.scenes.get(sceneId);
  }

  /**
   * 删除场景
   */
  removeScene(sceneId) {
    const scene = this.scenes.get(sceneId);
    if (scene) {
      scene.destroy();
      this.scenes.delete(sceneId);
      return true;
    }
    return false;
  }

  /**
   * 设置当前场景
   */
  setCurrentScene(sceneId) {
    if (this.scenes.has(sceneId)) {
      this.currentScene = sceneId;
      return true;
    }
    return false;
  }

  /**
   * 获取当前场景
   */
  getCurrentScene() {
    return this.currentScene ? this.scenes.get(this.currentScene) : null;
  }

  /**
   * 添加场景过渡
   */
  addSceneTransition(fromSceneId, toSceneId, transitionConfig) {
    const transitionKey = `${fromSceneId}_to_${toSceneId}`;
    this.sceneTransitions.set(transitionKey, {
      from: fromSceneId,
      to: toSceneId,
      ...transitionConfig
    });
  }

  /**
   * 获取场景过渡
   */
  getSceneTransition(fromSceneId, toSceneId) {
    const transitionKey = `${fromSceneId}_to_${toSceneId}`;
    return this.sceneTransitions.get(transitionKey);
  }

  /**
   * 渲染单个场景
   */
  async renderScene(sceneId, outputPath) {
    const scene = this.scenes.get(sceneId);
    if (!scene) {
      throw new Error(`场景不存在: ${sceneId}`);
    }

    return await scene.render(outputPath);
  }

  /**
   * 渲染所有场景为连续视频
   */
  async renderAllScenes(outputPath, options = {}) {
    const {
      includeTransitions = true,
      transitionDuration = 1.0,
      defaultTransition = 'fade'
    } = options;

    const sceneIds = Array.from(this.scenes.keys());
    if (sceneIds.length === 0) {
      throw new Error('没有可渲染的场景');
    }

    // 如果只有一个场景，直接渲染
    if (sceneIds.length === 1) {
      return await this.renderScene(sceneIds[0], outputPath);
    }

    // 创建组合场景
    const combinedElements = [];
    let currentTime = 0;

    for (let i = 0; i < sceneIds.length; i++) {
      const sceneId = sceneIds[i];
      const scene = this.scenes.get(sceneId);
      const sceneElements = scene.getElements();

      // 调整元素时间
      const adjustedElements = sceneElements.map(element => ({
        ...element,
        startTime: element.startTime + currentTime,
        endTime: element.endTime + currentTime
      }));

      combinedElements.push(...adjustedElements);

      // 添加场景过渡
      if (includeTransitions && i < sceneIds.length - 1) {
        const nextSceneId = sceneIds[i + 1];
        const transition = this.getSceneTransition(sceneId, nextSceneId) || {
          type: defaultTransition,
          duration: transitionDuration
        };

        // 添加过渡元素
        const transitionElement = this.createTransitionElement(
          currentTime + scene.getDuration() - transition.duration,
          transition.duration,
          transition
        );
        combinedElements.push(transitionElement);
      }

      currentTime += scene.getDuration();
    }

    // 创建组合视频
    const videoMaker = new VideoMaker({
      ...this.globalConfig,
      outPath: outputPath,
      elements: combinedElements
    });

    return await videoMaker.start();
  }

  /**
   * 创建过渡元素
   */
  createTransitionElement(startTime, duration, transitionConfig) {
    return {
      type: "shape",
      shape: "rectangle",
      fillColor: transitionConfig.color || "#000000",
      x: 0,
      y: 0,
      width: "100%",
      height: "100%",
      originX: "left",
      originY: "top",
      startTime: startTime,
      duration: duration,
      zIndex: 9999,
      opacity: 0,
      animations: [
        {
          property: "opacity",
          from: 0,
          to: 1,
          duration: duration / 2,
          startTime: 0,
          easing: "easeIn"
        },
        {
          property: "opacity",
          from: 1,
          to: 0,
          duration: duration / 2,
          startTime: duration / 2,
          easing: "easeOut"
        }
      ]
    };
  }

  /**
   * 获取所有场景信息
   */
  getScenesInfo() {
    const info = [];
    for (const [sceneId, scene] of this.scenes) {
      info.push({
        id: sceneId,
        name: scene.getName(),
        duration: scene.getDuration(),
        elementCount: scene.getElementCount(),
        isCurrent: sceneId === this.currentScene
      });
    }
    return info;
  }

  /**
   * 销毁所有场景
   */
  destroy() {
    for (const scene of this.scenes.values()) {
      scene.destroy();
    }
    this.scenes.clear();
    this.sceneTransitions.clear();
    this.currentScene = null;
  }
}

/**
 * 场景类 - 单个场景的封装
 */
export class Scene {
  constructor(sceneId, config) {
    this.sceneId = sceneId;
    this.config = config;
    this.elements = [];
    this.name = config.name || `场景 ${sceneId}`;
    this.duration = 0;
    this.videoMaker = null;
  }

  /**
   * 添加元素到场景
   */
  addElement(elementConfig) {
    const element = {
      ...elementConfig,
      sceneId: this.sceneId
    };
    
    this.elements.push(element);
    
    // 更新场景持续时间
    const elementEndTime = (element.startTime || 0) + (element.duration || 4);
    this.duration = Math.max(this.duration, elementEndTime);
    
    return element;
  }

  /**
   * 批量添加元素
   */
  addElements(elements) {
    elements.forEach(element => this.addElement(element));
  }

  /**
   * 移除元素
   */
  removeElement(elementIndex) {
    if (elementIndex >= 0 && elementIndex < this.elements.length) {
      this.elements.splice(elementIndex, 1);
      this.updateDuration();
      return true;
    }
    return false;
  }

  /**
   * 更新场景持续时间
   */
  updateDuration() {
    this.duration = 0;
    for (const element of this.elements) {
      const elementEndTime = (element.startTime || 0) + (element.duration || 4);
      this.duration = Math.max(this.duration, elementEndTime);
    }
  }

  /**
   * 获取元素
   */
  getElements() {
    return [...this.elements];
  }

  /**
   * 获取元素数量
   */
  getElementCount() {
    return this.elements.length;
  }

  /**
   * 获取场景持续时间
   */
  getDuration() {
    return this.duration;
  }

  /**
   * 获取场景名称
   */
  getName() {
    return this.name;
  }

  /**
   * 设置场景名称
   */
  setName(name) {
    this.name = name;
  }

  /**
   * 渲染场景
   */
  async render(outputPath) {
    this.videoMaker = new VideoMaker({
      ...this.config,
      outPath: outputPath,
      elements: this.elements
    });

    return await this.videoMaker.start();
  }

  /**
   * 预览场景（渲染前几秒）
   */
  async preview(outputPath, previewDuration = 5) {
    const previewElements = this.elements.map(element => ({
      ...element,
      duration: Math.min(element.duration || 4, previewDuration)
    }));

    const previewMaker = new VideoMaker({
      ...this.config,
      outPath: outputPath,
      elements: previewElements
    });

    return await previewMaker.start();
  }

  /**
   * 销毁场景
   */
  destroy() {
    if (this.videoMaker) {
      this.videoMaker.close();
    }
    this.elements = [];
    this.duration = 0;
  }
}

export default SceneManager;
