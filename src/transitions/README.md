# 过渡效果系统 - 简化配置版本

## 概述

新的过渡效果系统支持通过简单直观的配置创建各种过渡效果，无需编写复杂的代码。

## 基础用法

### 1. 基本过渡效果

```javascript
import { VideoMaker } from "./index.js";

const videoMaker = new VideoMaker({
  // ... 其他配置
  transitions: [
    {
      type: "fade",        // 过渡效果类型
      startTime: 1.5,      // 开始时间（秒）
      duration: 1.0        // 持续时间（秒）
    }
  ]
});
```

### 2. 自定义过渡效果

```javascript
import { transitionManager } from "./transitions/TransitionManager.js";

// 注册自定义过渡效果
transitionManager.addTransition('myCustomFade', {
  type: 'opacity',
  from: { opacity: 1 },
  to: { opacity: 0 },
  easing: 'bounce'
});

// 使用自定义过渡效果
const videoMaker = new VideoMaker({
  transitions: [
    {
      type: "myCustomFade",
      startTime: 1.0,
      duration: 1.5
    }
  ]
});
```

## 过渡效果类型

### 1. 透明度效果 (opacity)

```javascript
{
  type: 'opacity',
  from: { opacity: 1 },      // 起始透明度 (0-1)
  to: { opacity: 0 },        // 结束透明度 (0-1)
  easing: 'linear'           // 缓动函数
}
```

### 2. 位置效果 (position)

```javascript
{
  type: 'position',
  from: { x: 0, y: 0 },      // 起始位置 (相对坐标，-1到1)
  to: { x: -1, y: 0 },       // 结束位置 (相对坐标，-1到1)
  easing: 'easeInOut'
}
```

### 3. 缩放效果 (scale)

```javascript
{
  type: 'scale',
  from: { scale: 1 },        // 起始缩放比例
  to: { scale: 2 },          // 结束缩放比例
  easing: 'easeOut'
}
```

### 4. 旋转效果 (rotation)

```javascript
{
  type: 'rotation',
  from: { angle: 0 },        // 起始角度（度）
  to: { angle: 360 },        // 结束角度（度）
  easing: 'easeInOut'
}
```

### 5. 擦除效果 (wipe)

```javascript
{
  type: 'wipe',
  direction: 'left',         // 擦除方向: left, right, up, down
  easing: 'linear'
}
```

### 6. 3D效果 (3d)

```javascript
{
  type: '3d',
  axis: 'y',                 // 旋转轴: x, y, z
  angle: 180,                // 旋转角度（度）
  easing: 'easeInOut'
}
```

### 7. 溶解效果 (dissolve)

```javascript
{
  type: 'dissolve',
  pattern: 'random',         // 溶解模式
  easing: 'linear'
}
```

## 缓动函数

### 基础缓动
- `linear` - 线性
- `easeIn` - 缓入
- `easeOut` - 缓出
- `easeInOut` - 缓入缓出

### 高级缓动
- `bounce` - 弹跳
- `elastic` - 弹性

## 预设过渡效果

### 基础效果
```javascript
import { basicTransitions } from "./transitions/transition-configs.js";

// 淡入淡出
basicTransitions.fade

// 快速淡入淡出
basicTransitions.quickFade

// 弹跳淡入淡出
basicTransitions.bounceFade
```

### 滑动效果
```javascript
import { slideTransitions } from "./transitions/transition-configs.js";

// 左滑
slideTransitions.slideLeft

// 右滑
slideTransitions.slideRight

// 上滑
slideTransitions.slideUp

// 下滑
slideTransitions.slideDown

// 对角线滑动
slideTransitions.slideDiagonal
```

### 缩放效果
```javascript
import { scaleTransitions } from "./transitions/transition-configs.js";

// 放大
scaleTransitions.zoomIn

// 缩小
scaleTransitions.zoomOut

// 弹性缩放
scaleTransitions.elasticZoom
```

### 旋转效果
```javascript
import { rotationTransitions } from "./transitions/transition-configs.js";

// 顺时针旋转
rotationTransitions.rotateClockwise

// 逆时针旋转
rotationTransitions.rotateCounterClockwise

// 半圈旋转
rotationTransitions.rotateHalf
```

### 3D效果
```javascript
import { threeDTransitions } from "./transitions/transition-configs.js";

// Y轴翻转
threeDTransitions.flipY

// X轴翻转
threeDTransitions.flipX

// Z轴翻转
threeDTransitions.flipZ
```

## 组合效果

### 滑动 + 淡入淡出
```javascript
{
  type: 'position',
  from: { x: 0, opacity: 1 },
  to: { x: -1, opacity: 0 },
  easing: 'easeInOut'
}
```

### 缩放 + 旋转
```javascript
{
  type: 'scale',
  from: { scale: 1, angle: 0 },
  to: { scale: 2, angle: 360 },
  easing: 'easeOut'
}
```

## 预设组合

```javascript
import { transitionPresets } from "./transitions/transition-configs.js";

// 电影风格
transitionPresets.cinematic

// 现代风格
transitionPresets.modern

// 创意风格
transitionPresets.creative
```

## 完整示例

```javascript
import { VideoMaker } from "./index.js";
import { transitionManager } from "./transitions/TransitionManager.js";
import { allTransitions } from "./transitions/transition-configs.js";

// 注册所有预设过渡效果
Object.entries(allTransitions).forEach(([name, config]) => {
  transitionManager.addTransition(name, config);
});

const videoMaker = new VideoMaker({
  outPath: "output.mp4",
  width: 1280,
  height: 720,
  fps: 30,
  elements: [
    // 场景元素...
  ],
  transitions: [
    {
      type: "fade",
      startTime: 1.5,
      duration: 1.0
    },
    {
      type: "slideLeft",
      startTime: 3.0,
      duration: 1.5
    },
    {
      type: "zoomIn",
      startTime: 5.0,
      duration: 1.0
    }
  ]
});

await videoMaker.start();
```

## 高级用法

### 创建复杂的自定义过渡效果

```javascript
// 自定义弹跳滑动效果
transitionManager.addTransition('bounceSlide', {
  type: 'position',
  from: { x: 0 },
  to: { x: -1 },
  easing: 'bounce'
});

// 自定义弹性缩放效果
transitionManager.addTransition('elasticZoom', {
  type: 'scale',
  from: { scale: 1 },
  to: { scale: 1.5 },
  easing: 'elastic'
});
```

### 动态过渡效果

```javascript
// 根据场景内容动态选择过渡效果
function getTransitionForScene(sceneIndex) {
  const transitions = ['fade', 'slideLeft', 'zoomIn', 'rotateClockwise'];
  return {
    type: transitions[sceneIndex % transitions.length],
    startTime: sceneIndex * 2,
    duration: 1.0
  };
}

const transitions = Array.from({ length: 4 }, (_, i) => getTransitionForScene(i));
```

## 注意事项

1. **时间控制**: 确保过渡效果的 `startTime` 和 `duration` 不与元素时间冲突
2. **性能优化**: 复杂的过渡效果可能影响渲染性能
3. **兼容性**: 某些 3D 效果在旧设备上可能不支持
4. **内存使用**: 大量过渡效果会占用更多内存

## 故障排除

### 过渡效果不生效
- 检查过渡效果名称是否正确
- 确认时间配置是否合理
- 验证元素是否存在

### 性能问题
- 减少同时使用的过渡效果数量
- 使用简单的缓动函数
- 降低视频分辨率或帧率

### 渲染错误
- 检查过渡效果配置格式
- 确认所有依赖已正确导入
- 查看控制台错误信息