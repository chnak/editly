import { animationManager } from '../animations/AnimationManager.js';
import { getPositionProps, parsePositionValue } from '../utils/positionUtils.js';

/**
 * 元素基类 - 所有视频元素的基类
 */
export class BaseElement {
  constructor(config) {
    this.type = config.type;
    this.startTime = config.startTime || 0;
    this.duration = config.duration || 4;
    this.endTime = config.endTime || this.startTime + this.duration;
    this.canvasWidth = config.canvasWidth || 1920;
    this.canvasHeight = config.canvasHeight || 1080;
    this.fps = config.fps || 30;
    // 变换属性
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.scaleX = config.scaleX || 1;
    this.scaleY = config.scaleY || 1;
    this.rotation = config.rotation || 0;
    this.opacity = config.opacity || 1;
    this.zIndex = config.zIndex || 0;
    
    // 位置属性
    this.position = config.position || 'center';
    this.originX = config.originX || 'center';
    this.originY = config.originY || 'center';
    
    // 3D变换属性
    this.rotationX = config.rotationX || 0;
    this.rotationY = config.rotationY || 0;
    this.rotationZ = config.rotation || 0;
    this.translateZ = config.translateZ || 0;
    
    // 动画属性
    this.animations = [];
    this.animationManager = animationManager;
    
    // 处理动画配置
    this.processAnimations(config.animations || []);
    
    // 内部状态
    this.isInitialized = false;
  }

