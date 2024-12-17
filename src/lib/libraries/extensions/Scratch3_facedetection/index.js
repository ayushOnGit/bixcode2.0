const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const Video = require("../../io/video");
const TargetType = require("../../extension-support/target-type");
const Clone = require("../../util/clone");
const tf = require("@tensorflow/tfjs");

// Import BlazeFace model
const Blazeface = require("@tensorflow-models/blazeface");

// Icon for the extension
const blockIconURI =
  "data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaGVpZ2h0PSI0My4zNDltbSIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVF1YWxpdHkiIHNoYXBlLXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB2aWV3Qm94PSIwIDAgNDMzNSA0MzM1IiB3aWR0aD0iNDMuMzQ5bW0iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9IkxheWVyX3gwMDIwXzEiPjxwYXRoIGQ9Im0zNzYzIDEwMDhoLTMwN2MtMjggMC01MS0yMy01MS01MXYtNTc0aC02MzFjLTI4IDAtNTEtMjMtNTEtNTF2LTI4MWMwLTI4IDIzLTUxIDUxLTUxaDk4OWMyOCAwIDUxIDIzIDUxIDUxdjkwNmMwIDI4LTIzIDUxLTUxIDUxem0tMTU5NiAxNDAwYy04NSAwLTE2Ny0xMy0yNDUtMzd2NDA2aDQ5MXYtNDA2Yy03OCAyNC0xNjAgMzctMjQ2IDM3em0tMzQ3LTc1Yy0yOTItMTMzLTQ5Ni00MjctNDk2LTc2OHYtNDUxYzAtNDY1IDM3OS04NDMgODQzLTg0MyA0NjUgMCA4NDQgMzc4IDg0NCA4NDN2NDUxYzAgMzQxLTIwNCA2MzUtNDk2IDc2OHY0NDRoNDk3YzI4MiAwIDUxMSAyMzAgNTExIDUxMXY5OTZjMCAyOC0yMyA1MS01MSA1MWgtMjYwOWMtMjggMC01MS0yMy01MS01MXYtOTk2YzAtMjgyIDIyOS01MTEgNTExLTUxMWg0OTd6bTM0Ny0xOTYxYy00MDggMC03NDEgMzMyLTc0MSA3NDF2NDUxYzAgNDA5IDMzMyA3NDEgNzQxIDc0MSA0MDkgMCA3NDItMzMyIDc0Mi03NDF2LTQ1MWMwLTQwOS0zMzMtNzQxLTc0Mi03NDF6bS0xMjUzIDM4NjFoMjUwN3YtOTQ1YzAtMjI2LTE4NC00MDktNDA5LTQwOWgtMTY4OWMtMjI2IDAtNDA5IDE4My00MDkgNDA5em0yODQ5LTE1NTVoLTk4OWMtMjggMC01MS0yMy01MS01MXYtMjgxYzAtMjggMjMtNTEgNTEtNTFoNjMxdi01NzRjMC0yOCAyMy01MSA1MS01MWgzMDdjMjggMCA1MSAyMyA1MSA1MXY5MDZjMCAyOC0yMyA1MS01MSA1MXptLTkzOS0xMDJoODg5di04MDRoLTIwNnY1NzRjMCAyOC0yMyA1MS01MSA1MWgtNjMyem0tMTI2MyAxMDJoLTk4OWMtMjggMC01MS0yMy01MS01MXYtOTA2YzAtMjggMjMtNTEgNTEtNTFoMzA3YzI4IDAgNTEgMjMgNTEgNTF2NTc0aDYzMWMyOCAwIDUxIDIzIDUxIDUxdjI4MWMwIDI4LTIzIDUxLTUxIDUxem0tOTM5LTEwMmg4ODh2LTE3OWgtNjMxYy0yOCAwLTUxLTIzLTUxLTUxdi01NzRoLTIwNnptMjU3LTE1NjhoLTMwN2MtMjggMC01MS0yMy01MS01MXYtOTA2YzAtMjggMjIzIDUxLTUxIDUxSDYzMnpNMTUxMCAyODc5aDE2ODljLTIyNiAwLTQwOSAxODMtNDA5IDQwOXY5NDVoMjUwN3YtOTQ1YzAtMjI2LTE4NC00MDktNDA5LTQwOWg4ODl2LTgwNHoyMDZ2LTgwNHoiLz48L2c+PC9nPjwvc3ZnPg==";

