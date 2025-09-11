import Editly from "./core/index.js";
const data={
  "outPath": "output.mp4",
  "width": 1280,
  "height": 720,
  "fps": 25,
  "tracks": {
    "0": {
      "type": "scene",
      "scenes": [
        {
          "transitionOut": { "name": "fade", "duration": 0.8 },
          "elements": [
            { "startTime": 0, "duration": 3, "layer": { "type": "image", "path": "./assets/pano.jpg" } },
            { "startTime": 3, "duration": 3, "layer": { "type": "video", "path": "./assets/palawan.mp4", "cutFrom": 0, "cutTo": 3, "mixVolume": 0.9 } }
          ]
        },
        {
          "transitionIn": { "name": "fade", "duration": 0.8 },
          "elements": [
            { "startTime": 0, "duration": 3, "layer": { type: "radial-gradient"  } },
            { "startTime": 0.5, "duration": 2, "layer": { "type": "title", "text": "下一场景", "fontPath": "assets/Patua_One/PatuaOne-Regular.ttf" } }
          ]
        }
      ]
    }
  }
}
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