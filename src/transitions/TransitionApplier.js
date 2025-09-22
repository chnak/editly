import { transitionManager } from './TransitionManager.js';

/**
 * 过渡效果应用器
 * 负责在元素之间应用过渡效果
 */
export class TransitionApplier {
  constructor() {
    this.transitionManager = transitionManager;
  }

  /**
   * 应用过渡效果
   * @param {string} transitionName 过渡效果名称
   * @param {number} progress 过渡进度 (0-1)
   * @param {Object} fromFrame 起始帧数据
   * @param {Object} toFrame 结束帧数据
   * @param {Object} canvas 画布对象
   * @returns {Promise<Object>} 过渡后的帧数据
   */
  async applyTransition(transitionName, progress, fromFrame, toFrame, canvas) {
    const transition = this.transitionManager.getTransition(transitionName);
    
    if (!transition) {
      throw new Error(`过渡效果 "${transitionName}" 不存在`);
    }

    // 确保进度在 0-1 范围内
    const clampedProgress = Math.max(0, Math.min(1, progress));

    try {
      const result = await transition.apply(clampedProgress, fromFrame, toFrame, canvas);
      return result;
    } catch (error) {
      console.error(`应用过渡效果 "${transitionName}" 失败:`, error);
      throw error;
    }
  }

  /**
   * 检查过渡效果是否存在
   * @param {string} transitionName 过渡效果名称
   * @returns {boolean} 是否存在
   */
  hasTransition(transitionName) {
    return this.transitionManager.getTransition(transitionName) !== undefined;
  }

  /**
   * 获取所有可用的过渡效果
   * @returns {Array<string>} 过渡效果名称列表
   */
  getAvailableTransitions() {
    return this.transitionManager.getAvailableTransitions();
  }

  /**
   * 创建自定义过渡效果
   * @param {string} name 过渡效果名称
   * @param {Object} config 过渡效果配置
   */
  createCustomTransition(name, config) {
    this.transitionManager.addTransition(name, config);
  }
}

// 导出默认实例
export const transitionApplier = new TransitionApplier();
