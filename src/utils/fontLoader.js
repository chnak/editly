import * as opentype from "opentype.js";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * 字体加载器
 * 支持加载 TTF、OTF 等字体文件
 */
export class FontLoader {
    constructor() {
        this.fontCache = new Map();
        this.defaultFonts = new Map();
    }

    /**
     * 加载字体文件
     * @param {string} fontPath - 字体文件路径
     * @param {string} fontName - 字体名称
     * @returns {Promise<opentype.Font>}
     */
    async loadFont(fontPath, fontName) {
        if (this.fontCache.has(fontName)) {
            return this.fontCache.get(fontName);
        }

        try {
            const fontBuffer = readFileSync(fontPath);
            const font = opentype.parse(fontBuffer.buffer);
            this.fontCache.set(fontName, font);
            console.log(`✓ 字体加载成功: ${fontName}`);
            return font;
        } catch (error) {
            console.warn(`字体加载失败: ${fontName}`, error.message);
            return null;
        }
    }

    /**
     * 加载默认字体
     * @param {string} fontFamily - 字体族名称
     * @returns {Promise<opentype.Font>}
     */
    async loadDefaultFont(fontFamily) {
        if (this.defaultFonts.has(fontFamily)) {
            return this.defaultFonts.get(fontFamily);
        }

        // 尝试从系统字体目录加载
        const fontPaths = this.getSystemFontPaths(fontFamily);
        
        for (const fontPath of fontPaths) {
            try {
                const font = await this.loadFont(fontPath, fontFamily);
                if (font) {
                    this.defaultFonts.set(fontFamily, font);
                    return font;
                }
            } catch (error) {
                // 继续尝试下一个路径
                continue;
            }
        }

        console.warn(`无法加载默认字体: ${fontFamily}`);
        return null;
    }

    /**
     * 获取系统字体路径
     * @param {string} fontFamily - 字体族名称
     * @returns {string[]}
     */
    getSystemFontPaths(fontFamily) {
        const paths = [];
        
        // Windows 字体路径
        if (process.platform === 'win32') {
            const windowsFonts = [
                `C:/Windows/Fonts/${fontFamily}.ttf`,
                `C:/Windows/Fonts/${fontFamily}.otf`,
                `C:/Windows/Fonts/${fontFamily}-Regular.ttf`,
                `C:/Windows/Fonts/${fontFamily}-Regular.otf`,
                `C:/Windows/Fonts/arial.ttf`,
                `C:/Windows/Fonts/arialbd.ttf`,
                `C:/Windows/Fonts/ariali.ttf`,
                `C:/Windows/Fonts/arialbi.ttf`
            ];
            paths.push(...windowsFonts);
        }
        
        // macOS 字体路径
        if (process.platform === 'darwin') {
            const macFonts = [
                `/System/Library/Fonts/${fontFamily}.ttf`,
                `/System/Library/Fonts/${fontFamily}.otf`,
                `/Library/Fonts/${fontFamily}.ttf`,
                `/Library/Fonts/${fontFamily}.otf`,
                `/System/Library/Fonts/Arial.ttf`,
                `/System/Library/Fonts/Arial Bold.ttf`,
                `/System/Library/Fonts/Arial Italic.ttf`
            ];
            paths.push(...macFonts);
        }
        
        // Linux 字体路径
        if (process.platform === 'linux') {
            const linuxFonts = [
                `/usr/share/fonts/truetype/${fontFamily.toLowerCase()}/${fontFamily}.ttf`,
                `/usr/share/fonts/opentype/${fontFamily.toLowerCase()}/${fontFamily}.otf`,
                `/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf`,
                `/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf`
            ];
            paths.push(...linuxFonts);
        }

        return paths;
    }

    /**
     * 获取字体
     * @param {string} fontFamily - 字体族名称
     * @returns {opentype.Font|null}
     */
    getFont(fontFamily) {
        return this.fontCache.get(fontFamily) || this.defaultFonts.get(fontFamily) || null;
    }

    /**
     * 预加载常用字体
     */
    async preloadCommonFonts() {
        const commonFonts = ['Arial', 'Times New Roman', 'Courier New', 'Helvetica'];
        
        for (const font of commonFonts) {
            try {
                await this.loadDefaultFont(font);
            } catch (error) {
                console.warn(`预加载字体失败: ${font}`, error.message);
            }
        }
    }
}

// 创建全局字体加载器实例
export const fontLoader = new FontLoader();