class Scratch3FaceDetectionBlocks {
  constructor(runtime) {
    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;
    this.runtime.emit("EXTENSION_DATA_LOADING", true);

    // Initialize properties
    this.blazeface = null;
    this.firstTime = false;
    this.currentFace = null;
    this.allFaces = [];
    this.cachedSize = 100;
    this.cachedTilt = 90;
    this.isDetectedArrayLength = 5;
    this.isDetectedArray = new Array(this.isDetectedArrayLength).fill(false);
    this.smoothedIsDetected = false;

    // Bind methods
    this._clearAttachments = this._clearAttachments.bind(this);
    this._loop = this._loop.bind(this);
    this.updateAttachments = this.updateAttachments.bind(this);

    // Load the BlazeFace model
    this._loadModel();

    // Event listeners
    this.runtime.on("PROJECT_STOP_ALL", this._clearAttachments);
  }

  // Extension ID
  get EXTENSION_ID() {
    return "facedetection";
  }

  // Default state for face detection
  static get DEFAULT_FACE_SENSING_STATE() {
    return {
      attachedToPartNumber: null,
      offsetDirection: 0,
      offsetSize: 0,
      offsetX: 0,
      offsetY: 0,
      prevDirection: 0,
      prevSize: 100,
      prevX: 0,
      prevY: 0,
    };
  }

  // Dimensions for video input
  static get DIMENSIONS() {
    return [480, 360];
  }

  // Detection interval (in milliseconds)
  static get INTERVAL() {
    return 1000 / 15; // 15 FPS
  }

  // Key for storing face detection state
  static get STATE_KEY() {
    return "Scratch.faceDetection";
  }

  // Load BlazeFace model with error handling
  async _loadModel() {
    try {
      this.blazeface = await Blazeface.load();
      this.runtime.emit("EXTENSION_DATA_LOADING", false);
      if (this.runtime.ioDevices) {
        this._loop();
      }
    } catch (error) {
      console.error("Error loading BlazeFace model:", error);
      this.runtime.emit("EXTENSION_DATA_LOADING", false);
    }
  }

  // Cleanup attachments when project stops
  _clearAttachments() {
    this.runtime.targets.forEach((target) => {
      const state = this._getFaceDetectionState(target);
      state.attachedToPartNumber = null;
    });
  }

  // Main loop for face detection using requestAnimationFrame
  async _loop() {
    const frame = this.runtime.ioDevices.video.getFrame({
      format: Video.FORMAT_IMAGE_DATA,
      dimensions: Scratch3FaceDetectionBlocks.DIMENSIONS,
      cacheTimeout: Scratch3FaceDetectionBlocks.INTERVAL,
    });

    if (frame && this.blazeface) {
      try {
        const faces = await this.blazeface.estimateFaces(frame, false);
        this.allFaces = faces;
        if (faces.length > 0) {
          this.currentFace = faces[0];
        } else {
          this.currentFace = null;
        }
        this.updateIsDetected();
      } catch (error) {
        console.error("Error estimating faces:", error);
      }
    }

    this.updateAttachments();

    // Schedule the next frame
    requestAnimationFrame(this._loop);
  }

  // Update the smoothed detection status
  updateIsDetected() {
    this.isDetectedArray.push(!!this.currentFace);

    if (this.isDetectedArray.length > this.isDetectedArrayLength) {
      this.isDetectedArray.shift();
    }

    const allFalse = this.isDetectedArray.every((item) => item === false);
    const allTrue = this.isDetectedArray.every((item) => item === true);

    if (allFalse) {
      this.smoothedIsDetected = false;
    } else if (allTrue) {
      this.smoothedIsDetected = true;
    }
    // If mixed, retain the previous state
  }

  // Retrieve or initialize face detection state for a target
  _getFaceDetectionState(target) {
    let faceDetectionState = target.getCustomState(
      Scratch3FaceDetectionBlocks.STATE_KEY
    );

    if (!faceDetectionState) {
      faceDetectionState = Clone.simple(
        Scratch3FaceDetectionBlocks.DEFAULT_FACE_SENSING_STATE
      );
      target.setCustomState(
        Scratch3FaceDetectionBlocks.STATE_KEY,
        faceDetectionState
      );
    }

    return faceDetectionState;
  }

