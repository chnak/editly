# 字体重构说明

## 概述

将 title 处理字体的逻辑移到了 `BaseElement` 基类中，这样所有元素都可以复用统一的字体处理功能。

## 重构内容

### 1. 新增的 BaseElement 静态方法

#### `BaseElement.findAndRegisterSystemFont(fontFamily)`
- 使用 `font-finder` 查找并注册系统字体
- 支持中文字体名称映射
- 自动缓存已注册的字体

#### `BaseElement.parseFontSize(value, width, height)`
- 解析字体大小，支持多种单位
- 支持：px, %, vw, vh, vmin, vmax

#### `BaseElement.processFont(config, width, height)`
- 统一的字体处理入口
- 自动处理字体注册和大小解析
- 返回处理后的字体族名和大小

### 2. 修改的文件

#### `src/elements/base.js`
- 添加了字体处理相关的导入
- 新增了字体缓存数组
- 添加了三个静态字体处理方法

#### `src/elements/titleProcessor.js`
- 移除了重复的字体处理代码
- 使用 `BaseElement.processFont()` 处理字体
- 简化了字体处理逻辑

#### `src/elements/textProcessor.js`
- 移除了重复的字体处理代码
- 使用 `BaseElement.processFont()` 处理字体
- 简化了字体处理逻辑

## 使用方法

### 1. 在元素处理器中使用

```javascript
// 使用 BaseElement 的字体处理逻辑
const fontResult = await BaseElement.processFont({ 
  fontPath, 
  fontFamily, 
  fontSize 
}, width, height);

const finalFontFamily = fontResult.fontFamily;
const finalFontSize = fontResult.fontSize;
```

### 2. 支持的字体配置

#### 中文字体（系统字体）
```javascript
{
  type: "title",
  text: "中文字体测试",
  fontFamily: "微软雅黑", // 自动查找并注册
  fontSize: 50
}
```

#### 英文字体（系统字体）
```javascript
{
  type: "title", 
  text: "English Font Test",
  fontFamily: "Arial", // 自动查找并注册
  fontSize: 50
}
```

#### 自定义字体文件
```javascript
{
  type: "title",
  text: "自定义字体测试", 
  fontPath: "./fonts/MyFont.ttf", // 使用字体文件
  fontSize: 50
}
```

#### 字体大小单位
```javascript
{
  type: "title",
  text: "字体大小测试",
  fontFamily: "微软雅黑",
  fontSize: "5%", // 支持百分比、vw、vh、vmin、vmax
}
```

## 中文字体映射

| 中文名称 | 系统字体名称 |
|---------|-------------|
| 微软雅黑 | DengXian |
| 楷体 | KaiTi |
| 宋体 | SimSun-ExtB |
| 黑体 | SimHei |
| 等线 | DengXian |

## 优势

1. **代码复用**：所有元素都可以使用统一的字体处理逻辑
2. **维护性**：字体处理逻辑集中在一个地方，便于维护
3. **一致性**：所有元素的字体处理行为保持一致
4. **扩展性**：新增元素类型时可以直接使用字体处理功能
5. **功能完整**：支持系统字体、自定义字体、多种单位等

## 测试

运行以下测试文件验证重构效果：

```bash
# 测试字体重构后的功能
node test-font-refactor.js

# 测试动画系统（使用中文字体）
node animation-test.js
```

## 注意事项

1. 字体注册是全局的，已注册的字体会被缓存
2. 系统字体查找失败时会回退到 Arial
3. 自定义字体文件路径需要相对于项目根目录
4. 字体大小单位基于容器尺寸计算
