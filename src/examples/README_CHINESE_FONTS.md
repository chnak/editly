# 中文字体使用指南

## 问题说明

在 Node.js Canvas 环境中，中文字体支持存在以下限制：

1. **系统字体名称问题**：中文系统字体名称（如"微软雅黑"、"楷体"、"宋体"）在 Node.js 中可能无法正确识别
2. **字体注册机制**：需要使用 `registerFont()` 函数注册字体文件才能使用
3. **字体文件依赖**：需要提供支持中文的字体文件（TTF/OTF 格式）

## 解决方案

### 1. 使用自定义中文字体文件（推荐）

```javascript
{
  type: "title",
  text: "中文字体测试",
  fontPath: "./fonts/PatuaOne-Regular.ttf", // 使用字体文件路径
  fontSize: 50,
  textColor: "#ffffff"
}
```

### 2. 使用系统字体（可能不支持中文）

```javascript
{
  type: "title",
  text: "系统字体测试",
  fontFamily: "Arial", // 系统字体，可能不支持中文
  fontSize: 50,
  textColor: "#ffffff"
}
```

## 字体文件配置

### 推荐的中文字体文件

1. **PatuaOne-Regular.ttf** - 项目默认包含的装饰性字体
2. **Microsoft YaHei** - 微软雅黑（需要提供字体文件）
3. **SimHei** - 黑体（需要提供字体文件）
4. **SimSun** - 宋体（需要提供字体文件）

### 字体文件放置位置

```
src/
├── fonts/
│   ├── PatuaOne-Regular.ttf  # 默认中文字体
│   ├── Arial.ttf            # 英文字体
│   └── MyChineseFont.ttf    # 自定义中文字体
```

## 完整配置示例

### 基础中文字体配置

```javascript
{
  type: "title",
  text: "中文字体测试",
  fontPath: "./fonts/PatuaOne-Regular.ttf", // 使用中文字体文件
  fontSize: 50,
  textColor: "#ffffff",
  x: 640,
  y: 360,
  duration: 4,
  animations: ["fadeIn"]
}
```

### 中英文混合文本

```javascript
{
  type: "title",
  text: "中英文混合 Mixed Text 测试",
  fontPath: "./fonts/PatuaOne-Regular.ttf",
  fontSize: 45,
  textColor: "#4ecdc4",
  x: 640,
  y: 300,
  duration: 3,
  animations: ["zoomIn"]
}
```

### 分割动画 + 中文字体

```javascript
{
  type: "title",
  text: "分割动画中文字体",
  fontPath: "./fonts/PatuaOne-Regular.ttf",
  fontSize: 45,
  textColor: "#ffe66d",
  x: 640,
  y: 400,
  duration: 3,
  split: "letter", // 按字符分割
  splitDelay: 0.1,
  splitDuration: 0.3,
  animations: ["bounceIn"]
}
```

### 长文本处理

```javascript
{
  type: "title",
  text: "这是一个很长的中文文本用来测试字体渲染效果和换行处理",
  fontPath: "./fonts/PatuaOne-Regular.ttf",
  fontSize: 35,
  textColor: "#ff9ff3",
  x: 640,
  y: 500,
  duration: 2,
  animations: ["slideInFromLeft"]
}
```

## 字体大小单位支持

中文字体同样支持多种单位：

```javascript
{
  fontSize: 50,        // 像素值
  fontSize: "50px",    // 像素单位
  fontSize: "5%",      // 相对于画布的百分比
  fontSize: "5vw",     // 视口宽度单位
  fontSize: "5vh",     // 视口高度单位
}
```

## 常见问题解决

### 1. 中文字体不显示

**问题**：中文字符显示为方块或问号
**解决方案**：
- 确保使用 `fontPath` 而不是 `fontFamily`
- 检查字体文件是否支持中文字符
- 验证字体文件路径是否正确

### 2. 字体文件加载失败

**问题**：控制台显示字体注册失败
**解决方案**：
- 检查字体文件是否存在
- 确认字体文件格式（支持 TTF、OTF）
- 验证文件路径是否正确

### 3. 字体效果异常

**问题**：中文字体渲染效果不理想
**解决方案**：
- 尝试不同的字体文件
- 调整字体大小
- 检查字体文件是否完整

## 测试文件

项目提供了以下测试文件来验证中文字体支持：

- `src/test-chinese-fonts.js` - 中文字体功能测试
- `src/animation-test.js` - 动画系统测试（已修复中文字体问题）

运行测试：

```bash
cd src
node test-chinese-fonts.js
node animation-test.js
```

## 最佳实践

1. **优先使用字体文件**：使用 `fontPath` 而不是 `fontFamily` 来确保中文字体支持
2. **字体文件管理**：将字体文件放在 `src/fonts/` 目录下
3. **字体选择**：选择支持中文的字体文件
4. **测试验证**：在开发过程中及时测试字体渲染效果
5. **错误处理**：监听字体注册错误并处理

## 注意事项

1. **字体版权**：确保使用的字体文件有合法的使用权限
2. **文件大小**：避免使用过大的字体文件影响性能
3. **跨平台兼容**：在不同操作系统上测试字体渲染效果
4. **字符支持**：确保字体文件支持所需的中文字符集
