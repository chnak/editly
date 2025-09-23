# 过渡效果系统

本目录包含基于 core/transition.js 的过渡效果实现，使用 gl-transition 库提供高质量的 WebGL 过渡效果。

## 文件结构

- `transition.js` - 核心过渡效果类，基于 core/transition.js
- `easings.js` - 缓动函数，基于 core/easings.js
- `README.md` - 本文档

## 使用方法

### 1. 基本过渡效果

```javascript
import { VideoMaker } from "../index.js";

const videoMaker = new VideoMaker({
  outPath: "output.mp4",
  width: 1280,
  height: 720,
  fps: 30,
  elements: [
    // 场景1
    {
      type: "image",
      source: "image1.jpg",
      duration: 3,
      x: '50%',
      y: '50%',
      width: '100%',
      height: '100%',
      fit: "cover"
    },
    // 场景2
    {
      type: "image",
      source: "image2.jpg", 
      duration: 3,
      startTime: 2.5,
      x: '50%',
      y: '50%',
      width: '100%',
      height: '100%',
      fit: "cover"
    }
  ],
  transitions: [
    {
      name: "fade",
      duration: 1,
      easing: "easeInOut",
      startTime: 2.5
    }
  ]
});

await videoMaker.start();
```

### 2. 支持的过渡效果

基于 gl-transition 库，支持以下过渡效果：

- `fade` - 淡入淡出
- `directional-left` - 从左滑入
- `directional-right` - 从右滑入
- `directional-up` - 从上滑入
- `directional-down` - 从下滑入
- `random` - 随机过渡效果

### 3. 支持的缓动函数

- `linear` - 线性
- `easeIn` - 缓入
- `easeOut` - 缓出
- `easeInOut` - 缓入缓出
- `easeInExpo` - 指数缓入
- `easeOutExpo` - 指数缓出
- `easeInOutExpo` - 指数缓入缓出

### 4. 过渡效果配置

```javascript
{
  name: "fade",           // 过渡效果名称
  duration: 1,            // 持续时间（秒）
  easing: "easeInOut",    // 缓动函数
  startTime: 2.5,         // 开始时间（秒）
  params: {}              // 额外参数（可选）
}
```

## 技术实现

过渡效果使用 WebGL 进行硬件加速渲染，提供流畅的视觉效果。每个过渡效果都会在指定的时间范围内平滑地从一个场景过渡到另一个场景。

## 注意事项

1. 过渡效果需要两个相邻的场景才能正常工作
2. 过渡时间不应超过场景的持续时间
3. 确保过渡的开始时间与场景切换时间一致
4. 某些过渡效果可能需要特定的参数配置