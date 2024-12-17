const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const formatMessage = require("format-message");
const ml5 = require("ml5");

const blockIconURI =
  "data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaGVpZ2h0PSI0My4zNDltbSIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVF1YWxpdHkiIHNoYXBlLXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB2aWV3Qm94PSIwIDAgNDMzNSA0MzM1IiB3aWR0aD0iNDMuMzQ5bW0iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9IkxheWVyX3gwMDIwXzEiPjxwYXRoIGQ9Im0zNzYzIDEwMDhoLTMwN2MtMjggMC01MS0yMy01MS01MXYtNTc0aC02MzFjLTI4IDAtNTEtMjMtNTEtNTF2LTI4MWMwLTI4IDIzLTUxIDUxLTUxaDk4OWMyOCAwIDUxIDIzIDUxIDUxdjkwNmMwIDI4LTIzIDUxLTUxIDUxem0tMTU5NiAxNDAwYy04NSAwLTE2Ny0xMy0yNDUtMzd2NDA2aDQ5MXYtNDA2Yy03OCAyNC0xNjAgMzctMjQ2IDM3em0tMzQ3LTc1Yy0yOTItMTMzLTQ5Ni00MjctNDk2LTc2OHYtNDUxYzAtNDY1IDM3OS04NDMgODQzLTg0MyA0NjUgMCA4NDQgMzc4IDg0NCA4NDN2NDUxYzAgMzQxLTIwNCA2MzUtNDk2IDc2OHY0NDRoNDk3YzI4MiAwIDUxMSAyMzAgNTExIDUxMXY5OTZjMCAyOC0yMyA1MS01MSA1MWgtMjYwOWMtMjggMC01MS0yMy01MS01MXYtOTk2YzAtMjgyIDIyOS01MTEgNTExLTUxMWg0OTd6bTM0Ny0xOTYxYy00MDggMC03NDEgMzMyLTc0MSA3NDF2NDUxYzAgNDA5IDMzMyA3NDEgNzQxIDc0MSA0MDkgMCA3NDItMzMyIDc0Mi03NDF2LTQ1MWMwLTQwOS0zMzMtNzQxLTc0Mi03NDF6bS0xMjUzIDM4NjFoMjUwN3YtOTQ1YzAtMjI2LTE4NC00MDktNDA5LTQwOWgtMTY4OWMtMjI2IDAtNDA5IDE4My00MDkgNDA5em0yODQ5LTE1NTVoLTk4OWMtMjggMC01MS0yMy01MS01MXYtMjgxYzAtMjggMjMtNTEgNTEtNTFoNjMxdi01NzRjMC0yOCAyMy01MSA1MS01MWgzMDdjMjggMCA1MSAyMyA1MSA1MXY5MDZjMCAyOC0yMyA1MS01MSA1MXptLTkzOS0xMDJoODg5di04MDRoLTIwNnY1NzRjMCAyOC0yMyA1MS01MSA1MWgtNjMyem0tMTI2MyAxMDJoLTk4OWMtMjggMC01MS0yMy01MS01MXYtOTA2YzAtMjggMjMtNTEgNTEtNTFoMzA3YzI4IDAgNTEgMjMgNTEgNTF2NTc0aDYzMWMyOCAwIDUxIDIzIDUxIDUxdjI4MWMwIDI4LTIzIDUxLTUxIDUxem0tOTM5LTEwMmg4ODh2LTE3OWgtNjMxYy0yOCAwLTUxLTIzLTUxLTUxdi01NzRoLTIwNnptMjU3LTE1NjhoLTMwN2MtMjggMC01MS0yMy01MS01MXYtOTA2YzAtMjggMjMtNTEgNTEtNTFoOTg5YzI4IDAgNTEgMjMgNTEgNTF2MjgxYzAgMjgtMjMgNTEtNTEgNTFoLTYzMXY1NzRjMCAyOC0yMyA1MS01MSA1MXptLTI1Ny0xMDJoMjA2di01NzRjMC0yOCAyMy01MSA1MS01MWg2MzF2LTE3OWgtODg4em0yODg1IDBoMjA2di04MDRoLTg4OXYxNzloNjMyYzI4IDAgNTEgMjMgNTEgNTF6Ii8+PHBhdGggZD0ibTI5MDkgMTExM2MwLTQwOS0zMzMtNzQxLTc0Mi03NDEtNDA4IDAtNzQxIDMzMi03NDEgNzQxdjQ1MWMwIDQwOSAzMzMgNzQxIDc0MSA3NDEgNDA5IDAgNzQyLTMzMiA3NDItNzQxeiIgZmlsbD0iI2ZmYzA2ZCIvPjxwYXRoIGQ9Im0yNDEzIDIzNzFjLTc4IDI0LTE2MCAzNy0yNDYgMzctODUgMC0xNjctMTMtMjQ1LTM3djQwNmg0OTF6IiBmaWxsPSIjZTZhZDYyIi8+PHBhdGggZD0ibTMwMTIgMjg3OWgtMTY4OWMtMjI2IDAtNDA5IDE4My00MDkgNDA5djk0NWgyNTA3di05NDVjMC0yMjYtMTg0LTQwOS00MDktNDA5eiIgZmlsbD0iIzFhYTFmZiIvPjxnIGZpbGw9IiMxNzkxZTYiPjxwYXRoIGQ9Im0yODI0IDI1NzZoODg5di04MDRoLTIwNnY1NzRjMCAyOC0yMyA1MS01MSA1MWgtNjMyeiIvPjxwYXRoIGQ9Im0xNTEwIDI1NzZ2LTE3OWgtNjMxYy0yOCAwLTUxLTIzLTUxLTUxdi01NzRoLTIwNnY4MDR6Ii8+PHBhdGggZD0ibTg3OSAyODFoNjMxdi0xNzloLTg4OHY4MDRoMjA2di01NzRjMC0yOCAyMy01MSA1MS01MXoiLz48cGF0aCBkPSJtMjgyNCAxMDJ2MTc5aDYzMmMyOCAwIDUxIDIzIDUxIDUxdjU3NGgyMDZ2LTgwNHoiLz48L2c+PC9nPjwvc3ZnPg==";

