# 字体使用说明

## 概述

本项目支持使用自定义字体来渲染文本，包括标题和普通文本元素。支持 TTF、OTF 等常见字体格式。

## 字体配置方式

### 1. 使用系统字体（推荐用于测试）

```javascript
{
  type: "title",
  text: "使用系统字体",
  fontFamily: "Arial", // 直接指定系统字体族名
  fontSize: 50,
  textColor: "#ffffff"
}
```

**支持的系统字体示例：**
- `"Arial"`
- `"Times New Roman"`
- `"Helvetica"`
- `"Georgia"`
- `"Verdana"`
- `"Courier New"`
- 等等...

### 2. 使用自定义字体文件（推荐用于生产）

```javascript
{
  type: "title",
  text: "使用自定义字体",
  fontPath: "./fonts/MyCustomFont.ttf", // 指定字体文件路径
  fontSize: 50,
  textColor: "#ffffff"
}
```

### 3. 混合使用（系统字体 + 自定义字体）

```javascript
{
  type: "title",
  text: "混合字体配置",
  fontFamily: "Arial", // 系统字体作为后备
  fontPath: "./fonts/MyCustomFont.ttf", // 自定义字体文件
  fontSize: 50,
  textColor: "#ffffff"
}
```

## 字体文件位置

- 默认字体目录：`src/fonts/`
- 当前包含的字体：
  - `Arial.ttf` - 英文字体
  - `PatuaOne-Regular.ttf` - 装饰性字体

## 字体注册机制

### 自动注册
- 当使用 `fontPath` 时，系统会自动注册字体
- 字体会被注册为 base64 编码的字体族名
- 避免字体名称冲突

### 字体缓存
- 已注册的字体会被缓存，避免重复注册
- 字体注册信息会输出到控制台

## 完整配置示例

### 基础字体配置

```javascript
{
  type: "title",
  text: "标题文本",
  // 字体配置
  fontPath: "./fonts/MyFont.ttf", // 自定义字体文件路径
  fontFamily: "MyFont", // 字体族名（可选，系统会自动生成）
  fontSize: 72, // 字体大小（支持多种单位）
  textColor: "#ffffff", // 文字颜色
  
  // 位置配置
  x: 640,
  y: 360,
  position: "center", // 或 "left", "right", "top", "bottom"
  
  // 时间配置
  duration: 4,
  startTime: 0,
  
  // 动画配置
  animations: ["fadeIn", "zoomIn"]
}
```

### 高级字体效果配置

```javascript
{
  type: "title",
  text: "高级字体效果",
  fontPath: "./fonts/MyFont.ttf",
  fontSize: 60,
  textColor: "#ffffff",
  
  // 阴影效果
  shadow: true,
  shadowColor: "#000000",
  shadowBlur: 10,
  shadowOffsetX: 5,
  shadowOffsetY: 5,
  
  // 边框效果
  stroke: true,
  strokeColor: "#ff0000",
  strokeWidth: 3,
  
  // 渐变效果
  gradient: true,
  gradientType: "linear", // "linear" 或 "radial"
  gradientColors: ["#ff0000", "#00ff00", "#0000ff"],
  gradientDirection: "horizontal", // "horizontal", "vertical", "diagonal"
  
  // 文字装饰
  underline: true,
  linethrough: false,
  overline: false,
  
  // 发光效果
  glow: true,
  glowColor: "#ffffff",
  glowBlur: 15,
  
  // 文字变形
  skewX: 0,
  skewY: 0,
  
  // 分割动画
  split: "letter", // "letter", "word", "line"
  splitDelay: 0.1,
  splitDuration: 0.3,
  
  // 打字机效果
  typewriter: true,
  typewriterSpeed: 100, // 毫秒/字符
  typewriterDelay: 0
}
```

## 字体大小单位支持

字体大小支持多种单位：

```javascript
{
  fontSize: 72, // 像素值
  fontSize: "72px", // 像素单位
  fontSize: "10%", // 相对于画布最小尺寸的百分比
  fontSize: "5vw", // 视口宽度单位
  fontSize: "5vh", // 视口高度单位
  fontSize: "5vmin", // 视口最小单位
  fontSize: "5vmax" // 视口最大单位
}
```

## 分割动画字体配置

当使用分割动画时，字体配置会应用到每个分割片段：

```javascript
{
  type: "title",
  text: "分割动画文本",
  fontPath: "./fonts/MyFont.ttf",
  fontSize: 50,
  textColor: "#ffffff",
  
  // 分割配置
  split: "letter", // 按字符分割
  splitDelay: 0.1, // 每个字符的延迟时间（秒）
  splitDuration: 0.3, // 每个字符的动画持续时间（秒）
  
  // 动画配置
  animations: ["bounceIn", "fadeIn"]
}
```

## 注意事项

1. **字体文件路径**：使用相对路径时，相对于项目根目录
2. **字体格式**：支持 TTF、OTF 等常见格式
3. **字体加载**：字体会在首次使用时自动注册
4. **字体缓存**：已注册的字体会被缓存，避免重复加载
5. **错误处理**：字体加载失败时会输出警告，但不影响程序运行
6. **中文字体**：建议使用支持中文的字体文件

## 故障排除

### 字体不显示
- 检查字体文件路径是否正确
- 确认字体文件格式是否支持
- 查看控制台是否有字体注册错误信息

### 字体效果异常
- 确认字体文件是否完整
- 检查字体是否支持所需的字符
- 验证字体配置参数是否正确

### 性能问题
- 避免使用过大的字体文件
- 合理使用字体缓存机制
- 考虑字体文件的加载时间
