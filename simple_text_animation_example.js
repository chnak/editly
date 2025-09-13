import Editly from "./core/index.js";

const data = {
  outPath: "simple_text_animation.mp4",
  width: 1920,
  height: 1080,
  fps: 30,
  tracks: {
    "1": {
      type: "track",
      elements: [
        // 示例1: 逐字动画
        {
          type: "scene",
          startTime: 0,
          duration: 6,
          elements: [
            {
              duration: 6,
              type: "fill-color",
              color: "#1a1a2e"
            },
            {
              startTime: 0.5,
              duration: 5,
              type: "char-by-char-text",
              text: "逐字动画",
              textColor: "#ffffff",
              fontSize: 72,
              position: "center",
              charDelay: 0.2,
              charDuration: 0.4,
              animate: [
                {
                  time: 0,
                  effect: "zoomIn",
                  duration: 0.3
                }
              ]
            }
          ]
        },
        // 示例2: 逐行动画
        {
          type: "scene",
          startTime: 6,
          duration: 6,
          elements: [
            {
              duration: 6,
              type: "fill-color",
              color: "#16213e"
            },
            {
              startTime: 0.5,
              duration: 5,
              type: "line-by-line-text",
              text: "第一行\n第二行\n第三行",
              textColor: "#00d4ff",
              fontSize: 64,
              position: "center",
              lineDelay: 0.3,
              lineDuration: 0.5,
              lineHeight: 1.3,
              animate: [
                {
                  time: 0,
                  effect: "slideInLeft",
                  duration: 0.4
                }
              ]
            }
          ]
        }
      ]
    }
  }
};

async function main() {
  const editly = new Editly(data);
  editly.start();
  editly.on("start", () => {
    console.log("[事件] 开始渲染简单文本动画示例");
  });
  editly.on("progress", (value) => {
    console.log(`[事件] 进度: ${(value * 100).toFixed(1)}%`);
  });
  editly.on("complete", (value) => {
    console.log(`[事件] 完成: ${value}`);
  });
}

main();
