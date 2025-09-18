import { parsePositionValue, getPositionProps, parseSizeValue, calculateActualPosition } from './utils/positionUtils.js';

/**
 * 位置解析功能单元测试
 */
function runPositionParsingTests() {
  console.log("开始位置解析功能测试...\n");
  
  let passedTests = 0;
  let totalTests = 0;
  
  function test(name, condition, expected, actual) {
    totalTests++;
    const passed = condition;
    if (passed) {
      console.log(`✅ ${name}`);
      passedTests++;
    } else {
      console.log(`❌ ${name}`);
      console.log(`   期望: ${expected}`);
      console.log(`   实际: ${actual}`);
    }
  }
  
  // 测试像素单位解析
  console.log("=== 像素单位测试 ===");
  test(
    "像素单位解析 - 100px",
    parsePositionValue("100px", 1920) === 100,
    100,
    parsePositionValue("100px", 1920)
  );
  
  test(
    "像素单位解析 - 纯数字",
    parsePositionValue(200, 1920) === 200,
    200,
    parsePositionValue(200, 1920)
  );
  
  // 测试百分比单位解析
  console.log("\n=== 百分比单位测试 ===");
  test(
    "百分比单位解析 - 50%",
    parsePositionValue("50%", 1920) === 960,
    960,
    parsePositionValue("50%", 1920)
  );
  
  test(
    "百分比单位解析 - 25%",
    parsePositionValue("25%", 1920) === 480,
    480,
    parsePositionValue("25%", 1920)
  );
  
  test(
    "百分比单位解析 - 100%",
    parsePositionValue("100%", 1080) === 1080,
    1080,
    parsePositionValue("100%", 1080)
  );
  
  // 测试视口单位解析
  console.log("\n=== 视口单位测试 ===");
  test(
    "视口宽度单位解析 - 10vw",
    parsePositionValue("10vw", 1920) === 192,
    192,
    parsePositionValue("10vw", 1920)
  );
  
  test(
    "视口高度单位解析 - 20vh",
    parsePositionValue("20vh", 1080) === 216,
    216,
    parsePositionValue("20vh", 1080)
  );
  
  // 测试预定义位置
  console.log("\n=== 预定义位置测试 ===");
  const centerPos = getPositionProps({ position: "center", width: 1920, height: 1080 });
  test(
    "中心位置 - X坐标",
    centerPos.left === 960,
    960,
    centerPos.left
  );
  
  test(
    "中心位置 - Y坐标",
    centerPos.top === 540,
    540,
    centerPos.top
  );
  
  const topLeftPos = getPositionProps({ position: "top-left", width: 1920, height: 1080 });
  test(
    "左上角位置 - X坐标",
    topLeftPos.left === 192,
    192,
    topLeftPos.left
  );
  
  test(
    "左上角位置 - Y坐标",
    topLeftPos.top === 108,
    108,
    topLeftPos.top
  );
  
  const bottomRightPos = getPositionProps({ position: "bottom-right", width: 1920, height: 1080 });
  test(
    "右下角位置 - X坐标",
    bottomRightPos.left === 1728,
    1728,
    bottomRightPos.left
  );
  
  test(
    "右下角位置 - Y坐标",
    bottomRightPos.top === 972,
    972,
    bottomRightPos.top
  );
  
  // 测试自定义坐标
  console.log("\n=== 自定义坐标测试 ===");
  const customPos = getPositionProps({ 
    x: "50%", 
    y: "30%", 
    width: 1920, 
    height: 1080 
  });
  test(
    "自定义坐标 - X坐标",
    customPos.left === 960,
    960,
    customPos.left
  );
  
  test(
    "自定义坐标 - Y坐标",
    customPos.top === 324,
    324,
    customPos.top
  );
  
  // 测试尺寸解析
  console.log("\n=== 尺寸解析测试 ===");
  test(
    "尺寸解析 - 像素",
    parseSizeValue("200px", 1920) === 200,
    200,
    parseSizeValue("200px", 1920)
  );
  
  test(
    "尺寸解析 - 百分比",
    parseSizeValue("25%", 1920) === 480,
    480,
    parseSizeValue("25%", 1920)
  );
  
  // 测试实际位置计算
  console.log("\n=== 实际位置计算测试 ===");
  const actualPos1 = calculateActualPosition({
    left: 100,
    top: 100,
    width: 200,
    height: 150,
    originX: "center",
    originY: "center"
  });
  test(
    "中心原点 - X坐标",
    actualPos1.left === 0,
    0,
    actualPos1.left
  );
  
  test(
    "中心原点 - Y坐标",
    actualPos1.top === 25,
    25,
    actualPos1.top
  );
  
  const actualPos2 = calculateActualPosition({
    left: 100,
    top: 100,
    width: 200,
    height: 150,
    originX: "right",
    originY: "bottom"
  });
  test(
    "右下原点 - X坐标",
    actualPos2.left === -100,
    -100,
    actualPos2.left
  );
  
  test(
    "右下原点 - Y坐标",
    actualPos2.top === -50,
    -50,
    actualPos2.top
  );
  
  // 测试边界情况
  console.log("\n=== 边界情况测试 ===");
  test(
    "空字符串处理",
    parsePositionValue("", 1920) === 0,
    0,
    parsePositionValue("", 1920)
  );
  
  test(
    "无效字符串处理",
    parsePositionValue("invalid", 1920) === 0,
    0,
    parsePositionValue("invalid", 1920)
  );
  
  test(
    "负数处理",
    parsePositionValue("-50px", 1920) === -50,
    -50,
    parsePositionValue("-50px", 1920)
  );
  
  test(
    "小数处理",
    parsePositionValue("50.5%", 1920) === 969.6,
    969.6,
    parsePositionValue("50.5%", 1920)
  );
  
  // 输出测试结果
  console.log("\n=== 测试结果 ===");
  console.log(`通过测试: ${passedTests}/${totalTests}`);
  console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log("🎉 所有测试通过！");
  } else {
    console.log("⚠️  有测试失败，请检查实现。");
  }
  
  return passedTests === totalTests;
}

/**
 * 性能测试
 */
function runPerformanceTests() {
  console.log("\n=== 性能测试 ===");
  
  const iterations = 10000;
  
  // 测试位置解析性能
  console.time("位置解析性能测试");
  for (let i = 0; i < iterations; i++) {
    parsePositionValue("50%", 1920);
    parsePositionValue("100px", 1920);
    parsePositionValue("25vw", 1920);
  }
  console.timeEnd("位置解析性能测试");
  
  // 测试位置属性获取性能
  console.time("位置属性获取性能测试");
  for (let i = 0; i < iterations; i++) {
    getPositionProps({ position: "center", width: 1920, height: 1080 });
    getPositionProps({ x: "50%", y: "30%", width: 1920, height: 1080 });
  }
  console.timeEnd("位置属性获取性能测试");
}

// 运行测试
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  const allTestsPassed = runPositionParsingTests();
  runPerformanceTests();
  
  if (allTestsPassed) {
    console.log("\n✅ 所有位置解析测试通过！");
  } else {
    console.log("\n❌ 部分测试失败，请检查代码。");
    process.exit(1);
  }
}

export { runPositionParsingTests, runPerformanceTests };
