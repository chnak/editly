/**
 * Creatomate 风格文本特效处理器
 * 实现类似 Creatomate 的文本动画效果
 */
export class CreatomateTextEffects {
  constructor() {
    this.effects = new Map();
    this.initializeEffects();
  }

  /**
   * 初始化所有文本特效
   */
  initializeEffects() {
    // 打字机效果
    this.effects.set('typewriter', {
      name: 'typewriter',
      description: '打字机效果 - 逐字符显示',
      process: this.processTypewriter.bind(this)
    });

    // 逐字显示
    this.effects.set('reveal', {
      name: 'reveal',
      description: '逐字显示 - 字符依次出现',
      process: this.processReveal.bind(this)
    });

    // 擦除效果
    this.effects.set('wipe', {
      name: 'wipe',
      description: '擦除效果 - 从左到右擦除显示',
      process: this.processWipe.bind(this)
    });

    // 分割效果
    this.effects.set('split', {
      name: 'split',
      description: '分割效果 - 按词或行分割显示',
      process: this.processSplit.bind(this)
    });

    // 逐词分割动画
    this.effects.set('splitWords', {
      name: 'splitWords',
      description: '逐词分割动画 - 按单词分割显示',
      process: this.processSplitWords.bind(this)
    });

    // 逐行分割动画
    this.effects.set('splitLines', {
      name: 'splitLines',
      description: '逐行分割动画 - 按行分割显示',
      process: this.processSplitLines.bind(this)
    });

    // 逐字符分割动画
    this.effects.set('splitChars', {
      name: 'splitChars',
      description: '逐字符分割动画 - 按字符分割显示',
      process: this.processSplitChars.bind(this)
    });

    // 波浪分割动画
    this.effects.set('waveSplit', {
      name: 'waveSplit',
      description: '波浪分割动画 - 分割元素呈波浪状出现',
      process: this.processWaveSplit.bind(this)
    });

    // 旋转分割动画
    this.effects.set('rotateSplit', {
      name: 'rotateSplit',
      description: '旋转分割动画 - 分割元素旋转出现',
      process: this.processRotateSplit.bind(this)
    });

    // 缩放分割动画
    this.effects.set('scaleSplit', {
      name: 'scaleSplit',
      description: '缩放分割动画 - 分割元素缩放出现',
      process: this.processScaleSplit.bind(this)
    });

    // 淡入分割动画
    this.effects.set('fadeSplit', {
      name: 'fadeSplit',
      description: '淡入分割动画 - 分割元素淡入出现',
      process: this.processFadeSplit.bind(this)
    });

    // 滑动分割动画
    this.effects.set('slideSplit', {
      name: 'slideSplit',
      description: '滑动分割动画 - 分割元素滑动出现',
      process: this.processSlideSplit.bind(this)
    });

    // 模糊效果
    this.effects.set('blur', {
      name: 'blur',
      description: '模糊到清晰',
      process: this.processBlur.bind(this)
    });

    // 故障效果
    this.effects.set('glitch', {
      name: 'glitch',
      description: '故障效果',
      process: this.processGlitch.bind(this)
    });

    // 震动效果
    this.effects.set('shake', {
      name: 'shake',
      description: '震动效果',
      process: this.processShake.bind(this)
    });

    // 脉冲效果
    this.effects.set('pulse', {
      name: 'pulse',
      description: '脉冲效果',
      process: this.processPulse.bind(this)
    });

    // 波浪效果
    this.effects.set('wave', {
      name: 'wave',
      description: '波浪效果',
      process: this.processWave.bind(this)
    });

    // 弹簧效果
    this.effects.set('spring', {
      name: 'spring',
      description: '弹簧效果',
      process: this.processSpring.bind(this)
    });

    // 3D翻转
    this.effects.set('flip3D', {
      name: 'flip3D',
      description: '3D翻转效果',
      process: this.processFlip3D.bind(this)
    });

    // 爆炸效果
    this.effects.set('explode', {
      name: 'explode',
      description: '爆炸效果',
      process: this.processExplode.bind(this)
    });

    // 溶解效果
    this.effects.set('dissolve', {
      name: 'dissolve',
      description: '溶解效果',
      process: this.processDissolve.bind(this)
    });

    // 螺旋效果
    this.effects.set('spiral', {
      name: 'spiral',
      description: '螺旋效果',
      process: this.processSpiral.bind(this)
    });

    // 摇摆效果
    this.effects.set('wobble', {
      name: 'wobble',
      description: '摇摆效果',
      process: this.processWobble.bind(this)
    });
  }