const Message = {
  getX: {
    hi: "व्यक्ति संख्या [PERSON_NUMBER] , मुख्य बिंदु संख्या [KEYPOINT] का x",
    en: "x of person no: [PERSON_NUMBER] , keypoint no: [KEYPOINT]",
  },
  getY: {
    hi: "व्यक्ति संख्या [PERSON_NUMBER] , मुख्य बिंदु संख्या [KEYPOINT] का y",
    en: "y of person no: [PERSON_NUMBER] , keypoint no: [KEYPOINT]",
  },
  peopleCount: {
    hi: "लोगों की संख्या",
    en: "people count",
  },
  videoToggle: {
    hi: "वीडियो को [VIDEO_STATE] करें",
    en: "turn video [VIDEO_STATE]",
  },
  setRatio: {
    hi: "अनुपात को [RATIO] करें",
    en: "set ratio to [RATIO]",
  },
  setInterval: {
    hi: "प्रत्येक [INTERVAL] सेकंड में लेबल करें",
    en: "Label once every [INTERVAL] seconds",
  },
  on: {
    hi: "चालू",
    en: "on",
  },
  off: {
    hi: "बंद",
    en: "off",
  },
  video_on_flipped: {
    hi: "फ्लिप किया हुआ",
    en: "on flipped",
  },
  please_wait: {
    hi: "सेटअप में समय लगता है। ब्राउज़र अटक जाएगा, कृपया प्रतीक्षा करें।",
    en: "Setup takes a while. The browser will get stuck, but please wait.",
  },
};
const AvailableLocales = ["en", "hi"];

