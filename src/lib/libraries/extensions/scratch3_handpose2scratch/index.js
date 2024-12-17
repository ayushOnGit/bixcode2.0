const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const formatMessage = require("format-message");
const ml5 = require("ml5");

const icon = require("./blockIconURI.js");3

const Message = {
  getX: {
    en: "get x-axis of [LANDMARK]",
    hi: "[LANDMARK] का x-अक्ष प्राप्त करें",
  },
  getY: {
    en: "get y-axis of [LANDMARK]",
    hi: "[LANDMARK] का y-अक्ष प्राप्त करें",
  },
  getZ: {
    en: "get z-axis of [LANDMARK]",
    hi: "[LANDMARK] का z-अक्ष प्राप्त करें",
  },
  videoToggle: {
    en: "turn video [VIDEO_STATE]",
    hi: "वीडियो को [VIDEO_STATE] करें",
  },
  setRatio: {
    en: "set ratio to [RATIO]",
    hi: "अनुपात को [RATIO] पर सेट करें",
  },
  setInterval: {
    en: "Label once every [INTERVAL] seconds",
    hi: "प्रत्येक [INTERVAL] सेकंड में एक बार पहचान करें",
  },
  on: {
    en: "on",
    hi: "चालू",
  },
  off: {
    en: "off",
    hi: "बंद",
  },
  video_on_flipped: {
    en: "on flipped",
    hi: "उल्टा चालू",
  },
  please_wait: {
    en: "Setup takes a while. The browser will get stuck, but please wait.",
    hi: "सेटअप में कुछ समय लगता है। ब्राउज़र अटक सकता है, कृपया प्रतीक्षा करें।",
  },
  landmarks: [
    {
      en: "wrist",
      hi: "कलाई",
    },
    {
      en: "the base of thumb",
      hi: "अंगूठे का मूल",
    },
    {
      en: "the 2nd joint of thumb",
      hi: "अंगूठे का दूसरा जोड़",
    },
    {
      en: "the 1st joint of thumb",
      hi: "अंगूठे का पहला जोड़",
    },
    {
      en: "thumb",
      hi: "अंगूठा",
    },
    {
      en: "the 3rd joint of index finger",
      hi: "तर्जनी का तीसरा जोड़",
    },
    {
      en: "the 2nd joint of index finger",
      hi: "तर्जनी का दूसरा जोड़",
    },
    {
      en: "the 1st joint of index finger",
      hi: "तर्जनी का पहला जोड़",
    },
    {
      en: "index finger",
      hi: "तर्जनी",
    },
    {
      en: "the 3rd joint of middle finger",
      hi: "मध्यमा का तीसरा जोड़",
    },
    {
      en: "the 2nd joint of middle finger",
      hi: "मध्यमा का दूसरा जोड़",
    },
    {
      en: "the 1st joint of middle finger",
      hi: "मध्यमा का पहला जोड़",
    },
    {
      en: "middle finger",
      hi: "मध्यमा",
    },
    {
      en: "the 3rd joint of ring finger",
      hi: "अनामिका का तीसरा जोड़",
    },
    {
      en: "the 2nd joint of ring finger",
      hi: "अनामिका का दूसरा जोड़",
    },
    {
      en: "the 1st joint of ring finger",
      hi: "अनामिका का पहला जोड़",
    },
    {
      en: "ring finger",
      hi: "अनामिका",
    },
    {
      en: "the 3rd joint of little finger",
      hi: "कनिष्ठा का तीसरा जोड़",
    },
    {
      en: "the 2nd joint of little finger",
      hi: "कनिष्ठा का दूसरा जोड़",
    },
    {
      en: "the 1st joint of little finger",
      hi: "कनिष्ठा का पहला जोड़",
    },
    {
      en: "little finger",
      hi: "कनिष्ठा",
    },
  ],
};

const AvailableLocales = ["en", "hi"];

class Scratch3Handpose2ScratchBlocks {
  get LANDMARK_MENU() {
    const landmark_menu = [];
    for (let i = 1; i <= 21; i++) {
      landmark_menu.push({
        text: `${Message.landmarks[i - 1][this._locale]} (${i})`,
        value: String(i),
      });
    }
    return landmark_menu;
  }

