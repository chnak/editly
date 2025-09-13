import os from 'os';
import { performance } from 'perf_hooks';

export default class AutoOptimizer {
  constructor() {
    this.systemInfo = this.getSystemInfo();
    this.performanceHistory = [];
    this.optimizationRules = this.getOptimizationRules();
  }

  // 获取系统信息
  getSystemInfo() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const cpuCores = os.cpus().length;
    const platform = os.platform();
    
    return {
      totalMemGB: totalMem / (1024 * 1024 * 1024),
      freeMemGB: freeMem / (1024 * 1024 * 1024),
      usedMemGB: (totalMem - freeMem) / (1024 * 1024 * 1024),
      memUsagePercent: ((totalMem - freeMem) / totalMem) * 100,
      cpuCores,
      platform,
      arch: os.arch()
    };
  }

  // 计算视频内存需求
  calculateVideoMemory(videoConfig) {
    const { width, height, fps, duration } = videoConfig;
    const channels = 4; // RGBA
    const bytesPerPixel = channels;
    
    // 单帧内存
    const frameSize = width * height * bytesPerPixel;
    const frameSizeMB = frameSize / (1024 * 1024);
    
    // FFmpeg缓冲区 (经验值)
    const ffmpegBuffer = 5.7;
    
    // 每进程总内存需求
    const memoryPerProcess = frameSizeMB + ffmpegBuffer;
    
    // 总帧数
    const totalFrames = Math.ceil(duration * fps);
    
    return {
      frameSizeMB,
      memoryPerProcess,
      totalFrames,
      totalVideoMemory: frameSizeMB * totalFrames
    };
  }

  // 获取优化规则
  getOptimizationRules() {
    return {
      // 内存安全规则
      memory: {
        maxMemoryUsagePercent: 30, // 最大使用30%可用内存
        minMemoryPerProcess: 10,   // 每进程最少10MB
        maxMemoryPerProcess: 100,  // 每进程最多100MB
        safetyBuffer: 0.2          // 20%安全缓冲
      },
      
      // 性能规则
      performance: {
        minWorkers: 1,
        maxWorkers: 16,
        optimalWorkersRatio: 0.8,  // 80% CPU核心数
        minChunkDuration: 0.5,     // 最小0.5秒分块
        maxChunkDuration: 10,      // 最大10秒分块
        optimalChunkDuration: 2.0  // 最优2秒分块
      },
      
      // 视频长度规则
      duration: {
        short: { max: 10, workers: 0.5, chunk: 1.0 },
        medium: { max: 30, workers: 0.8, chunk: 2.0 },
        long: { max: 60, workers: 0.6, chunk: 3.0 },
        veryLong: { max: Infinity, workers: 0.4, chunk: 4.0 }
      },
      
      // 分辨率规则
      resolution: {
        low: { max: 1280 * 720, workers: 1.0, chunk: 1.0 },
        medium: { max: 1920 * 1080, workers: 0.8, chunk: 2.0 },
        high: { max: 2560 * 1440, workers: 0.6, chunk: 3.0 },
        ultra: { max: Infinity, workers: 0.4, chunk: 4.0 }
      }
    };
  }

  // 分析视频复杂度
  analyzeVideoComplexity(videoConfig, tracks) {
    let complexity = 0;
    
    // 基础复杂度
    const { width, height, fps, duration } = videoConfig;
    complexity += (width * height) / (1920 * 1080); // 分辨率因子
    complexity += fps / 30; // 帧率因子
    complexity += duration / 10; // 时长因子
    
    // 轨道复杂度
    if (tracks) {
      for (const [trackId, track] of Object.entries(tracks)) {
        if (track.elements) {
          for (const element of track.elements) {
            // 元素类型复杂度
            const elementComplexity = this.getElementComplexity(element);
            complexity += elementComplexity;
            
            // 动画复杂度
            if (element.animate) {
              complexity += element.animate.length * 0.1;
            }
          }
        }
      }
    }
    
    return Math.max(1, complexity);
  }

  // 获取元素复杂度
  getElementComplexity(element) {
    const complexityMap = {
      'fill-color': 0.1,
      'title': 0.3,
      'image': 0.2,
      'video': 0.5,
      'linear-gradient': 0.4,
      'radial-gradient': 0.4,
      'gl': 1.0,
      'shader': 1.0,
      'canvas': 0.8,
      'fabric': 0.6
    };
    
    return complexityMap[element.type] || 0.2;
  }

  // 计算最优配置
  calculateOptimalConfig(videoConfig, tracks = null) {
    const videoMemory = this.calculateVideoMemory(videoConfig);
    const complexity = this.analyzeVideoComplexity(videoConfig, tracks);
    
    console.log('🔍 自动优化分析:');
    console.log(`   系统内存: ${this.systemInfo.freeMemGB.toFixed(2)} GB 可用`);
    console.log(`   视频分辨率: ${videoConfig.width}x${videoConfig.height}`);
    console.log(`   视频时长: ${videoConfig.duration}秒`);
    console.log(`   单帧内存: ${videoMemory.frameSizeMB.toFixed(2)} MB`);
    console.log(`   视频复杂度: ${complexity.toFixed(2)}`);
    
    // 1. 计算最大安全进程数
    const maxSafeWorkers = this.calculateMaxSafeWorkers(videoMemory);
    
    // 2. 根据视频特征调整
    const adjustedWorkers = this.adjustWorkersByVideo(videoConfig, maxSafeWorkers);
    
    // 3. 计算最优分块大小
    const optimalChunkDuration = this.calculateOptimalChunkDuration(videoConfig, adjustedWorkers);
    
    // 4. 应用复杂度调整
    const finalConfig = this.applyComplexityAdjustments({
      maxWorkers: adjustedWorkers,
      chunkDuration: optimalChunkDuration
    }, complexity);
    
    // 5. 验证配置安全性
    const validatedConfig = this.validateConfig(finalConfig, videoMemory);
    
    console.log('\n🎯 最优配置:');
    console.log(`   进程数: ${validatedConfig.maxWorkers}`);
    console.log(`   分块大小: ${validatedConfig.chunkDuration}秒`);
    console.log(`   预估内存: ${(videoMemory.memoryPerProcess * validatedConfig.maxWorkers).toFixed(2)} MB`);
    console.log(`   内存占比: ${((videoMemory.memoryPerProcess * validatedConfig.maxWorkers) / (this.systemInfo.freeMemGB * 1024) * 100).toFixed(1)}%`);
    
    return {
      ...validatedConfig,
      memoryPerProcess: videoMemory.memoryPerProcess,
      totalMemoryNeeded: videoMemory.memoryPerProcess * validatedConfig.maxWorkers,
      complexity,
      confidence: this.calculateConfidence(validatedConfig, videoMemory)
    };
  }

  // 计算最大安全进程数
  calculateMaxSafeWorkers(videoMemory) {
    const rules = this.optimizationRules.memory;
    const availableMemMB = this.systemInfo.freeMemGB * 1024;
    const safeMemoryLimit = availableMemMB * rules.maxMemoryUsagePercent / 100;
    
    const maxByMemory = Math.floor(safeMemoryLimit / videoMemory.memoryPerProcess);
    const maxByCores = Math.floor(this.systemInfo.cpuCores * this.optimizationRules.performance.optimalWorkersRatio);
    const maxByRules = this.optimizationRules.performance.maxWorkers;
    
    return Math.min(maxByMemory, maxByCores, maxByRules);
  }

  // 根据视频特征调整进程数
  adjustWorkersByVideo(videoConfig, baseWorkers) {
    const { width, height, duration } = videoConfig;
    const resolution = width * height;
    
    // 分辨率调整
    let workers = baseWorkers;
    if (resolution <= 1280 * 720) {
      workers = Math.min(workers, Math.floor(workers * 1.2)); // 低分辨率可以更多进程
    } else if (resolution >= 2560 * 1440) {
      workers = Math.floor(workers * 0.8); // 高分辨率减少进程
    }
    
    // 时长调整
    if (duration <= 10) {
      workers = Math.min(workers, 4); // 短视频不需要太多进程
    } else if (duration >= 60) {
      workers = Math.max(workers, 2); // 长视频至少2个进程
    }
    
    return Math.max(1, workers);
  }

  // 计算最优分块大小
  calculateOptimalChunkDuration(videoConfig, workers) {
    const { duration } = videoConfig;
    const rules = this.optimizationRules.performance;
    
    // 基础分块大小
    let chunkDuration = rules.optimalChunkDuration;
    
    // 根据时长调整
    if (duration <= 10) {
      chunkDuration = Math.max(rules.minChunkDuration, duration / 4);
    } else if (duration <= 30) {
      chunkDuration = 2.0;
    } else if (duration <= 60) {
      chunkDuration = 3.0;
    } else {
      chunkDuration = 4.0;
    }
    
    // 根据进程数调整
    if (workers === 1) {
      chunkDuration = Math.min(chunkDuration, 2.0); // 单进程用小分块
    } else if (workers >= 8) {
      chunkDuration = Math.max(chunkDuration, 3.0); // 多进程用大分块
    }
    
    return Math.max(rules.minChunkDuration, Math.min(rules.maxChunkDuration, chunkDuration));
  }

  // 应用复杂度调整
  applyComplexityAdjustments(config, complexity) {
    if (complexity > 2.0) {
      // 高复杂度，减少进程数，增加分块大小
      return {
        maxWorkers: Math.max(1, Math.floor(config.maxWorkers * 0.7)),
        chunkDuration: Math.min(10, config.chunkDuration * 1.5)
      };
    } else if (complexity < 1.0) {
      // 低复杂度，可以增加进程数
      return {
        maxWorkers: Math.min(16, Math.floor(config.maxWorkers * 1.2)),
        chunkDuration: Math.max(0.5, config.chunkDuration * 0.8)
      };
    }
    
    return config;
  }

  // 验证配置安全性
  validateConfig(config, videoMemory) {
    const rules = this.optimizationRules;
    
    // 确保进程数在合理范围内
    config.maxWorkers = Math.max(
      rules.performance.minWorkers,
      Math.min(rules.performance.maxWorkers, config.maxWorkers)
    );
    
    // 确保分块大小在合理范围内
    config.chunkDuration = Math.max(
      rules.performance.minChunkDuration,
      Math.min(rules.performance.maxChunkDuration, config.chunkDuration)
    );
    
    // 确保内存使用安全
    const totalMemoryNeeded = videoMemory.memoryPerProcess * config.maxWorkers;
    const maxSafeMemory = this.systemInfo.freeMemGB * 1024 * rules.memory.maxMemoryUsagePercent / 100;
    
    if (totalMemoryNeeded > maxSafeMemory) {
      config.maxWorkers = Math.floor(maxSafeMemory / videoMemory.memoryPerProcess);
      config.maxWorkers = Math.max(1, config.maxWorkers);
    }
    
    return config;
  }

  // 计算配置置信度
  calculateConfidence(config, videoMemory) {
    let confidence = 100;
    
    // 内存使用率影响置信度
    const memoryUsagePercent = (videoMemory.memoryPerProcess * config.maxWorkers) / (this.systemInfo.freeMemGB * 1024) * 100;
    if (memoryUsagePercent > 20) {
      confidence -= (memoryUsagePercent - 20) * 2;
    }
    
    // 进程数影响置信度
    if (config.maxWorkers === 1) {
      confidence -= 10; // 单进程性能可能不佳
    } else if (config.maxWorkers > 8) {
      confidence -= 5; // 过多进程可能不稳定
    }
    
    // 分块大小影响置信度
    if (config.chunkDuration < 1.0) {
      confidence -= 15; // 分块太小可能效率低
    } else if (config.chunkDuration > 6.0) {
      confidence -= 10; // 分块太大可能并行度不够
    }
    
    return Math.max(0, Math.min(100, confidence));
  }

  // 生成完整配置
  generateFullConfig(videoConfig, tracks = null, options = {}) {
    const optimal = this.calculateOptimalConfig(videoConfig, tracks);
    
    const config = {
      outPath: options.outPath || 'auto_optimized_output.mp4',
      width: videoConfig.width,
      height: videoConfig.height,
      fps: videoConfig.fps,
      parallel: true,
      maxWorkers: optimal.maxWorkers,
      chunkDuration: optimal.chunkDuration,
      verbose: options.verbose !== false,
      memoryOptimized: true,
      autoOptimized: true,
      confidence: optimal.confidence,
      tracks: tracks || videoConfig.tracks
    };
    
    // 添加性能监控
    if (options.enableMonitoring !== false) {
      config.onProgress = (percent) => {
        if (options.onProgress) {
          options.onProgress(percent);
        }
      };
    }
    
    return config;
  }

  // 记录性能数据
  recordPerformance(config, duration, success) {
    this.performanceHistory.push({
      config: { maxWorkers: config.maxWorkers, chunkDuration: config.chunkDuration },
      duration,
      success,
      timestamp: Date.now()
    });
    
    // 只保留最近100条记录
    if (this.performanceHistory.length > 100) {
      this.performanceHistory = this.performanceHistory.slice(-100);
    }
  }

  // 获取性能统计
  getPerformanceStats() {
    if (this.performanceHistory.length === 0) {
      return null;
    }
    
    const successful = this.performanceHistory.filter(p => p.success);
    const avgDuration = successful.reduce((sum, p) => sum + p.duration, 0) / successful.length;
    
    return {
      totalRuns: this.performanceHistory.length,
      successRate: (successful.length / this.performanceHistory.length) * 100,
      averageDuration: avgDuration,
      bestConfig: successful.reduce((best, current) => 
        current.duration < best.duration ? current : best
      )
    };
  }
}
