import { ShapeElement } from "./elements/shape.js";

/**
 * 形状元素测试
 */
async function shapeTest() {
  console.log("🔍 开始形状元素测试...");
  
  try {
    const shapeElement = new ShapeElement({
      type: "shape",
      shape: "rectangle",
      fillColor: "#ff0000",
      duration: 1,
      x: 0,
      y: 0,
      shapeWidth: 100,
      shapeHeight: 100,
      width: 100,
      height: 100
    });
    
    console.log("✓ 形状元素创建成功");
    
    // 测试读取帧
    const frameData = await shapeElement.readNextFrame(0, null);
    console.log("帧数据:", frameData);
    
    if (frameData && frameData.data) {
      console.log("✓ 帧数据生成成功");
      console.log("数据大小:", frameData.data.length);
      console.log("尺寸:", frameData.width, "x", frameData.height);
      
      // 检查数据是否全为0（黑色）
      const data = frameData.data;
      let hasNonZero = false;
      for (let i = 0; i < Math.min(100, data.length); i++) {
        if (data[i] !== 0) {
          hasNonZero = true;
          break;
        }
      }
      
      if (hasNonZero) {
        console.log("✓ 帧数据包含非零值，不是黑色");
      } else {
        console.log("❌ 帧数据全为零，是黑色");
      }
    } else {
      console.log("❌ 帧数据生成失败");
    }
    
    await shapeElement.close();
    
  } catch (error) {
    console.error("❌ 形状元素测试失败:", error);
    console.error("错误堆栈:", error.stack);
  }
}

// 运行测试
shapeTest();
