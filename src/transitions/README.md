# 过渡效果系统

## 概述

过渡效果系统为 VideoMaker 提供了丰富的场景切换效果，让视频制作更加专业和流畅。

## 支持的过渡效果

### 1. 淡入淡出效果
- **fade**: 经典的淡入淡出效果
- **dissolve**: 溶解效果

### 2. 滑动效果
- **slideLeft**: 从左向右滑动
- **slideRight**: 从右向左滑动
- **slideUp**: 从下向上滑动
- **slideDown**: 从上向下滑动

### 3. 缩放效果
- **zoomIn**: 缩放进入
- **zoomOut**: 缩放退出

### 4. 旋转效果
- **rotateIn**: 旋转进入

### 5. 擦除效果
- **wipeLeft**: 从左向右擦除
- **wipeRight**: 从右向左擦除

### 6. 3D 效果
- **flip3D**: 3D 翻转效果

## 使用方法

### 基本配置

```javascript
const videoMaker = new VideoMaker({
  outPath: "output/video.mp4",
  width: 1280,
  height: 720,
  fps: 30,
  elements: [
    // 你的元素配置
  ],
  transitions: [
    {
      type: "fade",        // 过渡效果类型
      startTime: 2.5,      // 开始时间（秒）
      duration: 1.0        // 持续时间（秒）
    }
  ]
});
```

### 过渡效果配置参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `type` | string | 是 | 过渡效果类型 |
| `startTime` | number | 否 | 开始时间，默认为 0 |
| `duration` | number | 否 | 持续时间，默认为 1 秒 |

### 时间安排建议

1. **过渡开始时间**: 通常设置为前一个场景结束前 0.5 秒
2. **过渡持续时间**: 建议 0.5-2 秒之间
3. **场景重叠**: 确保过渡期间两个场景都有内容

### 示例配置

```javascript
// 多个过渡效果
transitions: [
  {
    type: "fade",
    startTime: 2.5,
    duration: 1.0
  },
  {
    type: "slideLeft",
    startTime: 5.5,
    duration: 1.5
  },
  {
    type: "zoomIn",
    startTime: 8.0,
    duration: 0.8
  }
]
```

## 自定义过渡效果

### 创建自定义过渡

```javascript
import { transitionApplier } from './transitions/TransitionApplier.js';

// 创建自定义过渡效果
transitionApplier.createCustomTransition('myTransition', {
  name: 'myTransition',
  duration: 1.0,
  type: 'custom',
  apply: async (progress, fromFrame, toFrame, canvas) => {
    // 自定义过渡逻辑
    // progress: 0-1 的过渡进度
    // fromFrame: 起始帧数据
    // toFrame: 结束帧数据
    // canvas: 画布对象
    
    // 返回过渡后的帧数据
    return transitionResult;
  }
});
```

### 过渡效果函数参数

- `progress`: 过渡进度 (0-1)
- `fromFrame`: 起始帧的 RGBA 数据
- `toFrame`: 结束帧的 RGBA 数据
- `canvas`: Fabric.js 画布对象

## 性能优化建议

1. **合理设置过渡时间**: 避免过长的过渡时间
2. **减少同时过渡**: 避免多个过渡效果同时进行
3. **优化帧率**: 根据过渡复杂度调整 FPS
4. **内存管理**: 及时清理临时画布

## 常见问题

### Q: 过渡效果不显示？
A: 检查过渡时间是否与场景时间重叠，确保 `startTime` 和 `duration` 设置正确。

### Q: 过渡效果卡顿？
A: 降低 FPS 或减少过渡持续时间，检查系统内存使用情况。

### Q: 如何添加新的过渡效果？
A: 在 `TransitionManager.js` 中添加新的过渡效果配置，或使用 `createCustomTransition` 方法。

## 技术实现

过渡效果系统基于以下技术：

- **Fabric.js**: 用于画布操作和图像处理
- **RGBA 数据处理**: 高效的像素级操作
- **时间轴管理**: 精确的时间控制
- **异步渲染**: 支持复杂的过渡效果

## 扩展性

系统设计为高度可扩展，支持：

- 添加新的过渡效果类型
- 自定义过渡函数
- 复杂的多图层过渡
- 实时预览功能