class Scratch3Facemesh2ScratchBlocks {
  get PERSON_NUMBER_MENU() {
    let person_number_menu = [];
    for (let i = 1; i <= 10; i++) {
      person_number_menu.push({ text: String(i), value: String(i)});
    }
    return person_number_menu;
  }
  
  get KEYPOINT_MENU() {
    let keypoint_menu = [];
    for (let i = 1; i <= 468; i++) {
      keypoint_menu.push({ text: String(i), value: String(i) });
    }
    return keypoint_menu;
  }

  get VIDEO_MENU() {
    return [
      {
        text: Message.off[this._locale],
        value: "off",
      },
      {
        text: Message.on[this._locale],
        value: "on",
      },
      {
        text: Message.video_on_flipped[this._locale],
        value: "on-flipped",
      },
    ];
  }

  get EXTENSION_ID() {
    return "facemesh2scratch";
  }

  get INTERVAL_MENU() {
    return [
      {
        text: "0.1",
        value: "0.1",
      },
      {
        text: "0.2",
        value: "0.2",
      },
      {
        text: "0.5",
        value: "0.5",
      },
      {
        text: "1.0",
        value: "1.0",
      },
    ];
  }

  get RATIO_MENU() {
    return [
      {
        text: "0.5",
        value: "0.5",
      },
      {
        text: "0.75",
        value: "0.75",
      },
      {
        text: "1",
        value: "1",
      },
      {
        text: "1.5",
        value: "1.5",
      },
      {
        text: "2.0",
        value: "2.0",
      },
    ];
  }

  constructor(runtime) {
    this.runtime = runtime;

    this.faces = [];
    this.ratio = 0.75;

    // Create canvas element for drawing bounding boxes
    this.canvas = document.createElement("canvas");
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "100px"; // Hardcoded position from the top
    this.canvas.style.left = "700px"; // Hardcoded position from the left
    this.canvas.style.zIndex = "10";
    this.canvas.width = 480; // Default width
    this.canvas.height = 360; // Default height
    this.context = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.detectFace = () => {
      this.video = this.runtime.ioDevices.video.provider.video;
      
      alert(Message.please_wait[this._locale]);

      this.facemesh = ml5.facemesh(this.video, () => {
        console.log("Model loaded!");
      });

      this.facemesh.on("predict", (faces) => {
        if (faces.length < this.faces.length) {
          this.faces.splice(faces.length);
        }
        faces.forEach((face, index) => {
          this.faces[index] = { keypoints: face.scaledMesh };
        });

        // this.drawBoundingBox(); // Draw bounding boxes with updated faces data
      });
    };

    this.runtime.ioDevices.video.enableVideo().then(this.detectFace);
  }

  drawBoundingBox() {
    if (this.video && this.facemesh) {
      // Clear previous drawings
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.faces.forEach((face) => {
        const keypoints = face.keypoints;
        console.log(keypoints);

        // Check if keypoints are available
        if (!keypoints || keypoints.length === 0) return;

        // Initialize bounding box coordinates
        let minX = Infinity,
          maxX = -Infinity,
          minY = Infinity,
          maxY = -Infinity;

        keypoints.forEach((point) => {
          const x = point[0] * this.ratio;
          const y = point[1] * this.ratio;

          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        });

        // Adjust the coordinates for canvas mirroring
        const canvasMinX = this.canvas.width - maxX;
        const canvasMaxX = this.canvas.width - minX;

        // Draw bounding box
        this.context.strokeStyle = "red";
        this.context.lineWidth = 2;
        this.context.strokeRect(
          canvasMinX,
          minY,
          canvasMaxX - canvasMinX,
          maxY - minY
        );
      });
    } else {
      console.error("Video or facemesh not initialized.");
    }
  }

