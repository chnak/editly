import * as opentype from "opentype.js";
import { fontLoader } from "./fontLoader.js";

/**
 * 基于 OpenType.js 的文本宽度计算器
 */
class TextWidthCalculator {
    constructor(fontFamily = 'Arial', fontSize = 16) {
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.font = null;
        this.loadFont();
    }

    async loadFont() {
        try {
            // 尝试从字体加载器获取字体
            this.font = fontLoader.getFont(this.fontFamily);
            
            // 如果没有找到，尝试加载默认字体
            if (!this.font) {
                this.font = await fontLoader.loadDefaultFont(this.fontFamily);
            }
        } catch (error) {
            console.warn('Failed to load font, using estimation:', error);
            this.font = null;
        }
    }

    calculateWidth(text, fontSize = null) {
        const size = fontSize || this.fontSize;
        
        // 对空格使用更合适的宽度
        if (text === ' ' || text === '\t' || text === '\n') {
            return size * 0.2;
        }
        
        if (this.font) {
            try {
                // 使用 OpenType.js 计算精确宽度
                const path = this.font.getPath(text, 0, 0, size);
                const bbox = path.getBoundingBox();
                return bbox.x2 - bbox.x1; // 宽度 = 右边界 - 左边界
            } catch (error) {
                console.warn('OpenType.js 计算失败，使用估算:', error);
                return this.estimateWidth(text, size);
            }
        } else {
            // 回退到基于字符的估算
            return this.estimateWidth(text, size);
        }
    }

    /**
     * 计算文本中每个字符的位置和宽度
     * 这是关键方法，用于分割文本时保持精确的字符位置
     */
    calculateCharacterPositions(text, fontSize = null) {
        const size = fontSize || this.fontSize;
        const positions = [];
        
        // 如果字体未加载，使用估算方法
        if (!this.font) {
            return this.estimateCharacterPositions(text, size);
        }
        
        try {
            // 使用 OpenType.js 的 advanceWidth 属性来获取更精确的字符宽度
            let currentX = 0;
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                
                // 对空格使用更合适的宽度
                let charWidth;
                if (char === ' ' || char === '\t' || char === '\n') {
                    charWidth = size * 0.2;
                } else {
                    // 获取字符的 advanceWidth（包括字距调整）
                    const glyph = this.font.charToGlyph(char);
                    charWidth = glyph.advanceWidth ? glyph.advanceWidth * (size / this.font.unitsPerEm) : this.calculateCharacterWidth(char, size);
                }
                
                positions.push({
                    char: char,
                    x: currentX,
                    width: charWidth,
                    index: i
                });
                
                currentX += charWidth;
            }
            
            return positions;
        } catch (error) {
            console.warn('OpenType.js 字符位置计算失败，使用估算:', error);
            return this.estimateCharacterPositions(text, size);
        }
    }

    /**
     * 估算字符位置（当字体不可用时）
     */
    estimateCharacterPositions(text, fontSize) {
        const positions = [];
        let currentX = 0;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            // 对空格使用更合适的宽度
            let charWidth;
            if (char === ' ' || char === '\t' || char === '\n') {
                charWidth = fontSize * 0.2;
            } else {
                charWidth = this.estimateCharacterWidth(char, fontSize);
            }
            
            positions.push({
                char: char,
                x: currentX,
                width: charWidth,
                index: i
            });
            
            currentX += charWidth;
        }
        
        return positions;
    }

    estimateWidth(text, fontSize) {
        // 基于字符类型的宽度估算
        let totalWidth = 0;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charWidth = this.getCharacterWidth(char, fontSize);
            totalWidth += charWidth;
        }
        
        return totalWidth;
    }

    getCharacterWidth(char, fontSize) {
        // 对空格使用更合适的宽度（字体大小的 0.2 倍）
        if (char === ' ' || char === '\t' || char === '\n') {
            return fontSize * 0.2;
        }
        
        if (this.font) {
            try {
                // 使用 OpenType.js 计算单个字符的精确宽度
                const path = this.font.getPath(char, 0, 0, fontSize);
                const bbox = path.getBoundingBox();
                return bbox.x2 - bbox.x1;
            } catch (error) {
                // 如果失败，回退到估算
                return this.estimateCharacterWidth(char, fontSize);
            }
        } else {
            return this.estimateCharacterWidth(char, fontSize);
        }
    }

    estimateCharacterWidth(char, fontSize) {
        // 基于字符类型的宽度估算
        const isChinese = /[\u4e00-\u9fff]/.test(char);
        const isPunctuation = this.isPunctuation(char);
        const isSpace = /\s/.test(char);
        const isDigit = /\d/.test(char);
        const isLetter = /[a-zA-Z]/.test(char);
        
        if (isSpace) {
            return fontSize * 0.3; // 空格
        } else if (isChinese) {
            return fontSize; // 中文字符通常是正方形
        } else if (isPunctuation) {
            return fontSize * 0.4; // 标点符号
        } else if (isDigit) {
            return fontSize * 0.6; // 数字
        } else if (isLetter) {
            return fontSize * 0.6; // 英文字母
        } else {
            return fontSize * 0.5; // 其他字符
        }
    }

    isPunctuation(char) {
        const englishPunctuation = /[.,!?;:'"()[\]{}@#$%^&*+=|\\~`<>/]/;
        const chinesePunctuation = /[，。！？；：""''（）【】《》〈〉「」『』〔〕…—、]/;
        const otherSymbols = /[±×÷=≠≤≥<>≈∞∑∏∫√∆∇∂]/;
        return englishPunctuation.test(char) || chinesePunctuation.test(char) || otherSymbols.test(char);
    }
}

