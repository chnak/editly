# 通用动画管理系统

类似 Creatomate 的通用动画管理系统，为 editly 视频制作库提供强大的动画功能。

## 功能特性

- 🎬 **预设动画库** - 20+ 种常用动画预设
- 🔧 **动画构建器** - 链式API简化动画配置
- 🎯 **关键帧动画** - 支持复杂的时间轴动画
- ⚡ **高性能** - 优化的动画计算和渲染
- 🎨 **丰富缓动** - 15+ 种缓动函数
- 🔄 **动画组合** - 支持序列和并行动画

## 快速开始

### 1. 使用预设动画

```javascript
import { VideoMaker } from "./index.js";

const videoMaker = new VideoMaker({
  outPath: "output.mp4",
  width: 1280,
  height: 720,
  elements: [
    {
      type: "text",
      text: "Hello World",
      x: 640,
      y: 360,
      animations: ["fadeIn"] // 使用预设动画
    }
  ]
});
```

### 2. 使用动画构建器

```javascript
import { createAnimationBuilder } from "./index.js";

const builder = createAnimationBuilder();
const animations = builder
  .animate('opacity')
    .from(0)
    .to(1)
    .duration(0.5)
    .easing('easeOut')
    .end()
  .animate('x')
    .from(-200)
    .to(640)
    .duration(1)
    .delay(0.5)
    .easing('bounce')
    .end()
  .getAnimations();
```

### 3. 使用预设构建器

```javascript
import { createPresetBuilder } from "./index.js";

const presetBuilder = createPresetBuilder();
const animations = presetBuilder
  .fadeIn({ duration: 0.5 })
  .slideInLeft({ duration: 1, delay: 0.5 })
  .zoomIn({ duration: 0.8, delay: 1.5 })
  .getAnimations();
```

## 预设动画库

### 基础动画
- `fadeIn` - 淡入
- `fadeOut` - 淡出
- `slideInLeft` - 从左侧滑入
- `slideInRight` - 从右侧滑入
- `slideInTop` - 从上方滑入
- `slideInBottom` - 从下方滑入

### 缩放动画
- `zoomIn` - 缩放进入
- `zoomOut` - 缩放退出
- `bounceIn` - 弹跳进入
- `elasticIn` - 弹性进入

### 旋转动画
- `rotateIn` - 旋转进入
- `swingIn` - 摇摆进入
- `flipInX` - X轴翻转进入
- `flipInY` - Y轴翻转进入

### 特效动画
- `wobble` - 摇摆
- `pulse` - 脉冲
- `blink` - 闪烁

## 缓动函数

### 基础缓动
- `linear` - 线性
- `easeIn` - 缓入
- `easeOut` - 缓出
- `easeInOut` - 缓入缓出

### 高级缓动
- `easeInCubic` - 三次缓入
- `easeOutCubic` - 三次缓出
- `easeInOutCubic` - 三次缓入缓出
- `easeInQuart` - 四次缓入
- `easeOutQuart` - 四次缓出
- `easeInOutQuart` - 四次缓入缓出

### 特殊缓动
- `bounce` - 弹跳
- `elastic` - 弹性
- `back` - 回弹
- `circ` - 圆形
- `expo` - 指数
- `sine` - 正弦
- `swing` - 摇摆
- `wobble` - 摆动

## 动画属性

支持的动画属性包括：

### 2D变换
- `x` - X轴位置
- `y` - Y轴位置
- `scaleX` - X轴缩放
- `scaleY` - Y轴缩放
- `rotation` - 旋转角度
- `opacity` - 透明度

### 3D变换
- `rotationX` - X轴旋转
- `rotationY` - Y轴旋转
- `rotationZ` - Z轴旋转
- `translateZ` - Z轴位移

## 关键帧动画

支持复杂的关键帧动画：

```javascript
{
  property: 'x',
  keyframes: [
    { time: 0, value: -200, easing: 'easeOut' },
    { time: 0.3, value: 640, easing: 'easeOut' },
    { time: 0.7, value: 640, easing: 'linear' },
    { time: 1, value: 1480, easing: 'easeIn' }
  ],
  duration: 4
}
```

## 动画配置选项

### 基础选项
- `property` - 动画属性
- `from` - 起始值
- `to` - 结束值
- `duration` - 持续时间（秒）
- `startTime` - 开始时间（秒）
- `delay` - 延迟时间（秒）