  /**
   * 处理打字机效果
   */
  processTypewriter(config) {
    const { text, progress, charDelay = 0.05, split = 'char' } = config;
    
    if (split === 'none' || split === 'default') {
      // 默认效果 - 整个文本一起显示
      return {
        visibleText: progress > 0 ? text : '',
        remainingText: progress > 0 ? '' : text,
        progress: Math.min(progress, 1),
        isComplete: progress >= 1,
        charIndex: progress > 0 ? text.length : 0
      };
    }
    
    // 根据分割类型处理
    const segments = this.splitText(text, split);
    const segmentDelay = charDelay;
    const totalDuration = segments.length * segmentDelay;
    const currentTime = progress * totalDuration;
    const visibleSegments = Math.floor(currentTime / segmentDelay);
    
    const visibleText = segments.slice(0, Math.min(visibleSegments, segments.length)).join('');
    const remainingText = segments.slice(visibleSegments).join('');
    
    return {
      visibleText,
      remainingText,
      progress: Math.min(visibleSegments / segments.length, 1),
      isComplete: visibleSegments >= segments.length,
      charIndex: visibleSegments,
      segments: segments.slice(0, Math.min(visibleSegments, segments.length))
    };
  }

  /**
   * 处理逐字显示效果
   */
  processReveal(config) {
    const { text, progress, charDelay = 0.1, split = 'char' } = config;
    
    if (split === 'none' || split === 'default') {
      // 默认效果 - 整个文本一起显示
      return {
        visibleChars: [{
          char: text,
          opacity: progress,
          scale: 0.5 + progress * 0.5,
          y: (1 - progress) * 20
        }],
        progress: Math.min(progress, 1),
        isComplete: progress >= 1
      };
    }
    
    // 根据分割类型处理
    const segments = this.splitText(text, split);
    const totalDuration = segments.length * charDelay;
    const currentTime = progress * totalDuration;
    
    const visibleChars = segments.map((segment, index) => {
      const segmentStartTime = index * charDelay;
      const segmentProgress = Math.max(0, Math.min((currentTime - segmentStartTime) / charDelay, 1));
      return {
        char: segment,
        opacity: segmentProgress,
        scale: 0.5 + segmentProgress * 0.5,
        y: (1 - segmentProgress) * 20,
        x: (1 - segmentProgress) * 10
      };
    });

    return {
      visibleChars,
      progress: Math.min(currentTime / totalDuration, 1),
      isComplete: currentTime >= totalDuration,
      segments
    };
  }

  /**
   * 处理擦除效果
   */
  processWipe(config) {
    const { text, progress, wipeDirection = 'left', split = 'none' } = config;
    const wipeProgress = Math.max(0, Math.min(progress, 1));
    
    if (split === 'none' || split === 'default') {
      // 默认效果 - 整个文本一起擦除
      return {
        text,
        wipeProgress,
        wipeDirection,
        clipX: wipeDirection === 'left' ? 0 : (1 - wipeProgress) * 100,
        clipY: wipeDirection === 'top' ? 0 : (1 - wipeProgress) * 100,
        clipWidth: wipeDirection === 'left' || wipeDirection === 'right' ? wipeProgress * 100 : 100,
        clipHeight: wipeDirection === 'top' || wipeDirection === 'bottom' ? wipeProgress * 100 : 100
      };
    }
    
    // 根据分割类型处理
    const segments = this.splitText(text, split);
    const segmentDelay = 0.1;
    const segmentDuration = 0.3;
    
    const animatedSegments = segments.map((segment, index) => {
      const segmentStartTime = index * segmentDelay;
      const segmentProgress = Math.max(0, Math.min((progress - segmentStartTime) / segmentDuration, 1));
      
      return {
        text: segment,
        wipeProgress: segmentProgress,
        wipeDirection,
        opacity: segmentProgress,
        scaleX: 0.8 + segmentProgress * 0.2,
        scaleY: 0.8 + segmentProgress * 0.2
      };
    });

    return {
      segments: animatedSegments,
      progress: Math.min(progress, 1),
      isComplete: progress >= (segments.length - 1) * segmentDelay + segmentDuration,
      splitType: split
    };
  }

