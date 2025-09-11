import Editly from "./core/index.js";

// 多轨 + 多场景示例：
// - 轨 1：背景轨（两个串联场景），图片平铺 + 渐变
// - 轨 2：内容轨（两个串联场景），标题与新闻条
// - 轨 3：字幕轨（单场景）

const data = {
  outPath: "output_scenes.mp4",
  width: 1920,
  height: 1080,
  fps: 30,
  tracks: {
    // 底层：背景轨
    "1": {
        type: "track",
        elements: [
          {
            startTime:0,
            duration: 15,
            type: "image",
            path: "./assets/pano.jpg",
            originX: "center",
            originY: "center"
          },
          {
            // 标题：从第 1 秒开始显示 4 秒
            startTime: 1,
            duration: 4,
            type: "title",
            text: "轨道1",
            position: { y: 0.85 },
            fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf",
            animate: [
              { time: "in", effect: "fadeIn" },
              { time: "out", effect: "fadeOut" }
            ]
          },
          {
              startTime: 15,
              duration: 5,
              type: "radial-gradient"
            }
        ]
      },

    // 中层：内容轨
    "2": {
        type: "scene",
        elements: [
            {
                // 标题：从第 1 秒开始显示 4 秒
                startTime: 5,
                duration: 4,
                type: "title",
                text: "轨道二",
                position: { y: 0.85 },
                fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf",
                animate: [
                { time: "in", effect: "fadeIn" },
                { time: "out", effect: "fadeOut" }
                ]
            },
         
            {
              startTime: 10,
              duration: 5,
              type: "news-title", 
              text: "Breaking News2", 
              fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf"
            }
        ]
    },

    // 顶层：字幕轨（单场景）
    "3": {
        type: "scene",
        elements: [
            {
                // 标题：从第 1 秒开始显示 4 秒
                startTime: 10,
                duration: 4,
                type: "title",
                text: "轨道三",
                position: { y: 0.85 },
                fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf",
                animate: [
                { time: "in", effect: "fadeIn" },
                { time: "out", effect: "fadeOut" }
                ]
            },
         
            {
              startTime: 10,
              duration: 5,
              type: "subtitle", 
              text: "Multi-track & multi-scene demo", 
              position: { y: 0.92 }, 
              textColor: "#dddddd", 
              fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf"
            }
        ]
    }
    
  }
};

async function main() {
  const editly = new Editly(data);
  editly.start();
  editly.on("start", () => {
    console.log("[event] start");
  });
  editly.on("progress", (value) => {
    console.log(`[event] 进度${value}`);
  });
  editly.on("complete", (value) => {
    console.log(`[event] 完成${value}`);
  });
}

main();