  getInfo() {
    this._locale = this.setLocale();

    return [
      {
        id: "facemesh2scratch",
        name: "Face Detection",
        blockIconURI: blockIconURI,
        blocks: [
          {
            opcode: "getX",
            blockType: BlockType.REPORTER,
            text: Message.getX[this._locale],
            arguments: {
              PERSON_NUMBER: {
                type: ArgumentType.STRING,
                menu: "personNumberMenu",
                defaultValue: "1",
              },
              KEYPOINT: {
                type: ArgumentType.STRING,
                menu: "keypointMenu",
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "getY",
            blockType: BlockType.REPORTER,
            text: Message.getY[this._locale],
            arguments: {
              PERSON_NUMBER: {
                type: ArgumentType.STRING,
                menu: "personNumberMenu",
                defaultValue: "1",
              },
              KEYPOINT: {
                type: ArgumentType.STRING,
                menu: "keypointMenu",
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "getPeopleCount",
            blockType: BlockType.REPORTER,
            text: Message.peopleCount[this._locale],
          },
          {
            opcode: "videoToggle",
            blockType: BlockType.COMMAND,
            text: Message.videoToggle[this._locale],
            arguments: {
              VIDEO_STATE: {
                type: ArgumentType.STRING,
                menu: "videoMenu",
                defaultValue: "on",
              },
            },
          },
          {
            opcode: "setRatio",
            blockType: BlockType.COMMAND,
            text: Message.setRatio[this._locale],
            arguments: {
              RATIO: {
                type: ArgumentType.STRING,
                menu: "ratioMenu",
                defaultValue: "0.75",
              },
            },
          },
          {
            opcode: "setInterval",
            blockType: BlockType.COMMAND,
            text: Message.setInterval[this._locale],
            arguments: {
              INTERVAL: {
                type: ArgumentType.STRING,
                menu: "intervalMenu",
                defaultValue: "0.5",
              },
            },
          },
        ],
        menus: {
          personNumberMenu: {
            acceptReporters: true,
            items: this.PERSON_NUMBER_MENU,
          },
          keypointMenu: {
            acceptReporters: true,
            items: this.KEYPOINT_MENU,
          },
          videoMenu: {
            acceptReporters: true,
            items: this.VIDEO_MENU,
          },
          ratioMenu: {
            acceptReporters: true,
            items: this.RATIO_MENU,
          },
          intervalMenu: {
            acceptReporters: true,
            items: this.INTERVAL_MENU,
          },
        },
      },
    ];
  }

  getX(args) {
    const person_number = Cast.toNumber(args.PERSON_NUMBER) - 1;
    const keypoint_number = Cast.toNumber(args.KEYPOINT) - 1;
    if (
      this.faces.length > person_number &&
      this.faces[person_number].keypoints.length > keypoint_number
    ) {
      return this.faces[person_number].keypoints[keypoint_number][0];
    } else {
      return "";
    }
  }

  getY(args) {
    const person_number = Cast.toNumber(args.PERSON_NUMBER) - 1;
    const keypoint_number = Cast.toNumber(args.KEYPOINT) - 1;
    if (
      this.faces.length > person_number &&
      this.faces[person_number].keypoints.length > keypoint_number
    ) {
      return this.faces[person_number].keypoints[keypoint_number][1];
    } else {
      return "";
    }
  }

  getPeopleCount() {
    return this.faces.length;
  }

  videoToggle(args) {
    const videoState = Cast.toString(args.VIDEO_STATE);

    if (videoState === "off") {
      this.runtime.ioDevices.video.disableVideo();
    } else {
      this.runtime.ioDevices.video.enableVideo();
      this.video.mirror = videoState === "on-flipped";
    }
  }

  setRatio(args) {
    this.ratio = Cast.toNumber(args.RATIO);
  }

  setInterval(args) {
    const interval = Cast.toNumber(args.INTERVAL);
    if (interval <= 0) return;

    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.drawBoundingBox();
    }, interval * 1000);
  }

  setLocale() {
    const locale = formatMessage.setup().locale;
    if (AvailableLocales.indexOf(locale) !== -1) {
      return locale;
    } else if (locale.startsWith("ja")) {
      return "ja";
    } else {
      return "en";
    }
  }
}

module.exports = Scratch3Facemesh2ScratchBlocks;