  /**
   * 处理分割效果
   */
  processSplit(config) {
    const { text, progress, split = 'word', segmentDelay = 0.1, segmentDuration = 0.3 } = config;
    const segments = this.splitText(text, split);
    
    const animatedSegments = segments.map((segment, index) => {
      const segmentStartTime = index * segmentDelay;
      const segmentProgress = Math.max(0, Math.min((progress - segmentStartTime) / segmentDuration, 1));
      
      return {
        text: segment,
        opacity: segmentProgress,
        scaleX: segmentProgress,
        scaleY: segmentProgress,
        rotation: (1 - segmentProgress) * 10,
        y: (1 - segmentProgress) * 30,
        x: (1 - segmentProgress) * 20
      };
    });

    return {
      segments: animatedSegments,
      progress: Math.min(progress, 1),
      isComplete: progress >= (segments.length - 1) * segmentDelay + segmentDuration,
      splitType: split
    };
  }

  /**
   * 处理模糊效果
   */
  processBlur(config) {
    const { progress } = config;
    const blurProgress = Math.max(0, Math.min(progress, 1));
    
    return {
      opacity: blurProgress,
      blur: (1 - blurProgress) * 10,
      scale: 0.8 + blurProgress * 0.2
    };
  }

  /**
   * 处理故障效果
   */
  processGlitch(config) {
    const { progress } = config;
    const glitchIntensity = Math.sin(progress * Math.PI * 20) * 0.1;
    
    return {
      x: glitchIntensity * 10,
      y: Math.sin(progress * Math.PI * 15) * 5,
      rotation: glitchIntensity * 2,
      opacity: 0.8 + Math.random() * 0.2
    };
  }

  /**
   * 处理震动效果
   */
  processShake(config) {
    const { progress } = config;
    const shakeIntensity = Math.sin(progress * Math.PI * 30) * 0.1;
    
    return {
      x: shakeIntensity * 15,
      y: Math.sin(progress * Math.PI * 25) * 8,
      rotation: shakeIntensity * 1
    };
  }

  /**
   * 处理脉冲效果
   */
  processPulse(config) {
    const { progress } = config;
    const pulsePhase = (progress * 4) % 1; // 4次脉冲
    const pulseScale = 1 + Math.sin(pulsePhase * Math.PI * 2) * 0.1;
    
    return {
      scaleX: pulseScale,
      scaleY: pulseScale,
      opacity: 0.9 + Math.sin(pulsePhase * Math.PI * 2) * 0.1
    };
  }

  /**
   * 处理波浪效果
   */
  processWave(config) {
    const { progress } = config;
    const wavePhase = progress * Math.PI * 2;
    
    return {
      y: Math.sin(wavePhase) * 10,
      rotation: Math.sin(wavePhase * 0.5) * 5,
      scaleX: 1 + Math.sin(wavePhase * 1.5) * 0.05
    };
  }

  /**
   * 处理弹簧效果
   */
  processSpring(config) {
    const { progress } = config;
    const springProgress = this.springEase(progress);
    
    return {
      scaleX: springProgress,
      scaleY: springProgress,
      rotation: (1 - springProgress) * 10
    };
  }

