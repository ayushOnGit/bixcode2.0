// import { createVideoElement } from '../../../dist/web/openblock-vm.js';
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const Video = require('../../io/video.js'); // Import your Video class

class Scratch3CameraStreamBlocks {
  constructor(runtime) {
    this.runtime = runtime;
    this.video = new Video(runtime); // Initialize Video class
  }

  get EXTENSION_ID() {
    return "camerastream";
  }

  getInfo() {
    return {
      id: "camerastream",
      name: formatMessage({
        id: "cameraStream.categoryName",
        default: "Camera Stream",
      }),
      blocks: [
        {
          opcode: "startStream",
          text: formatMessage({
            id: "cameraStream.startStream",
            default: "start streaming from [URL]",
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            URL: {
              type: ArgumentType.STRING,
              defaultValue: "http://192.168.0.183:8080/video",
            },
          },
        },
        {
          opcode: "stopStream",
          text: formatMessage({
            id: "cameraStream.stopStream",
            default: "stop streaming",
          }),
          blockType: BlockType.COMMAND,
        },
      ],
    };
  }

  async startStream(args) {
    console.log("startStream called");
    const url = args.URL;
    console.log("Streaming URL:", url);

    try {
      // Set up the video provider and start the stream
      await this.setupVideoStream(url);
      await this.video.enableVideo();
      console.log("Video enabled and preview setup.");
    } catch (error) {
      console.error("Error enabling video:", error);
    }
  }

  stopStream() {
    console.log("stopStream called");
    try {
      this.video.disableVideo();
      if (this.videoElement) {
        this.videoElement.src = "";
        this.videoElement.pause();
        this.videoElement = null;
        console.log("Video stream stopped.");
      }
    } catch (error) {
      console.error("Error stopping video stream:", error);
    }
  }

  async setupVideoStream(url) {
    try {
      if (this.videoElement) {
        // Update existing video element's URL
        console.log("Updating existing video element URL.");
        this.videoElement.src = url;
        this.videoElement.load();
        await this.videoElement.play();
        console.log("Video is playing.");
        return;
      }

      // Create a new video element and set its source
      this.videoElement = createVideoElement(new URL(url));
      document.body.appendChild(this.videoElement); // Append to the body if needed

      // Play the video
      const playPromise = this.videoElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video started streaming successfully.");
          })
          .catch((error) => {
            console.error("Video failed to start streaming:", error);
          });
      }
    } catch (error) {
      console.error("Error with video setup:", error);
    }
  }

  getVideoElement() {
    return this.videoElement;
  }
}

module.exports = Scratch3CameraStreamBlocks;
