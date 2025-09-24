import fontFinder from "font-finder";

/**
 * 测试 font-finder 功能
 */
async function testFontFinder() {
  console.log("开始测试 font-finder 功能...");
  
  try {
    // 列出所有可用字体
    console.log("\n获取系统字体列表...");
    const fonts = await fontFinder.list();
    console.log("字体列表:", fonts);
    
    if (Array.isArray(fonts)) {
      console.log(`找到 ${fonts.length} 个字体:`);
      fonts.slice(0, 10).forEach(font => {
        console.log(`- ${font.family || font.name} (${font.style || 'normal'})`);
      });
      
      if (fonts.length > 10) {
        console.log(`... 还有 ${fonts.length - 10} 个字体`);
      }
    } else {
      console.log("字体列表不是数组格式:", typeof fonts);
    }
    
    // 测试查找特定字体
    const testFonts = [
      "微软雅黑",
      "楷体", 
      "宋体",
      "Arial",
      "Times New Roman",
      "Helvetica",
      "Georgia",
      "Verdana",
      "Courier New"
    ];
    
    console.log("\n测试查找特定字体:");
    for (const fontName of testFonts) {
      try {
        const font = await fontFinder.get(fontName);
        if (font) {
          console.log(`✓ 找到字体: ${fontName} -> ${font.path}`);
        } else {
          console.log(`✗ 未找到字体: ${fontName}`);
        }
      } catch (error) {
        console.log(`✗ 查找字体失败: ${fontName}`, error.message);
      }
    }
    
  } catch (error) {
    console.error("font-finder 测试失败:", error);
  }
  
  console.log("\nfont-finder 测试完成！");
}

// 运行测试
testFontFinder().catch(console.error);
