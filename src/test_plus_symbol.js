import { FabricSplitText } from './utils/fabricSplitText.js';

// 测试 + 符号的问题
function testPlusSymbol() {
  console.log('测试 + 符号的问题...');
  
  const testText = "SPRING IN + OUT";
  console.log(`测试文本: "${testText}"`);
  
  // 创建 FabricSplitText 实例
  const splitText = new FabricSplitText(testText, {
    fontSize: 50,
    fontFamily: 'Arial',
    fill: '#ffffff',
    split: 'word'
  });
  
  console.log('\n=== 详细分析 + 符号 ===');
  
  // 分析字符分割中的 + 符号
  const plusChar = splitText.characters.find(c => c.char === '+');
  if (plusChar) {
    console.log('字符分割中的 + 符号:');
    console.log(`  位置: x=${plusChar.x.toFixed(2)}`);
    console.log(`  宽度: ${plusChar.width.toFixed(2)}`);
    console.log(`  高度: ${plusChar.height.toFixed(2)}`);
  }
  
  // 分析单词分割中的 + 符号
  const plusWord = splitText.words.find(w => w.word === '+');
  if (plusWord) {
    console.log('\n单词分割中的 + 符号:');
    console.log(`  位置: x=${plusWord.x.toFixed(2)}`);
    console.log(`  宽度: ${plusWord.width.toFixed(2)}`);
    console.log(`  高度: ${plusWord.height.toFixed(2)}`);
  }
  
  // 检查 + 符号前后的字符
  console.log('\n+ 符号前后的字符:');
  const plusIndex = testText.indexOf('+');
  if (plusIndex > 0) {
    const beforeChar = testText[plusIndex - 1];
    const afterChar = testText[plusIndex + 1];
    console.log(`  前一个字符: "${beforeChar}"`);
    console.log(`  后一个字符: "${afterChar}"`);
  }
  
  // 检查 + 符号在分割标记中的位置
  const tokens = splitText._splitTextIntoTokens();
  const plusTokenIndex = tokens.indexOf('+');
  console.log('\n+ 符号在分割标记中的位置:');
  console.log(`  分割标记: ${tokens.join(' | ')}`);
  console.log(`  + 符号索引: ${plusTokenIndex}`);
  
  if (plusTokenIndex > 0) {
    console.log(`  前一个标记: "${tokens[plusTokenIndex - 1]}"`);
    console.log(`  后一个标记: "${tokens[plusTokenIndex + 1]}"`);
  }
  
  // 检查位置是否正确
  console.log('\n位置正确性检查:');
  const expectedPlusX = 260; // 基于之前的测试结果
  const actualPlusX = plusChar ? plusChar.x : 0;
  const isCorrect = Math.abs(actualPlusX - expectedPlusX) < 0.1;
  console.log(`  期望位置: ${expectedPlusX}`);
  console.log(`  实际位置: ${actualPlusX.toFixed(2)}`);
  console.log(`  是否正确: ${isCorrect ? '✅' : '❌'}`);
  
  // 检查总宽度
  console.log(`\n总宽度: ${splitText.totalWidth.toFixed(2)}`);
}

testPlusSymbol();