/**
 * 文本测量和布局工具
 */
export class TextMetrics {
    constructor(options = {}) {
        this.options = {
            maxWidth: 80,
            lineHeight: 1,
            tabSize: 4,
            fontSize: 16,
            fontFamily: 'Arial', // 添加字体族选项
            ...options
        };
        
        this.widthCalculator = new TextWidthCalculator(
            this.options.fontFamily, 
            this.options.fontSize
        );
    }

    // 计算单行文本宽度
    getTextWidth(text) {
        return this.widthCalculator.calculateWidth(text);
    }

    // 计算文本高度（考虑换行）
    getTextHeight(text, maxWidth = null) {
        const width = maxWidth || this.options.maxWidth;
        const wrappedLines = this.wrapText(text, width);
        return wrappedLines.length * this.options.lineHeight;
    }

    // 获取文本的完整尺寸信息
    getTextSize(text, maxWidth = null) {
        const width = maxWidth || this.options.maxWidth;
        const lines = this.wrapText(text, width);
        
        const actualWidth = lines.reduce((max, line) => {
            return Math.max(max, this.getTextWidth(line));
        }, 0);
        
        const actualHeight = lines.length * this.options.lineHeight;
        
        return {
            width: actualWidth,
            height: actualHeight,
            lineCount: lines.length,
            lines: lines,
            characterCount: text.length,
            wordCount: text.split(/\s+/).filter(word => word.length > 0).length
        };
    }

    // 高级文本换行（支持tab、保留格式）
    wrapText(text, maxWidth) {
        // 替换tab为空格
        const tabReplaced = text.replace(/\t/g, ' '.repeat(this.options.tabSize));
        const paragraphs = tabReplaced.split('\n');
        const allLines = [];
        
        paragraphs.forEach(paragraph => {
            if (paragraph.trim() === '') {
                allLines.push('');
                return;
            }
            
            const words = paragraph.split(/\s+/);
            const lines = [];
            let currentLine = '';
            
            words.forEach(word => {
                if (word === '') return;
                
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const testWidth = this.getTextWidth(testLine);
                
                if (testWidth <= maxWidth) {
                    currentLine = testLine;
                } else {
                    if (currentLine) lines.push(currentLine);
                    currentLine = word;
                }
            });
            
            if (currentLine) lines.push(currentLine);
            allLines.push(...lines);
        });
        
        return allLines;
    }

    // 计算文本在指定宽度内的最佳字体大小（模拟）
    calculateOptimalFontSize(text, containerWidth, containerHeight) {
        const baseSize = this.getTextSize(text);
        const widthRatio = containerWidth / baseSize.width;
        const heightRatio = containerHeight / baseSize.height;
        
        return Math.min(widthRatio, heightRatio) * 100; // 返回百分比
    }

    // 文本对齐计算
    calculateAlignment(text, containerWidth, alignment = 'left') {
        const lines = this.wrapText(text, containerWidth);
        const alignedLines = [];
        
        lines.forEach(line => {
            const lineWidth = this.getTextWidth(line);
            const padding = Math.max(0, containerWidth - lineWidth);
            
            switch (alignment) {
                case 'left':
                    alignedLines.push(line + ' '.repeat(padding));
                    break;
                case 'right':
                    alignedLines.push(' '.repeat(padding) + line);
                    break;
                case 'center':
                    const leftPad = Math.floor(padding / 2);
                    const rightPad = padding - leftPad;
                    alignedLines.push(' '.repeat(leftPad) + line + ' '.repeat(rightPad));
                    break;
                case 'justify':
                    alignedLines.push(this.justifyLine(line, containerWidth));
                    break;
                default:
                    alignedLines.push(line);
            }
        });
        
        return alignedLines;
    }

