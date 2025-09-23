# 音频元素 (AudioElement)

音频元素用于在视频中播放音频文件，支持多种音频效果和混音功能。

## 基本用法

```javascript
{
  type: "audio",
  source: "path/to/audio.mp3",
  duration: 10,
  startTime: 0
}
```

## 属性说明

### 基础属性
- `source` (string): 音频文件路径
- `duration` (number): 音频播放时长（秒）- **会截取音频到指定时长**
- `startTime` (number): 开始播放时间（秒）
- `volume` (number): 音量大小 (0.0 - 1.0，默认: 1.0)
- `mixVolume` (number): 混音音量 (0.0 - 1.0，默认: 1.0)

### 音频效果
- `fadeIn` (number): 淡入时间（秒，默认: 0）
- `fadeOut` (number): 淡出时间（秒，默认: 0）
- `speedFactor` (number): 播放速度倍数（默认: 1.0）
- `loop` (boolean): 是否循环播放（默认: false）

### 音频截取
- `cutFrom` (number): 开始截取时间（秒，默认: 0）
- `cutTo` (number): 结束截取时间（秒，默认: 到文件结束）

### 音频标准化
- `audioNorm` (boolean): 是否启用音频标准化（默认: false）
- `audioNormGaussSize` (number): 音频标准化高斯大小（默认: 5）
- `audioNormMaxGain` (number): 音频标准化最大增益（默认: 30）

## 使用示例

### 基础音频播放
```javascript
{
  type: "audio",
  source: "../assets/background.mp3",
  duration: 30,
  startTime: 0,
  volume: 0.8
}
```

### 带效果的音频播放
```javascript
{
  type: "audio",
  source: "../assets/sound-effect.mp3",
  duration: 5,
  startTime: 2,
  volume: 0.6,
  mixVolume: 0.8,
  fadeIn: 1.0,
  fadeOut: 1.0,
  cutFrom: 0,
  cutTo: 5,
  speedFactor: 1.2,
  audioNorm: true
}
```

### 循环音效
```javascript
{
  type: "audio",
  source: "../assets/loop.mp3",
  duration: 60,
  startTime: 0,
  loop: true,
  cutFrom: 0,
  cutTo: 3,  // 只播放前3秒，然后循环
  volume: 0.4
}
```

## 多音频混音

系统支持多个音频元素同时播放，会自动进行混音处理：

```javascript
{
  elements: [
    // 背景音乐
    {
      type: "audio",
      source: "../assets/background.mp3",
      duration: 30,
      startTime: 0,
      volume: 0.5,
      mixVolume: 0.8,
      fadeIn: 2.0,
      fadeOut: 2.0
    },
    
    // 音效1
    {
      type: "audio",
      source: "../assets/sound1.mp3",
      duration: 3,
      startTime: 5,
      volume: 0.8,
      mixVolume: 1.0
    },
    
    // 音效2
    {
      type: "audio",
      source: "../assets/sound2.mp3",
      duration: 2,
      startTime: 8,
      volume: 0.6,
      mixVolume: 0.7,
      speedFactor: 1.5
    }
  ]
}
```

## 支持的音频格式

- MP3
- M4A/AAC
- WAV
- FLAC
- OGG
- 其他FFmpeg支持的音频格式

## 注意事项

1. **音频元素不产生视觉帧** - 音频元素只处理音频，不会在画面上显示任何内容
2. **音频处理在渲染前完成** - 所有音频文件会在视频渲染前被处理和混合
3. **临时文件管理** - 系统会自动创建临时音频文件，渲染完成后会自动清理
4. **性能考虑** - 大量音频元素可能会影响渲染性能，建议合理控制数量
5. **时长控制优先级** - `duration` > `cutTo` > 原始音频时长，`duration` 属性会截取音频到指定时长

## 技术实现

音频元素基于以下技术实现：
- **FFmpeg**: 用于音频文件处理和格式转换
- **音频混合**: 使用FFmpeg的`amix`滤镜进行多音频混合
- **淡入淡出**: 使用FFmpeg的`afade`滤镜实现
- **音频标准化**: 使用FFmpeg的`dynaudnorm`滤镜实现
- **速度调整**: 使用FFmpeg的`atempo`滤镜实现
