/**
 * 过渡效果管理器 - 简化配置版本
 * 支持通过简单配置创建各种过渡效果
 */
export class TransitionManager {
  constructor() {
    this.transitions = new Map();
    this.initializeDefaultTransitions();
  }

  /**
   * 初始化默认过渡效果
   */
  initializeDefaultTransitions() {
    // 基础过渡效果配置
    const transitionConfigs = {
      // 淡入淡出类
      fade: {
        type: 'opacity',
        from: { opacity: 1 },
        to: { opacity: 0 },
        easing: 'linear'
      },
      
      // 滑动类
      slideLeft: {
        type: 'position',
        from: { x: 0 },
        to: { x: -1 },
        easing: 'easeInOut'
      },
      slideRight: {
        type: 'position',
        from: { x: 0 },
        to: { x: 1 },
        easing: 'easeInOut'
      },
      slideUp: {
        type: 'position',
        from: { y: 0 },
        to: { y: -1 },
        easing: 'easeInOut'
      },
      slideDown: {
        type: 'position',
        from: { y: 0 },
        to: { y: 1 },
        easing: 'easeInOut'
      },
      
      // 缩放类
      zoomIn: {
        type: 'scale',
        from: { scale: 1 },
        to: { scale: 2 },
        easing: 'easeOut'
      },
      zoomOut: {
        type: 'scale',
        from: { scale: 1 },
        to: { scale: 0.5 },
        easing: 'easeIn'
      },
      
      // 旋转类
      rotateIn: {
        type: 'rotation',
        from: { angle: 0 },
        to: { angle: 360 },
        easing: 'easeInOut'
      },
      
      // 擦除类
      wipeLeft: {
        type: 'wipe',
        direction: 'left',
        easing: 'linear'
      },
      wipeRight: {
        type: 'wipe',
        direction: 'right',
        easing: 'linear'
      },
      wipeUp: {
        type: 'wipe',
        direction: 'up',
        easing: 'linear'
      },
      wipeDown: {
        type: 'wipe',
        direction: 'down',
        easing: 'linear'
      },
      
      // 溶解类
      dissolve: {
        type: 'dissolve',
        pattern: 'random',
        easing: 'linear'
      },
      
      // 3D 效果类
      flip3D: {
        type: '3d',
        axis: 'y',
        angle: 180,
        easing: 'easeInOut'
      },
      flip3DX: {
        type: '3d',
        axis: 'x',
        angle: 180,
        easing: 'easeInOut'
      },
      
      // 特殊效果类
      blur: {
        type: 'blur',
        from: { blur: 0 },
        to: { blur: 10 },
        easing: 'easeInOut'
      },
      pixelate: {
        type: 'pixelate',
        from: { pixelSize: 1 },
        to: { pixelSize: 20 },
        easing: 'easeInOut'
      }
    };

    // 注册所有默认过渡效果
    Object.entries(transitionConfigs).forEach(([name, config]) => {
      this.addTransition(name, config);
    });
  }