    // 两端对齐
    justifyLine(line, containerWidth) {
        const words = line.split(/\s+/);
        if (words.length <= 1) return line;
        
        const wordsWidth = words.reduce((sum, word) => 
            sum + this.getTextWidth(word), 0);
        const totalSpacesWidth = containerWidth - wordsWidth;
        const spaceCount = words.length - 1;
        const spaceWidth = Math.floor(totalSpacesWidth / spaceCount);
        const extraSpaces = totalSpacesWidth % spaceCount;
        
        let justified = '';
        words.forEach((word, index) => {
            justified += word;
            if (index < words.length - 1) {
                const spaces = spaceWidth + (index < extraSpaces ? 1 : 0);
                justified += ' '.repeat(spaces);
            }
        });
        
        return justified;
    }

    // 计算字符的精确宽度（基于字体大小）
    getCharacterWidth(char, fontSize = null) {
        const size = fontSize || this.options.fontSize;
        return this.widthCalculator.getCharacterWidth(char, size);
    }

    // 计算文本的精确宽度（基于字体大小）
    getTextWidthWithFontSize(text, fontSize = null) {
        const size = fontSize || this.options.fontSize;
        return this.widthCalculator.calculateWidth(text, size);
    }

    // 计算文本中每个字符的位置和宽度
    getCharacterPositions(text, fontSize = null) {
        const size = fontSize || this.options.fontSize;
        return this.widthCalculator.calculateCharacterPositions(text, size);
    }

    // 智能分割文本为标记（单词、空格、标点符号）
    splitIntoTokens(text) {
        const tokens = [];
        let currentToken = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const isSpace = /\s/.test(char);
            const isPunctuation = this.isPunctuation(char);
            const isChinese = /[\u4e00-\u9fff]/.test(char);
            const isMathSymbol = /[+\-*/=<>]/.test(char); // 数学符号

            if (isSpace) {
                if (currentToken) { 
                    tokens.push(currentToken); 
                    currentToken = ''; 
                }
                tokens.push(char);
            } else if (isPunctuation && !isMathSymbol) {
                // 普通标点符号，单独分割
                if (currentToken) { 
                    tokens.push(currentToken); 
                    currentToken = ''; 
                }
                tokens.push(char);
            } else if (isMathSymbol) {
                // 数学符号，如果前后有字母数字，则合并到单词中
                if (currentToken && /[a-zA-Z0-9]/.test(currentToken[currentToken.length - 1])) {
                    currentToken += char;
                } else if (currentToken) {
                    tokens.push(currentToken);
                    currentToken = char;
                } else {
                    currentToken = char;
                }
            } else if (isChinese) {
                if (currentToken) { 
                    tokens.push(currentToken); 
                    currentToken = ''; 
                }
                tokens.push(char);
            } else {
                currentToken += char;
            }
        }
        
        if (currentToken) { 
            tokens.push(currentToken); 
        }
        
        return tokens.filter(token => token.length > 0);
    }

    // 判断字符是否为标点符号
    isPunctuation(char) {
        const englishPunctuation = /[.,!?;:'"()[\]{}@#$%^&*+=|\\~`<>/]/;
        const chinesePunctuation = /[，。！？；：""''（）【】《》〈〉「」『』〔〕…—、]/;
        const otherSymbols = /[±×÷=≠≤≥<>≈∞∑∏∫√∆∇∂]/;
        return englishPunctuation.test(char) || chinesePunctuation.test(char) || otherSymbols.test(char);
    }

    // 计算智能间距
    calculateSmartSpacing(tokens, fontSize = null) {
        const size = fontSize || this.options.fontSize;
        const spacing = [];
        
        for (let i = 0; i < tokens.length - 1; i++) {
            const currentToken = tokens[i];
            const nextToken = tokens[i + 1];
            
            let baseSpacing = size * 0.1; // 基础间距为字体大小的 10%
            
            // 特殊处理标点符号和空格
            if (this.isPunctuation(currentToken) || this.isPunctuation(nextToken)) {
                baseSpacing *= 0.2; // 标点符号前后使用更小的间距
            } else if (currentToken.trim() === '' || nextToken.trim() === '') {
                baseSpacing *= 0.1; // 空格前后使用最小的间距
            }
            
            spacing.push(baseSpacing);
        }
        
        return spacing;
    }
}

export default TextMetrics;
