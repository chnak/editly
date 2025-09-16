import { creatomateTextEffects } from "./animations/CreatomateTextEffects.js";

/**
 * 详细调试分割效果
 */
function debugSplitDetailed() {
  console.log("🔍 详细调试分割效果...");
  
  const testText = "ABC";
  
  console.log("\n📝 测试文本:", testText);
  
  // 测试 split 效果
  console.log("\n🎬 测试 split 效果 (按字符分割):");
  
  for (let progress = 0; progress <= 1; progress += 0.2) {
    console.log(`\n进度 ${progress.toFixed(1)}:`);
    
    const result = creatomateTextEffects.processTextEffect('split', {
      text: testText,
      progress,
      split: 'char',
      segmentDelay: 0.3,
      segmentDuration: 0.6
    });
    
    console.log(`  分割段数: ${result.segments.length}`);
    console.log(`  进度: ${result.progress.toFixed(2)}`);
    console.log(`  完成: ${result.isComplete}`);
    
    result.segments.forEach((segment, index) => {
      console.log(`    ${index}: "${segment.text}" (透明度: ${segment.opacity.toFixed(2)}, 缩放: ${segment.scaleX.toFixed(2)}, 旋转: ${segment.rotation.toFixed(2)}, Y: ${segment.y.toFixed(2)})`);
    });
  }
  
  // 测试 waveSplit 效果
  console.log("\n🎬 测试 waveSplit 效果 (按字符分割):");
  
  for (let progress = 0; progress <= 1; progress += 0.2) {
    console.log(`\n进度 ${progress.toFixed(1)}:`);
    
    const result = creatomateTextEffects.processTextEffect('waveSplit', {
      text: testText,
      progress,
      split: 'char',
      segmentDelay: 0.3,
      segmentDuration: 0.6
    });
    
    console.log(`  分割段数: ${result.segments.length}`);
    console.log(`  进度: ${result.progress.toFixed(2)}`);
    console.log(`  完成: ${result.isComplete}`);
    
    result.segments.forEach((segment, index) => {
      console.log(`    ${index}: "${segment.text}" (透明度: ${segment.opacity.toFixed(2)}, 缩放: ${segment.scaleX.toFixed(2)}, 旋转: ${segment.rotation.toFixed(2)}, Y: ${segment.y.toFixed(2)})`);
    });
  }
}

// 运行调试
debugSplitDetailed();
