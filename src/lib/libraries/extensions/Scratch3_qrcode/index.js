const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast.js');
const formatMessage = require('format-message');
const Video = require('../../io/video');
const StageLayering = require('../../engine/stage-layering');

const jsQR = require('jsqr'); //https://github.com/cozmo/jsQR
const encoding = require('encoding-japanese'); //https://github.com/polygonplanet/encoding.js

const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQwIDQwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzgiIGhlaWdodD0iMzgiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IiB4PSIxIiB5PSIxIi8+CiAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMC4wNjQ0NTMsIDAsIDAsIDAuMDY0NDUzLCAzLjUwMDAzMSwgMy41MDAwMzEpIj4KICAgIDxnPgogICAgICA8Zz4KICAgICAgICA8cGF0aCBkPSJNMCwwdjIzMy43MzloMjMzLjczOVYwSDB6IE0yMDAuMzQ4LDIwMC4zNDhIMzMuMzkxVjMzLjM5MWgxNjYuOTU3VjIwMC4zNDh6IiBzdHlsZT0ic3Ryb2tlOiByZ2IoMCwgMCwgMCk7IHN0cm9rZS1vcGFjaXR5OiAwLjE1OyBmaWxsOiByZ2IoNzcsIDc3LCA3Nyk7IHN0cm9rZS13aWR0aDogNi44MjY2OHB4OyIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgICA8Zz4KICAgICAgPGc+CiAgICAgICAgPHJlY3QgeD0iNjYuNzgzIiB5PSI2Ni43ODMiIHdpZHRoPSIxMDAuMTc0IiBoZWlnaHQ9IjEwMC4xNzQiIHN0eWxlPSJzdHJva2U6IHJnYigwLCAwLCAwKTsgc3Ryb2tlLW9wYWNpdHk6IDAuMTU7IGZpbGw6IHJnYig3NywgNzcsIDc3KTsgc3Ryb2tlLXdpZHRoOiA2LjgyNjY4cHg7Ii8+CiAgICAgIDwvZz4KICAgIDwvZz4KICAgIDxnPgogICAgICA8Zz4KICAgICAgICA8cGF0aCBkPSJNMjc4LjI2MSwwdjIzMy43MzlINTEyVjBIMjc4LjI2MXogTTQ3OC42MDksMjAwLjM0OEgzMTEuNjUyVjMzLjM5MWgxNjYuOTU3VjIwMC4zNDh6IiBzdHlsZT0ic3Ryb2tlOiByZ2IoMCwgMCwgMCk7IHN0cm9rZS1vcGFjaXR5OiAwLjE1OyBmaWxsOiByZ2IoNzcsIDc3LCA3Nyk7IHN0cm9rZS13aWR0aDogNi44MjY2OHB4OyIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgICA8Zz4KICAgICAgPGc+CiAgICAgICAgPHJlY3QgeD0iMzQ1LjA0MyIgeT0iNjYuNzgzIiB3aWR0aD0iMTAwLjE3NCIgaGVpZ2h0PSIxMDAuMTc0IiBzdHlsZT0ic3Ryb2tlOiByZ2IoMCwgMCwgMCk7IHN0cm9rZS1vcGFjaXR5OiAwLjE1OyBmaWxsOiByZ2IoNzcsIDc3LCA3Nyk7IHN0cm9rZS13aWR0aDogNi44MjY2OHB4OyIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgICA8Zz4KICAgICAgPGc+CiAgICAgICAgPHBhdGggZD0iTTAsMjc4LjI2MVY1MTJoMjMzLjczOVYyNzguMjYxSDB6IE0yMDAuMzQ4LDQ3OC42MDlIMzMuMzkxVjMxMS42NTJoMTY2Ljk1N1Y0NzguNjA5eiIgc3R5bGU9InN0cm9rZTogcmdiKDAsIDAsIDApOyBzdHJva2Utb3BhY2l0eTogMC4xNTsgZmlsbDogcmdiKDc3LCA3NywgNzcpOyBzdHJva2Utd2lkdGg6IDYuODI2NjhweDsiLz4KICAgICAgPC9nPgogICAgPC9nPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxyZWN0IHg9IjY2Ljc4MyIgeT0iMzQ1LjA0MyIgd2lkdGg9IjEwMC4xNzQiIGhlaWdodD0iMTAwLjE3NCIgc3R5bGU9InN0cm9rZTogcmdiKDAsIDAsIDApOyBzdHJva2Utb3BhY2l0eTogMC4xNTsgZmlsbDogcmdiKDc3LCA3NywgNzcpOyBzdHJva2Utd2lkdGg6IDYuODI2NjhweDsiLz4KICAgICAgPC9nPgogICAgPC9nPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMzQ1LjA0MywzMTEuNjUyIDM0NS4wNDMsMjc4LjI2MSAyNzguMjYxLDI3OC4yNjEgMjc4LjI2MSw1MTIgMzQ1LjA0Myw1MTIgMzQ1LjA0Myw0NzguNjA5IDMxMS42NTIsNDc4LjYwOSAmIzEwOyYjOTsmIzk7JiM5OzMxMS42NTIsNDExLjgyNiAzNDUuMDQzLDQxMS44MjYgMzQ1LjA0MywzNzguNDM1IDMxMS42NTIsMzc4LjQzNSAzMTEuNjUyLDMxMS42NTIgJiM5OyYjOTsiIHN0eWxlPSJzdHJva2U6IHJnYigwLCAwLCAwKTsgc3Ryb2tlLW9wYWNpdHk6IDAuMTU7IGZpbGw6IHJnYig3NywgNzcsIDc3KTsgc3Ryb2tlLXdpZHRoOiA2LjgyNjY4cHg7Ii8+CiAgICAgIDwvZz4KICAgIDwvZz4KICAgIDxnPgogICAgICA8Zz4KICAgICAgICA8cmVjdCB4PSI0NzguNjA5IiB5PSIyNzguMjYxIiB3aWR0aD0iMzMuMzkxIiBoZWlnaHQ9IjMzLjM5MSIgc3R5bGU9InN0cm9rZTogcmdiKDAsIDAsIDApOyBzdHJva2Utb3BhY2l0eTogMC4xNTsgZmlsbDogcmdiKDc3LCA3NywgNzcpOyBzdHJva2Utd2lkdGg6IDYuODI2NjhweDsiLz4KICAgICAgPC9nPgogICAgPC9nPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iNDc4LjYwOSwzNTYuMTc0IDQ3OC42MDksNDc4LjYwOSA0NDUuMjE3LDQ3OC42MDkgNDQ1LjIxNyw1MTIgNTEyLDUxMiA1MTIsMzU2LjE3NCAmIzk7JiM5OyIgc3R5bGU9InN0cm9rZTogcmdiKDAsIDAsIDApOyBzdHJva2Utb3BhY2l0eTogMC4xNTsgZmlsbDogcmdiKDc3LCA3NywgNzcpOyBzdHJva2Utd2lkdGg6IDYuODI2NjhweDsiLz4KICAgICAgPC9nPgogICAgPC9nPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxyZWN0IHg9IjM3OC40MzUiIHk9IjI3OC4yNjEiIHdpZHRoPSI2Ni43ODMiIGhlaWdodD0iMzMuMzkxIiBzdHlsZT0ic3Ryb2tlOiByZ2IoMCwgMCwgMCk7IHN0cm9rZS1vcGFjaXR5OiAwLjE1OyBmaWxsOiByZ2IoNzcsIDc3LCA3Nyk7IHN0cm9rZS13aWR0aDogNi44MjY2OHB4OyIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgICA8Zz4KICAgICAgPGc+CiAgICAgICAgPHBvbHlnb24gcG9pbnRzPSI0NDUuMjE3LDM3OC40MzUgNDQ1LjIxNywzNDUuMDQzIDM3OC40MzUsMzQ1LjA0MyAzNzguNDM1LDQ0NS4yMTcgNDQ1LjIxNyw0NDUuMjE3IDQ0NS4yMTcsNDExLjgyNiAmIzEwOyYjOTsmIzk7JiM5OzQxMS44MjYsNDExLjgyNiA0MTEuODI2LDM3OC40MzUgJiM5OyYjOTsiIHN0eWxlPSJzdHJva2U6IHJnYigwLCAwLCAwKTsgc3Ryb2tlLW9wYWNpdHk6IDAuMTU7IGZpbGw6IHJnYig3NywgNzcsIDc3KTsgc3Ryb2tlLXdpZHRoOiA2LjgyNjY4cHg7Ii8+CiAgICAgIDwvZz4KICAgIDwvZz4KICAgIDxnPgogICAgICA8Zz4KICAgICAgICA8cmVjdCB4PSIzNzguNDM1IiB5PSI0NzguNjA5IiB3aWR0aD0iMzMuMzkxIiBoZWlnaHQ9IjMzLjM5MSIgc3R5bGU9InN0cm9rZTogcmdiKDAsIDAsIDApOyBzdHJva2Utb3BhY2l0eTogMC4xNTsgZmlsbDogcmdiKDc3LCA3NywgNzcpOyBzdHJva2Utd2lkdGg6IDYuODI2NjhweDsiLz4KICAgICAgPC9nPgogICAgPC9nPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogICAgPGcvPgogIDwvZz4KPC9zdmc+';




