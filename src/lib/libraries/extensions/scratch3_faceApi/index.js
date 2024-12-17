const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const Cast = require("../../util/cast");
const TargetType = require("../../extension-support/target-type");
const faceapi = require('@vladmandic/face-api');

class Scratch3API {
  constructor(runtime) {
    this.runtime = runtime;
    this.runtime.emit("EXTENSION_DATA_LOADING", true);
    this.faceApiLoaded = false;
    this.modelsLoaded = false;
    this.canvas = null;
  }

  get EXTENSION_ID() {
    return "face2API";
  }

  static get DIMENSIONS() {
    return [480, 360];
  }

  static get INTERVAL() {
    return 1000 / 30; // 15 FPS
  }

  static get STATE_KEY() {
    return "Scratch.face2API";
  }

  loadFaceApiScript() {
    if (!this.faceApiLoaded) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js";
      script.onload = () => {
        console.log("face-api.js loaded successfully");
        this.faceApiLoaded = true;
      };
      document.head.appendChild(script);
    }
  }

  unloadFaceApiScript() {
    if (this.faceApiLoaded) {
      const faceApiScript = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js"]');
      const canvas = document.querySelector('canvas');
      if (faceApiScript) {
        faceApiScript.remove();
        this.faceApiLoaded = false;
        console.log("face-api.js script unloaded.");

        setTimeout(() => {
          this.clearCanvas(canvas);
          console.log("Canvas cleared after script unload.");
        }, 1000);
      }
      this.modelsLoaded = false;
    }
  }

  getInfo() {
    return [{
      id: "facedetection",
      name: formatMessage({
        id: "faceSensing.categoryName",
        default: "Face Detection",
        description: "Name of the face detection extension",
      }),
      blocks: [
        {
          opcode: "openCamera",
          text: formatMessage({
            id: "faceSensing.openCamera",
            default: "open camera [STATE]",
            description: "Block to start or stop the webcam for face detection",
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            STATE: {
              type: ArgumentType.STRING,
              menu: 'onOffMenu',
              defaultValue: 'on'
            }
          },
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "loadFaceApi",
          text: formatMessage({
            id: "faceSensing.loadFaceApi",
            default: "Load face-api.js",
            description: "Block to load face-api.js script",
          }),
          blockType: BlockType.COMMAND,
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "unloadFaceApi",
          text: formatMessage({
            id: "faceSensing.unloadFaceApi",
            default: "Unload face-api.js",
            description: "Block to unload face-api.js script",
          }),
          blockType: BlockType.COMMAND,
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "startFaceDetection",
          text: formatMessage({
            id: "faceSensing.startFaceDetection",
            default: "Start Face Detection [STATE]",
            description: "Block to start face detection",
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            STATE: {
              type: ArgumentType.STRING,
              menu: 'onOffMenu',
              defaultValue: 'on'
            }
          },
          filter: [TargetType.SPRITE],
        },
      ],
      menus: {
        onOffMenu: {
          acceptReporters: true,
          items: [
            { text: formatMessage({ id: 'on', default: 'on' }), value: 'on' },
            { text: formatMessage({ id: 'off', default: 'off' }), value: 'off' }
          ]
        }
      }
    }];
  }

  loadFaceApi(args, util) {
    this.loadFaceApiScript();
  }

  unloadFaceApi(args, util) {
    this.unloadFaceApiScript();
    // this.stopVideo();
  }

  // working fine 
  openCamera(args, util) {
    const state = Cast.toString(args.STATE);
    const delay = 500; 

    if (state === "on") {
        setTimeout(() => {
            this.startVideo(); // Start the video feed
            // Only start face detection if it is not already running
            if (!this.modelsLoaded) {
                this.startFaceDetection({ STATE: 'on' }, util); // Explicitly start face detection
            }
        }, delay);
    } else if (state === "off") {
        setTimeout(() => {
            this.stopVideo(); // Stop the video feed
        }, delay);
    }
}


  async startFaceDetection(args, util) {
    const state = Cast.toString(args.STATE);

    if (state === "on") {
        if (!this.faceApiLoaded) {
            this.loadFaceApiScript();
        }

        if (!this.modelsLoaded) {
            await this.loadFaceDetectionModels();
            this.modelsLoaded = true;
        }
        const video = document.querySelector('video');
        if (!video) {
            console.error("Camera is not open. Face detection cannot start.");
            return; // Exit the function if camera is not available
        }
        this.handleVideoPlay(video);

    } else if (state === "off") {
        this.unloadFaceApiScript(); // Unload face-api.js
        this.stopVideo(); // Stop the video and remove canvas

        console.log("Face detection stopped.");
    }
}


  async loadFaceDetectionModels() {
    const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.14/model/';
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
      await faceapi.nets.ageGenderNet.loadFromUri(modelPath);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
      await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);
      console.log("Face detection models loaded successfully.");
    } catch (error) {
      console.error("Error loading face detection models:", error);
    }
  }

  createCanvas() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = Scratch3API.DIMENSIONS[0];
      this.canvas.height = Scratch3API.DIMENSIONS[1];
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '100px';
      this.canvas.style.right = '10px';
      this.canvas.style.zIndex = '2'; // Make sure it's on top of the video

      document.body.appendChild(this.canvas);
      console.log("Canvas created and added to DOM.");
    }
    return this.canvas;
  }

  handleVideoPlay(video) {
    const canvas = this.createCanvas();

    video.addEventListener('loadedmetadata', () => { 
      const displaySize = { width: canvas.width, height: canvas.height };
      faceapi.matchDimensions(canvas, displaySize);

      const intervalId = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withAgeAndGender()
          .withFaceExpressions();

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.length > 0) {
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          this.drawDetectionBoxes(canvas, resizedDetections);
          this.drawFaceLandmarks(canvas, resizedDetections);
        }
      }, Scratch3API.INTERVAL);

      video.setAttribute('data-interval-id', intervalId);
    });
  }

  clearCanvas(canvas) {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      console.log("Canvas cleared.");
      // canvas.remove();
    }
  }

  drawDetectionBoxes(canvas, resizedDetections) {
    faceapi.draw.drawDetections(canvas, resizedDetections);
  }

  drawFaceLandmarks(canvas, resizedDetections) {
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  }

  startVideo() {
    let video = document.querySelector('video');

    if (video) {
      console.log('Video already declared.');
      return;
    }

    video = document.createElement('video');
    video.autoplay = true;
    video.width = Scratch3API.DIMENSIONS[0];
    video.height = Scratch3API.DIMENSIONS[1];
    video.style.position = 'absolute';
    video.style.top = '100px';
    video.style.right = '10px';
    video.style.zIndex = '1';

    document.body.appendChild(video);

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        this.handleVideoPlay(video);
      });
  }

  stopVideo() {
    const video = document.querySelector('video');
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.remove();
      console.log("Video stopped and removed from DOM.");
    }
  }
}

module.exports = Scratch3API;
