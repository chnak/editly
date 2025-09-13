import Editly from "./core/index.js";

const data = {
  outPath: "test_contain_blur_positions.mp4",
  width: 1920,
  height: 1080,
  fps: 30,
  tracks: {
    "1": {
      type: "track",
      elements: [
        // 测试1: center 位置的 contain-blur
        {
          type:"scene",
          startTime: 0,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img1.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "Center Position - Contain Blur",
              fontSize: 48,
              fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf",
              position: "top"
            }
          ]
        },
        // 测试2: top-left 位置的 contain-blur
        {
          type:"scene",
          startTime: 4,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img2.jpg",
              resizeMode: "contain-blur",
              position: "top-left",
              width: 0.5,
              height: 0.5
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "Top-Left Position - Contain Blur",
              fontSize: 48,
              fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf",
              position: "top"
            }
          ]
        },
        // 测试3: bottom-right 位置的 contain-blur
        {
          type:"scene",
          startTime: 8,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img3.jpg",
              resizeMode: "contain-blur",
              position: "bottom-right",
              width: 0.7,
              height: 0.7
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "Bottom-Right Position - Contain Blur",
              fontSize: 48,
              fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf",
              position: "top"
            }
          ]
        },
        // 测试4: 自定义位置的 contain-blur
        {
          type:"scene",
          startTime: 12,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img1.jpg",
              resizeMode: "contain-blur"
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "Custom Position (30%, 30%) - Contain Blur",
              fontSize: 48,
              fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf",
              position: "top"
            }
          ]
        },
        // 测试5: 缩放动画的 contain-blur
        {
          type:"scene",
          startTime: 16,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img2.jpg",
              resizeMode: "contain-blur",
              position: "center",
              width: 0.6,
              height: 0.6,
              zoomDirection: "in",
              zoomAmount: 0.2
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "Zoom Animation - Contain Blur",
              fontSize: 48,
              fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf",
              position: "top"
            }
          ]
        },
        // 测试6: 对比测试 - 普通 contain vs contain-blur
        {
          type:"scene",
          startTime: 20,
          duration: 4,
          elements: [
            {
              duration: 2,
              type: "image",
              path: "./assets/img3.jpg",
              resizeMode: "contain",
              position: "center",
              width: 0.6,
              height: 0.6
            },
            {
              startTime: 0.5,
              duration: 1.5,
              type: "title",
              text: "Normal Contain (No Blur)",
              fontSize: 48,
              fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf",
              position: "top"
            },
            {
              startTime: 2,
              duration: 2,
              type: "image",
              path: "./assets/img3.jpg",
              resizeMode: "contain-blur",
              position: "center",
              width: 0.6,
              height: 0.6
            },
            {
              startTime: 2.5,
              duration: 1.5,
              type: "title",
              text: "Contain-Blur (Fixed)",
              fontSize: 48,
              fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf",
              position: "top"
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