  get EXTENSION_ID() {
    return "handpose2scratch";
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

    this.landmarks = [];
    this.ratio = 0.75;

    this.detectHand = () => {
      this.video = this.runtime.ioDevices.video.provider.video;

      this.showAlert("Please wait while the model is loading...");

      alert(Message.please_wait[this._locale]);

      const handpose = ml5.handpose(this.video, function () {
        console.log("Model loaded!");
        window.alert("Model Loaded!");
      });

      handpose.on("predict", (hands) => {
        hands.forEach((hand) => {
          this.landmarks = hand.landmarks;
        });
      });
    };
    this.runtime.ioDevices.video.enableVideo().then(this.detectHand);
  }

  getInfo() {
    this._locale = this.setLocale();

    return [
      {
        id: "handpose2scratch",
        name: "Hand Land Mark Detection",
        blockIconURI: icon,
        color1: "#9e76e3",
        color2: "#9e76e3",
        blocks: [
          {
            opcode: "getX",
            blockType: BlockType.REPORTER,
            text: Message.getX[this._locale],
            arguments: {
              LANDMARK: {
                type: ArgumentType.STRING,
                menu: "landmark",
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "getY",
            blockType: BlockType.REPORTER,
            text: Message.getY[this._locale],
            arguments: {
              LANDMARK: {
                type: ArgumentType.STRING,
                menu: "landmark",
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "getZ",
            blockType: BlockType.REPORTER,
            text: Message.getZ[this._locale],
            arguments: {
              LANDMARK: {
                type: ArgumentType.STRING,
                menu: "landmark",
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "videoToggle",
            blockType: BlockType.COMMAND,
            text: Message.videoToggle[this._locale],
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
        ],
        menus: {
          landmark: {
            acceptReporters: true,
            items: this.LANDMARK_MENU,
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
    let landmark = parseInt(args.LANDMARK, 10) - 1;
    if (this.landmarks[landmark]) {
      if (this.runtime.ioDevices.video.mirror === false) {
        return -1 * (240 - this.landmarks[landmark][0] * this.ratio);
      } else {
        return 240 - this.landmarks[landmark][0] * this.ratio;
      }
    } else {
      return "";
    }
  }

  getY(args) {
    let landmark = parseInt(args.LANDMARK, 10) - 1;
    if (this.landmarks[landmark]) {
      return 180 - this.landmarks[landmark][1] * this.ratio;
    } else {
      return "";
    }
  }

  getZ(args) {
    let landmark = parseInt(args.LANDMARK, 10) - 1;
    if (this.landmarks[landmark]) {
      return this.landmarks[landmark][2];
    } else {
      return "";
    }
  }

  videoToggle(args) {
    let state = args.VIDEO_STATE;
    if (state === "off") {
      this.runtime.ioDevices.video.disableVideo();
    } else {
      this.runtime.ioDevices.video.enableVideo().then(this.detectHand);
      this.runtime.ioDevices.video.mirror = state === "on";
    }
  }

  /**
   * A scratch command block handle that configures the video preview's
   * transparency from passed arguments.
   * @param {object} args - the block arguments
   * @param {number} args.TRANSPARENCY - the transparency to set the video
   *   preview to
   */
  setVideoTransparency(args) {
    const transparency = Cast.toNumber(args.TRANSPARENCY);
    this.globalVideoTransparency = transparency;
    this.runtime.ioDevices.video.setPreviewGhost(transparency);
  }

  setRatio(args) {
    this.ratio = parseFloat(args.RATIO);
  }

  setLocale() {
    let locale = formatMessage.setup().locale;
    if (AvailableLocales.includes(locale)) {
      return locale;
    } else {
      return "en";
    }
  }

  showAlert(message) {
    console.log("show alert");
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.textContent = message;
    document.body.appendChild(popup);
    this.popupElement = popup;
  }

  closeAlert() {
    if (this.popupElement) {
      console.log("close alert");
      this.popupElement.remove();
    }
  }
}

module.exports = Scratch3Handpose2ScratchBlocks;