  /**
   * 处理3D翻转效果
   */
  processFlip3D(config) {
    const { progress } = config;
    const flipProgress = Math.max(0, Math.min(progress, 1));
    
    return {
      rotationX: -90 + flipProgress * 90,
      rotationY: (1 - flipProgress) * 15,
      scaleX: 0.5 + flipProgress * 0.5,
      scaleY: 0.5 + flipProgress * 0.5
    };
  }

  /**
   * 处理爆炸效果
   */
  processExplode(config) {
    const { progress } = config;
    const explodeProgress = Math.max(0, Math.min(progress, 1));
    
    return {
      scaleX: explodeProgress * 1.5,
      scaleY: explodeProgress * 1.5,
      rotation: explodeProgress * 180,
      opacity: 1 - explodeProgress * 0.3
    };
  }

  /**
   * 处理溶解效果
   */
  processDissolve(config) {
    const { progress } = config;
    const dissolveProgress = Math.max(0, Math.min(progress, 1));
    
    return {
      opacity: dissolveProgress,
      scaleX: 0.8 + dissolveProgress * 0.2,
      scaleY: 0.8 + dissolveProgress * 0.2,
      rotation: (1 - dissolveProgress) * 5
    };
  }

  /**
   * 处理螺旋效果
   */
  processSpiral(config) {
    const { progress } = config;
    const spiralProgress = Math.max(0, Math.min(progress, 1));
    
    return {
      rotation: spiralProgress * 360,
      scaleX: 0.2 + spiralProgress * 0.8,
      scaleY: 0.2 + spiralProgress * 0.8,
      x: Math.sin(spiralProgress * Math.PI * 2) * 20,
      y: Math.cos(spiralProgress * Math.PI * 2) * 20
    };
  }

  /**
   * 处理摇摆效果
   */
  processWobble(config) {
    const { progress } = config;
    const wobblePhase = progress * Math.PI * 8;
    
    return {
      rotation: Math.sin(wobblePhase) * 5,
      scaleX: 1 + Math.sin(wobblePhase * 1.3) * 0.05,
      scaleY: 1 + Math.cos(wobblePhase * 1.1) * 0.05
    };
  }

  /**
   * 处理逐词分割动画
   */
  processSplitWords(config) {
    const { text, progress, split = 'word', segmentDelay = 0.15, segmentDuration = 0.4 } = config;
    const words = this.splitText(text, split);
    
    const animatedSegments = words.map((word, index) => {
      const segmentStartTime = index * segmentDelay;
      const segmentProgress = Math.max(0, Math.min((progress - segmentStartTime) / segmentDuration, 1));
      
      return {
        text: word,
        opacity: segmentProgress,
        scaleX: 0.3 + segmentProgress * 0.7,
        scaleY: 0.3 + segmentProgress * 0.7,
        rotation: (1 - segmentProgress) * 15,
        y: (1 - segmentProgress) * 40,
        x: (1 - segmentProgress) * 30
      };
    });

    return {
      segments: animatedSegments,
      progress: Math.min(progress, 1),
      isComplete: progress >= (words.length - 1) * segmentDelay + segmentDuration,
      splitType: split
    };
  }

  /**
   * 处理逐行分割动画
   */
  processSplitLines(config) {
    const { text, progress, segmentDelay = 0.2, segmentDuration = 0.5 } = config;
    const lines = this.splitText(text, 'line');
    
    const animatedSegments = lines.map((line, index) => {
      const segmentStartTime = index * segmentDelay;
      const segmentProgress = Math.max(0, Math.min((progress - segmentStartTime) / segmentDuration, 1));
      
      return {
        text: line,
        opacity: segmentProgress,
        scaleX: 0.5 + segmentProgress * 0.5,
        scaleY: 0.5 + segmentProgress * 0.5,
        rotation: (1 - segmentProgress) * 20,
        y: (1 - segmentProgress) * 60,
        x: (1 - segmentProgress) * 40
      };
    });

    return {
      segments: animatedSegments,
      progress: Math.min(progress, 1),
      isComplete: progress >= (lines.length - 1) * segmentDelay + segmentDuration,
      splitType: split
    };
  }

