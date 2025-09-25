import { FabricSplitText } from './utils/fabricSplitText.js';

// 测试 segment 对象的结构
function testSegmentStructure() {
  console.log('测试 segment 对象的结构...');
  
  const testText = "SPRING IN + OUT";
  console.log(`测试文本: "${testText}"`);
  
  // 创建 FabricSplitText 实例
  const splitText = new FabricSplitText(testText, {
    fontSize: 50,
    fontFamily: 'Arial',
    fill: '#ffffff',
    split: 'word'
  });
  
  console.log('\n=== 单词分割的 segment 结构 ===');
  splitText.words.forEach((segment, i) => {
    console.log(`\nSegment ${i}:`);
    console.log(`  word: "${segment.word}"`);
    console.log(`  char: ${segment.char}`);
    console.log(`  text: ${segment.text}`);
    console.log(`  text.text: ${segment.text ? segment.text.text : 'undefined'}`);
    console.log(`  isSpace: ${segment.isSpace}`);
    console.log(`  isPunctuation: ${segment.isPunctuation}`);
    console.log(`  x: ${segment.x}`);
    console.log(`  y: ${segment.y}`);
    console.log(`  width: ${segment.width}`);
    console.log(`  height: ${segment.height}`);
    
    // 测试文本内容获取
    const textContent = segment.char || (segment.text && segment.text.text) || segment.text || '';
    console.log(`  获取的文本内容: "${textContent}"`);
  });
  
  console.log('\n=== 字符分割的 segment 结构 ===');
  splitText.characters.forEach((segment, i) => {
    if (segment.char === '+' || segment.char === ' ') {
      console.log(`\nCharacter ${i}:`);
      console.log(`  char: "${segment.char}"`);
      console.log(`  text: ${segment.text}`);
      console.log(`  text.text: ${segment.text ? segment.text.text : 'undefined'}`);
      console.log(`  isSpace: ${segment.isSpace}`);
      console.log(`  isPunctuation: ${segment.isPunctuation}`);
      console.log(`  x: ${segment.x}`);
      console.log(`  y: ${segment.y}`);
      console.log(`  width: ${segment.width}`);
      console.log(`  height: ${segment.height}`);
      
      // 测试文本内容获取
      const textContent = segment.char || (segment.text && segment.text.text) || segment.text || '';
      console.log(`  获取的文本内容: "${textContent}"`);
    }
  });
}

testSegmentStructure();

