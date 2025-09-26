import { VideoMaker } from "./index.js";

async function testSubtitleSimple() {
  console.log("测试简单字幕功能...");
  
  const videoMaker = new VideoMaker({
    outPath: "output/simple-subtitle-test.mp4",
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 30,
    elements: [
      // 测试字幕显示
      {
            type: "shape",
            shape: "rectangle",
            fillColor: "#2c3e50",
            width: "100%",
            height: "100%",
            duration: 20,
            startTime: 0,
            x: '50%',
            y: '50%'
      },
      {
        type: "subtitle",
        text: "在遥远的夜空里，住着无数闪亮的小星星。它们中最小的那颗叫闪闪，它和别的星星不一样——它还不会眨眼。",
        fontSize: 60,
        textColor: "#ffffff",
        backgroundColor: "rgba(211, 14, 14, 1)",
        position: "bottom",
        startTime: 0,
        duration: 10,
        padding: 10
      }
    ]
  });

  try {
    await videoMaker.start();
    console.log("简单字幕测试完成: output/subtitle-simple-test.mp4");
  } catch (error) {
    console.error("简单字幕测试失败:", error);
  }
}

testSubtitleSimple();