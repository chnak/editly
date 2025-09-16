import { creatomateTextEffects } from "./animations/CreatomateTextEffects.js";

/**
 * 调试 splitText 函数
 */
function debugSplitText() {
  console.log("🔍 调试 splitText 函数...");
  
  const testText = "ABC";
  
  console.log("\n📝 测试文本:", testText);
  
  const splitTypes = ['char', 'word', 'space', 'line', 'default'];
  
  splitTypes.forEach(splitType => {
    console.log(`\n分割类型: ${splitType}`);
    
    // 直接调用 splitText 方法
    const segments = creatomateTextEffects.splitText(testText, splitType);
    console.log(`  结果: [${segments.map(s => `"${s}"`).join(', ')}]`);
    console.log(`  段数: ${segments.length}`);
  });
  
  // 测试更复杂的文本
  const complexText = "Hello World 你好世界";
  console.log(`\n📝 复杂文本: ${complexText}`);
  
  splitTypes.forEach(splitType => {
    console.log(`\n分割类型: ${splitType}`);
    const segments = creatomateTextEffects.splitText(complexText, splitType);
    console.log(`  结果: [${segments.map(s => `"${s}"`).join(', ')}]`);
    console.log(`  段数: ${segments.length}`);
  });
}

// 运行调试
debugSplitText();
