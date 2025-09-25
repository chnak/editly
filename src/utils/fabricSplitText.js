import * as fabric from "fabric/node";
import { TextMetrics } from "./textMetrics.js";
import { createCanvas } from "canvas";

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
    
    // 初始化 TextMetrics
    this.textMetrics = new TextMetrics({
      fontSize: this.options.fontSize,
      fontFamily: this.options.fontFamily,
      lineHeight: this.options.lineHeight
    });
    
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
    
    // 使用 TextMetrics 计算所有字符的精确位置
    const characterPositions = this.textMetrics.getCharacterPositions(this.text, this.options.fontSize);
    
    for (let i = 0; i < characterPositions.length; i++) {
      const pos = characterPositions[i];
      const char = pos.char;
      const isSpace = char.trim() === '';
      const isPunctuation = this._isPunctuation(char);
      const isChinese = /[\u4e00-\u9fff]/.test(char);
      
      // 创建 Fabric.js Text 对象
      const textObj = new fabric.Text(char, {
        fontSize: this.options.fontSize,
        fontFamily: this.options.fontFamily,
        fill: this.options.fill,
        textAlign: 'left',
        originX: 'left',
        originY: 'top'
      });

      const charInfo = {
        text: textObj,
        char: char,
        index: i,
        isSpace: isSpace,
        isPunctuation: isPunctuation,
        isChinese: isChinese,
        width: pos.width, // 使用 OpenType.js 计算的精确宽度
        height: textObj.height,
        x: pos.x, // 使用 OpenType.js 计算的精确位置
        y: 0
      };
      
      this.characters.push(charInfo);
    }
  }

  /**
   * 创建单词分割
   */
  _createWords() {
    this.words = [];
    const tokens = this._splitTextIntoTokens();
    
    // 使用 OpenType.js 计算精确的字符位置
    const characterPositions = this.textMetrics.getCharacterPositions(this.text, this.options.fontSize);
    
    // 为每个单词找到对应的字符位置
    let charIndex = 0;
    
    for (let i = 0; i < tokens.length; i++) {
      const word = tokens[i];
      const isSpace = word.trim() === '';
      const isPunctuation = this._isPunctuation(word);
      
      // 创建 Fabric.js Text 对象
      const textObj = new fabric.Text(word, {
        fontSize: this.options.fontSize,
        fontFamily: this.options.fontFamily,
        fill: this.options.fill,
        textAlign: 'left',
        originX: 'left',
        originY: 'top'
      });

      // 使用 TextMetrics 计算精确宽度
      const actualWidth = this.textMetrics.getTextWidthWithFontSize(word, this.options.fontSize);
      
      // 找到这个单词在字符位置中的起始位置
      let wordStartX = 0;
      if (charIndex < characterPositions.length) {
        wordStartX = characterPositions[charIndex].x;
      }

      this.words.push({
        text: textObj,
        word: word,
        index: i,
        isSpace: isSpace,
        isPunctuation: isPunctuation,
        width: actualWidth, // 使用计算出的精确宽度
        height: textObj.height,
        x: wordStartX, // 使用 OpenType.js 计算的精确位置
        y: 0
      });
      
      // 更新字符索引 - 跳过这个单词的所有字符
      charIndex += word.length;
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
   * 注意：字符位置已经在 _createCharacters 中通过 OpenType.js 精确计算了
   * 这里只需要设置 y 坐标和计算总尺寸
   */
  _calculateCharacterPositions() {
    const lineHeight = this.options.fontSize * this.options.lineHeight;
    
    // 字符位置已经在 _createCharacters 中通过 OpenType.js 精确计算了
    // 这里只需要设置 y 坐标
    for (let i = 0; i < this.characters.length; i++) {
      const char = this.characters[i];
      char.y = 0; // 设置 y 坐标
    }
    
    // 计算总宽度（使用最后一个字符的位置 + 宽度）
    if (this.characters.length > 0) {
      const lastChar = this.characters[this.characters.length - 1];
      this.totalWidth = lastChar.x + lastChar.width;
    } else {
      this.totalWidth = 0;
    }
    
    this.totalHeight = lineHeight;
  }

  /**
   * 计算动态字符间距
   * 使用 TextMetrics 的智能间距计算
   */
  _calculateDynamicCharSpacing() {
    if (!this.options.dynamicSpacing) {
      return [];
    }
    
    const tokens = this.characters.map(c => c.char);
    return this.textMetrics.calculateSmartSpacing(tokens, this.options.fontSize);
  }

  /**
   * 计算单词位置
   * 注意：单词位置已经在 _createWords 中通过 OpenType.js 精确计算了
   * 这里只需要设置 y 坐标和计算总尺寸
   */
  _calculateWordPositions() {
    const lineHeight = this.options.fontSize * this.options.lineHeight;
    
    // 单词位置已经在 _createWords 中通过 OpenType.js 精确计算了
    // 这里只需要设置 y 坐标
    for (let i = 0; i < this.words.length; i++) {
      const word = this.words[i];
      word.y = 0; // 设置 y 坐标
    }
    
    // 计算总宽度（使用最后一个单词的位置 + 宽度）
    if (this.words.length > 0) {
      const lastWord = this.words[this.words.length - 1];
      this._calculatedWordWidth = lastWord.x + lastWord.width;
    } else {
      this._calculatedWordWidth = 0;
    }
    
    this.totalHeight = lineHeight;
  }

  /**
   * 计算动态单词间距
   * 使用 TextMetrics 的智能间距计算
   */
  _calculateDynamicWordSpacing() {
    if (!this.options.dynamicSpacing) {
      return [];
    }
    
    const tokens = this.words.map(w => w.word);
    return this.textMetrics.calculateSmartSpacing(tokens, this.options.fontSize);
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

  /**
   * 智能分割文本为标记（单词、空格、标点符号）
   */
  _splitTextIntoTokens() {
    return this.textMetrics.splitIntoTokens(this.text);
  }

  /**
   * 判断字符是否为标点符号
   */
  _isPunctuation(char) {
    return this.textMetrics.isPunctuation(char);
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
