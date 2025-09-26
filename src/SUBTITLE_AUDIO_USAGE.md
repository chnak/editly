# 字幕音频功能使用指南

## 概述

字幕元素现在支持音频功能，可以为每段字幕配置不同的音频文件，实现语音播报效果。

## 功能特性

- **全局音频**：为整个字幕元素设置背景音乐
- **分段音频**：为每段字幕配置不同的语音文件
- **音量控制**：支持音量调节（0.0 - 1.0）
- **淡入淡出**：支持音频的淡入淡出效果
- **时间同步**：音频与字幕显示时间自动同步

## 配置参数

### 基本配置
```javascript
{
  type: "subtitle",
  text: "第一段字幕\n第二段字幕\n第三段字幕",
  // ... 其他字幕配置
}
```

### 音频配置
```javascript
{
  // 全局背景音乐
  audio: "assets/background-music.mp3",
  
  // 每段字幕对应的音频文件
  audioSegments: [
    "assets/voice1.mp3",  // 第一段字幕的语音
    "assets/voice2.mp3",  // 第二段字幕的语音
    "assets/voice3.mp3"   // 第三段字幕的语音
  ],
  
  // 音频参数
  volume: 0.8,      // 音量 (0.0 - 1.0)
  fadeIn: 0.5,      // 淡入时间（秒）
  fadeOut: 0.5      // 淡出时间（秒）
}
```

## 使用示例

### 1. 基本字幕音频
```javascript
const videoMaker = new VideoMaker({
  elements: [
    {
      type: "subtitle",
      text: "欢迎使用字幕音频功能",
      fontSize: 50,
      textColor: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.7)",
      position: "center",
      startTime: 0,
      duration: 4,
      // 音频配置
      audio: "assets/background.mp3",
      volume: 0.8,
      fadeIn: 0.3,
      fadeOut: 0.3
    }
  ]
});
```

### 2. 分段字幕音频
```javascript
const videoMaker = new VideoMaker({
  elements: [
    {
      type: "subtitle",
      text: "第一段\n第二段\n第三段",
      fontSize: 50,
      textColor: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.7)",
      position: "center",
      startTime: 0,
      duration: 6,
      // 分段音频配置
      audioSegments: [
        "assets/voice1.mp3",
        "assets/voice2.mp3",
        "assets/voice3.mp3"
      ],
      volume: 0.9,
      fadeIn: 0.5,
      fadeOut: 0.5
    }
  ]
});
```

### 3. 混合音频（全局 + 分段）
```javascript
const videoMaker = new VideoMaker({
  elements: [
    {
      type: "subtitle",
      text: "背景音乐 + 语音播报",
      fontSize: 50,
      textColor: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.7)",
      position: "center",
      startTime: 0,
      duration: 8,
      // 混合音频配置
      audio: "assets/background-music.mp3",  // 背景音乐
      audioSegments: [
        "assets/voice1.mp3",  // 语音1
        "assets/voice2.mp3",  // 语音2
        "assets/voice3.mp3"   // 语音3
      ],
      volume: 0.8,
      fadeIn: 0.5,
      fadeOut: 0.5
    }
  ]
});
```

## 音频文件要求

- **格式支持**：MP3, WAV, AAC, OGG 等常见音频格式
- **文件路径**：支持相对路径和绝对路径
- **文件大小**：建议单个文件不超过 10MB
- **时长匹配**：建议音频时长与对应字幕段时长匹配

## 注意事项

1. **音频文件存在性**：确保音频文件路径正确且文件存在
2. **时间同步**：音频会自动与字幕显示时间同步
3. **音量平衡**：合理设置音量，避免音频过大或过小
4. **淡入淡出**：建议设置适当的淡入淡出时间，避免音频突然开始或结束
5. **性能考虑**：大量音频文件可能影响渲染性能

## 错误处理

如果音频文件不存在或加载失败，系统会：
- 继续渲染视频（不中断）
- 在控制台输出警告信息
- 跳过该音频段，继续处理其他音频

## 测试建议

1. 先测试无音频的字幕功能
2. 添加单个音频文件测试
3. 测试分段音频功能
4. 测试混合音频功能
5. 调整音量和淡入淡出参数