  /**
   * 处理逐字符分割动画
   */
  processSplitChars(config) {
    const { text, progress, segmentDelay = 0.05, segmentDuration = 0.2 } = config;
    const chars = text.split('').filter(char => char.trim());
    
    const animatedSegments = chars.map((char, index) => {
      const segmentStartTime = index * segmentDelay;
      const segmentProgress = Math.max(0, Math.min((progress - segmentStartTime) / segmentDuration, 1));
      
      return {
        text: char,
        opacity: segmentProgress,
        scaleX: 0.2 + segmentProgress * 0.8,
        scaleY: 0.2 + segmentProgress * 0.8,
        rotation: (1 - segmentProgress) * 25,
        y: (1 - segmentProgress) * 20,
        x: (1 - segmentProgress) * 15
      };
    });

    return {
      segments: animatedSegments,
      progress: Math.min(progress, 1),
      isComplete: progress >= (chars.length - 1) * segmentDelay + segmentDuration,
      splitType: split
    };
  }

  /**
   * 处理波浪分割动画
   */
  processWaveSplit(config) {
    const { text, progress, split = 'word', segmentDelay = 0.1, segmentDuration = 0.3 } = config;
    const segments = this.splitText(text, split);
    
    const animatedSegments = segments.map((segment, index) => {
      const segmentStartTime = index * segmentDelay;
      const segmentProgress = Math.max(0, Math.min((progress - segmentStartTime) / segmentDuration, 1));
      const waveOffset = Math.sin(index * 0.5) * 20;
      
      return {
        text: segment,
        opacity: segmentProgress,
        scaleX: 0.4 + segmentProgress * 0.6,
        scaleY: 0.4 + segmentProgress * 0.6,
        rotation: (1 - segmentProgress) * 10 + waveOffset * 0.1,
        y: (1 - segmentProgress) * 30 + waveOffset,
        x: (1 - segmentProgress) * 20
      };
    });

    return {
      segments: animatedSegments,
      progress: Math.min(progress, 1),
      isComplete: progress >= (segments.length - 1) * segmentDelay + segmentDuration,
      splitType: split
    };
  }

  /**
   * 处理旋转分割动画
   */
  processRotateSplit(config) {
    const { text, progress, splitType = 'word', segmentDelay = 0.12, segmentDuration = 0.4 } = config;
    const segments = this.splitText(text, splitType);
    
    const animatedSegments = segments.map((segment, index) => {
      const segmentStartTime = index * segmentDelay;
      const segmentProgress = Math.max(0, Math.min((progress - segmentStartTime) / segmentDuration, 1));
      
      return {
        text: segment,
        opacity: segmentProgress,
        scaleX: 0.3 + segmentProgress * 0.7,
        scaleY: 0.3 + segmentProgress * 0.7,
        rotation: (1 - segmentProgress) * 360,
        y: (1 - segmentProgress) * 50,
        x: (1 - segmentProgress) * 30
      };
    });

    return {
      segments: animatedSegments,
      progress: Math.min(progress, 1),
      isComplete: progress >= (segments.length - 1) * segmentDelay + segmentDuration,
      splitType: split
    };
  }

  /**
   * 处理缩放分割动画
   */
  processScaleSplit(config) {
    const { text, progress, splitType = 'word', segmentDelay = 0.08, segmentDuration = 0.3 } = config;
    const segments = this.splitText(text, splitType);
    
    const animatedSegments = segments.map((segment, index) => {
      const segmentStartTime = index * segmentDelay;
      const segmentProgress = Math.max(0, Math.min((progress - segmentStartTime) / segmentDuration, 1));
      
      return {
        text: segment,
        opacity: segmentProgress,
        scaleX: segmentProgress,
        scaleY: segmentProgress,
        rotation: 0,
        y: 0,
        x: 0
      };
    });

    return {
      segments: animatedSegments,
      progress: Math.min(progress, 1),
      isComplete: progress >= (segments.length - 1) * segmentDelay + segmentDuration,
      splitType: split
    };
  }

