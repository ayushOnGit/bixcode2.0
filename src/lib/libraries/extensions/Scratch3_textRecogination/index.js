    const ArgumentType = require('../../extension-support/argument-type');
    const BlockType = require('../../extension-support/block-type');
    const TargetType = require('../../extension-support/target-type');
    const Cast = require('../../util/cast.js');
    const formatMessage = require('format-message');
    const Video = require('../../io/video');
    const StageLayering = require('../../engine/stage-layering');
    const Tesseract = require('tesseract.js');

    const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGc+PGc+PHBhdGggZD0ibTQzNiA0MzAtNzIgNzJoLTI4OHYtMjMyaDM2MHoiIGZpbGw9IiNmYWY3ZjUiLz48cGF0aCBkPSJtNzYgMTBoMzYwdjIyMGgtMzYweiIgZmlsbD0iI2ZhZjdmNSIvPjxwYXRoIGQ9Im0zNjQgNTAydi03Mmg3MnoiIGZpbGw9IiNkZmVkZmYiLz48cGF0aCBkPSJtMzYgMjMwaDQ0MHY0MGgtNDQweiIgZmlsbD0iI2ZmZTZiNCIvPjwvZz48Zz48Y2lyY2xlIGN4PSI0MzYiIGN5PSIzMzAuMTgiIHI9IjEwIi8+PHBhdGggZD0ibTEyNiA0MjBjLTUuNTIzIDAtMTAgNC40NzgtMTAgMTBzNC40NzcgMTAgMTAgMTBoMTk4YzUuNTIyIDAgMTAtNC40NzggMTAtMTBzLTQuNDc4LTEwLTEwLTEweiIvPjxwYXRoIGQ9Im0zOTYgMzkwYzAtNS41MjItNC40NzgtMTAtMTAtMTBoLTI2MGMtNS41MjMgMC0xMCA0LjQ3OC0xMCAxMHM0LjQ3NyAxMCAxMCAxMGgyNjBjNS41MjIgMCAxMC00LjQ3OCAxMC0xMHoiLz48cGF0aCBkPSJtMzg2IDM0MGgtMjYwYy01LjUyMyAwLTEwIDQuNDc4LTEwIDEwczQuNDc3IDEwIDEwIDEwaDI2MGM1LjUyMiAwIDEwLTQuNDc4IDEwLTEwcy00LjQ3OC0xMC0xMC0xMHoiLz48cGF0aCBkPSJtMzg2IDMwMGgtMjIwYy01LjUyMyAwLTEwIDQuNDc4LTEwIDEwczQuNDc3IDEwIDEwIDEwaDIyMGM1LjUyMiAwIDEwLTQuNDc4IDEwLTEwcy00LjQ3OC0xMC0xMC0xMHoiLz48cGF0aCBkPSJtMzQ2IDE3MGgtMjIwYy01LjUyMyAwLTEwIDQuNDc4LTEwIDEwczQuNDc3IDEwIDEwIDEwaDIyMGM1LjUyMiAwIDEwLTQuNDc4IDEwLTEwcy00LjQ3OC0xMC0xMC0xMHoiLz48cGF0aCBkPSJtMzg2IDEzMGgtMjYwYy01LjUyMyAwLTEwIDQuNDc4LTEwIDEwczQuNDc3IDEwIDEwIDEwaDI2MGM1LjUyMiAwIDEwLTQuNDc4IDEwLTEwcy00LjQ3OC0xMC0xMC0xMHoiLz48cGF0aCBkPSJtMzg2IDkwaC0xMDdjLTUuNTIyIDAtMTAgNC40NzgtMTAgMTBzNC40NzggMTAgMTAgMTBoMTA3YzUuNTIyIDAgMTAtNC40NzggMTAtMTBzLTQuNDc4LTEwLTEwLTEweiIvPjxwYXRoIGQ9Im0xMjYgMTEwaDEwOGM1LjUyMyAwIDEwLTQuNDc4IDEwLTEwcy00LjQ3Ny0xMC0xMC0xMGgtMTA4Yy01LjUyMyAwLTEwIDQuNDc4LTEwIDEwczQuNDc3IDEwIDEwIDEweiIvPjxwYXRoIGQ9Im0xODEgNzBoMTUwYzUuNTIyIDAgMTAtNC40NzggMTAtMTBzLTQuNDc4LTEwLTEwLTEwaC0xNTBjLTUuNTIzIDAtMTAgNC40NzgtMTAgMTBzNC40NzcgMTAgMTAgMTB6Ii8+PHBhdGggZD0ibTEwIDQ2YzUuNTIzIDAgMTAtNC40NzggMTAtMTB2LTE2aDE2YzUuNTIzIDAgMTAtNC40NzggMTAtMTBzLTQuNDc3LTEwLTEwLTEwaC0yNmMtNS41MjMgMC0xMCA0LjQ3OC0xMCAxMHYyNmMwIDUuNTIyIDQuNDc3IDEwIDEwIDEweiIvPjxwYXRoIGQ9Im01MDIgMGgtMjZjLTUuNTIyIDAtMTAgNC40NzgtMTAgMTBzNC40NzggMTAgMTAgMTBoMTZ2MTZjMCA1LjUyMiA0LjQ3OCAxMCAxMCAxMHMxMC00LjQ3OCAxMC0xMHYtMjZjMC01LjUyMi00LjQ3OC0xMC0xMC0xMHoiLz48cGF0aCBkPSJtNTAyIDQ2NmMtNS41MjIgMC0xMCA0LjQ3OC0xMCAxMHYxNmgtMTZjLTUuNTIyIDAtMTAgNC40NzgtMTAgMTBzNC40NzggMTAgMTAgMTBoMjZjNS41MjIgMCAxMC00LjQ3OCAxMC0xMHYtMjZjMC01LjUyMi00LjQ3OC0xMC0xMC0xMHoiLz48cGF0aCBkPSJtMzYgNDkyaC0xNnYtMTZjMC01LjUyMi00LjQ3Ny0xMC0xMC0xMHMtMTAgNC40NzgtMTAgMTB2MjZjMCA1LjUyMiA0LjQ3NyAxMCAxMCAxMGgyNmM1LjUyMyAwIDEwLTQuNDc4IDEwLTEwcy00LjQ3Ny0xMC0xMC0xMHoiLz48cGF0aCBkPSJtNDc2IDI4MGM1LjUyMiAwIDEwLTQuNDc4IDEwLTEwdi00MGMwLTUuNTIyLTQuNDc4LTEwLTEwLTEwaC0zMHYtMjEwYzAtNS41MjItNC40NzgtMTAtMTAtMTBoLTM2MGMtNS41MjMgMC0xMCA0LjQ3OC0xMCAxMHYyMTBoLTMwYy01LjUyMyAwLTEwIDQuNDc4LTEwIDEwdjQwYzAgNS41MjIgNC40NzcgMTAgMTAgMTBoMzB2MjIyYzAgMi42MyAxLjA3IDUuMjEgMi45MyA3LjA2OSAxLjg2IDEuODYxIDQuNDQgMi45MzEgNy4wNyAyLjkzMWgyODhjMi42NjIgMCA1LjE2NS0xLjAzNSA3LjA1Mi0yLjkxNS4wMDYtLjAwNi4wMTItLjAwNy4wMTktLjAxM2w3Mi03MmMuMDI0LS4wMjQuMDM0LS4wNDIuMDU1LS4wNjUgMS44NTItMS44ODIgMi44NzQtNC4zNjUgMi44NzQtNy4wMDZ2LTU0LjgyYzAtNS41Mi00LjQ5LTEwLTEwLTEwcy05Ljk5IDQuNDctMTAgOS45OHYuMDIgNDQuODE5aC02MmMtNS41MjIgMC0xMCA0LjQ3OC0xMCAxMHY2MmgtMjY4di0yMTJoMzQwdjUuMThjMCA1LjUxIDQuNDc5IDEwIDEwIDEwIDUuNTEgMCAxMC00LjQ5IDEwLTEwdi01LjE4em0tMTAyIDE2MGgzNy44NTdsLTM3Ljg1NyAzNy44NTd6bS0yODgtNDIwaDM0MHYyMDBoLTM0MHptLTQwIDI0MHYtMjBoNDIwdjIweiIvPjwvZz48L2c+PC9zdmc+';




    const { hexToDecimal } = require('openblock-vm/src/util/color.js');

    const DefaultInterval = 1000;

    const DefaultStageWidth = 480;
    const DefaultStageHeight = 360;

    const Mode = {
        CAMERA: 1,
        STAGE: 2
    };

    class Scratch3textRecognitionBlocks {
        constructor(runtime) {
            this.runtime = runtime;
            this._canvas = document.querySelector('canvas');
            this._scanning = false;
            this._mode = null;
            this._interval = DefaultInterval;
            this._data = '';
            this._binaryData = null;
            this.image = null;
            this._scanInterval = null;
            this.text  = null;

            this.runtime.on('PROJECT_STOP_ALL', this.trStop.bind(this));

            this._penSkinId = this.runtime.renderer.createPenSkin();
            const penDrawableId = this.runtime.renderer.createDrawable(StageLayering.SPRITE_LAYER);
            this.runtime.renderer.updateDrawableProperties(penDrawableId, { skinId: this._penSkinId });
        }

        imageDataToImage(imageData) {
            return new Promise((resolve, reject) => {
                // Create a canvas element
                const canvas = document.createElement('canvas');
                canvas.width = imageData.width;
                canvas.height = imageData.height;
        
                // Get the canvas context
                const ctx = canvas.getContext('2d');
                
                // // Rotate the canvas by 180 degrees and mirror it horizontally
                // ctx.translate(canvas.width / 2, canvas.height / 2);
                // ctx.rotate(Math.PI);
                // ctx.scale(-1, 1);
                // ctx.translate(-canvas.width / 2, -canvas.height / 2);
        
                // Put the ImageData onto the canvas
                ctx.putImageData(imageData, 0, 0);
                
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(Math.PI);
                ctx.scale(-1, 1);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);


                // Convert the canvas content to a Data URL
                canvas.toBlob(blob => {
                    if (blob) {
                        const img = new Image();
                        img.onload = () => {
                            resolve(img);
                        };
                        img.onerror = reject;
                        img.src = URL.createObjectURL(blob);
                    } else {
                        reject(new Error('Canvas toBlob failed'));
                    }
                });
            });
        }
        flipImageDataVertically(data, width, height) {
            const rowSize = width * 4; // RGBA = 4 bytes per pixel
            const temp = new Uint8Array(rowSize);
            
            for (let i = 0; i < height / 2; i++) {
                const topRow = i * rowSize;
                const bottomRow = (height - i - 1) * rowSize;
        
                // Swap top row with bottom row
                temp.set(data.subarray(topRow, topRow + rowSize));
                data.copyWithin(topRow, bottomRow, bottomRow + rowSize);
                data.set(temp, bottomRow);
            }
        }


        get EXTENSION_ID() {
            return 'textRecognition';
        }

        getInfo() {
            const stage = this.runtime.getTargetForStage();
            if (stage) {
                stage.videoTransparency = 0;
            }

            return [{
                id: 'textRecognition',
                name: "Text Recognition",
                blockIconURI: blockIconURI,
                color1: '#4E53A3',
                color2: '#BBB1C9',
                blocks: [
                    {
                        opcode: 'trStart',
                        text: formatMessage({
                            id: 'trCodeReader.startScanning',
                            default: 'Start Text Recognition Scanner [INPUT]',
                            description: 'Starts tr code scanner'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            INPUT: {
                                type: ArgumentType.STRING,
                                menu: 'inputMenu',
                                defaultValue: "Stage"
                            }
                        }
                    },
                    {
                        opcode: 'trStop',
                        text: formatMessage({
                            id: 'trCodeReader.stopScanning',
                            default: 'Stop Text Recognition Scanner',
                            description: 'Stop Text Recognition code scanner'
                        }),
                        blockType: BlockType.COMMAND
                    },
                    '---',
                    {
                        opcode: 'trData',
                        text: formatMessage({
                            id: 'trCodeReader.trData',
                            default: 'Reconized Text Data',
                            description: 'tr code data'
                        }),
                        blockType: BlockType.REPORTER
                    }
                ],
                menus: {
                    inputMenu: {
                        acceptReporters: false,
                        items: ["Camera", "Stage"]
                    },
                    intervalMenu: {
                        acceptReporters: false,
                        items: ['0.3', '0.5', '1']
                    }
                }
            }];
        }

        _scan() {
            if (!this._scanning || (this._mode === Mode.CAMERA && !this.runtime.ioDevices.video.videoReady)) {
                this._scanning = false;
            this._clearMark();
                clearInterval(this._scanInterval); // Clear the interval if scanning stops
                return;
            }

            let frame = null;
            let width, height;
            if(this._mode == Mode.CAMERA){
                frame = this.runtime.ioDevices.video.getFrame({
                    format: Video.FORMAT_IMAGE_DATA,
                    dimensions: Video.DIMENSIONS
                }).data;
                width = DefaultStageWidth;
                height = DefaultStageHeight;
                const imagedata =new ImageData(new Uint8ClampedArray(frame), width, height);
                this.flipImageDataVertically(imagedata);

                this.imageDataToImage(imagedata).then(img => {
                    document.body.appendChild(img); // Append the image to the body for demonstration
                    this.image = img;
                    console.log(this.image);
                }).catch(err => {
                    console.error('Error creating image:', err);
                });
                this._clearMark();
                if (frame) {
                    try {
                        Tesseract.recognize(
                            this.image,
                            'eng'
                        ).then(({ data: { text } }) => {
                            if (text){
                                this.text = text;
                                console.log("Recognized Text: ",this.text);
                            }
                            
                        }).catch(err => {
                            console.error('Error in Tesseract recognition:', err);
                        });
                    } catch (error) {
                        console.error('Error in Tesseract setup:', error);
                    }
                }

            }

            else if (this._mode === Mode.STAGE) {
                const webgl = this.runtime.renderer._gl;
                const canvas = webgl.canvas;
                const width = canvas.width;
                const height = canvas.height;
                const frame = new Uint8Array(width * height * 4);
                webgl.readPixels(0,0, width, height, webgl.RGBA, webgl.UNSIGNED_BYTE, frame);
                this.flipImageDataVertically(frame, width, height);
                console.log(frame);
                const imageData = new ImageData(new Uint8ClampedArray(frame), width, height);

                this.imageDataToImage(imageData).then(img => {
                    // document.body.appendChild(img); // Append the image to the body for demonstration
                    this.image = img;
                   
                }).catch(err => {
                    console.error('Error creating image:', err);
                });
                if (frame) {
                    try {
                        Tesseract.recognize(
                            this.image,
                            'eng'
                        ).then(({ data: { text } }) => {
                            if (text.length>5){
                                this.text = text;
                                console.log("Recognized Text: ",this.text);
                            }
                            
                        }).catch(err => {
                            console.error('Error in Tesseract recognition:', err);
                        });
                    } catch (error) {
                        console.error('Error in Tesseract setup:', error);
                    }
                }}

            
            setTimeout(this._scan.bind(this), this._interval);
        }

        _decodeBinaryData(binaryData) {
            let encode = encoding.detect(binaryData);
            if (encode == 'UTF16') {
                return new TextDecoder('utf-16').decode(Uint16Array.from(binaryData).buffer);
            } else {
                try {
                    return new TextDecoder(encode).decode(Uint8Array.from(binaryData).buffer);
                } catch (e) {
                    return '';
                }
            }
        }

        _getGlobalVideoTransparency() {
            const stage = this.runtime.getTargetForStage();
            if (stage) {
                return stage.videoTransparency;
            }
            return 0;
        }

        _clearMark(){
            this.runtime.renderer.penClear(this._penSkinId);
        }

        trStart(args, util) {
            if(args.INPUT == "Camera"){
                this._mode = Mode.CAMERA;
            } else if (args.INPUT == "Stage"){
                this._mode = Mode.STAGE;
            }

            if(this._scanning || (this._mode == Mode.CAMERA && !this.runtime.ioDevices)){
                return;
            }

            if(this._mode == Mode.CAMERA){
                this.runtime.ioDevices.video.setPreviewGhost(this._getGlobalVideoTransparency());
                this.runtime.ioDevices.video.mirror = false;
                this.runtime.ioDevices.video.enableVideo();
                if(this.runtime.ioDevices.video.videoReady){
                    this._scanning = true;
                    this._scan();
                }else{
                    setTimeout(this.qrStart.bind(this, args, util), 500);
                }
            } else if (this._mode == Mode.STAGE){
                this._scanning = true;
                this._scan();
            }
        }

        trStop(args, util) {
            if (!this._scanning) {
                return;
            }

            this.runtime.ioDevices.video.disableVideo();
            this._scanning = false;
            this._clearMark();
            clearInterval(this._scanInterval); // Clear the interval when stopping
        }

        trSetCameraTransparency(args, util) {
            const transparency = Cast.toNumber(args.TRANSPARENCY);
            const stage = this.runtime.getTargetForStage();
            if (stage) {
                stage.videoTransparency = transparency;
            }
            this.runtime.ioDevices.video.setPreviewGhost(transparency);
        }

        trData(args, util){
            if (this.text){
                return this.text;
            }
            
        }
    }

    module.exports = Scratch3textRecognitionBlocks;
