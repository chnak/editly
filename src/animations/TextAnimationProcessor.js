/**
 * 文本动画处理器 - 专门处理文本相关的复杂动画效果
 */
export class TextAnimationProcessor {
  constructor() {
    this.animationManager = null;
  }

  /**
   * 设置动画管理器
   * @param {AnimationManager} manager 动画管理器实例
   */
  setAnimationManager(manager) {
    this.animationManager = manager;
  }

  /**
   * 创建文本缩放动画参数
   * @param {Object} config 配置参数
   * @returns {Object} 缩放参数
   */
  createZoomAnimation(config) {
    const { progress, zoomDirection, zoomAmount } = config;
    
    if (zoomDirection === "in") {
      return {
        scaleX: 1 + (progress * zoomAmount),
        scaleY: 1 + (progress * zoomAmount)
      };
    } else {
      return {
        scaleX: 1 + ((1 - progress) * zoomAmount),
        scaleY: 1 + ((1 - progress) * zoomAmount)
      };
    }
  }

  /**
   * 创建文本位移动画参数
   * @param {Object} config 配置参数
   * @returns {Object} 位移参数
   */
  createTranslateAnimation(config) {
    const { progress, zoomDirection, zoomAmount } = config;
    
    if (zoomDirection === "in") {
      return {
        translateX: progress * zoomAmount * 50,
        translateY: 0
      };
    } else {
      return {
        translateX: (1 - progress) * zoomAmount * 50,
        translateY: 0
      };
    }
  }

  /**
   * 创建文本分割动画
   * @param {Object} config 配置参数
   * @returns {Array} 分割后的文本片段数组
   */
  createSplitAnimation(config) {
    const { 
      text, 
      splitType, 
      splitDelay, 
      splitDuration, 
      progress,
      fontSize,
      textColor,
      fontFamily
    } = config;

    if (!splitType) return [];

    const segments = this.splitText(text, splitType);
    
    return segments.map((segment, index) => {
      const segmentProgress = Math.max(0, Math.min(1, 
        (progress - index * splitDelay) / splitDuration
      ));
      
      return {
        text: segment,
        index,
        progress: segmentProgress,
        startTime: index * splitDelay,
        endTime: index * splitDelay + splitDuration,
        opacity: segmentProgress,
        scaleX: segmentProgress,
        scaleY: segmentProgress
      };
    });
  }

  /**
   * 创建打字机动画
   * @param {Object} config 配置参数
   * @returns {Object} 打字机动画结果
   */
  createTypewriterAnimation(config) {
    const { 
      text, 
      progress, 
      charDelay = 0.05,
      fontSize,
      textColor,
      fontFamily
    } = config;

    const totalChars = text.length;
    const totalDuration = totalChars * charDelay;
    const currentTime = progress * totalDuration;
    const visibleChars = Math.floor(currentTime / charDelay);
    
    const visibleText = text.substring(0, Math.min(visibleChars, totalChars));
    const remainingText = text.substring(visibleChars);
    
    return {
      visibleText,
      remainingText,
      progress: Math.min(visibleChars / totalChars, 1),
      isComplete: visibleChars >= totalChars
    };
  }

  /**
   * 创建擦除动画
   * @param {Object} config 配置参数
   * @returns {Object} 擦除动画结果
   */
  createWipeAnimation(config) {
    const { 
      text, 
      progress, 
      wipeDirection = 'left',
      fontSize,
      textColor,
      fontFamily
    } = config;

    const wipeProgress = Math.max(0, Math.min(progress, 1));
    
    return {
      text,
      wipeProgress,
      wipeDirection,
      opacity: wipeProgress,
      clipX: wipeDirection === 'left' ? 0 : (1 - wipeProgress) * 100,
      clipY: wipeDirection === 'top' ? 0 : (1 - wipeProgress) * 100,
      clipWidth: wipeDirection === 'left' || wipeDirection === 'right' ? wipeProgress * 100 : 100,
      clipHeight: wipeDirection === 'top' || wipeDirection === 'bottom' ? wipeProgress * 100 : 100
    };
  }

  /**
   * 分割文本
   * @param {string} text 要分割的文本
   * @param {string} splitType 分割类型
   * @returns {Array} 分割后的文本数组
   */
  splitText(text, splitType) {
    if (!splitType) return [text];
    
    if (splitType === 'word') {
      // 按词分割（支持中英文）
      const chineseRegex = /[\u4e00-\u9fff]/;
      if (chineseRegex.test(text)) {
        // 包含中文，按字符分割
        return text.split('').filter(char => char.trim());
      } else {
        // 纯英文，按单词分割
        return text.split(/\s+/).filter(word => word.trim());
      }
    } else if (splitType === 'line') {
      // 按行分割
      return text.split('\n').filter(item => item.trim());
    }
    return [text];
  }

  /**
   * 应用文本动画到Fabric对象
   * @param {Object} fabricObject Fabric对象
   * @param {Object} animationResult 动画结果
   * @param {Object} position 位置信息
   */
  applyAnimationToFabricObject(fabricObject, animationResult, position) {
    const props = {
      left: position.left + (animationResult.translateX || 0),
      top: position.top + (animationResult.translateY || 0),
      scaleX: animationResult.scaleX || 1,
      scaleY: animationResult.scaleY || 1,
      opacity: animationResult.opacity || 1,
      originX: "center",
      originY: "center"
    };

    fabricObject.set(props);
  }

  /**
   * 创建组合动画（缩放+位移）
   * @param {Object} config 配置参数
   * @returns {Object} 组合动画结果
   */
  createCombinedAnimation(config) {
    const zoomResult = this.createZoomAnimation(config);
    const translateResult = this.createTranslateAnimation(config);
    
    return {
      ...zoomResult,
      ...translateResult,
      opacity: 1
    };
  }

  /**
   * 获取文本动画预设
   * @param {string} presetName 预设名称
   * @param {Object} options 选项
   * @returns {Object} 动画配置
   */
  getTextAnimationPreset(presetName, options = {}) {
    if (!this.animationManager) {
      throw new Error('动画管理器未设置');
    }

    const preset = this.animationManager.presets.get(presetName);
    if (!preset) {
      throw new Error(`文本动画预设 "${presetName}" 不存在`);
    }

    return {
      ...preset,
      ...options
    };
  }

  /**
   * 处理文本动画
   * @param {string} animationType 动画类型
   * @param {Object} config 配置参数
   * @returns {Object} 动画结果
   */
  processTextAnimation(animationType, config) {
    switch (animationType) {
      case 'textZoom':
        return this.createZoomAnimation(config);
      
      case 'textTranslate':
        return this.createTranslateAnimation(config);
      
      case 'textSplit':
        return this.createSplitAnimation(config);
      
      case 'textTypewriter':
        return this.createTypewriterAnimation(config);
      
      case 'textWipe':
        return this.createWipeAnimation(config);
      
      case 'textCombined':
        return this.createCombinedAnimation(config);
      
      default:
        throw new Error(`未知的文本动画类型: ${animationType}`);
    }
  }
}

// 导出默认实例
export const textAnimationProcessor = new TextAnimationProcessor();
