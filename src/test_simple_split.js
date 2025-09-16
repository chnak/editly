import { creatomateTextEffects } from "./animations/CreatomateTextEffects.js";

/**
 * 测试文本分割功能
 */
function testSplitFunctionality() {
  console.log("🧪 开始测试文本分割功能...");
  
  const testText = "Hello World 你好世界";
  
  // 测试不同的分割类型
  const splitTypes = ['default', 'char', 'word', 'space', 'line', 'sentence', 'phrase'];
  
  splitTypes.forEach(splitType => {
    console.log(`\n📝 测试分割类型: ${splitType}`);
    
    try {
      // 测试打字机效果
      const typewriterResult = creatomateTextEffects.processTextEffect('typewriter', {
        text: testText,
        progress: 0.5,
        split: splitType
      });
      
      console.log(`  打字机效果: ${typewriterResult.visibleText} (剩余: ${typewriterResult.remainingText})`);
      
      // 测试逐字显示效果
      const revealResult = creatomateTextEffects.processTextEffect('reveal', {
        text: testText,
        progress: 0.5,
        split: splitType
      });
      
      console.log(`  逐字显示效果: ${revealResult.visibleChars.length} 个可见字符`);
      
      // 测试分割效果
      const splitResult = creatomateTextEffects.processTextEffect('split', {
        text: testText,
        progress: 0.5,
        split: splitType
      });
      
      console.log(`  分割效果: ${splitResult.segments.length} 个分割段`);
      
    } catch (error) {
      console.error(`  ❌ 分割类型 ${splitType} 测试失败:`, error.message);
    }
  });
  
  console.log("\n✅ 文本分割功能测试完成！");
}

// 运行测试
testSplitFunctionality();
