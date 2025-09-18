#!/usr/bin/env node

/**
 * 视频位置和大小测试运行脚本
 * 提供多种测试选项
 */

import { testVideoPositionAndSize } from './video-position-size-test.js';
import { simpleVideoPositionTest } from './simple-video-position-test.js';
import { runPositionParsingTests, runPerformanceTests } from './position-parsing-test.js';

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
视频位置和大小测试工具

用法: node run-video-tests.js [选项]

选项:
  --help, -h          显示此帮助信息
  --simple, -s        运行简化测试（快速）
  --full, -f          运行完整测试（详细）
  --unit, -u          运行单元测试（位置解析）
  --performance, -p   运行性能测试
  --all, -a           运行所有测试
  --list, -l          列出所有可用测试

示例:
  node run-video-tests.js --simple
  node run-video-tests.js --full
  node run-video-tests.js --unit
  node run-video-tests.js --all
`);
}

/**
 * 列出所有可用测试
 */
function listTests() {
  console.log(`
可用的测试:

1. 简化视频位置测试 (--simple)
   - 测试基本的像素、百分比、预定义位置
   - 运行时间: ~30秒
   - 输出: simple-video-position-test.mp4

2. 完整视频位置测试 (--full)
   - 测试所有位置单位、尺寸单位、适配模式
   - 运行时间: ~2分钟
   - 输出: video-position-size-test.mp4

3. 位置解析单元测试 (--unit)
   - 测试位置解析函数的正确性
   - 运行时间: <1秒
   - 输出: 控制台测试结果

4. 性能测试 (--performance)
   - 测试位置解析函数的性能
   - 运行时间: <1秒
   - 输出: 控制台性能数据

5. 所有测试 (--all)
   - 依次运行所有测试
   - 运行时间: ~3分钟
   - 输出: 所有测试结果
`);
}

/**
 * 运行简化测试
 */
async function runSimpleTest() {
  console.log("🚀 运行简化视频位置测试...");
  try {
    await simpleVideoPositionTest();
    console.log("✅ 简化测试完成！");
  } catch (error) {
    console.error("❌ 简化测试失败:", error);
  }
}

/**
 * 运行完整测试
 */
async function runFullTest() {
  console.log("🚀 运行完整视频位置测试...");
  try {
    await testVideoPositionAndSize();
    console.log("✅ 完整测试完成！");
  } catch (error) {
    console.error("❌ 完整测试失败:", error);
  }
}

/**
 * 运行单元测试
 */
function runUnitTest() {
  console.log("🚀 运行位置解析单元测试...");
  try {
    const success = runPositionParsingTests();
    if (success) {
      console.log("✅ 单元测试完成！");
    } else {
      console.log("❌ 单元测试失败！");
    }
  } catch (error) {
    console.error("❌ 单元测试失败:", error);
  }
}

/**
 * 运行性能测试
 */
function runPerformanceTest() {
  console.log("🚀 运行性能测试...");
  try {
    runPerformanceTests();
    console.log("✅ 性能测试完成！");
  } catch (error) {
    console.error("❌ 性能测试失败:", error);
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log("🚀 运行所有测试...\n");
  
  // 1. 单元测试
  console.log("1/4 运行单元测试...");
  runUnitTest();
  console.log("");
  
  // 2. 性能测试
  console.log("2/4 运行性能测试...");
  runPerformanceTest();
  console.log("");
  
  // 3. 简化测试
  console.log("3/4 运行简化测试...");
  await runSimpleTest();
  console.log("");
  
  // 4. 完整测试
  console.log("4/4 运行完整测试...");
  await runFullTest();
  console.log("");
  
  console.log("🎉 所有测试完成！");
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  if (args.includes('--list') || args.includes('-l')) {
    listTests();
    return;
  }
  
  if (args.includes('--all') || args.includes('-a')) {
    await runAllTests();
    return;
  }
  
  if (args.includes('--simple') || args.includes('-s')) {
    await runSimpleTest();
    return;
  }
  
  if (args.includes('--full') || args.includes('-f')) {
    await runFullTest();
    return;
  }
  
  if (args.includes('--unit') || args.includes('-u')) {
    runUnitTest();
    return;
  }
  
  if (args.includes('--performance') || args.includes('-p')) {
    runPerformanceTest();
    return;
  }
  
  console.log("❌ 未知选项，使用 --help 查看帮助信息");
}

// 运行主函数
main().catch(console.error);
