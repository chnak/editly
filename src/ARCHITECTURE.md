# 项目架构说明

## 整体架构

```
src/
├── index.js                 # 主入口文件，导出 VideoMaker 类
├── configParser.js          # 配置解析器，将 Creatomate 风格配置转换为内部格式
├── timeline.js              # 时间线管理，负责元素的时间轴和合成
├── renderer.js              # 视频渲染器，负责 FFmpeg 进程和帧写入
├── elements/                # 元素实现目录
│   ├── base.js              # 元素基类，定义通用接口和动画系统
│   ├── video.js             # 视频元素
│   ├── image.js             # 图像元素
│   ├── text.js              # 文本元素
│   ├── shape.js             # 形状元素
│   ├── composition.js       # 组合元素
│   ├── videoProcessor.js    # 视频处理器
│   ├── imageProcessor.js    # 图像处理器
│   ├── textProcessor.js     # 文本处理器
│   └── shapeProcessor.js    # 形状处理器
├── canvas/                  # 画布工具
│   └── fabric.js            # Fabric.js 画布封装
├── transitions/             # 过渡效果
│   └── transition.js        # 过渡效果基类
├── animations/              # 动画系统
│   └── animation.js         # 动画类
├── examples/                # 示例文件
│   ├── basic-example.js     # 基础示例
│   ├── advanced-example.js  # 高级示例
│   └── creatomate-style-example.js # Creatomate 风格示例
├── test.js                  # 测试文件
├── package.json             # 项目配置
└── README.md                # 项目说明
```

## 核心类说明

### VideoMaker
主要的视频制作类，负责：
- 配置解析和验证
- 时间线创建
- 渲染器管理
- 事件发射

### ConfigParser
配置解析器，负责：
- 将 Creatomate 风格的 JSON 配置转换为内部格式
- 创建对应的元素实例
- 计算时间信息

### Timeline
时间线管理类，负责：
- 管理所有元素的时间轴
- 获取指定时间的合成帧
- 元素层级管理
- 资源清理

### VideoRenderer
视频渲染器，负责：
- 启动和管理 FFmpeg 进程
- 逐帧渲染时间线
- 将帧数据写入视频文件
- 进度回调

## 元素系统

### BaseElement
所有元素的基类，提供：
- 通用的时间管理
- 变换属性（位置、缩放、旋转、透明度）
- 动画系统
- 缓动函数

### 具体元素类型
- **VideoElement**: 视频元素，支持视频文件播放
- **ImageElement**: 图像元素，支持静态图像显示
- **TextElement**: 文本元素，支持文本渲染和样式
- **ShapeElement**: 形状元素，支持基本几何形状
- **CompositionElement**: 组合元素，支持嵌套元素

## 动画系统

### 支持的动画属性
- `x`, `y`: 位置动画
- `scaleX`, `scaleY`: 缩放动画
- `rotation`: 旋转动画
- `opacity`: 透明度动画

### 缓动函数
- `linear`: 线性
- `easeIn`: 缓入
- `easeOut`: 缓出
- `easeInOut`: 缓入缓出
- `bounce`: 弹跳
- `elastic`: 弹性

## 渲染流程

1. **配置解析**: 将 JSON 配置转换为内部元素对象
2. **时间线创建**: 创建 Timeline 实例管理所有元素
3. **逐帧渲染**: 对每一帧调用 `getCompositeFrameAtTime`
4. **元素渲染**: 每个元素调用 `readNextFrame` 方法
5. **帧合成**: 将所有元素渲染到同一个画布
6. **FFmpeg 编码**: 将帧数据写入视频文件

## 与 editly 的对比

### 相似点
- 都使用 `readNextFrame(progress, canvas)` 接口
- 都支持逐帧渲染
- 都使用 FFmpeg 进行最终编码

### 不同点
- **配置结构**: 使用 Creatomate 风格的扁平化配置
- **元素系统**: 更简洁的元素定义方式
- **动画系统**: 内置更丰富的缓动函数
- **API 设计**: 更接近 Creatomate 的 API 风格

## 扩展性

### 添加新元素类型
1. 继承 `BaseElement` 类
2. 实现 `readNextFrame` 方法
3. 在 `ConfigParser` 中注册新类型
4. 创建对应的处理器

### 添加新动画效果
1. 在 `BaseElement.ease()` 方法中添加新的缓动函数
2. 在 `Animation` 类中添加新的动画类型

### 添加新过渡效果
1. 继承 `Transition` 类
2. 实现 `apply()` 方法
3. 在 `Transition` 类中注册新类型
