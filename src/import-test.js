/**
 * 导入测试 - 测试所有模块是否能正确导入
 */

console.log("开始导入测试...");

try {
  // 测试主入口
  console.log("测试主入口导入...");
  const { VideoMaker } = await import("./index.js");
  console.log("✓ VideoMaker 导入成功");

  // 测试配置解析器
  console.log("测试配置解析器导入...");
  const { ConfigParser } = await import("./configParser.js");
  console.log("✓ ConfigParser 导入成功");

  // 测试时间线
  console.log("测试时间线导入...");
  const { Timeline } = await import("./timeline.js");
  console.log("✓ Timeline 导入成功");

  // 测试渲染器
  console.log("测试渲染器导入...");
  const { VideoRenderer } = await import("./renderer.js");
  console.log("✓ VideoRenderer 导入成功");

  // 测试元素基类
  console.log("测试元素基类导入...");
  const { BaseElement } = await import("./elements/base.js");
  console.log("✓ BaseElement 导入成功");

  // 测试具体元素
  console.log("测试具体元素导入...");
  const { VideoElement } = await import("./elements/video.js");
  const { ImageElement } = await import("./elements/image.js");
  const { TextElement } = await import("./elements/text.js");
  const { ShapeElement } = await import("./elements/shape.js");
  const { CompositionElement } = await import("./elements/composition.js");
  console.log("✓ 所有元素类导入成功");

  // 测试画布工具
  console.log("测试画布工具导入...");
  const { createFabricCanvas, renderFabricCanvas, rgbaToFabricImage } = await import("./canvas/fabric.js");
  console.log("✓ 画布工具导入成功");

  // 测试过渡效果
  console.log("测试过渡效果导入...");
  const { Transition } = await import("./transitions/transition.js");
  console.log("✓ Transition 导入成功");

  // 测试动画
  console.log("测试动画导入...");
  const { Animation } = await import("./animations/animation.js");
  console.log("✓ Animation 导入成功");

  console.log("\n🎉 所有模块导入测试通过！");
  console.log("库的模块结构完整，所有依赖关系正确。");

} catch (error) {
  console.error("✗ 导入测试失败:", error.message);
  console.error("错误详情:", error);
}
