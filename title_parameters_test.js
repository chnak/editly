import Editly from "./core/index.js";

const data = {
  outPath: "title_parameters_test.mp4",
  width: 1920,
  height: 1080,
  fps: 30,
  fast: true, // 启用快速模式 - 降低分辨率和帧率
  tracks: {
    "1": {
      type: "track",
      elements: [
        // 测试1: 基础参数 - text, textColor, fontFamily
        {
          type: "scene",
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
              text: "基础参数测试 - 白色文字",
              textColor: "#ffffff",
              position: "center"
            }
          ]
        },
        
        // 测试2: 不同颜色
        {
          type: "scene",
          startTime: 4,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img2.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "红色文字测试",
              textColor: "#ff0000",
              position: "center"
            }
          ]
        },

        // 测试3: 所有position位置选项
        {
          type: "scene",
          startTime: 8,
          duration: 6,
          elements: [
            {
              duration: 6,
              type: "image",
              path: "./assets/img3.jpg",
              resizeMode: "contain-blur",
            },
            // top
            {
              startTime: 0.5,
              duration: 1,
              type: "title",
              text: "Top",
              textColor: "#ffff00",
              position: "top"
            },
            // top-left
            {
              startTime: 1.5,
              duration: 1,
              type: "title",
              text: "Top-Left",
              textColor: "#00ff00",
              position: "top-left"
            },
            // top-right
            {
              startTime: 2.5,
              duration: 1,
              type: "title",
              text: "Top-Right",
              textColor: "#00ffff",
              position: "top-right"
            },
            // center-left
            {
              startTime: 3.5,
              duration: 1,
              type: "title",
              text: "Center-Left",
              textColor: "#ff00ff",
              position: "center-left"
            },
            // center
            {
              startTime: 4.5,
              duration: 1,
              type: "title",
              text: "Center",
              textColor: "#ffffff",
              position: "center"
            },
            // center-right
            {
              startTime: 5.5,
              duration: 1,
              type: "title",
              text: "Center-Right",
              textColor: "#ff8800",
              position: "center-right"
            }
          ]
        },

        // 测试4: 底部位置
        {
          type: "scene",
          startTime: 14,
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
              duration: 1,
              type: "title",
              text: "Bottom",
              textColor: "#ffffff",
              position: "bottom"
            },
            {
              startTime: 1.5,
              duration: 1,
              type: "title",
              text: "Bottom-Left",
              textColor: "#00ff00",
              position: "bottom-left"
            },
            {
              startTime: 2.5,
              duration: 1,
              type: "title",
              text: "Bottom-Right",
              textColor: "#ff0000",
              position: "bottom-right"
            }
          ]
        },

        // 测试5: 自定义位置坐标
        {
          type: "scene",
          startTime: 18,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img2.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 1,
              type: "title",
              text: "自定义位置 (0.2, 0.3)",
              textColor: "#ffff00",
              position: { x: 0.2, y: 0.3, originX: "left", originY: "top" }
            },
            {
              startTime: 1.5,
              duration: 1,
              type: "title",
              text: "自定义位置 (0.8, 0.7)",
              textColor: "#00ffff",
              position: { x: 0.8, y: 0.7, originX: "right", originY: "bottom" }
            },
            {
              startTime: 2.5,
              duration: 1,
              type: "title",
              text: "自定义位置 (0.5, 0.5)",
              textColor: "#ff00ff",
              position: { x: 0.5, y: 0.5, originX: "center", originY: "center" }
            }
          ]
        },

        // 测试6: 缩放参数 - zoomDirection 和 zoomAmount
        {
          type: "scene",
          startTime: 22,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img3.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 1.5,
              type: "title",
              text: "Zoom In 效果",
              textColor: "#ffffff",
              position: "center",
              zoomDirection: "in",
              zoomAmount: 0.3
            },
            {
              startTime: 2,
              duration: 1.5,
              type: "title",
              text: "Zoom Out 效果",
              textColor: "#ff0000",
              position: "center",
              zoomDirection: "out",
              zoomAmount: 0.3
            }
          ]
        },

        // 测试7: 动画效果 - fadeIn/fadeOut
        {
          type: "scene",
          startTime: 26,
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
              text: "淡入淡出效果",
              textColor: "#ffffff",
              position: "center",
              animate: [
                { time: 'in', effect: 'fadeIn' },
                { time: 'out', effect: 'fadeOut' }
              ]
            }
          ]
        },

        // 测试8: 动画效果 - slideInLeft/slideOutRight
        {
          type: "scene",
          startTime: 30,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img2.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "左滑入右滑出",
              textColor: "#00ff00",
              position: "center",
              animate: [
                { time: 'in', effect: 'slideInLeft' },
                { time: 'out', effect: 'slideOutRight' }
              ]
            }
          ]
        },

        // 测试9: 动画效果 - slideInRight/slideOutLeft
        {
          type: "scene",
          startTime: 34,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img3.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "右滑入左滑出",
              textColor: "#0000ff",
              position: "center",
              animate: [
                { time: 'in', effect: 'slideInRight' },
                { time: 'out', effect: 'slideOutLeft' }
              ]
            }
          ]
        },

        // 测试10: 动画效果 - zoomIn/zoomOut
        {
          type: "scene",
          startTime: 38,
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
              text: "缩放进入和退出",
              textColor: "#ffff00",
              position: "center",
              animate: [
                { time: 'in', effect: 'zoomIn' },
                { time: 'out', effect: 'zoomOut' }
              ]
            }
          ]
        },

        // 测试11: 动画效果 - 更多方向效果
        {
          type: "scene",
          startTime: 42,
          duration: 6,
          elements: [
            {
              duration: 6,
              type: "image",
              path: "./assets/img2.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 1,
              type: "title",
              text: "上淡入",
              textColor: "#ff0000",
              position: "center",
              animate: [
                { time: 'in', effect: 'fadeInUp' }
              ]
            },
            {
              startTime: 1.5,
              duration: 1,
              type: "title",
              text: "下淡入",
              textColor: "#00ff00",
              position: "center",
              animate: [
                { time: 'in', effect: 'fadeInDown' }
              ]
            },
            {
              startTime: 2.5,
              duration: 1,
              type: "title",
              text: "左淡入",
              textColor: "#0000ff",
              position: "center",
              animate: [
                { time: 'in', effect: 'fadeInLeft' }
              ]
            },
            {
              startTime: 3.5,
              duration: 1,
              type: "title",
              text: "右淡入",
              textColor: "#ffff00",
              position: "center",
              animate: [
                { time: 'in', effect: 'fadeInRight' }
              ]
            },
            {
              startTime: 4.5,
              duration: 1,
              type: "title",
              text: "旋转进入",
              textColor: "#ff00ff",
              position: "center",
              animate: [
                { time: 'in', effect: 'rotateIn' }
              ]
            }
          ]
        },

        // 测试11.5: 新增动画效果测试
        {
          type: "scene",
          startTime: 48,
          duration: 6,
          elements: [
            {
              duration: 6,
              type: "image",
              path: "./assets/img3.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 1,
              type: "title",
              text: "弹跳进入",
              textColor: "#ff8800",
              position: "center",
              animate: [
                { time: 'in', effect: 'bounceIn' }
              ]
            },
            {
              startTime: 1.5,
              duration: 1,
              type: "title",
              text: "X轴翻转",
              textColor: "#8800ff",
              position: "center",
              animate: [
                { time: 'in', effect: 'flipInX' }
              ]
            },
            {
              startTime: 2.5,
              duration: 1,
              type: "title",
              text: "Y轴翻转",
              textColor: "#00ff88",
              position: "center",
              animate: [
                { time: 'in', effect: 'flipInY' }
              ]
            },
            {
              startTime: 3.5,
              duration: 1,
              type: "title",
              text: "弹性进入",
              textColor: "#ff0088",
              position: "center",
              animate: [
                { time: 'in', effect: 'elasticIn' }
              ]
            },
            {
              startTime: 4.5,
              duration: 1,
              type: "title",
              text: "旋转退出",
              textColor: "#88ff00",
              position: "center",
              animate: [
                { time: 'in', effect: 'fadeIn' },
                { time: 'out', effect: 'rotateOut' }
              ]
            }
          ]
        },

        // 测试12: 分割动画 - 按词分割
        {
          type: "scene",
          startTime: 54,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img3.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "Hello World Test",
              textColor: "#ffffff",
              position: "center",
              split: "word",
              splitDelay: 0.2,
              splitDuration: 0.5
            }
          ]
        },

        // 测试13: 分割动画 - 按字符分割（中文）
        {
          type: "scene",
          startTime: 58,
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
              text: "中文测试",
              textColor: "#00ff00",
              position: "center",
              split: "word", // 中文会按字符分割
              splitDelay: 0.1,
              splitDuration: 0.3
            }
          ]
        },

        // 测试14: 分割动画 - 按行分割
        {
          type: "scene",
          startTime: 62,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img2.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "第一行\n第二行\n第三行",
              textColor: "#ff0000",
              position: "center",
              split: "line",
              splitDelay: 0.3,
              splitDuration: 0.4
            }
          ]
        },

        // 测试15: 组合动画 - 多个关键帧
        {
          type: "scene",
          startTime: 66,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img3.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "组合动画效果",
              textColor: "#ffffff",
              position: "center",
              animate: [
                { time: 'in', effect: 'slideInLeft' },
                { time: 0.3, from: { scaleX: 1, scaleY: 1 }, to: { scaleX: 1.2, scaleY: 1.2 }, ease: 'easeInOutQuad', duration: 0.2 },
                { time: 0.7, from: { scaleX: 1.2, scaleY: 1.2 }, to: { scaleX: 1, scaleY: 1 }, ease: 'easeInOutQuad', duration: 0.2 },
                { time: 'out', effect: 'slideOutRight' }
              ]
            }
          ]
        },

        // 测试16: 自定义字体
        {
          type: "scene",
          startTime: 70,
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
              text: "自定义字体 Patua One",
              textColor: "#ffff00",
              fontFamily: "Patua One",
              position: "center"
            }
          ]
        },

        // 测试17: 大字体测试
        {
          type: "scene",
          startTime: 74,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img2.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "大字体测试",
              textColor: "#ff0000",
              fontSize: 80, // 注意：这个参数在代码中会被覆盖，实际使用Math.min(width, height) * 0.1
              position: "center"
            }
          ]
        },

        // 测试18: 长文本测试
        {
          type: "scene",
          startTime: 78,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img3.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "这是一个很长的文本测试，用来验证文本换行和显示效果，看看是否能正确处理长文本内容",
              textColor: "#ffffff",
              position: "center"
            }
          ]
        },

        // 测试19: 特殊字符测试
        {
          type: "scene",
          startTime: 82,
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
              text: "特殊字符: !@#$%^&*()_+-=[]{}|;':\",./<>?",
              textColor: "#00ff00",
              position: "center"
            }
          ]
        },

        // 测试20: 多行文本测试
        {
          type: "scene",
          startTime: 86,
          duration: 4,
          elements: [
            {
              duration: 4,
              type: "image",
              path: "./assets/img2.jpg",
              resizeMode: "contain-blur",
            },
            {
              startTime: 0.5,
              duration: 3,
              type: "title",
              text: "多行文本测试\n第二行内容\n第三行内容\n第四行内容",
              textColor: "#ff00ff",
              position: "center"
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
    console.log("[event] 开始生成视频");
  });
  editly.on("progress", (value) => {
    console.log(`[event] 进度: ${(value * 100).toFixed(1)}%`);
  });
  editly.on("complete", (value) => {
    console.log(`[event] 完成: ${value}`);
  });
  editly.on("error", (error) => {
    console.error(`[event] 错误: ${error}`);
  });
}

main();
