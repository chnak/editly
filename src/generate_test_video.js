/**
 * 生成测试视频 - 展示动画系统效果
 */
import { createTitleElement } from './elements/titleProcessor.js';
import { animationManager } from './animations/AnimationManager.js';
import { textAnimationProcessor } from './animations/TextAnimationProcessor.js';
import { createCanvas } from 'canvas';
import * as fabric from 'fabric/node';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

async function generateTestVideo() {
  console.log('🎬 开始生成测试视频...\n');

  try {
    // 设置文本动画处理器
    textAnimationProcessor.setAnimationManager(animationManager);

    // 创建画布
    const canvas = createCanvas(1920, 1080);
    const fabricCanvas = new fabric.Canvas(canvas);

    // 测试场景配置
    const scenes = [
      {
        name: '基础缩放动画',
        config: {
          text: 'Hello World',
          textColor: '#ffffff',
          position: 'center',
          zoomDirection: 'in',
          zoomAmount: 0.3,
          width: 1920,
          height: 1080
        },
        duration: 2.0
      },
      {
        name: '分割动画 - 按词',
        config: {
          text: 'Welcome to Editly',
          textColor: '#ff6b6b',
          position: 'center',
          zoomDirection: 'in',
          zoomAmount: 0.2,
          split: 'word',
          splitDelay: 0.2,
          splitDuration: 0.5,
          width: 1920,
          height: 1080
        },
        duration: 3.0
      },
      {
        name: '分割动画 - 按行',
        config: {
          text: '第一行\n第二行\n第三行',
          textColor: '#4ecdc4',
          position: 'center',
          zoomDirection: 'out',
          zoomAmount: 0.2,
          split: 'line',
          splitDelay: 0.3,
          splitDuration: 0.6,
          width: 1920,
          height: 1080
        },
        duration: 3.0
      },
      {
        name: '中文文本测试',
        config: {
          text: '动画系统测试',
          textColor: '#45b7d1',
          position: 'center',
          zoomDirection: 'in',
          zoomAmount: 0.25,
          width: 1920,
          height: 1080
        },
        duration: 2.0
      }
    ];

    const frames = [];
    const fps = 30;

    // 生成每个场景的帧
    for (const scene of scenes) {
      console.log(`📝 生成场景: ${scene.name}`);
      
      const titleElement = await createTitleElement(scene.config);
      const totalFrames = Math.floor(scene.duration * fps);
      
      for (let frame = 0; frame < totalFrames; frame++) {
        const progress = frame / (totalFrames - 1);
        
        // 清空画布
        fabricCanvas.clear();
        
        // 设置背景色
        fabricCanvas.setBackgroundColor('#1a1a1a', () => {});
        
        // 生成帧
        const frameData = await titleElement.readNextFrame(progress, fabricCanvas);
        
        if (frameData && frameData.data) {
          // 将帧数据保存为PNG
          const frameNumber = frames.length.toString().padStart(4, '0');
          const filename = `frame_${frameNumber}.png`;
          const filepath = resolve('./output', filename);
          
          // 创建ImageData并保存
          const imageData = new ImageData(
            new Uint8ClampedArray(frameData.data),
            frameData.width,
            frameData.height
          );
          
          // 使用canvas保存图片
          const tempCanvas = createCanvas(frameData.width, frameData.height);
          const ctx = tempCanvas.getContext('2d');
          ctx.putImageData(imageData, 0, 0);
          
          const buffer = tempCanvas.toBuffer('image/png');
          writeFileSync(filepath, buffer);
          
          frames.push({
            scene: scene.name,
            frame: frame,
            progress: progress,
            filename: filename
          });
          
          if (frame % 10 === 0) {
            console.log(`  ✓ 生成帧 ${frame + 1}/${totalFrames} (${(progress * 100).toFixed(1)}%)`);
          }
        }
      }
      
      await titleElement.close();
      console.log(`✓ 场景完成: ${scene.name} (${totalFrames} 帧)`);
    }

    console.log(`\n🎉 视频生成完成！`);
    console.log(`📊 统计信息:`);
    console.log(`- 总帧数: ${frames.length}`);
    console.log(`- 场景数: ${scenes.length}`);
    console.log(`- 帧率: ${fps} FPS`);
    console.log(`- 输出目录: ./output/`);
    
    // 生成帧列表文件
    const frameList = frames.map(f => `file '${f.filename}'\nduration ${1/fps}`).join('\n');
    writeFileSync('./output/frame_list.txt', frameList);
    
    console.log(`\n📝 使用FFmpeg生成视频:`);
    console.log(`ffmpeg -f concat -i ./output/frame_list.txt -c:v libx264 -pix_fmt yuv420p -r ${fps} ./output/test_video.mp4`);

  } catch (error) {
    console.error('❌ 生成失败:', error.message);
    console.error(error.stack);
  }
}

// 创建输出目录
import { mkdirSync } from 'fs';
try {
  mkdirSync('./output', { recursive: true });
} catch (error) {
  // 目录已存在
}

// 运行生成
generateTestVideo();
