const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const Video = require("../../io/video");
const ml5 = require("ml5");
const StageLayering = require("../../engine/stage-layering");
const Cast = require("../../util/cast.js");

const DefaultStageWidth = 480;
const DefaultStageHeight = 360;

const MakerAttributes = {
  color4f: [0.9, 0.6, 0.2, 0.7],       // RGB values
  diameter: 7,
};

const blockIconURI =
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMTEyLjAxIiB4Mj0iNDM2LjcxIiB5MT0iMTEyLjYxIiB5Mj0iNDM3LjMyIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwMDU2NzAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDU2NzAiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtMiIgeDE9IjMxNC4yMSIgeDI9IjUzMC40MiIgeGxpbms6aHJlZj0iI2xpbmVhci1ncmFkaWVudCIgeTE9Ijg3LjYiIHkyPSIzMDMuODEiLz48bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudC0zIiB4MT0iODYuNzEiIHgyPSIzMDEuOTUiIHhsaW5rOmhyZWY9IiNsaW5lYXItZ3JhZGllbnQiIHkxPSIzMTUuMTEiIHkyPSI1MzAuMzUiLz48ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj48ZyBpZD0iTGF5ZXJfMl9jb3B5XzUiIGRhdGEtbmFtZT0iTGF5ZXIgMiBjb3B5IDUiPjxnIGlkPSJfMTE3IiBkYXRhLW5hbWU9IjExNyI+PGcgZmlsbD0iI2ZmZiI+PHBhdGggZD0ibTEzMS44OCAyMTEuMTh2LTczYTYuMzIgNi4zMiAwIDAgMSA2LjMyLTYuMzJoNzNhOSA5IDAgMCAwIDktOXYtMTIuODZhOSA5IDAgMCAwIC05LTloLTczYTM3LjIxIDM3LjIxIDAgMCAwIC0zNy4yIDM3LjJ2NzNhOSA5IDAgMCAwIDkgOWgxM2E5IDkgMCAwIDAgOC44OC05LjAyeiIvPjxwYXRoIGQ9Im0zMDAuODIgMTMxLjg4aDczYTYuMzIgNi4zMiAwIDAgMSA2LjMyIDYuMzJ2NzNhOSA5IDAgMCAwIDkgOWgxM2E5IDkgMCAwIDAgOS05di03M2EzNy4yMSAzNy4yMSAwIDAgMCAtMzcuMzQtMzcuMmgtNzNhOSA5IDAgMCAwIC05IDl2MTNhOSA5IDAgMCAwIDkuMDIgOC44OHoiLz48cGF0aCBkPSJtMzgwLjEyIDMwMC44MnY3M2E2LjMyIDYuMzIgMCAwIDEgLTYuMzIgNi4zMmgtNzNhOSA5IDAgMCAwIC05IDl2MTNhOSA5IDAgMCAwIDkgOWg3M2EzNy4yMSAzNy4yMSAwIDAgMCAzNy4yLTM3LjM0di03M2E5IDkgMCAwIDAgLTktOWgtMTNhOSA5IDAgMCAwIC04Ljg4IDkuMDJ6Ii8+PHBhdGggZD0ibTIxMS4xOCAzODAuMTJoLTczYTYuMzIgNi4zMiAwIDAgMSAtNi4zMi02LjMydi03M2E5IDkgMCAwIDAgLTktOWgtMTIuODZhOSA5IDAgMCAwIC05IDl2NzNhMzcuMjEgMzcuMjEgMCAwIDAgMzcuMiAzNy4yaDczYTkgOSAwIDAgMCA5LTl2LTEzYTkgOSAwIDAgMCAtOS4wMi04Ljg4eiIvPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iODEuMTMiLz48L2c+PC9nPjwvZz48L2c+PC9zdmc+";

const Message = {
  categoryName: {
    en: "Object Detection",
    hi: "वस्तु पहचान",
  },
  whenObjectDetected: {
    en: "when [OBJECT] detected",
    hi: "जब [OBJECT] का पता चला हो",
  },
  startObjectDetection: {
    en: "start object detection",
    hi: "वस्तु पहचान शुरू करें",
  },
  setObjectBbox: {
    en: "set box on object with x:[X] y:[Y] width:[WIDTH] height:[HEIGHT]",
    hi: "वस्तु पर बॉक्स सेट करें x:[X] y:[Y] चौड़ाई:[WIDTH] ऊँचाई:[HEIGHT]",
  },
  clearMark: {
    en: "clear set box on object",
    hi: "वस्तु पर सेट बॉक्स साफ़ करें",
  },
  object_name: {
    en: "object name",
    hi: "वस्तु का नाम",
  },
  object_detail: {
    en: "predict [prop] of object [object_no]",
    hi: "वस्तु [object_no] का [prop] अनुमान लगाएं",
  },
  videoToggle: {
    en: "set video [VIDEO_STATE]",
    hi: "वीडियो को [VIDEO_STATE] करें",
  },
  PROP_List: {
    en: ["Name", "X_Position", "Y_Position", "Width", "Height", "Confidence"],
    hi: ["नाम", "X_स्थिति", "Y_स्थिति", "चौड़ाई", "ऊँचाई", "विश्वसनीयता"],
  },
  OBJECT_LIST: {
    en: ["person", "car", "dog", "cat"],
    hi: ["व्यक्ति", "कार", "कुत्ता", "बिल्ली"],
  },
  VIDEO_MENU: {
    en: ["off", "on", "on-flipped"],
    hi: ["बंद", "चालू", "उल्टा चालू"],
  },
};

