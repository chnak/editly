import { FabricImage } from "fabric/node";
import { defineFrameSource } from "../libs/index.js";
import { getPositionProps, getTranslationParams, getZoomParams, loadImage } from "../utils/util.js";
import { blurImage } from "./fabric.js";
export default defineFrameSource("image", async ({ verbose, params, width, height }) => {
    const { path, position, width: relWidth, height: relHeight, zoomDirection = "in", zoomAmount = 0.1, resizeMode = "contain-blur" } = params;
    if (verbose)
        console.log("Loading", path);
    const imgData = await loadImage(path);
    const createImg = () => new FabricImage(imgData, getPositionProps({ position, width, height }));
    let blurredImg;
    // Blurred version
    if (resizeMode === "contain-blur") {
        // If we dispose mutableImg, seems to cause issues with the rendering of blurredImg
        const mutableImg = createImg();
        if (verbose)
            console.log("Blurring background");
        blurredImg = await blurImage({ mutableImg, width, height });
        // 设置 blurredImg 的位置属性，与主图片保持一致
        const positionProps = getPositionProps({ position, width, height });
        blurredImg.set({
            originX: positionProps.originX,
            originY: positionProps.originY,
            left: positionProps.left,
            top: positionProps.top
        });
    }
    return {
        async readNextFrame(progress, canvas) {
            const img = createImg();
            const scaleFactor = getZoomParams({ progress, zoomDirection, zoomAmount });
            const translationParams = getTranslationParams({ progress, zoomDirection, zoomAmount });
            
            // 支持相对宽度和高度
            if (relWidth != null) {
                img.scaleToWidth(relWidth * width * scaleFactor);
                if(blurredImg){
                    blurredImg.scaleToWidth(relWidth * width * scaleFactor);
                }
            }
            else if (relHeight != null) {
                img.scaleToHeight(relHeight * height * scaleFactor);
                if(blurredImg){
                    blurredImg.scaleToHeight(relHeight * height * scaleFactor);
                }
            }
            else {
                // 使用原有的resizeMode逻辑
                const ratioW = width / img.width;
                const ratioH = height / img.height;
                
                if (resizeMode==='contain') {
                    if (ratioW > ratioH) {
                        img.scaleToHeight(height * scaleFactor);
                    }
                    else {
                        img.scaleToWidth(width * scaleFactor);
                    }
                }else if (resizeMode==='contain-blur') {
                    if (ratioW > ratioH) {
                        img.scaleToHeight(height * scaleFactor);
                        if(blurredImg) {
                            blurredImg.scaleToHeight(height * scaleFactor);
                        }
                    }
                    else {
                        img.scaleToWidth(width * scaleFactor);
                        if(blurredImg) {
                            blurredImg.scaleToWidth(width * scaleFactor);
                        }
                    }
                }
                else if (resizeMode === "cover") {
                    if (ratioW > ratioH) {
                        img.scaleToWidth(width * scaleFactor);
                    }
                    else {
                        img.scaleToHeight(height * scaleFactor);
                    }
                }
                else if (resizeMode === "stretch") {
                    img.set({
                        scaleX: (width / img.width) * scaleFactor,
                        scaleY: (height / img.height) * scaleFactor,
                    });
                }
            }
            
            // 应用位置偏移（如果有translationParams）
            if (translationParams !== 0) {
                img.left = img.left + translationParams;
                if(blurredImg) {
                    blurredImg.left = blurredImg.left + translationParams;
                }
            }
            
            if (blurredImg)
                canvas.add(blurredImg);
            canvas.add(img);
        },
        close() {
            if (blurredImg)
                blurredImg.dispose();
            // imgData.dispose();
        },
    };
});
