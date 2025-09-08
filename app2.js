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
            duration: 10,
            layer:{
              type: "radial-gradient" 
            }
          },
          // {
          //   startTime:0,
          //   duration:10,
          //   layer:{
          //     type: "subtitle",
          //     fontPath: "./assets/Patua_One/MicrosoftYaHei-Bold-01.ttf",
          //     text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
          //   }
          // },
          // {
          //   startTime: 0,
          //   duration: 5,
          //   loop:true,
          //   layer:{
          //     width:500,
          //     height:500,
          //     left:0.5,
          //     top:0.5,
          //     originX:"center",
          //     originY:"center",
          //     type: "video",
          //     path: "./assets/palawan.mp4"
          //   },
          // },
          {
            startTime: 2,
            duration: 3,
            layer:{ type: "title", text: "新闻啊1",fontPath: "./assets/Patua_One/MicrosoftYaHei-Bold-01.ttf"  },
          },
          {
              startTime:6,
              duration:4,
              layer:{
                type: "slide-in-text",
                text: "Text that slides in1",
                textColor: "#fff",
                position: { x: 0.04, y: 0.93, originY: "bottom", originX: "left" },
                fontPath: "./assets/Patua_One/MicrosoftYaHei-Bold-01.ttf",
                fontSize: 0.05
              }
            },
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
            layer:{ type: "title",position: { y: 0.6}, text: "测试2",fontPath: "./assets/Patua_One/MicrosoftYaHei-Bold-01.ttf"  }
          },
          {
            startTime: 5,
            duration: 4,
            layer:{ type: "news-title", text: "新闻啊2",fontPath: "./assets/Patua_One/MicrosoftYaHei-Bold-01.ttf"  },
          }
        ]
      },
      "3": { // 文字轨道（最高层）
        type: "scene",
        elements: [
          {
            startTime: 1,
            duration: 6,
            layer: { type: "subtitle", text: "Multi-track editing2",position: { y: 0.8}, textColor: "#cccccc" ,fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf" }
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