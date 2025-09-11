import Editly from "./core/index.js";

const data = {
  outPath: "output_scene.mp4",
  width: 1920,
  height: 1080,
  fps: 30,
  tracks: {
    "1": {
      type: "track",
      elements: [
        {
          // 背景图：整个时段都显示
          duration: 6,
          type: "image",
          path: "./assets/pano.jpg",
          width: 1920,
          height: 1080,
          left: 0.5,
          top: 0.5,
          originX: "center",
          originY: "center"
        },
        {
          // 标题：从第 1 秒开始显示 4 秒
          startTime: 1,
          duration: 4,
          type: "title",
          text: "Hello Scene",
          position: { y: 0.85 },
          fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf",
          animate: [
            { time: "in", effect: "fadeIn" },
            { time: "out", effect: "fadeOut" }
          ]
        },
        {
            startTime: 6,
            duration: 4,
            type: "radial-gradient"
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


