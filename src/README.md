# Video Maker

基于 Creatomate 配置结构的视频制作库，结合 editly 的渲染机制。

## 特性

- 🎬 **Creatomate 风格配置** - 使用简洁的 JSON 配置创建视频
- 🎨 **多种元素类型** - 支持视频、图像、文本、形状等元素
- ✨ **丰富的动画** - 内置多种缓动函数和动画效果
- 🚀 **高性能渲染** - 基于 Canvas 和 FFmpeg 的高效渲染
- 📱 **灵活布局** - 支持绝对定位和相对定位
- 🎭 **过渡效果** - 内置淡入淡出、滑动、缩放等过渡效果

## 安装

```bash
npm install
```

## 快速开始

```javascript
import { VideoMaker } from "./index.js";

const videoMaker = new VideoMaker({
  outPath: "output.mp4",
  width: 1920,
  height: 1080,
  fps: 30,
  elements: [
    {
      type: "text",
      text: "Hello World!",
      font: "48px Arial",
      fillColor: "#ffffff",
      duration: 5,
      x: 960,
      y: 540,
      textAlign: "center",
      animations: [
        {
          property: "opacity",
          from: 0,
          to: 1,
          duration: 1,
          easing: "easeIn"
        }
      ]
    }
  ]
});

await videoMaker.start();
```

## 元素类型

### 视频元素 (VideoElement)

```javascript
{
  type: "video",
  source: "path/to/video.mp4",
  duration: 5,
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1
}
```

### 图像元素 (ImageElement)

```javascript
{
  type: "image",
  source: "path/to/image.jpg",
  duration: 5,
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1
}
```

### 文本元素 (TextElement)

```javascript
{
  type: "text",
  text: "Hello World!",
  font: "48px Arial",
  fillColor: "#ffffff",
  strokeColor: "#000000",
  strokeWidth: 2,
  textAlign: "center",
  duration: 5,
  x: 960,
  y: 540
}
```

### 形状元素 (ShapeElement)

```javascript
{
  type: "shape",
  shape: "rectangle", // rectangle, circle, triangle
  fillColor: "#ff0000",
  strokeColor: "#000000",
  strokeWidth: 2,
  shapeWidth: 200,
  shapeHeight: 100,
  duration: 5,
  x: 100,
  y: 100
}
```

### 组合元素 (CompositionElement)

```javascript
{
  type: "composition",
  duration: 5,
  elements: [
    {
      type: "text",
      text: "组合文本",
      duration: 5
    }
  ]
}
```

## 动画系统

支持以下动画属性：
- `x`, `y` - 位置
- `scaleX`, `scaleY` - 缩放
- `rotation` - 旋转
- `opacity` - 透明度

支持的缓动函数：
- `linear` - 线性
- `easeIn` - 缓入
- `easeOut` - 缓出
- `easeInOut` - 缓入缓出
- `bounce` - 弹跳
- `elastic` - 弹性

```javascript
{
  animations: [
    {
      property: "opacity",
      from: 0,
      to: 1,
      duration: 1,
      startTime: 0,
      easing: "easeIn"
    }
  ]
}
```

## 过渡效果

支持以下过渡效果：
- `fade` - 淡入淡出
- `slide` - 滑动
- `zoom` - 缩放

```javascript
{
  transition: {
    duration: 1,
    name: "fade"
  }
}
```

## 示例

运行示例：

```bash
# 基础示例
npm run example:basic

# 高级示例
npm run example:advanced

# Creatomate 风格示例
npm run example:creatomate
```

## API 参考

### VideoMaker

主要的视频制作类。

#### 构造函数

```javascript
new VideoMaker(config)
```

**参数：**
- `config.outPath` - 输出文件路径
- `config.width` - 视频宽度
- `config.height` - 视频高度
- `config.fps` - 帧率
- `config.elements` - 元素数组

#### 方法

- `start()` - 开始渲染视频
- `close()` - 关闭资源

#### 事件

- `start` - 开始渲染
- `progress` - 渲染进度
- `complete` - 渲染完成
- `error` - 渲染错误

## 依赖

- Node.js >= 16.0.0
- FFmpeg
- Canvas
- Fabric.js

## 许可证

MIT