const AvailableLocales = ["en", "hi"];

  get VIDEO_MENU() {
    return [
      { text: "off", value: "off" },
      { text: "on", value: "on" },
      { text: "on-flipped", value: "on-flipped" },
    ];
  }

  get OBJECT_MENU() {
    return [
      { text: "1", value: 1 },
      { text: "2", value: 2 },
      { text: "3", value: 3 },
      { text: "4", value: 4 },
      { text: "5", value: 5 },
      { text: "6", value: 6 },
      { text: "7", value: 7 },
    ];
  }

  get EXTENSION_ID() {
    return "objectDetection";
  }

  _loop() {
    if (!this._detectionActive) return; // Exit if detection is not active

    setTimeout(() => {
      this._loop(); //repeatedly executes the detection logic approximately every 100 milliseconds.
    }, 100);            

    // Get video frame 
    const frame = this.runtime.ioDevices.video.getFrame({
      format: Video.FORMAT_IMAGE_DATA,
      dimensions: [DefaultStageWidth, DefaultStageHeight],    //defined above 
      cacheTimeout: this.runtime.currentStepTime,
    });

    if (frame && this.model) { 
      this.model      //this.model is imported from somewhere in the js 
        .detect(frame)
        .then((predictions) => {
          console.log(predictions);

          // Resize canvas to match video dimensions
          this._canvas.width = DefaultStageWidth;
          this._canvas.height = DefaultStageHeight;

          // Clear previous drawings
          this.clearMark();

          //fun
          predictions.forEach((prediction) => {
            const { label, x, y, width, height, confidence } = prediction;
            if (label) {
              this._ctx.beginPath();
              this._ctx.rect(x, y, width, height);
              this._ctx.lineWidth = 2;
              this._ctx.strokeStyle = "red";
              this._ctx.fillStyle = "red";
              this._ctx.stroke();
              this._ctx.fillText(
                label + " (" + Math.round(confidence * 100) + "%)",
                x,
                y > 10 ? y - 5 : 10
              );
            }
          });

          const detectedObject = "person"; // Example, you can change this dynamicalxly
          if (
            predictions.some(
              (prediction) => prediction.label === detectedObject
            )
          ) {
            this.runtime.emit("OBJECT_DETECTED", detectedObject);
          }
        })
        .catch((error) => {
          console.error("Error during object detection:", error);
        });
    }
  }

  getInfo() {
    return [
      {
        id: "objectDetection",
        blockIconURI: blockIconURI,
        color1: "#4CB0C7",
        color2: "#7E792D",
        name: formatMessage({
          id: "objectDetection.categoryName",
          default: "Object Detection",
          description: "Name of object detection extension",
        }),
        blocks: [
          {
            opcode: "whenObjectDetected",
            text: formatMessage({
              id: "objectDetection.whenObjectDetected",
              default: "when [OBJECT] detected",
              description: "Triggered when a specific object is detected",
            }),
            blockType: BlockType.HAT,
            arguments: {
              OBJECT: {
                type: ArgumentType.STRING,
                menu: "OBJECT_LIST",
                defaultValue: "person",
              },
            },
          },
          {
            opcode: "startObjectDetection",
            text: formatMessage({
              id: "objectDetection.startObjectDetection",
              default: "start object detection",
              description: "Starts object detection loop",
            }),
            blockType: BlockType.COMMAND,
          },
          {
            opcode: "stopObjectDetection",
            text: formatMessage({
              id: "objectDetection.stopObjectDetection",
              default: "stop object detection",
              description: "Stops object detection and clears the canvas",
            }),
            blockType: BlockType.COMMAND,
          },
          {
            opcode: "clearMark",
            text: formatMessage({
              id: "objectDetection.clearMark",
              default: "clear set box on object",
              description: "Clear set box on object",
            }),
            blockType: BlockType.COMMAND,
          },
          {
            opcode: "object_name",
            text: formatMessage({
              id: "objectDetection.object_name",
              default: "object name",
              description: "Returns the name of the detected object",
            }),
            blockType: BlockType.REPORTER,
          },
          {
            opcode: "object_detail",
            text: formatMessage({
              id: "objectDetection.object_detail",
              default: "predict [prop] of object [object_no]",
              description: "Returns the predict info of object",
            }),
            blockType: BlockType.REPORTER,
            arguments: {
              prop: {
                type: ArgumentType.STRING,
                menu: "PROP_List",
                defaultValue: "Name",
              },
              object_no: {
                type: ArgumentType.NUMBER,
                menu: "OBJECT_Number",
                defaultValue: 1,
              },
            },
          },
          {
            opcode: "videoToggle",
            blockType: BlockType.COMMAND,
            text: formatMessage({
              id: "objectDetection.videoToggle",
              default: "set video [VIDEO_STATE]",
              description: "Toggle video",
            }),
            arguments: {
              VIDEO_STATE: {
                type: ArgumentType.STRING,
                menu: "videoMenu",
                defaultValue: "off",
              },
            },
          },
          {
            opcode: "setVideoTransparency",
            text: formatMessage({
              id: "videoSensing.setVideoTransparency",
              default: "set video transparency to [TRANSPARENCY]",
              description: "Controls transparency of the video preview layer",
            }),
            arguments: {
              TRANSPARENCY: {
                type: ArgumentType.NUMBER,
                defaultValue: 50,
              },
            },
          },
        ],
        menus: {
          OBJECT_LIST: ["person", "car", "dog", "cat"],
          PROP_List: [
            "Name",
            "X_Position",
            "Y_Position",
            "Width",
            "Height",
            "Confidence",
          ],
          OBJECT_Number: this.OBJECT_MENU,
          videoMenu: {
            acceptReporters: false,
            items: this.VIDEO_MENU,
          },
        },
      },
    ];
  }

  whenObjectDetected(args, util) {
    const detectedObject = args.OBJECT;
    console.log("Detected : ", detectedObject);
  }

  setVideoTransparency(args) {
    const transparency = Cast.toNumber(args.TRANSPARENCY);
    this.globalVideoTransparency = transparency;
    this.runtime.ioDevices.video.setPreviewGhost(transparency);
  }

  videoToggle(args) {
    let state = args.VIDEO_STATE;
    if (state === "off") {
      this.globalVideoTransparency = 100;
      this.runtime.ioDevices.video.setPreviewGhost(100);
      this.videoEnabled = false;
    } else {
      this.globalVideoTransparency = 0;
      this.runtime.ioDevices.video.setPreviewGhost(0);
      this.runtime.ioDevices.video.mirror = state === "on";
      this.videoEnabled = true;
    }
  }

  object_name() {
    if (this.runtime.ioDevices.video) {
      const frame = this.runtime.ioDevices.video.getFrame({
        format: Video.FORMAT_IMAGE_DATA,
        dimensions: [DefaultStageWidth, DefaultStageHeight],
        cacheTimeout: this.runtime.currentStepTime,
      });

      this.model.detect(frame).then((predictions) => {
        if (predictions.length > 0) {
          this.class_name = predictions[0].label;
        }
      });

      return this.class_name;
    } else {
      console.error("Video device not available");
    }
  }

  object_predScore() {
    if (this.runtime.ioDevices.video) {
      const frame = this.runtime.ioDevices.video.getFrame({
        format: Video.FORMAT_IMAGE_DATA,
        dimensions: [DefaultStageWidth, DefaultStageHeight],
        cacheTimeout: this.runtime.currentStepTime,
      });

      this.model.detect(frame).then((predictions) => {
        if (predictions.length > 0) {
          this.pred_score = predictions[0].confidence;
        }
      });

      return this.pred_score;
    } else {
      console.error("Video device not available");
    }
  }

  object_detail(args) {
    const info = "";
    if (this.runtime.ioDevices.video) {
      const frame = this.runtime.ioDevices.video.getFrame({
        format: Video.FORMAT_IMAGE_DATA,
        dimensions: [DefaultStageWidth, DefaultStageHeight],
        cacheTimeout: this.runtime.currentStepTime,
      });

      this.model.detect(frame).then((predictions) => {
        if (predictions.length >= args.object_no) {
          console.log(predictions);
          const object_info = predictions[args.object_no - 1];
          if (args.prop === "Name") {
            this.class_info = object_info.label;
          } else if (args.prop === "X_Position") {
            this.class_info = object_info.x;
          } else if (args.prop === "Y_Position") {
            this.class_info = object_info.y;
          } else if (args.prop === "Width") {
            this.class_info = object_info.width;
          } else if (args.prop === "Height") {
            this.class_info = object_info.height;
          } else if (args.prop === "Confidence") {
            this.class_info = object_info.confidence;
          } else {
            console.log("no input");
          }
        }
      });

      return this.class_info;
    } else {
      console.error("Video device not available");
    }
  }

  startObjectDetection() {
    if (this.runtime.ioDevices.video) {
      this.runtime.ioDevices.video.enableVideo();
      this.runtime.ioDevices.video.setPreviewGhost(
        this.globalVideoTransparency
      );
    }
    this._detectionActive = true;
    this._loop();
  }

  stopObjectDetection() {
    this._detectionActive = false;
    this.clearMark();
  }

  clearMark() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height); // Clear the entire canvas
  }
}

module.exports = Scratch3ObjectDetectionBlocks;
