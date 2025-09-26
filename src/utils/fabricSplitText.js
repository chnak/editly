import * as fabric from "fabric/node";
import { createCanvas } from "canvas";
const SIGN = '_$_';

const MAX_LENGTH = 20; // 每段最大字数

/**
   * 计算混合中英文的语音时间
   */
function calculateSpeechTimeMixed(text, chineseSpeed = 200, englishSpeed = 150) {
  if (!text || typeof text !== 'string') return 0;

  // 统计中文字符数（Unicode中文范围）
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
  const chineseCount = chineseChars.length;

  // 统计英文单词数（按空格分割，过滤空值）
  const englishWords = text
      .replace(/[\u4e00-\u9fa5]/g, ' ') // 移除中文以准确统计英文单词
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);
  const englishCount = englishWords.length;

  // 计算两部分时间（秒）
  const chineseTime = (chineseCount / chineseSpeed) * 60;
  const englishTime = (englishCount / englishSpeed) * 60;

  // 返回总时间（四舍五入）
  return Math.round(chineseTime + englishTime);
}

/**
* 同步文本段落时长与最小时长
*/
function syncDurationWithMinDuration(textSegments, totalDuration, minDuration = 0.2) {
  const totalChars = textSegments.join("").length;
  let remainingDuration = totalDuration;

  // 先分配保底时长
  const segments = textSegments.map(text => {
    const duration = Math.max(
      minDuration,
      (text.length / totalChars) * totalDuration
    );
    remainingDuration -= duration;
    return { text, duration };
  });

  // 如果剩余时间 > 0，按字数比例再分配
  if (remainingDuration > 0) {
    const extraPerChar = remainingDuration / totalChars;
    segments.forEach(seg => {
      seg.duration += seg.text.length * extraPerChar;
    });
  }

  return segments;
}
export const parseSubtitles=function parseSubtitles(text,duration) {
  const text_list_with_duration=calculateSpeechTimeMixed(text);
  const text_list=splitText(text);
  duration=duration||text_list_with_duration
  return syncDurationWithMinDuration(text_list,duration);
}
/**
* 分割文本
*/
function splitText(text,maxLength = MAX_LENGTH) {
  // 1. 去除多余的引号和换行符
  text = text.replace(/["“”'‘’\n\r]/g, '');

  // 2. 替换标点为 SIGN + 标点（标点后插入 SIGN）
  const regexp = /([。？！,!;；，,])/g;
  text = text.replace(regexp, `$1${SIGN}`); // 标点后加 SIGN

  // 3. 按 SIGN 分割，并过滤空字符串
  let segments = text.split(SIGN).filter(seg => seg.trim());

  // 4. 处理长句子（超过 MAX_LENGTH 的按字数分割）
  segments = segments.flatMap(seg => {
    if (seg.length <= maxLength) return seg;
    const chunks = [];
    let start = 0;
    while (start < seg.length) {
      let end = Math.min(start + maxLength, seg.length);
      // 避免在标点中间切断
      if (end < seg.length && /[，。！？、]/.test(seg[end])) {
        end++;
      }
      chunks.push(seg.slice(start, end));
      start = end;
    }
    return chunks;
  });

  return segments;
}

/**
 * 基于 Fabric.js 的 SplitText 实现
 * 参考 PIXI SplitText 的设计理念
 */
export class FabricSplitText {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#000000',
      textAlign: 'left',
      charSpacing: 0,
      wordSpacing: 0,
      lineHeight: 1.2,
      // 智能间距配置
      autoSpacing: true,
      dynamicSpacing: true,  // 启用动态间距调整
      minCharSpacing: 0.05, // 最小字符间距（相对于字体大小）
      maxCharSpacing: 0.3,  // 最大字符间距
      minWordSpacing: 0.1,  // 最小单词间距
      maxWordSpacing: 0.5,  // 最大单词间距
      ...options
    };
    
    this.characters = [];
    this.words = [];
    this.lines = [];
    this.totalWidth = 0;
    this.totalHeight = 0;
    
    this._init();
  }

  /**
   * 初始化分割文本
   */
  _init() {
    this._createCharacters();
    this._createWords();
    this._createLines();
    this._calculateSmartSpacing();
    this._calculateDimensions();
  }
  
  /**
   * 计算智能间距
   */
  _calculateSmartSpacing() {
    if (!this.options.autoSpacing) return;
    
    // 基于字体大小和文本内容计算智能间距
    const fontSize = this.options.fontSize;
    const textLength = this.text.length;
    const hasSpaces = this.text.includes(' ');
    
    // 计算字符间距
    if (this.options.charSpacing === 0) {
      // 基于字体大小和文本长度动态计算
      let charSpacingRatio = Math.max(
        this.options.minCharSpacing,
        Math.min(this.options.maxCharSpacing, fontSize * 0.001 + 0.1)
      );
      
      // 如果文本较短，增加间距
      if (textLength < 10) {
        charSpacingRatio *= 1.2;
      }
      
      this.options.charSpacing = fontSize * charSpacingRatio;
    }
    
    // 计算单词间距
    if (this.options.wordSpacing === 0) {
      let wordSpacingRatio = Math.max(
        this.options.minWordSpacing,
        Math.min(this.options.maxWordSpacing, fontSize * 0.002 + 0.2)
      );
      
      // 如果包含空格，适当调整单词间距
      if (hasSpaces) {
        wordSpacingRatio *= 1.1;
      }
      
      this.options.wordSpacing = fontSize * wordSpacingRatio;
    }
  }

  /**
   * 创建字符分割
   */
  _createCharacters() {
    this.characters = [];
    const chars = this.text.split('');
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const isSpace = char.trim() === '';
      const isSymbol = /[^\w\s\u4e00-\u9fff]/.test(char); // 检测符号字符
      
      // 创建 Fabric.js Text 对象
      const textObj = new fabric.Text(char, {
        fontSize: this.options.fontSize,
        fontFamily: this.options.fontFamily,
        fill: this.options.fill,
        textAlign: 'left',
        originX: 'left',
        originY: 'top'
      });

      // 对于空格字符，使用更准确的宽度计算
      let charWidth = textObj.width;
      if (isSpace) {
        // 空格字符使用字体大小的1/4作为宽度，这是更准确的做法
        charWidth = this.options.fontSize * 0.25;
      } else if (isSymbol) {
        // 符号字符可能需要特殊处理
        charWidth = Math.max(textObj.width, this.options.fontSize * 0.3);
      }

      this.characters.push({
        text: textObj,
        char: char,
        index: i,
        isSpace: isSpace,
        isSymbol: isSymbol,
        width: charWidth,
        height: textObj.height,
        x: 0, // 将在 _calculateDimensions 中设置
        y: 0
      });
    }
  }

  /**
   * 创建单词分割
   */
  _createWords() {
    this.words = [];
    const words = this.text.split(/(\s+)/).filter(word => word.length > 0);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isSpace = word.trim() === '';
      
      // 创建 Fabric.js Text 对象
      const textObj = new fabric.Text(word, {
        fontSize: this.options.fontSize,
        fontFamily: this.options.fontFamily,
        fill: this.options.fill,
        textAlign: 'left',
        originX: 'left',
        originY: 'top'
      });

      // 对于空格单词，使用更准确的宽度计算
      let wordWidth = textObj.width;
      if (isSpace) {
        // 空格单词的宽度基于空格数量和字体大小
        const spaceCount = word.length;
        wordWidth = spaceCount * this.options.fontSize * 0.25;
      }

      this.words.push({
        text: textObj,
        word: word,
        index: i,
        isSpace: isSpace,
        width: wordWidth,
        height: textObj.height,
        x: 0, // 将在 _calculateDimensions 中设置
        y: 0
      });
    }
  }

  /**
   * 创建行分割
   */
  _createLines() {
    this.lines = [];
    const lines = this.text.split('\n').filter(line => line.trim().length > 0);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 创建 Fabric.js Text 对象
      const textObj = new fabric.Text(line, {
        fontSize: this.options.fontSize,
        fontFamily: this.options.fontFamily,
        fill: this.options.fill,
        textAlign: 'left',
        originX: 'left',
        originY: 'top'
      });

      this.lines.push({
        text: textObj,
        line: line,
        index: i,
        width: textObj.width,
        height: textObj.height,
        x: 0, // 将在 _calculateDimensions 中设置
        y: 0
      });
    }
  }

  /**
   * 计算尺寸和位置
   */
  _calculateDimensions() {
    this._calculateCharacterPositions();
    this._calculateWordPositions();
    this._calculateLinePositions();
    
    // 确保 totalWidth 使用正确的值
    // 对于单词分割，使用计算出的实际宽度
    if (this.words.length > 0 && this._calculatedWordWidth !== undefined) {
      this.totalWidth = this._calculatedWordWidth;
    } else if (this.words.length > 0) {
      // 回退到最后一个单词的位置 + 宽度
      const lastWord = this.words[this.words.length - 1];
      this.totalWidth = lastWord.x + lastWord.width;
    }
    
    // 对于字符分割，使用字符位置计算的实际宽度
    if (this.characters.length > 0) {
      const lastChar = this.characters[this.characters.length - 1];
      this.totalWidth = Math.max(this.totalWidth, lastChar.x + lastChar.width);
    }
  }

  /**
   * 计算字符位置
   */
  _calculateCharacterPositions() {
    let currentX = 0;
    const lineHeight = this.options.fontSize * this.options.lineHeight;
    
    // 计算动态字符间距
    const dynamicSpacing = this._calculateDynamicCharSpacing();
    
    for (let i = 0; i < this.characters.length; i++) {
      const char = this.characters[i];
      
      char.x = currentX;
      char.y = 0;
      
      // 计算下一个字符的位置
      currentX += char.width;
      
      // 添加字符间距（除了最后一个字符）
      if (i < this.characters.length - 1) {
        if (char.isSpace) {
          // 对于空格，添加较小的间距以保持自然感
          currentX += this.options.charSpacing * 0.2;
        } else if (char.isSymbol) {
          // 对于符号，添加适中的间距
          currentX += this.options.charSpacing * 0.8;
        } else {
          // 对于普通字符，添加正常间距
          const spacing = dynamicSpacing[i] || this.options.charSpacing;
          currentX += spacing;
        }
      }
    }
    
    this.totalWidth = currentX;
    this.totalHeight = lineHeight;
  }

  /**
   * 计算动态字符间距
   * 根据字符宽度差异来调整间距，使显示更匀称
   */
  _calculateDynamicCharSpacing() {
    const spacing = [];
    
    // 如果未启用动态间距，返回空数组
    if (!this.options.dynamicSpacing) {
      return spacing;
    }
    
    const chars = this.characters.filter(c => !c.isSpace);
    
    if (chars.length <= 1) {
      return spacing;
    }
    
    // 计算字符宽度统计
    const widths = chars.map(c => c.width);
    const avgWidth = widths.reduce((sum, w) => sum + w, 0) / widths.length;
    const minWidth = Math.min(...widths);
    const maxWidth = Math.max(...widths);
    const widthRange = maxWidth - minWidth;
    
    // 如果宽度差异很小，使用固定间距
    if (widthRange < avgWidth * 0.2) {
      for (let i = 0; i < chars.length - 1; i++) {
        spacing.push(this.options.charSpacing);
      }
      return spacing;
    }
    
    // 计算动态间距
    for (let i = 0; i < chars.length - 1; i++) {
      const currentChar = chars[i];
      const nextChar = chars[i + 1];
      
      // 基于当前字符和下一个字符的宽度计算间距
      const currentWidthRatio = currentChar.width / avgWidth;
      const nextWidthRatio = nextChar.width / avgWidth;
      
      // 计算基础间距
      let baseSpacing = this.options.charSpacing;
      
      // 特殊处理符号字符
      if (currentChar.isSymbol || nextChar.isSymbol) {
        // 符号字符使用较小的间距
        baseSpacing *= 0.6;
      }
      // 如果两个字符都很窄，增加间距
      else if (currentWidthRatio < 0.7 && nextWidthRatio < 0.7) {
        baseSpacing *= 1.2;
      }
      // 如果两个字符都很宽，减少间距
      else if (currentWidthRatio > 1.3 && nextWidthRatio > 1.3) {
        baseSpacing *= 0.7;
      }
      // 如果宽度差异很大，使用中等间距
      else if (Math.abs(currentWidthRatio - nextWidthRatio) > 0.6) {
        baseSpacing *= 1.05;
      }
      
      // 确保间距在合理范围内
      const minSpacing = this.options.charSpacing * 0.2;
      const maxSpacing = this.options.charSpacing * 1.5;
      baseSpacing = Math.max(minSpacing, Math.min(maxSpacing, baseSpacing));
      
      spacing.push(baseSpacing);
    }
    
    return spacing;
  }

  /**
   * 计算单词位置
   */
  _calculateWordPositions() {
    let currentX = 0;
    const lineHeight = this.options.fontSize * this.options.lineHeight;
    
    // 计算动态单词间距
    const dynamicSpacing = this._calculateDynamicWordSpacing();
    
    for (let i = 0; i < this.words.length; i++) {
      const word = this.words[i];
      
      word.x = currentX;
      word.y = 0;
      
      // 计算下一个单词的位置
      currentX += word.width;
      
      // 添加单词间距（除了最后一个单词）
      if (i < this.words.length - 1) {
        if (word.isSpace) {
          // 对于空格，添加较小的间距以保持自然感
          currentX += this.options.wordSpacing * 0.3;
        } else {
          // 对于普通单词，添加正常间距
          const spacing = dynamicSpacing[i] || this.options.wordSpacing;
          currentX += spacing;
        }
      }
    }
    
    // 将计算出的最终宽度保存为实例变量，供 _calculateDimensions 使用
    this._calculatedWordWidth = currentX;
    this.totalHeight = lineHeight;
  }

  /**
   * 计算动态单词间距
   * 根据单词长度差异来调整间距，使显示更匀称
   */
  _calculateDynamicWordSpacing() {
    const spacing = [];
    
    // 如果未启用动态间距，返回空数组
    if (!this.options.dynamicSpacing) {
      return spacing;
    }
    
    const words = this.words.filter(w => !w.isSpace);
    
    if (words.length <= 1) {
      return spacing;
    }
    
    // 计算单词宽度统计
    const widths = words.map(w => w.width);
    const avgWidth = widths.reduce((sum, w) => sum + w, 0) / widths.length;
    const minWidth = Math.min(...widths);
    const maxWidth = Math.max(...widths);
    const widthRange = maxWidth - minWidth;
    
    // 如果宽度差异很小，使用固定间距
    if (widthRange < avgWidth * 0.3) {
      for (let i = 0; i < words.length - 1; i++) {
        spacing.push(this.options.wordSpacing);
      }
      return spacing;
    }
    
    // 计算动态间距
    for (let i = 0; i < words.length - 1; i++) {
      const currentWord = words[i];
      const nextWord = words[i + 1];
      
      // 基于当前单词和下一个单词的长度计算间距
      const currentWidthRatio = currentWord.width / avgWidth;
      const nextWidthRatio = nextWord.width / avgWidth;
      
      // 计算基础间距
      let baseSpacing = this.options.wordSpacing;
      
      // 如果两个单词都很短，增加间距
      if (currentWidthRatio < 0.8 && nextWidthRatio < 0.8) {
        baseSpacing *= 1.3;
      }
      // 如果两个单词都很长，减少间距
      else if (currentWidthRatio > 1.2 && nextWidthRatio > 1.2) {
        baseSpacing *= 0.8;
      }
      // 如果长度差异很大，使用中等间距
      else if (Math.abs(currentWidthRatio - nextWidthRatio) > 0.5) {
        baseSpacing *= 1.1;
      }
      
      // 确保间距在合理范围内
      const minSpacing = this.options.wordSpacing * 0.5;
      const maxSpacing = this.options.wordSpacing * 1.8;
      baseSpacing = Math.max(minSpacing, Math.min(maxSpacing, baseSpacing));
      
      spacing.push(baseSpacing);
    }
    
    return spacing;
  }

  /**
   * 计算行位置
   */
  _calculateLinePositions() {
    let currentY = 0;
    const lineHeight = this.options.fontSize * this.options.lineHeight;
    let maxWidth = 0;
    
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      
      line.x = 0;
      line.y = currentY;
      
      // 更新最大宽度
      maxWidth = Math.max(maxWidth, line.width);
      
      // 计算下一行的位置
      currentY += lineHeight;
    }
    
    this.totalWidth = maxWidth;
    this.totalHeight = currentY;
  }

  /**
   * 获取字符数组
   */
  getCharacters() {
    return this.characters;
  }

  /**
   * 获取单词数组
   */
  getWords() {
    return this.words;
  }

  /**
   * 获取行数组
   */
  getLines() {
    return this.lines;
  }

  /**
   * 获取总宽度
   */
  getTotalWidth() {
    return this.totalWidth;
  }

  /**
   * 获取总高度
   */
  getTotalHeight() {
    return this.totalHeight;
  }

  /**
   * 获取指定分割类型的数据
   */
  getSegments(type = 'char') {
    switch (type) {
      case 'char':
      case 'letter':
        return this.characters;
      case 'word':
        return this.words;
      case 'line':
        return this.lines;
      default:
        return this.characters;
    }
  }

  /**
   * 设置字符间距
   */
  setCharSpacing(spacing) {
    this.options.charSpacing = spacing;
    this._calculateCharacterPositions();
  }

  /**
   * 设置单词间距
   */
  setWordSpacing(spacing) {
    this.options.wordSpacing = spacing;
    this._calculateWordPositions();
  }

  /**
   * 设置行高
   */
  setLineHeight(lineHeight) {
    this.options.lineHeight = lineHeight;
    this._calculateDimensions();
  }

  /**
   * 设置字体大小
   */
  setFontSize(fontSize) {
    this.options.fontSize = fontSize;
    this._init(); // 重新初始化
  }

  /**
   * 设置字体族
   */
  setFontFamily(fontFamily) {
    this.options.fontFamily = fontFamily;
    this._init(); // 重新初始化
  }

  /**
   * 设置文本颜色
   */
  setFill(fill) {
    this.options.fill = fill;
    
    // 更新所有文本对象的颜色
    [...this.characters, ...this.words, ...this.lines].forEach(segment => {
      segment.text.set('fill', fill);
    });
  }

  /**
   * 获取指定字符的边界框
   */
  getCharacterBounds(index) {
    if (index >= 0 && index < this.characters.length) {
      const char = this.characters[index];
      return {
        x: char.x,
        y: char.y,
        width: char.width,
        height: char.height
      };
    }
    return null;
  }

  /**
   * 获取指定单词的边界框
   */
  getWordBounds(index) {
    if (index >= 0 && index < this.words.length) {
      const word = this.words[index];
      return {
        x: word.x,
        y: word.y,
        width: word.width,
        height: word.height
      };
    }
    return null;
  }

  /**
   * 获取指定行的边界框
   */
  getLineBounds(index) {
    if (index >= 0 && index < this.lines.length) {
      const line = this.lines[index];
      return {
        x: line.x,
        y: line.y,
        width: line.width,
        height: line.height
      };
    }
    return null;
  }

  /**
   * 销毁对象，清理资源
   */
  destroy() {
    // 清理所有文本对象
    [...this.characters, ...this.words, ...this.lines].forEach(segment => {
      if (segment.text && segment.text.dispose) {
        segment.text.dispose();
      }
    });
    
    this.characters = [];
    this.words = [];
    this.lines = [];
  }
}

/**
 * 创建 SplitText 实例的工厂函数
 */
export function createSplitText(text, options = {}) {
  return new FabricSplitText(text, options);
}

/**
 * 批量创建 SplitText 实例
 */
export function createMultipleSplitText(texts, options = {}) {
  return texts.map(text => new FabricSplitText(text, options));
}
