import editly from "./src/index.js";
import { createFrameSource } from "./src/frameSource.js";
const data={
    outPath: "output.mp4",
    fps: 30,
    tracks: {
      "1": { // 背景轨道（最低层）
        type: "scene",
        elements: [
          {
            startTime: 0,
            duration: 10,
            layer:{ type: "title-background", text: "Transitions",fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf" }
          },
          {
            startTime: 3,
            duration: 5,
            layer:{ type: "title-background",position: { x: 0.2, y: 0.2}, text: "211212",fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf" }
          }
        ]
      },
      "2": { // 内容轨道
        type: "scene", 
        elements: [
          {
            startTime: 2,
            duration: 5, 
            layer:{ type: "title-background",position: { y: 0.6}, text: "Bounce",fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf"  }
          },
          {
            startTime: 8,
            duration: 4,
            layer:{ type: "news-title", text: "BREAKING NEWS",fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf"  },
          }
        ]
      },
      "3": { // 文字轨道（最高层）
        type: "scene",
        elements: [
          {
            startTime: 1,
            duration: 6,
            layer: { type: "subtitle", text: "Multi-track editing",position: { y: 0.8}, textColor: "#cccccc" ,fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf" }
          }
        ]
      }
    },
    // globalLayers: [
    //   { type: "image", path: "logo.png", position: "top-right", width: 0.1 }
    // ]
};
async function main(){
    await editly(data)
}
main()