import { createFabricCanvas, renderFabricCanvas, rgbaToFabricImage } from "./canvas/fabric.js";

/**
 * 画布测试
 */
async function canvasTest() {
  console.log("🔍 开始画布测试...");
  
  try {
    // 创建测试数据
    const width = 100;
    const height = 100;
    const testData = new Uint8Array(width * height * 4);
    
    // 填充红色数据
    for (let i = 0; i < testData.length; i += 4) {
      testData[i] = 255;     // R
      testData[i + 1] = 0;   // G
      testData[i + 2] = 0;   // B
      testData[i + 3] = 255; // A
    }
    
    console.log("✓ 测试数据创建成功");
    
    // 创建 Fabric 画布
    const canvas = createFabricCanvas({ width, height });
    console.log("✓ Fabric 画布创建成功");
    
    // 创建 Fabric 图像
    const fabricImage = await rgbaToFabricImage({ 
      width, 
      height, 
      rgba: Buffer.from(testData) 
    });
    console.log("✓ Fabric 图像创建成功");
    
    // 添加到画布
    canvas.add(fabricImage);
    console.log("✓ 图像添加到画布成功");
    
    // 渲染画布
    const rgba = await renderFabricCanvas(canvas);
    console.log("✓ 画布渲染成功");
    console.log("渲染数据大小:", rgba.length);
    
    // 检查渲染数据
    let hasNonZero = false;
    for (let i = 0; i < Math.min(100, rgba.length); i++) {
      if (rgba[i] !== 0) {
        hasNonZero = true;
        break;
      }
    }
    
    if (hasNonZero) {
      console.log("✓ 渲染数据包含非零值，不是黑色");
    } else {
      console.log("❌ 渲染数据全为零，是黑色");
    }
    
  } catch (error) {
    console.error("❌ 画布测试失败:", error);
    console.error("错误堆栈:", error.stack);
  }
}

// 运行测试
canvasTest();