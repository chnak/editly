import { TextMetrics } from './utils/textMetrics.js';

// 详细测试 + 符号的分割和渲染
function testPlusDetailed() {
  console.log('详细测试 + 符号的分割和渲染...');
  
  const textMetrics = new TextMetrics({
    fontSize: 50,
    fontFamily: 'Arial'
  });
  
  const testText = "SPRING IN + OUT";
  console.log(`测试文本: "${testText}"`);
  
  // 测试分割标记
  const tokens = textMetrics.splitIntoTokens(testText);
  console.log('\n分割标记:');
  tokens.forEach((token, i) => {
    const displayToken = token === ' ' ? 'SPACE' : token;
    const isPunctuation = textMetrics.isPunctuation(token);
    const isMathSymbol = /[+\-*/=<>]/.test(token);
    console.log(`  ${i}: "${displayToken}" (标点: ${isPunctuation}, 数学符号: ${isMathSymbol})`);
  });
  
  // 测试字符位置
  const positions = textMetrics.getCharacterPositions(testText, 50);
  console.log('\n字符位置:');
  positions.forEach((pos, i) => {
    const char = pos.char === ' ' ? 'SPACE' : pos.char;
    if (char === '+' || char === 'SPACE') {
      console.log(`  ${i}: "${char}" x=${pos.x.toFixed(2)} width=${pos.width.toFixed(2)}`);
    }
  });
  
  // 测试 + 符号的宽度计算
  console.log('\n+ 符号宽度计算:');
  console.log(`  getCharacterWidth: ${textMetrics.getCharacterWidth('+', 50).toFixed(2)}`);
  console.log(`  getTextWidthWithFontSize: ${textMetrics.getTextWidthWithFontSize('+', 50).toFixed(2)}`);
  console.log(`  calculateWidth: ${textMetrics.widthCalculator.calculateWidth('+', 50).toFixed(2)}`);
  
  // 测试 + 符号在文本中的表现
  console.log('\n+ 符号在文本中的表现:');
  const plusIndex = testText.indexOf('+');
  if (plusIndex > 0) {
    const beforeText = testText.substring(0, plusIndex);
    const afterText = testText.substring(plusIndex + 1);
    const beforeWidth = textMetrics.getTextWidthWithFontSize(beforeText, 50);
    const plusWidth = textMetrics.getTextWidthWithFontSize('+', 50);
    const afterWidth = textMetrics.getTextWidthWithFontSize(afterText, 50);
    
    console.log(`  前文本: "${beforeText}" 宽度: ${beforeWidth.toFixed(2)}`);
    console.log(`  + 符号: "+" 宽度: ${plusWidth.toFixed(2)}`);
    console.log(`  后文本: "${afterText}" 宽度: ${afterWidth.toFixed(2)}`);
    console.log(`  总宽度: ${(beforeWidth + plusWidth + afterWidth).toFixed(2)}`);
  }
}

testPlusDetailed();