  /**
   * 添加过渡效果
   * @param {string} name - 过渡效果名称
   * @param {Object} config - 过渡效果配置
   */
  addTransition(name, config) {
    const transition = {
      name,
      ...config,
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applyTransition(progress, fromFrame, toFrame, canvas, config);
      }
    };
    this.transitions.set(name, transition);
  }

  /**
   * 获取过渡效果
   */
  getTransition(name) {
    return this.transitions.get(name);
  }

  /**
   * 获取所有可用的过渡效果
   */
  getAvailableTransitions() {
    return Array.from(this.transitions.keys());
  }

  /**
   * 应用过渡效果
   */
  async applyTransition(progress, fromFrame, toFrame, canvas, config) {
    // 应用缓动函数
    const easedProgress = this.applyEasing(progress, config.easing || 'linear');
    
    switch (config.type) {
      case 'opacity':
        return this.applyOpacityTransition(easedProgress, fromFrame, toFrame, canvas, config);
      case 'position':
        return this.applyPositionTransition(easedProgress, fromFrame, toFrame, canvas, config);
      case 'scale':
        return this.applyScaleTransition(easedProgress, fromFrame, toFrame, canvas, config);
      case 'rotation':
        return this.applyRotationTransition(easedProgress, fromFrame, toFrame, canvas, config);
      case 'wipe':
        return this.applyWipeTransition(easedProgress, fromFrame, toFrame, canvas, config);
      case 'dissolve':
        return this.applyDissolveTransition(easedProgress, fromFrame, toFrame, canvas, config);
      case '3d':
        return this.apply3DTransition(easedProgress, fromFrame, toFrame, canvas, config);
      case 'blur':
        return this.applyBlurTransition(easedProgress, fromFrame, toFrame, canvas, config);
      case 'pixelate':
        return this.applyPixelateTransition(easedProgress, fromFrame, toFrame, canvas, config);
      default:
        throw new Error(`未知的过渡效果类型: ${config.type}`);
    }
  }

  /**
   * 应用缓动函数
   */
  applyEasing(progress, easing) {
    switch (easing) {
      case 'linear':
        return progress;
      case 'easeIn':
        return progress * progress;
      case 'easeOut':
        return 1 - Math.pow(1 - progress, 2);
      case 'easeInOut':
        return progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'bounce':
        return this.bounceEasing(progress);
      case 'elastic':
        return this.elasticEasing(progress);
      default:
        return progress;
    }
  }

  /**
   * 弹跳缓动
   */
  bounceEasing(progress) {
    if (progress < 1 / 2.75) {
      return 7.5625 * progress * progress;
    } else if (progress < 2 / 2.75) {
      return 7.5625 * (progress -= 1.5 / 2.75) * progress + 0.75;
    } else if (progress < 2.5 / 2.75) {
      return 7.5625 * (progress -= 2.25 / 2.75) * progress + 0.9375;
    } else {
      return 7.5625 * (progress -= 2.625 / 2.75) * progress + 0.984375;
    }
  }

  /**
   * 弹性缓动
   */
  elasticEasing(progress) {
    if (progress === 0 || progress === 1) return progress;
    return Math.pow(2, -10 * progress) * Math.sin((progress - 0.1) * 5 * Math.PI) + 1;
  }

  /**
   * 应用透明度过渡
   */
  async applyOpacityTransition(progress, fromFrame, toFrame, canvas, config) {
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算透明度
    const fromOpacity = config.from?.opacity ?? (1 - progress);
    const toOpacity = config.to?.opacity ?? progress;

    // 添加 fromFrame
    if (fromFrame && fromOpacity > 0) {
      const fromImage = await rgbaToFabricImage({
        width: fromFrame.width,
        height: fromFrame.height,
        rgba: fromFrame.data
      });
      fromImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        opacity: fromOpacity
      });
      transitionCanvas.add(fromImage);
    }

    // 添加 toFrame
    if (toFrame && toOpacity > 0) {
      const toImage = await rgbaToFabricImage({
        width: toFrame.width,
        height: toFrame.height,
        rgba: toFrame.data
      });
      toImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        opacity: toOpacity
      });
      transitionCanvas.add(toImage);
    }

    return await renderFabricCanvas(transitionCanvas);
  }

  /**
   * 应用位置过渡
   */
  async applyPositionTransition(progress, fromFrame, toFrame, canvas, config) {
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算位置偏移
    const fromX = (config.from?.x ?? 0) * canvasWidth;
    const fromY = (config.from?.y ?? 0) * canvasHeight;
    const toX = (config.to?.x ?? 0) * canvasWidth;
    const toY = (config.to?.y ?? 0) * canvasHeight;

    const fromOffsetX = fromX + (toX - fromX) * (1 - progress);
    const fromOffsetY = fromY + (toY - fromY) * (1 - progress);
    const toOffsetX = fromX + (toX - fromX) * progress;
    const toOffsetY = fromY + (toY - fromY) * progress;

    // 添加 fromFrame
    if (fromFrame) {
      const fromImage = await rgbaToFabricImage({
        width: fromFrame.width,
        height: fromFrame.height,
        rgba: fromFrame.data
      });
      fromImage.set({
        left: canvasWidth / 2 + fromOffsetX,
        top: canvasHeight / 2 + fromOffsetY,
        originX: 'center',
        originY: 'center'
      });
      transitionCanvas.add(fromImage);
    }

    // 添加 toFrame
    if (toFrame) {
      const toImage = await rgbaToFabricImage({
        width: toFrame.width,
        height: toFrame.height,
        rgba: toFrame.data
      });
      toImage.set({
        left: canvasWidth / 2 + toOffsetX,
        top: canvasHeight / 2 + toOffsetY,
        originX: 'center',
        originY: 'center'
      });
      transitionCanvas.add(toImage);
    }

    return await renderFabricCanvas(transitionCanvas);
  }

  /**
   * 应用缩放过渡
   */
  async applyScaleTransition(progress, fromFrame, toFrame, canvas, config) {
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算缩放比例
    const fromScale = config.from?.scale ?? (1 - progress);
    const toScale = config.to?.scale ?? progress;

    // 添加 fromFrame
    if (fromFrame && fromScale > 0) {
      const fromImage = await rgbaToFabricImage({
        width: fromFrame.width,
        height: fromFrame.height,
        rgba: fromFrame.data
      });
      fromImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        scaleX: fromScale,
        scaleY: fromScale
      });
      transitionCanvas.add(fromImage);
    }

    // 添加 toFrame
    if (toFrame && toScale > 0) {
      const toImage = await rgbaToFabricImage({
        width: toFrame.width,
        height: toFrame.height,
        rgba: toFrame.data
      });
      toImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        scaleX: toScale,
        scaleY: toScale
      });
      transitionCanvas.add(toImage);
    }

    return await renderFabricCanvas(transitionCanvas);
  }

  /**
   * 应用旋转过渡
   */
  async applyRotationTransition(progress, fromFrame, toFrame, canvas, config) {
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算旋转角度
    const fromAngle = (config.from?.angle ?? 0) + (config.to?.angle ?? 360) * (1 - progress);
    const toAngle = (config.from?.angle ?? 0) + (config.to?.angle ?? 360) * progress;

    // 添加 fromFrame
    if (fromFrame) {
      const fromImage = await rgbaToFabricImage({
        width: fromFrame.width,
        height: fromFrame.height,
        rgba: fromFrame.data
      });
      fromImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        angle: fromAngle
      });
      transitionCanvas.add(fromImage);
    }

    // 添加 toFrame
    if (toFrame) {
      const toImage = await rgbaToFabricImage({
        width: toFrame.width,
        height: toFrame.height,
        rgba: toFrame.data
      });
      toImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        angle: toAngle
      });
      transitionCanvas.add(toImage);
    }

    return await renderFabricCanvas(transitionCanvas);
  }

  /**
   * 应用擦除过渡
   */
  async applyWipeTransition(progress, fromFrame, toFrame, canvas, config) {
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算擦除位置
    let wipePosition;
    switch (config.direction) {
      case 'left':
        wipePosition = canvasWidth * progress;
        break;
      case 'right':
        wipePosition = canvasWidth * (1 - progress);
        break;
      case 'up':
        wipePosition = canvasHeight * progress;
        break;
      case 'down':
        wipePosition = canvasHeight * (1 - progress);
        break;
    }

    // 添加 fromFrame
    if (fromFrame) {
      const fromImage = await rgbaToFabricImage({
        width: fromFrame.width,
        height: fromFrame.height,
        rgba: fromFrame.data
      });
      fromImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center'
      });
      
      // 应用裁剪
      await this.applyWipeClip(fromImage, config.direction, wipePosition, canvasWidth, canvasHeight);
      transitionCanvas.add(fromImage);
    }

    // 添加 toFrame
    if (toFrame) {
      const toImage = await rgbaToFabricImage({
        width: toFrame.width,
        height: toFrame.height,
        rgba: toFrame.data
      });
      toImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center'
      });
      
      // 应用裁剪
      await this.applyWipeClip(toImage, config.direction, wipePosition, canvasWidth, canvasHeight, true);
      transitionCanvas.add(toImage);
    }

    return await renderFabricCanvas(transitionCanvas);
  }

  /**
   * 应用擦除裁剪
   */
  async applyWipeClip(image, direction, position, canvasWidth, canvasHeight, isToFrame = false) {
    const { fabric } = await import('fabric');
    
    let clipRect;
    switch (direction) {
      case 'left':
        clipRect = new fabric.Rect({
          left: isToFrame ? 0 : position,
          top: 0,
          width: isToFrame ? position : canvasWidth - position,
          height: canvasHeight
        });
        break;
      case 'right':
        clipRect = new fabric.Rect({
          left: isToFrame ? position : 0,
          top: 0,
          width: isToFrame ? canvasWidth - position : position,
          height: canvasHeight
        });
        break;
      case 'up':
        clipRect = new fabric.Rect({
          left: 0,
          top: isToFrame ? 0 : position,
          width: canvasWidth,
          height: isToFrame ? position : canvasHeight - position
        });
        break;
      case 'down':
        clipRect = new fabric.Rect({
          left: 0,
          top: isToFrame ? position : 0,
          width: canvasWidth,
          height: isToFrame ? canvasHeight - position : position
        });
        break;
    }
    
    if (clipRect) {
      image.set('clipPath', clipRect);
    }
  }

  /**
   * 应用溶解过渡
   */
  async applyDissolveTransition(progress, fromFrame, toFrame, canvas, config) {
    // 溶解效果类似于淡入淡出，但使用随机模式
    return this.applyOpacityTransition(progress, fromFrame, toFrame, canvas, {
      from: { opacity: 1 - progress },
      to: { opacity: progress }
    });
  }

  /**
   * 应用 3D 过渡
   */
  async apply3DTransition(progress, fromFrame, toFrame, canvas, config) {
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算 3D 变换
    const angle = (config.angle ?? 180) * progress;
    const axis = config.axis ?? 'y';

    // 添加 fromFrame
    if (fromFrame && progress < 0.5) {
      const fromImage = await rgbaToFabricImage({
        width: fromFrame.width,
        height: fromFrame.height,
        rgba: fromFrame.data
      });
      
      const transform = {};
      if (axis === 'x') {
        transform.rotationX = angle;
      } else if (axis === 'y') {
        transform.rotationY = angle;
      } else {
        transform.rotationZ = angle;
      }
      
      fromImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        ...transform
      });
      transitionCanvas.add(fromImage);
    }

    // 添加 toFrame
    if (toFrame && progress >= 0.5) {
      const toImage = await rgbaToFabricImage({
        width: toFrame.width,
        height: toFrame.height,
        rgba: toFrame.data
      });
      
      const transform = {};
      if (axis === 'x') {
        transform.rotationX = angle - (config.angle ?? 180);
      } else if (axis === 'y') {
        transform.rotationY = angle - (config.angle ?? 180);
      } else {
        transform.rotationZ = angle - (config.angle ?? 180);
      }
      
      toImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        ...transform
      });
      transitionCanvas.add(toImage);
    }

    return await renderFabricCanvas(transitionCanvas);
  }

  /**
   * 应用模糊过渡
   */
  async applyBlurTransition(progress, fromFrame, toFrame, canvas, config) {
    // 模糊效果需要特殊处理，这里先使用透明度过渡
    return this.applyOpacityTransition(progress, fromFrame, toFrame, canvas, {
      from: { opacity: 1 - progress },
      to: { opacity: progress }
    });
  }

  /**
   * 应用像素化过渡
   */
  async applyPixelateTransition(progress, fromFrame, toFrame, canvas, config) {
    // 像素化效果需要特殊处理，这里先使用透明度过渡
    return this.applyOpacityTransition(progress, fromFrame, toFrame, canvas, {
      from: { opacity: 1 - progress },
      to: { opacity: progress }
    });
  }
}

// 导出默认实例
export const transitionManager = new TransitionManager();