const DefaultInterval = 300;

const DefaultStageWidth = 480;
const DefaultStageHeight = 360;

const MakerAttributes = {
    color4f: [0.9, 0.6, 0.2, 0.7],
    diameter: 7
};

const Mode = {
    CAMERA: 1,
    STAGE: 2
};

class Scratch3QRCodeBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this._canvas = document.querySelector('canvas');
        this._scanning = false;
        this._mode = null;
        this._interval = DefaultInterval;
        this._data = '';
        this._binaryData = null;

        this.runtime.on('PROJECT_STOP_ALL', this.qrStop.bind(this));

        this._penSkinId = this.runtime.renderer.createPenSkin();
        const penDrawableId = this.runtime.renderer.createDrawable(StageLayering.SPRITE_LAYER);
        this.runtime.renderer.updateDrawableProperties(penDrawableId, {skinId: this._penSkinId});
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





    get EXTENSION_ID() {
        return 'qrCodeScanner';
    }

    getInfo () {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoTransparency = 0;
        }

        return [{
            id: 'qrcodeScanner',
            name: "QR Scanner",
            blockIconURI: blockIconURI,
            //docsURI: 'https://',
            color1: '#4E53A3',
            color2: '#BBB1C9',
            blocks: [
                {
                    opcode: 'qrStart',
                    text: formatMessage({
                        id: 'qrCodeReader.startScanning',
                        default: 'Start QR Scanner [INPUT]',
                        description: 'Starts QR code scanner'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INPUT: {
                            type: ArgumentType.STRING,
                            menu: 'inputMenu',
                            defaultValue: "Camera"
                        }
                    }
                },
                {
                    opcode: 'qrStop',
                    text: formatMessage({
                        id: 'qrCodeReader.stopScanning',
                        default: 'Stop QR Scanner',
                        description: 'Stop QR code scanner'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'qrSetInterval',
                    text: formatMessage({
                        id: 'qrCodeReader.setIntervel',
                        default: 'Set QR Scanner Interval [INTERVAL]',
                        description: 'Set QR code scanner interval'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INTERVAL: {
                            type: ArgumentType.NUMBER,
                            menu: 'intervalMenu',
                            defaultValue: 0.3
                        }
                    }
                },
                {
                    opcode: 'qrScanning',
                    text: formatMessage({
                        id: 'qrCodeReader.isScanning',
                        default: 'Scanning?',
                        description: 'Whether QR code scanner is scanning'
                    }),
                    blockType: BlockType.BOOLEAN
                },
                '---',
                {
                    opcode: 'qrData',
                    text: formatMessage({
                        id: 'qrCodeReader.qrData',
                        default: 'QR Data',
                        description: 'QR code data'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'qrASCII',
                    text: formatMessage({
                        id: 'qrCodeReader.qrASCII',
                        default: 'letter [INDEX] ASCII Code of Data',
                        description: 'QR code ASCII'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'qrReset',
                    text: formatMessage({
                        id: 'qrCodeReader.reset',
                        default: 'Reset QR Scanner',
                        description: 'Reset QR code scanner'
                    }),
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'qrSetCameraTransparency',
                    text:   formatMessage({
                        id: 'qrCodeReader.setCameraTransparency',
                        default: 'Set Camera Transparency [TRANSPARENCY]',
                        description: 'Set camera transparency'
                    }),
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
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
        }]
    };

    

    _scan(){
        if(!this._scanning ||  (this._mode == Mode.CAMERA && !this.runtime.ioDevices.video.videoReady)){
            this._scanning = false;
            this._clearMark();
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
        } else if (this._mode == Mode.STAGE){
            console.log("stage selected")
            const webgl = this.runtime.renderer.gl;
            frame = new Uint8Array(webgl.drawingBufferWidth * webgl.drawingBufferHeight * 4);
            webgl.readPixels(0, 0, webgl.drawingBufferWidth, webgl.drawingBufferHeight, webgl.RGBA, webgl.UNSIGNED_BYTE, frame);
            width = webgl.drawingBufferWidth;
            height = webgl.drawingBufferHeight;
        }
        const image = new ImageData(new Uint8ClampedArray(frame), width, height);
        this.imageDataToImage(image).then(img => {
            document.body.appendChild(img); // Append the image to the body for demonstration
            this.image = img;
            console.log(this.image);
        }).catch(err => {
            console.error('Error creating image:', err);
        });
        


        // Scan the image for markers and draw
        const code = jsQR(image.data, image.width, image.height, {
            inversionAttempts: 'dontInvert',
        });
        

        this._clearMark();
        if(code){
            const delimiter = code.binaryData.indexOf(0); //NULL index
            // console.log(code.location)
            if(delimiter != -1){
                code.binaryData = code.binaryData.slice(0, delimiter);
            }
            this._data = this._decodeBinaryData(code.binaryData);
            this._binaryData = code.binaryData;

            this._drawMark(code.location, width, height);
        }
        setTimeout(this._scan.bind(this), this._interval);
    }

    _drawMark(location, width, height){
        let widthScale = DefaultStageWidth / width;
        let heightScale = DefaultStageHeight / height;

        location.topLeftCorner.x = location.topLeftCorner.x * widthScale - width / 2 * widthScale;
        location.topRightCorner.x = location.topRightCorner.x * widthScale - width / 2 * widthScale;
        location.bottomRightCorner.x = location.bottomRightCorner.x * widthScale - width / 2 * widthScale;
        location.bottomLeftCorner.x = location.bottomLeftCorner.x * widthScale - width / 2 * widthScale;

        if(this._mode == Mode.CAMERA){
            location.topLeftCorner.y = height / 2 * heightScale - location.topLeftCorner.y * heightScale;
            location.topRightCorner.y = height / 2 * heightScale - location.topRightCorner.y * heightScale;
            location.bottomRightCorner.y = height / 2 * heightScale - location.bottomRightCorner.y * heightScale;
            location.bottomLeftCorner.y = height / 2 * heightScale - location.bottomLeftCorner.y * heightScale;
        } else if (this._mode == Mode.STAGE){
            location.topLeftCorner.y = location.topLeftCorner.y * heightScale - height / 2 * heightScale;
            location.topRightCorner.y = location.topRightCorner.y * heightScale - height / 2 * heightScale;
            location.bottomRightCorner.y = location.bottomRightCorner.y * heightScale - height / 2 * heightScale;
            location.bottomLeftCorner.y = location.bottomLeftCorner.y * heightScale - height / 2 * heightScale;
        }

        this.runtime.renderer.penLine(this._penSkinId, MakerAttributes, location.topLeftCorner.x, location.topLeftCorner.y, location.topRightCorner.x, location.topRightCorner.y);
        this.runtime.renderer.penLine(this._penSkinId, MakerAttributes, location.topRightCorner.x, location.topRightCorner.y, location.bottomRightCorner.x, location.bottomRightCorner.y);
        this.runtime.renderer.penLine(this._penSkinId, MakerAttributes, location.bottomRightCorner.x, location.bottomRightCorner.y, location.bottomLeftCorner.x, location.bottomLeftCorner.y);
        this.runtime.renderer.penLine(this._penSkinId, MakerAttributes, location.bottomLeftCorner.x, location.bottomLeftCorner.y, location.topLeftCorner.x, location.topLeftCorner.y);

    }

    _clearMark(){
        this.runtime.renderer.penClear(this._penSkinId);
    }

    _decodeBinaryData(binaryData){
        let encode = encoding.detect(binaryData);
        if(encode == 'UTF16'){
            return  new TextDecoder('utf-16').decode(Uint16Array.from(binaryData).buffer);
        }else{
            try{
                return new TextDecoder(encode).decode(Uint8Array.from(binaryData).buffer);
            }catch (e) {
                return '';
            }
        }
    }

    _getGlobalVideoTransparency () {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoTransparency;
        }
        return 0;
    }

    qrStart(args, util) {
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

    qrStop(args, util) {
        if(!this._scanning){
            return;
        }

        this.runtime.ioDevices.video.disableVideo();
        this._clearMark();
        this._scanning = false;
    }

    qrSetInterval(args, util){
        this._interval = args.INTERVAL * 1000;
    }

    qrScanning(args, util){
        return this._scanning;
    }

    qrData(args, util) {
        return this._data;
    }

    qrASCII(args, util) {
        if(this._data.length == 0 || this._binaryData.length == 0){
            return 0;
        }
        const index = Cast.toNumber(args.INDEX) - 1;
        if (index < 0 || index >= this._data.length) {
            return 0;
        }

        const encoder = new TextEncoder();
        const codes = encoder.encode(this._data.charAt(index));
        if(codes.length != 1 && codes[0] > 127){
            return 0;
        }
        return codes[0];
    }

    qrReset(args, util) {
        this._data = '';
        this._binaryData = null;
    }

    qrSetCameraTransparency(args, util) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoTransparency = transparency;
        }
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }
}

module.exports = Scratch3QRCodeBlocks;