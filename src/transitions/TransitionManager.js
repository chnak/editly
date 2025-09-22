/**
 * 过渡效果管理器
 * 支持多种过渡效果类型
 */
export class TransitionManager {
  constructor() {
    this.transitions = new Map();
    this.initializeTransitions();
  }

  /**
   * 初始化所有过渡效果
   */
  initializeTransitions() {
    // 淡入淡出效果
    this.addTransition('fade', {
      name: 'fade',
      duration: 1.0,
      type: 'opacity',
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applyFadeTransition(progress, fromFrame, toFrame, canvas);
      }
    });

    // 滑动效果
    this.addTransition('slideLeft', {
      name: 'slideLeft',
      duration: 1.0,
      type: 'position',
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applySlideTransition(progress, fromFrame, toFrame, canvas, 'left');
      }
    });

    this.addTransition('slideRight', {
      name: 'slideRight',
      duration: 1.0,
      type: 'position',
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applySlideTransition(progress, fromFrame, toFrame, canvas, 'right');
      }
    });

    this.addTransition('slideUp', {
      name: 'slideUp',
      duration: 1.0,
      type: 'position',
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applySlideTransition(progress, fromFrame, toFrame, canvas, 'up');
      }
    });

    this.addTransition('slideDown', {
      name: 'slideDown',
      duration: 1.0,
      type: 'position',
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applySlideTransition(progress, fromFrame, toFrame, canvas, 'down');
      }
    });

    // 缩放效果
    this.addTransition('zoomIn', {
      name: 'zoomIn',
      duration: 1.0,
      type: 'scale',
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applyZoomTransition(progress, fromFrame, toFrame, canvas, 'in');
      }
    });

    this.addTransition('zoomOut', {
      name: 'zoomOut',
      duration: 1.0,
      type: 'scale',
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applyZoomTransition(progress, fromFrame, toFrame, canvas, 'out');
      }
    });

    // 旋转效果
    this.addTransition('rotateIn', {
      name: 'rotateIn',
      duration: 1.0,
      type: 'rotation',
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applyRotateTransition(progress, fromFrame, toFrame, canvas);
      }
    });

    // 擦除效果
    this.addTransition('wipeLeft', {
      name: 'wipeLeft',
      duration: 1.0,
      type: 'wipe',
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applyWipeTransition(progress, fromFrame, toFrame, canvas, 'left');
      }
    });

    this.addTransition('wipeRight', {
      name: 'wipeRight',
      duration: 1.0,
      type: 'wipe',
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applyWipeTransition(progress, fromFrame, toFrame, canvas, 'right');
      }
    });

    // 溶解效果
    this.addTransition('dissolve', {
      name: 'dissolve',
      duration: 1.0,
      type: 'dissolve',
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applyDissolveTransition(progress, fromFrame, toFrame, canvas);
      }
    });

    // 3D 翻转效果
    this.addTransition('flip3D', {
      name: 'flip3D',
      duration: 1.0,
      type: '3d',
      apply: (progress, fromFrame, toFrame, canvas) => {
        return this.applyFlip3DTransition(progress, fromFrame, toFrame, canvas);
      }
    });
  }

  /**
   * 添加过渡效果
   */
  addTransition(name, config) {
    this.transitions.set(name, config);
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
   * 应用淡入淡出过渡
   */
  async applyFadeTransition(progress, fromFrame, toFrame, canvas) {
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    // 创建过渡画布
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算透明度
    const fromOpacity = 1 - progress;
    const toOpacity = progress;

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
   * 应用滑动过渡
   */
  async applySlideTransition(progress, fromFrame, toFrame, canvas, direction) {
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算位置偏移
    let fromOffsetX = 0, fromOffsetY = 0;
    let toOffsetX = 0, toOffsetY = 0;

    switch (direction) {
      case 'left':
        fromOffsetX = -canvasWidth * (1 - progress);
        toOffsetX = canvasWidth * (1 - progress);
        break;
      case 'right':
        fromOffsetX = canvasWidth * (1 - progress);
        toOffsetX = -canvasWidth * (1 - progress);
        break;
      case 'up':
        fromOffsetY = -canvasHeight * (1 - progress);
        toOffsetY = canvasHeight * (1 - progress);
        break;
      case 'down':
        fromOffsetY = canvasHeight * (1 - progress);
        toOffsetY = -canvasHeight * (1 - progress);
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
  async applyZoomTransition(progress, fromFrame, toFrame, canvas, type) {
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算缩放比例
    let fromScale, toScale;
    if (type === 'in') {
      fromScale = 1 + progress;
      toScale = progress;
    } else {
      fromScale = 1 - progress;
      toScale = 1 + progress;
    }

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
  async applyRotateTransition(progress, fromFrame, toFrame, canvas) {
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算旋转角度
    const fromRotation = -180 * (1 - progress);
    const toRotation = 180 * (1 - progress);

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
        angle: fromRotation
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
        angle: toRotation
      });
      transitionCanvas.add(toImage);
    }

    return await renderFabricCanvas(transitionCanvas);
  }

  /**
   * 应用擦除过渡
   */
  async applyWipeTransition(progress, fromFrame, toFrame, canvas, direction) {
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
    switch (direction) {
      case 'left':
        wipePosition = canvasWidth * progress;
        break;
      case 'right':
        wipePosition = canvasWidth * (1 - progress);
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
      if (direction === 'left') {
        fromImage.set('clipPath', new fabric.Rect({
          left: wipePosition,
          top: 0,
          width: canvasWidth - wipePosition,
          height: canvasHeight
        }));
      } else if (direction === 'right') {
        fromImage.set('clipPath', new fabric.Rect({
          left: 0,
          top: 0,
          width: wipePosition,
          height: canvasHeight
        }));
      }
      
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
      if (direction === 'left') {
        toImage.set('clipPath', new fabric.Rect({
          left: 0,
          top: 0,
          width: wipePosition,
          height: canvasHeight
        }));
      } else if (direction === 'right') {
        toImage.set('clipPath', new fabric.Rect({
          left: wipePosition,
          top: 0,
          width: canvasWidth - wipePosition,
          height: canvasHeight
        }));
      }
      
      transitionCanvas.add(toImage);
    }

    return await renderFabricCanvas(transitionCanvas);
  }

  /**
   * 应用溶解过渡
   */
  async applyDissolveTransition(progress, fromFrame, toFrame, canvas) {
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

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
        opacity: 1 - progress
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
        opacity: progress
      });
      transitionCanvas.add(toImage);
    }

    return await renderFabricCanvas(transitionCanvas);
  }

  /**
   * 应用 3D 翻转过渡
   */
  async applyFlip3DTransition(progress, fromFrame, toFrame, canvas) {
    const { createFabricCanvas, renderFabricCanvas } = await import('../canvas/fabric.js');
    const { rgbaToFabricImage } = await import('../utils/fabricUtils.js');
    
    const canvasWidth = canvas.width || 1280;
    const canvasHeight = canvas.height || 720;
    
    const transitionCanvas = createFabricCanvas({
      width: canvasWidth,
      height: canvasHeight
    });

    // 计算 3D 变换
    const rotationY = 90 * progress;
    const fromRotationY = rotationY;
    const toRotationY = rotationY - 90;

    // 添加 fromFrame
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
        rotationY: fromRotationY
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
      toImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        rotationY: toRotationY
      });
      transitionCanvas.add(toImage);
    }

    return await renderFabricCanvas(transitionCanvas);
  }
}

// 导出默认实例
export const transitionManager = new TransitionManager();
