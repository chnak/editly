import { creatomateTextEffects } from "./animations/CreatomateTextEffects.js";

/**
 * 调试分割效果
 */
function debugSplitEffect() {
  console.log("🔍 调试分割效果...");
  
  const testText = "Hello World";
  
  // 测试不同的分割类型
  console.log("\n📝 测试文本:", testText);
  
  // 测试 typewriter 效果
  console.log("\n🎬 测试 typewriter 效果:");
  const splitTypes = ['default', 'char', 'word', 'space'];
  
  splitTypes.forEach(splitType => {
    console.log(`\n  分割类型: ${splitType}`);
    
    for (let progress = 0; progress <= 1; progress += 0.2) {
      const result = creatomateTextEffects.processTextEffect('typewriter', {
        text: testText,
        progress,
        split: splitType,
        charDelay: 0.1
      });
      
      console.log(`    进度 ${progress.toFixed(1)}: "${result.visibleText}" (剩余: "${result.remainingText}")`);
    }
  });
  
  // 测试 reveal 效果
  console.log("\n🎬 测试 reveal 效果:");
  splitTypes.forEach(splitType => {
    console.log(`\n  分割类型: ${splitType}`);
    
    const result = creatomateTextEffects.processTextEffect('reveal', {
      text: testText,
      progress: 0.5,
      split: splitType,
      charDelay: 0.1
    });
    
    console.log(`    可见字符数: ${result.visibleChars.length}`);
    result.visibleChars.forEach((char, index) => {
      console.log(`      ${index}: "${char.char}" (透明度: ${char.opacity.toFixed(2)})`);
    });
  });
  
  // 测试 split 效果
  console.log("\n🎬 测试 split 效果:");
  splitTypes.forEach(splitType => {
    console.log(`\n  分割类型: ${splitType}`);
    
    const result = creatomateTextEffects.processTextEffect('split', {
      text: testText,
      progress: 0.5,
      split: splitType,
      segmentDelay: 0.1,
      segmentDuration: 0.3
    });
    
    console.log(`    分割段数: ${result.segments.length}`);
    result.segments.forEach((segment, index) => {
      console.log(`      ${index}: "${segment.text}" (透明度: ${segment.opacity.toFixed(2)}, 缩放: ${segment.scaleX.toFixed(2)})`);
    });
  });
}

// 运行调试
debugSplitEffect();