  /**
   * 处理淡入分割动画
   */
  processFadeSplit(config) {
    const { text, progress, splitType = 'word', segmentDelay = 0.1, segmentDuration = 0.5 } = config;
    const segments = this.splitText(text, splitType);
    
    const animatedSegments = segments.map((segment, index) => {
      const segmentStartTime = index * segmentDelay;
      const segmentProgress = Math.max(0, Math.min((progress - segmentStartTime) / segmentDuration, 1));
      
      return {
        text: segment,
        opacity: segmentProgress,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        y: 0,
        x: 0
      };
    });

    return {
      segments: animatedSegments,
      progress: Math.min(progress, 1),
      isComplete: progress >= (segments.length - 1) * segmentDelay + segmentDuration,
      splitType: split
    };
  }

  /**
   * 处理滑动分割动画
   */
  processSlideSplit(config) {
    const { text, progress, splitType = 'word', segmentDelay = 0.1, segmentDuration = 0.4, direction = 'left' } = config;
    const segments = this.splitText(text, splitType);
    
    const animatedSegments = segments.map((segment, index) => {
      const segmentStartTime = index * segmentDelay;
      const segmentProgress = Math.max(0, Math.min((progress - segmentStartTime) / segmentDuration, 1));
      
      let slideX = 0, slideY = 0;
      switch (direction) {
        case 'left':
          slideX = (1 - segmentProgress) * -100;
          break;
        case 'right':
          slideX = (1 - segmentProgress) * 100;
          break;
        case 'up':
          slideY = (1 - segmentProgress) * -50;
          break;
        case 'down':
          slideY = (1 - segmentProgress) * 50;
          break;
      }
      
      return {
        text: segment,
        opacity: segmentProgress,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        y: slideY,
        x: slideX
      };
    });

    return {
      segments: animatedSegments,
      progress: Math.min(progress, 1),
      isComplete: progress >= (segments.length - 1) * segmentDelay + segmentDuration,
      splitType: split
    };
  }

  /**
   * 分割文本
   */
  splitText(text, splitType) {
    switch (splitType) {
      case 'word':
        // 按单词分割（英文按空格，中文按字符）
        const chineseRegex = /[\u4e00-\u9fff]/;
        if (chineseRegex.test(text)) {
          return text.split('').filter(char => char.trim());
        } else {
          return text.split(/\s+/).filter(word => word.trim());
        }
        
      case 'space':
        // 按空格分割
        return text.split(/\s+/).filter(word => word.trim());
        
      case 'line':
        // 按行分割
        return text.split('\n').filter(item => item.trim());
        
      case 'char':
        // 按字符分割
        return text.split('').filter(char => char !== ' ' && char !== '\n' && char !== '\t');
        
      case 'sentence':
        // 按句子分割（句号、问号、感叹号）
        return text.split(/[.!?]+/).filter(sentence => sentence.trim());
        
      case 'phrase':
        // 按短语分割（逗号、分号）
        return text.split(/[,;]+/).filter(phrase => phrase.trim());
        
      case 'none':
      case 'default':
        // 不分割，返回整个文本
        return [text];
        
      default:
        // 默认按字符分割
        return text.split('').filter(char => char.trim());
    }
  }

  /**
   * 弹簧缓动函数
   */
  springEase(t) {
    return 1 - Math.cos(t * Math.PI * 2.5) * Math.exp(-t * 6);
  }

  /**
   * 获取可用的特效列表
   */
  getAvailableEffects() {
    return Array.from(this.effects.keys());
  }

  /**
   * 处理文本特效
   */
  processTextEffect(effectName, config) {
    const effect = this.effects.get(effectName);
    if (!effect) {
      throw new Error(`未知的文本特效: ${effectName}`);
    }
    return effect.process(config);
  }
}

// 导出默认实例
export const creatomateTextEffects = new CreatomateTextEffects();
