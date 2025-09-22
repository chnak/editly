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
    console.log(`[TransitionManager] 应用过渡效果:`, {
      type: config.type,
      easing: config.easing || 'linear',
      progress: progress.toFixed(3),
      config: config
    });
    
    // 应用缓动函数
    const easedProgress = await this.applyEasing(progress, config.easing || 'linear');
    console.log(`[TransitionManager] 缓动后进度: ${easedProgress.toFixed(3)}`);
    
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
  async applyEasing(progress, easing) {
    const { getEasingFunction } = await import('../utils/easings.js');
    const easingFunction = getEasingFunction(easing);
    return easingFunction(progress);
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
    const fromOpacity = config.from?.opacity ?? 1;
    const toOpacity = config.to?.opacity ?? 0;
    
    // 根据进度插值计算实际透明度
    const actualFromOpacity = fromOpacity + (toOpacity - fromOpacity) * (1 - progress);
    const actualToOpacity = fromOpacity + (toOpacity - fromOpacity) * progress;

    console.log(`[TransitionManager] 应用透明度过渡:`, {
      progress,
      fromOpacity,
      toOpacity,
      actualFromOpacity,
      actualToOpacity,
      fromFrame: !!fromFrame,
      toFrame: !!toFrame
    });

    // 添加 fromFrame
    if (fromFrame && actualFromOpacity > 0) {
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
        opacity: actualFromOpacity
      });
      transitionCanvas.add(fromImage);
      console.log(`[TransitionManager] 添加 fromFrame, 透明度: ${actualFromOpacity}`);
    }

    // 添加 toFrame
    if (toFrame && actualToOpacity > 0) {
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
        opacity: actualToOpacity
      });
      transitionCanvas.add(toImage);
      console.log(`[TransitionManager] 添加 toFrame, 透明度: ${actualToOpacity}`);
    }

    return await renderFabricCanvas(transitionCanvas);
  }

  /**
   * 应用位置过渡
   */
  async applyPositionTransition(progress, fromFrame, toFrame, canvas, config) {
    console.log(`[TransitionManager] 应用位置过渡:`, {
      progress,
      from: config.from,
      to: config.to,
      fromFrame: !!fromFrame,
      toFrame: !!toFrame
    });
    
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

    console.log(`[TransitionManager] 位置计算:`, {
      fromX, fromY, toX, toY,
      fromOffsetX, fromOffsetY, toOffsetX, toOffsetY
    });

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
      console.log(`[TransitionManager] 添加 fromFrame, 位置: (${fromOffsetX}, ${fromOffsetY})`);
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
      console.log(`[TransitionManager] 添加 toFrame, 位置: (${toOffsetX}, ${toOffsetY})`);
    }

    return await renderFabricCanvas(transitionCanvas);
  }

  /**
   * 应用缩放过渡
   */
  async applyScaleTransition(progress, fromFrame, toFrame, canvas, config) {
    console.log(`[TransitionManager] 应用缩放过渡:`, {
      progress,
      from: config.from,
      to: config.to,
      fromFrame: !!fromFrame,
      toFrame: !!toFrame
    });
    
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算缩放比例
    const fromScale = config.from?.scale ?? 1;
    const toScale = config.to?.scale ?? 1;
    
    // 根据进度插值计算实际缩放值
    const actualFromScale = fromScale + (toScale - fromScale) * (1 - progress);
    const actualToScale = fromScale + (toScale - fromScale) * progress;

    console.log(`[TransitionManager] 缩放计算:`, {
      fromScale, toScale, actualFromScale, actualToScale
    });

    // 添加 fromFrame
    if (fromFrame && actualFromScale > 0) {
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
        scaleX: actualFromScale,
        scaleY: actualFromScale
      });
      transitionCanvas.add(fromImage);
      console.log(`[TransitionManager] 添加 fromFrame, 缩放: ${actualFromScale}`);
    }

    // 添加 toFrame
    if (toFrame && actualToScale > 0) {
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
        scaleX: actualToScale,
        scaleY: actualToScale
      });
      transitionCanvas.add(toImage);
      console.log(`[TransitionManager] 添加 toFrame, 缩放: ${actualToScale}`);
    }

    return await renderFabricCanvas(transitionCanvas);
  }

  /**
   * 应用旋转过渡
   */
  async applyRotationTransition(progress, fromFrame, toFrame, canvas, config) {
    console.log(`[TransitionManager] 应用旋转过渡:`, {
      progress,
      from: config.from,
      to: config.to,
      fromFrame: !!fromFrame,
      toFrame: !!toFrame
    });
    
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算旋转角度
    const fromAngle = config.from?.angle ?? 0;
    const toAngle = config.to?.angle ?? 360;
    
    // 根据进度插值计算实际角度
    // 简单的连续旋转：从 fromAngle 旋转到 toAngle
    const actualAngle = fromAngle + (toAngle - fromAngle) * progress;

    console.log(`[TransitionManager] 旋转计算:`, {
      fromAngle, toAngle, actualAngle, progress
    });

    // 添加 fromFrame (前半段)
    if (fromFrame && progress < 0.5) {
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
        angle: actualAngle
      });
      transitionCanvas.add(fromImage);
      console.log(`[TransitionManager] 添加 fromFrame, 角度: ${actualAngle}`);
    }

    // 添加 toFrame (后半段)
    if (toFrame && progress >= 0.5) {
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
        angle: actualAngle
      });
      transitionCanvas.add(toImage);
      console.log(`[TransitionManager] 添加 toFrame, 角度: ${actualAngle}`);
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
    const fabric = await import('fabric/node');
    
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
    console.log(`[TransitionManager] 应用3D过渡:`, {
      progress,
      axis: config.axis ?? 'y',
      angle: config.angle ?? 180,
      fromFrame: !!fromFrame,
      toFrame: !!toFrame
    });
    
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算 3D 变换 - 使用Fabric.js支持的属性模拟3D效果
    const totalAngle = config.angle ?? 180;
    const axis = config.axis ?? 'y';
    const currentAngle = totalAngle * progress;

    console.log(`[TransitionManager] 3D变换计算:`, {
      totalAngle, currentAngle, axis, progress
    });

    // 根据进度决定显示哪个帧
    if (fromFrame && progress < 0.5) {
      // 前半段：显示 fromFrame，逐渐旋转
      const fromImage = await rgbaToFabricImage({
        width: fromFrame.width,
        height: fromFrame.height,
        rgba: fromFrame.data
      });
      
      const transform = {};
      if (axis === 'x') {
        // 模拟X轴旋转：使用skewY和scaleX
        const skewY = Math.sin(currentAngle * Math.PI / 180) * 0.5;
        const scaleX = Math.cos(currentAngle * Math.PI / 180);
        transform.skewY = skewY;
        transform.scaleX = Math.abs(scaleX);
        if (scaleX < 0) transform.flipX = true;
      } else if (axis === 'y') {
        // 模拟Y轴旋转：使用skewX和scaleY
        const skewX = Math.sin(currentAngle * Math.PI / 180) * 0.5;
        const scaleY = Math.cos(currentAngle * Math.PI / 180);
        transform.skewX = skewX;
        transform.scaleY = Math.abs(scaleY);
        if (scaleY < 0) transform.flipY = true;
      } else {
        // Z轴旋转：直接使用angle
        transform.angle = currentAngle;
      }
      
      fromImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        ...transform
      });
      transitionCanvas.add(fromImage);
      console.log(`[TransitionManager] 添加 fromFrame, 3D变换:`, transform);
    }

    if (toFrame && progress >= 0.5) {
      // 后半段：显示 toFrame，继续旋转
      const toImage = await rgbaToFabricImage({
        width: toFrame.width,
        height: toFrame.height,
        rgba: toFrame.data
      });
      
      const transform = {};
      if (axis === 'x') {
        // 模拟X轴旋转：使用skewY和scaleX
        const skewY = Math.sin(currentAngle * Math.PI / 180) * 0.5;
        const scaleX = Math.cos(currentAngle * Math.PI / 180);
        transform.skewY = skewY;
        transform.scaleX = Math.abs(scaleX);
        if (scaleX < 0) transform.flipX = true;
      } else if (axis === 'y') {
        // 模拟Y轴旋转：使用skewX和scaleY
        const skewX = Math.sin(currentAngle * Math.PI / 180) * 0.5;
        const scaleY = Math.cos(currentAngle * Math.PI / 180);
        transform.skewX = skewX;
        transform.scaleY = Math.abs(scaleY);
        if (scaleY < 0) transform.flipY = true;
      } else {
        // Z轴旋转：直接使用angle
        transform.angle = currentAngle;
      }
      
      toImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        ...transform
      });
      transitionCanvas.add(toImage);
      console.log(`[TransitionManager] 添加 toFrame, 3D变换:`, transform);
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