  // Extension block definitions
  getInfo() {
    return {
      id: "facedetection",
      blockIconURI: blockIconURI,
      name: formatMessage({
        id: "faceSensing.categoryName",
        default: "Face Detection",
        description: "Name of the face detection extension",
      }),
      blocks: [
        {
          opcode: "goToPart",
          text: formatMessage({
            id: "faceSensing.goToPart",
            default: "go to [PART]",
            description: "Block to move sprite to a facial part",
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            PART: {
              type: ArgumentType.STRING,
              menu: "PART",
              defaultValue: "2",
            },
          },
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "pointInFaceTiltDirection",
          text: formatMessage({
            id: "faceSensing.pointInFaceTiltDirection",
            default: "point in direction of face tilt",
            description: "Block to point sprite based on face tilt",
          }),
          blockType: BlockType.COMMAND,
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "setSizeToFaceSize",
          text: formatMessage({
            id: "faceSensing.setSizeToFaceSize",
            default: "set size to face size",
            description: "Block to set sprite size based on face size",
          }),
          blockType: BlockType.COMMAND,
          filter: [TargetType.SPRITE],
        },
        "---",
        {
          opcode: "whenTilted",
          text: formatMessage({
            id: "faceSensing.whenTilted",
            default: "when face tilts [DIRECTION]",
            description: "Hat block for face tilt direction",
          }),
          blockType: BlockType.HAT,
          arguments: {
            DIRECTION: {
              type: ArgumentType.STRING,
              menu: "TILT",
              defaultValue: "left",
            },
          },
        },
        {
          opcode: "whenSpriteTouchesPart",
          text: formatMessage({
            id: "faceSensing.whenSpriteTouchesPart",
            default: "when this sprite touches [PART]",
            description: "Hat block for sprite touching a facial part",
          }),
          arguments: {
            PART: {
              type: ArgumentType.STRING,
              menu: "PART",
              defaultValue: "2",
            },
          },
          blockType: BlockType.HAT,
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "whenFaceDetected",
          text: formatMessage({
            id: "faceSensing.whenFaceDetected",
            default: "when a face is detected",
            description: "Hat block for face detection",
          }),
          blockType: BlockType.HAT,
        },
        "---",
        {
          opcode: "faceIsDetected",
          text: formatMessage({
            id: "faceSensing.faceDetected",
            default: "a face is detected?",
            description: "Boolean block to check face detection",
          }),
          blockType: BlockType.BOOLEAN,
        },
        {
          opcode: "faceTilt",
          text: formatMessage({
            id: "faceSensing.faceTilt",
            default: "face tilt",
            description: "Reporter block for face tilt angle",
          }),
          blockType: BlockType.REPORTER,
        },
        {
          opcode: "faceSize",
          text: formatMessage({
            id: "faceSensing.faceSize",
            default: "face size",
            description: "Reporter block for face size",
          }),
          blockType: BlockType.REPORTER,
        },
        {
          opcode: "probability",
          text: formatMessage({
            id: "faceSensing.probability",
            default: "probability of face detection",
            description: "Reporter block for face detection probability",
          }),
          blockType: BlockType.REPORTER,
        },
        {
          opcode: "numberOfFaces",
          text: formatMessage({
            id: "faceSensing.numberOfFaces",
            default: "number of faces",
            description: "Reporter block for the number of detected faces",
          }),
          blockType: BlockType.REPORTER,
        },
      ],
      menus: {
        PART: [
          {
            text: "nose",
            value: "2",
          },
          {
            text: "mouth",
            value: "3",
          },
          {
            text: "left eye",
            value: "0",
          },
          {
            text: "right eye",
            value: "1",
          },
          {
            text: "between eyes",
            value: "6",
          },
          {
            text: "left ear",
            value: "4",
          },
          {
            text: "right ear",
            value: "5",
          },
          {
            text: "top of head",
            value: "7",
          },
        ],
        TILT: [
          {
            text: "left",
            value: "left",
          },
          {
            text: "right",
            value: "right",
          },
        ],
      },
    };
  }

  // Calculate the position between the eyes
  getBetweenEyesPosition() {
    const leftEye = this.getPartPosition(0);
    const rightEye = this.getPartPosition(1);
    return {
      x: leftEye.x + (rightEye.x - leftEye.x) / 2,
      y: leftEye.y + (rightEye.y - leftEye.y) / 2,
    };
  }

  // Estimate the top of the head based on facial landmarks
  getTopOfHeadPosition() {
    const leftEyePos = this.getPartPosition(0);
    const rightEyePos = this.getPartPosition(1);
    const mouthPos = this.getPartPosition(3);
    const dx = rightEyePos.x - leftEyePos.x;
    const dy = rightEyePos.y - leftEyePos.y;
    const directionRads = Math.atan2(dy, dx) + Math.PI / 2;
    const betweenEyesPos = this.getBetweenEyesPosition();
    const mouthDistance = this.distance(betweenEyesPos, mouthPos);
    return {
      x: betweenEyesPos.x + mouthDistance * Math.cos(directionRads),
      y: betweenEyesPos.y + mouthDistance * Math.sin(directionRads),
    };
  }

  // Calculate Euclidean distance between two points
  distance(pointA, pointB) {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Event handler: when sprite touches a specific facial part
  whenSpriteTouchesPart(args, util) {
    if (!this.currentFace || !this.currentFace.landmarks) return false;
    const pos = this.getPartPosition(args.PART);
    return util.target.isTouchingScratchPoint(pos.x, pos.y);
  }

  // Event handler: when a face is detected
  whenFaceDetected() {
    return this.smoothedIsDetected;
  }

  // Boolean reporter: is a face detected
  faceIsDetected() {
    return this.smoothedIsDetected;
  }

  // Reporter: number of detected faces
  numberOfFaces() {
    return this.allFaces.length;
  }

  // Reporter: probability of face detection
  probability() {
    if (this.currentFace) {
      return Math.round(this.currentFace.probability * 100);
    }
    return 0;
  }

  // Reporter: size of the detected face
  faceSize() {
    if (this.currentFace) {
      const size = Math.round(
        this.currentFace.bottomRight[0] - this.currentFace.topLeft[0]
      );
      this.cachedSize = size;
      return size;
    }
    return this.cachedSize;
  }

  // Get position of a specific facial part
  getPartPosition(part) {
    const defaultPos = { x: 0, y: 0 };
    if (!this.currentFace || !this.currentFace.landmarks) return defaultPos;

    if (Number(part) === 6) {
      return this.getBetweenEyesPosition();
    }

    if (Number(part) === 7) {
      return this.getTopOfHeadPosition();
    }

    const landmark = this.currentFace.landmarks[Number(part)];
    if (landmark) {
      return this.toScratchCoords(landmark);
    }

    return defaultPos;
  }

  // Convert image coordinates to Scratch coordinates
  toScratchCoords(position) {
    return {
      x: position[0] - 240, // Assuming video width of 480
      y: 180 - position[1], // Assuming video height of 360
    };
  }

  // Reporter: X position of a facial part
  partX(args) {
    return this.getPartPosition(args.PART).x;
  }

  // Reporter: Y position of a facial part
  partY(args) {
    return this.getPartPosition(args.PART).y;
  }

  // Event handler: when face tilts in a specific direction
  whenTilted(args) {
    const TILT_THRESHOLD = 10;

    if (args.DIRECTION === "left") {
      return this.faceTilt() < 90 - TILT_THRESHOLD;
    }

    if (args.DIRECTION === "right") {
      return this.faceTilt() > 90 + TILT_THRESHOLD;
    }

    return false;
  }

  // Command: Move sprite to a specific facial part
  goToPart(args, util) {
    if (!this.currentFace) return;
    const pos = this.getPartPosition(args.PART);
    util.target.setXY(pos.x, pos.y);
  }

  // Command: Point sprite in the direction of face tilt
  pointInFaceTiltDirection(args, util) {
    if (!this.currentFace) return;
    util.target.setDirection(this.faceTilt());
  }

  // Command: Set sprite size based on face size
  setSizeToFaceSize(args, util) {
    if (!this.currentFace) return;
    util.target.setSize(this.faceSize());
  }

  // Attach sprite to a specific facial part with offset
  attachToPart(args, util) {
    const state = this._getFaceDetectionState(util.target);
    state.attachedToPartNumber = args.PART;
    state.offsetX = 0;
    state.offsetY = 0;
    state.prevDirection = util.target.direction;
    state.offsetDirection = 0;
    state.offsetSize = 0;
    state.prevSize = util.target.size;
  }

  // Update attached sprites based on facial movements
  updateAttachments() {
    this.runtime.targets.forEach((target) => {
      const state = this._getFaceDetectionState(target);

      if (state.attachedToPartNumber !== null) {
        const partPos = this.getPartPosition(state.attachedToPartNumber);

        // Calculate offset changes
        state.offsetX += target.x - state.prevX;
        state.offsetY += target.y - state.prevY;
        state.offsetDirection += target.direction - state.prevDirection;
        state.offsetSize += target.size - state.prevSize;

        // Update sprite position, direction, and size
        target.setXY(partPos.x + state.offsetX, partPos.y + state.offsetY);
        target.setDirection(this.faceTilt() + state.offsetDirection);
        target.setSize(this.faceSize() + state.offsetSize);

        // Update previous states
        state.prevX = target.x;
        state.prevY = target.y;
        state.prevDirection = target.direction;
        state.prevSize = target.size;
      }
    });
  }

  // Reporter: Current face tilt angle
  faceTilt() {
    if (this.currentFace) {
      const leftEyePos = this.getPartPosition(0);
      const rightEyePos = this.getPartPosition(1);
      const dx = rightEyePos.x - leftEyePos.x;
      const dy = rightEyePos.y - leftEyePos.y;
      const directionRads = Math.atan2(dy, dx);
      const directionDeg = 90 - (directionRads * 180) / Math.PI;
      const tilt = Math.round(directionDeg);
      this.cachedTilt = tilt;
      return tilt;
    }
    return this.cachedTilt;
  }

  // Dispose of the BlazeFace model to free resources
  dispose() {
    if (this.blazeface && typeof this.blazeface.dispose === "function") {
      this.blazeface.dispose();
    }
  }
}

console.log("Face Detection Extension Loaded");

module.exports = Scratch3FaceDetectionBlocks;