  /**
   * 初始化元素
   */
  async initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;
  }

  /**
   * 读取下一帧 - 子类必须实现
   */
  async readNextFrame(time, canvas) {
    throw new Error('readNextFrame 方法必须在子类中实现');
  }

  /**
   * 关闭元素 - 子类可以重写
   */
  async close() {
    // 默认实现为空
  }

  /**
   * 处理动画配置
   * @param {Array} animations 动画配置数组
   */
  processAnimations(animations) {
    animations.forEach(animConfig => {
      let animation;
      
      if (typeof animConfig === 'string') {
        // 如果是字符串，当作预设动画处理
        animation = this.animationManager.applyPreset(animConfig);
      } else if (animConfig.type) {
        // 如果是 { type: "rotateIn" } 格式，当作预设动画处理
        animation = this.animationManager.applyPreset(animConfig.type, animConfig);
      } else if (animConfig.preset) {
        // 如果是预设动画配置
        animation = this.animationManager.applyPreset(animConfig.preset, animConfig);
      } else if (animConfig.keyframes) {
        // 如果是关键帧动画
        animation = this.animationManager.createKeyframeAnimation(animConfig);
      } else {
        // 普通动画配置
        animation = this.animationManager.createAnimation(animConfig);
      }
      
      // 设置动画的开始时间为元素的开始时间
      animation.startTime = this.startTime;
      this.animations.push(animation);
      
      // 为缩放动画自动添加Y轴
      if (animation.property === 'scaleX' && (animConfig === 'zoomIn' || animConfig === 'zoomOut' || 
          (animConfig.type && (animConfig.type === 'zoomIn' || animConfig.type === 'zoomOut')))) {
        const yAnimation = this.animationManager.createAnimation({
          property: 'scaleY',
          from: animation.from,
          to: animation.to,
          duration: animation.duration,
          easing: animation.easing,
          startTime: animation.startTime
        });
        this.animations.push(yAnimation);
      }
    });
  }

  /**
   * 添加动画
   * @param {Object|string} animation 动画配置或预设名称
   */
  addAnimation(animation) {
    if (typeof animation === 'string') {
      const anim = this.animationManager.applyPreset(animation);
      this.animations.push(anim);
    } else {
      const anim = this.animationManager.createAnimation(animation);
      this.animations.push(anim);
    }
  }

  /**
   * 移除动画
   * @param {string} animationId 动画ID
   */
  removeAnimation(animationId) {
    this.animations = this.animations.filter(anim => anim.id !== animationId);
  }

  /**
   * 计算当前时间的变换属性
   */
  getTransformAtTime(time) {
    const progress = this.getProgressAtTime(time);
    
    let x = this.x;
    let y = this.y;
    let scaleX = this.scaleX;
    let scaleY = this.scaleY;
    let rotation = this.rotation;
    let opacity = this.opacity;
    let rotationX = this.rotationX;
    let rotationY = this.rotationY;
    let rotationZ = this.rotationZ;
    let translateZ = this.translateZ;

    // 应用动画
    for (const animation of this.animations) {
      const animValue = animation.getValueAtTime(time);
      
      
      if (animValue !== null) {
        
        switch (animation.property) {
          case 'x':
            x = animation.isOffset ? this.x + animValue : animValue;
            break;
          case 'y':
            y = animation.isOffset ? this.y + animValue : animValue;
            break;
          case 'scaleX':
            scaleX = animValue;
            break;
          case 'scaleY':
            scaleY = animValue;
            break;
          case 'rotation':
          case 'rotationZ':
            rotation = rotationZ = animValue;
            break;
          case 'rotationX':
            rotationX = animValue;
            break;
          case 'rotationY':
            rotationY = animValue;
            break;
          case 'opacity':
            opacity = animValue;
            break;
          case 'translateZ':
            translateZ = animValue;
            break;
        }
      }
    }

    return { 
      x, y, scaleX, scaleY, rotation, opacity,
      rotationX, rotationY, rotationZ, translateZ
    };
  }

  /**
   * 获取元素在当前时间的进度 (0-1)
   */
  getProgressAtTime(time) {
    const elementTime = time - this.startTime;
    return Math.max(0, Math.min(elementTime / this.duration, 1));
  }

  /**
   * 获取动画在当前时间的进度
   */
  getAnimationProgress(time, animation) {
    const animStartTime = this.startTime + (animation.startTime || 0);
    const animDuration = animation.duration || 1; // 使用动画的默认时长1秒，而不是元素时长
    const animEndTime = animStartTime + animDuration;
    
    if (time < animStartTime || time > animEndTime) {
      return -1; // 动画未开始或已结束
    }
    
    return (time - animStartTime) / animDuration;
  }

  /**
   * 线性插值
   */
  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /**
   * 缓动函数
   */
  ease(t, type) {
    switch (type) {
      case 'easeIn':
        return t * t;
      case 'easeOut':
        return 1 - (1 - t) * (1 - t);
      case 'easeInOut':
        return t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
      case 'linear':
      default:
        return t;
    }
  }

  /**
   * 获取解析后的位置属性
   * @param {Object} options - 位置选项
   * @returns {Object} 位置属性 { left, top, originX, originY }
   */
  getPositionProps(options = {}) {
    const {
      position = this.position,
      x = this.x,
      y = this.y,
      originX = this.originX,
      originY = this.originY
    } = options;

    return getPositionProps({
      position,
      x,
      y,
      width: this.canvasWidth,
      height: this.canvasHeight,
      originX,
      originY
    });
  }

  /**
   * 解析位置值，支持多种单位
   * @param {string|number} value - 位置值
   * @param {string} dimension - 维度 ('width' 或 'height')
   * @returns {number} 解析后的像素值
   */
  parsePositionValue(value, dimension = 'width') {
    const containerSize = dimension === 'width' ? this.canvasWidth : this.canvasHeight;
    return parsePositionValue(value, containerSize);
  }

  /**
   * 将变换信息应用到 frameData
   * @param {Object} frameData - 原始帧数据
   * @param {Object} transform - 变换信息
   * @returns {Object} 应用变换后的帧数据
   */
  applyTransformToFrameData(frameData, transform) {
    if (!frameData) return null;

    // 获取位置属性
    const positionProps = this.getPositionProps();
    
    // 如果 frameData 已经包含了位置信息（如分割文本），则使用原有的位置
    // 否则使用计算出的位置
    const finalX = frameData.x !== undefined ? frameData.x : positionProps.left;
    const finalY = frameData.y !== undefined ? frameData.y : positionProps.top;
    const finalOriginX = frameData.originX !== undefined ? frameData.originX : positionProps.originX;
    const finalOriginY = frameData.originY !== undefined ? frameData.originY : positionProps.originY;
    
    // 应用变换信息
    return {
      ...frameData,
      x: finalX,
      y: finalY,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
      rotation: transform.rotation,
      opacity: transform.opacity,
      rotationX: transform.rotationX,
      rotationY: transform.rotationY,
      translateZ: transform.translateZ,
      originX: finalOriginX,
      originY: finalOriginY
    };
  }

  /**
   * 将变换信息应用到 Fabric 对象
   * @param {Object} fabricObject - Fabric 对象
   * @param {Object} transform - 变换信息
   * @returns {Object} 应用变换后的 Fabric 对象
   */
  applyTransformToFabricObject(fabricObject, transform) {
    if (!fabricObject || !fabricObject.set) return fabricObject;

    // 获取位置属性
    const positionProps = this.getPositionProps();
    
    // 应用变换信息
    fabricObject.set({
      left: positionProps.left,
      top: positionProps.top,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
      angle: transform.rotation,
      opacity: transform.opacity,
      rotationX: transform.rotationX,
      rotationY: transform.rotationY,
      translateZ: transform.translateZ,
      originX: positionProps.originX,
      originY: positionProps.originY
    });

    return fabricObject;
  }

  /**
   * 将变换信息应用到 contain-blur 效果的背景图像
   * @param {Object} backgroundData - 背景数据
   * @param {Object} transform - 变换信息
   * @returns {Object} 应用变换后的背景数据
   */
  applyTransformToContainBlurBackground(backgroundData, transform) {
    if (!backgroundData) return null;

    // 获取位置属性
    const positionProps = this.getPositionProps();
    
    return {
      ...backgroundData,
      x: positionProps.left,
      y: positionProps.top,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
      rotation: transform.rotation,
      opacity: transform.opacity,
      originX: positionProps.originX,
      originY: positionProps.originY
    };
  }

  /**
   * 将变换信息应用到 contain-blur 效果的前景图像
   * @param {Object} foregroundData - 前景数据
   * @param {Object} transform - 变换信息
   * @returns {Object} 应用变换后的前景数据
   */
  applyTransformToContainBlurForeground(foregroundData, transform) {
    if (!foregroundData) return null;

    // 获取位置属性
    const positionProps = this.getPositionProps();
    
    return {
      ...foregroundData,
      x: positionProps.left,
      y: positionProps.top,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
      rotation: transform.rotation,
      opacity: transform.opacity,
      originX: positionProps.originX,
      originY: positionProps.originY
    };
  }

  /**
   * 创建完整的 frameData，包含所有必要的变换信息
   * @param {Object} rawFrameData - 原始帧数据
   * @param {Object} transform - 变换信息
   * @returns {Object} 完整的帧数据
   */
  createCompleteFrameData(rawFrameData, transform) {
    if (!rawFrameData) return null;

    // 如果是 contain-blur 效果
    if (rawFrameData.isContainBlur && rawFrameData.background && rawFrameData.foreground) {
      return {
        ...rawFrameData,
        background: this.applyTransformToContainBlurBackground(rawFrameData.background, transform),
        foreground: this.applyTransformToContainBlurForeground(rawFrameData.foreground, transform)
      };
    }

    // 普通帧数据
    return this.applyTransformToFrameData(rawFrameData, transform);
  }
}
