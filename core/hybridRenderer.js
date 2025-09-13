import ProcessRenderer from './processRenderer.js';
import ParallelRenderer from './parallelRenderer.js';
import os from 'os';

export default class HybridRenderer {
  constructor(options = {}) {
    this.options = {
      maxWorkers: options.maxWorkers || Math.max(1, Math.floor(os.cpus().length * 0.8)),
      chunkDuration: options.chunkDuration || 2.0,
      verbose: options.verbose || false,
      keepTmp: options.keepTmp || false,
      autoDetect: options.autoDetect !== false, // 默认自动检测
      forceStrategy: options.forceStrategy, // 'thread' | 'process' | null
      ...options
    };
    
    // WebGL相关元素类型 - 包括所有需要Canvas渲染的元素
    this.webglElements = ['gl', 'shader', 'webgl', 'canvas', 'fabric', 'linear-gradient', 'radial-gradient', 'title'];
    this.canvasElements = ['fill-color', 'image', 'video'];
  }

  async renderParallel(timeline, totalDuration, fps, width, height, channels, outPath, audioFilePath, isGif, fast) {
    // 选择渲染策略
    const strategy = this.selectRenderStrategy(timeline);
    
    if (this.options.verbose) {
      console.log(`🎯 选择渲染策略: ${strategy}`);
    }

    // 根据策略选择渲染器
    let renderer;
    if (strategy === 'thread') {
      renderer = new ParallelRenderer({
        maxWorkers: this.options.maxWorkers,
        chunkDuration: this.options.chunkDuration,
        verbose: this.options.verbose,
        keepTmp: this.options.keepTmp,
        onChunkProgress: this.options.onChunkProgress
      });
    } else {
      renderer = new ProcessRenderer({
        maxWorkers: this.options.maxWorkers,
        chunkDuration: this.options.chunkDuration,
        verbose: this.options.verbose,
        keepTmp: this.options.keepTmp,
        onChunkProgress: this.options.onChunkProgress
      });
    }

    try {
      const result = await renderer.renderParallel(
        timeline, totalDuration, fps, width, height, channels, 
        outPath, audioFilePath, isGif, fast
      );
      
      if (this.options.verbose) {
        console.log(`✅ ${strategy}渲染完成`);
      }
      
      return result;
    } finally {
      await renderer.close();
    }
  }

  selectRenderStrategy(timeline) {
    // 如果强制指定策略，直接返回
    if (this.options.forceStrategy) {
      return this.options.forceStrategy;
    }

    // 如果不自动检测，默认使用进程
    if (!this.options.autoDetect) {
      return 'process';
    }

    // 检测是否使用WebGL相关功能
    const hasWebGL = this.detectWebGLElements(timeline);
    
    if (this.options.verbose) {
      console.log(`🔍 WebGL检测结果: ${hasWebGL ? '发现WebGL元素' : '无WebGL元素'}`);
    }

    // 根据检测结果选择策略
    return hasWebGL ? 'process' : 'thread';
  }

  detectWebGLElements(timeline) {
    // 检查所有轨道的所有元素
    for (const [trackId, track] of timeline.tracks) {
      if (this.hasWebGLElementsInTrack(track)) {
        return true;
      }
    }
    return false;
  }

  hasWebGLElementsInTrack(track) {
    // 检查轨道元素
    if (track.elements) {
      for (const element of track.elements) {
        if (this.isWebGLElement(element)) {
          return true;
        }
        
        // 检查scene类型元素的内部elements
        if (element.type === 'scene' && element.elements) {
          for (const sceneElement of element.elements) {
            if (this.isWebGLElement(sceneElement)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  isWebGLElement(element) {
    // 直接检查元素类型
    if (this.webglElements.includes(element.type)) {
      return true;
    }

    // 检查是否有WebGL相关属性
    const webglProps = ['shader', 'gl', 'webgl', 'canvas', 'fabric'];
    for (const prop of webglProps) {
      if (element[prop] !== undefined) {
        return true;
      }
    }

    // 检查动画中是否使用WebGL
    if (element.animate) {
      for (const anim of element.animate) {
        if (anim.effect && this.webglElements.includes(anim.effect)) {
          return true;
        }
      }
    }

    return false;
  }

  async close() {
    // 清理资源
  }

  // 获取渲染策略信息
  getStrategyInfo(timeline) {
    const strategy = this.selectRenderStrategy(timeline);
    const hasWebGL = this.detectWebGLElements(timeline);
    
    return {
      strategy,
      hasWebGL,
      webglElements: this.webglElements,
      canvasElements: this.canvasElements,
      recommendation: this.getRecommendation(strategy, hasWebGL)
    };
  }

  getRecommendation(strategy, hasWebGL) {
    if (strategy === 'thread') {
      return {
        reason: '无WebGL元素，使用线程渲染获得更好性能',
        benefits: ['更快的创建速度', '更低的内存使用', '更快的上下文切换'],
        warnings: ['不支持WebGL相关功能']
      };
    } else {
      return {
        reason: '检测到WebGL元素，使用进程渲染确保兼容性',
        benefits: ['完全兼容所有功能', '稳定的渲染结果', '更好的错误隔离'],
        warnings: ['进程创建开销较大', '内存使用较高']
      };
    }
  }
}
