import Editly from "./core/index.js";
const data={
    outPath: "output.mp4",
	width: 1920,
    height: 1080,
    fps: 30,
    tracks: {
      "1": { // 背景轨道（最低层）
        type: "scene",
        elements: [
          {
            startTime: 0,
            duration: 5,
            loop:true,
            layer:{
              inputWidth:500,
              inputHeight:500,
              type: "video",
              path: "./assets/palawan.mp4"
            }
          },
          {
            startTime: 0,
            duration: 5,
            layer:{ type: "title", text: "BREAKING NEWS",fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf"  },
          }
          // {
          //   startTime: 0,
          //   duration: 10,
          //   layer:{
          //     type: "title-background",
          //     text: "Editly can handle all formats and sizes with different fits",
          //     background: { type: "radial-gradient" },
          //   }
          // },
          
          
        ]
      },
      "2": { // 内容轨道
        type: "scene", 
        elements: [
          {
            startTime: 2,
            duration: 5, 
            layer:{ type: "title",position: { y: 0.6}, text: "Bounce",fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf"  }
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
    const editly=new Editly(data)
    editly.start()
    editly.on('start',()=>{
      console.log('[event] start')
    })
    editly.on('progress',(value)=>{
      console.log(`[event] 进度${value}`)
    })
    editly.on('complete',(value)=>{
      console.log(`[event] 完成${value}`)
    })
}
main()