### 高级选项
- `easing` - 缓动函数
- `repeat` - 重复次数（数字或 'loop' 或 'reverse'）
- `direction` - 动画方向（'normal' 或 'reverse'）
- `fillMode` - 填充模式（'none', 'forwards', 'backwards', 'both'）

## 动画组合

### 序列动画（按顺序执行）
```javascript
const animations = builder.sequence([
  { property: 'opacity', from: 0, to: 1, duration: 0.5 },
  { property: 'x', from: -200, to: 640, duration: 1 },
  { property: 'scaleX', from: 0.5, to: 1, duration: 0.8 }
]);
```

### 并行动画（同时执行）
```javascript
const animations = builder.parallel([
  { property: 'opacity', from: 0, to: 1, duration: 1 },
  { property: 'x', from: -200, to: 640, duration: 1 },
  { property: 'y', from: -100, to: 360, duration: 1 }
], 0);
```

## 使用示例

### 示例1: 基础文本动画
```javascript
import { VideoMaker } from "./index.js";

const videoMaker = new VideoMaker({
  outPath: "output.mp4",
  width: 1280,
  height: 720,
  elements: [
    {
      type: "text",
      text: "Hello World",
      textColor: "#ffffff",
      fontSize: 48,
      x: 640,
      y: 360,
      animations: [
        "fadeIn",
        {
          property: 'scaleX',
          from: 0.5,
          to: 1,
          duration: 1,
          easing: 'bounce'
        }
      ]
    }
  ]
});
```

### 示例2: 复杂动画组合
```javascript
import { createPresetBuilder } from "./index.js";

const presetBuilder = createPresetBuilder();
const animations = presetBuilder
  .fadeIn({ duration: 0.5 })
  .slideInLeft({ duration: 1, delay: 0.5 })
  .zoomIn({ duration: 0.8, delay: 1.5 })
  .bounceIn({ duration: 1, delay: 2.3 })
  .getAnimations();

const videoMaker = new VideoMaker({
  outPath: "output.mp4",
  width: 1280,
  height: 720,
  elements: [
    {
      type: "text",
      text: "复杂动画",
      x: 640,
      y: 360,
      animations: animations
    }
  ]
});
```

### 示例3: 关键帧动画
```javascript
const videoMaker = new VideoMaker({
  outPath: "output.mp4",
  width: 1280,
  height: 720,
  elements: [
    {
      type: "text",
      text: "关键帧动画",
      x: 640,
      y: 360,
      animations: [
        {
          property: 'x',
          keyframes: [
            { time: 0, value: -200, easing: 'easeOut' },
            { time: 0.3, value: 640, easing: 'easeOut' },
            { time: 0.7, value: 640, easing: 'linear' },
            { time: 1, value: 1480, easing: 'easeIn' }
          ],
          duration: 4
        }
      ]
    }
  ]
});
```

## API 参考

### AnimationManager
- `createAnimation(config)` - 创建动画
- `createKeyframeAnimation(config)` - 创建关键帧动画
- `applyPreset(presetName, options)` - 应用预设动画
- `getAvailablePresets()` - 获取可用预设列表

### AnimationBuilder
- `animate(property)` - 开始创建动画
- `from(value)` - 设置起始值
- `to(value)` - 设置结束值
- `duration(duration)` - 设置持续时间
- `easing(easing)` - 设置缓动函数
- `sequence(animations)` - 创建序列动画
- `parallel(animations, startTime)` - 创建并行动画

### PresetBuilder
- `fadeIn(options)` - 淡入动画
- `slideInLeft(options)` - 从左侧滑入
- `zoomIn(options)` - 缩放进入
- `bounceIn(options)` - 弹跳进入
- 等等...

## 性能优化

- 动画计算在渲染时进行，避免预计算大量数据
- 支持动画缓存和复用
- 优化的缓动函数计算
- 支持动画的懒加载

## 注意事项

1. 动画时间基于元素的 `startTime` 和 `duration`
2. 关键帧时间范围是 0-1，表示动画进度的百分比
3. 缓动函数名称区分大小写
4. 动画属性名称必须与支持的属性列表匹配
5. 复杂动画建议使用动画构建器以提高可读性

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基础动画和预设动画
- 实现动画构建器API
- 添加关键帧动画支持
- 包含20+种预设动画和15+种缓动函数
