const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const Cast = require("../../util/cast");
const TargetType = require("../../extension-support/target-type");
const faceapi = require('@vladmandic/face-api');

const predictedAges = [];
const predictedExpressions = [];
// const faceDetectionInterval = {}; // Object to store detection intervals by video

class Scratch3API {
  constructor(runtime) {
    this.runtime = runtime;
    this.runtime.emit("EXTENSION_DATA_LOADING", true);
    this.faceApiLoaded = false;
    this.modelsLoaded = false;
    this.loadFaceApiScript();
  }

  get EXTENSION_ID() {
    return "face2API";
  }

  static get DIMENSIONS() {
    return [480, 360];
  }

  static get INTERVAL() {
    return 1000 / 15; // 15 FPS
  }

  static get STATE_KEY() {
    return "Scratch.face2API";
  }

  loadFaceApiScript() {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js";
    script.onload = () => {
      console.log("face-api.js loaded successfully");
      this.faceApiLoaded = true;
    };
    // script.onerror = () => console.error("Failed to load face-api.js");
    document.head.appendChild(script);
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
          opcode: "startFaceDetection",
          text: formatMessage({
            id: "faceSensing.startFaceDetection",
            default: "start Face Detection [STATE]",
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
        {
          opcode: "drawDetectionBoxes",
          text: formatMessage({
            id: "faceSensing.showDetectionBox",
            default: "show detection box",
            description: "show detection box",
          }),
          blockType: BlockType.COMMAND,

          filter: [TargetType.SPRITE],
        },
        {
          opcode: "showDetectedAge",
          text: formatMessage({
            id: "faceSensing.showDetectedAge",
            default: "show detected age",
            description: "Block to display the detected age",
          }),
          blockType: BlockType.REPORTER,
          arguments: {},
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "showDetectedExpression",
          text: formatMessage({
            id: "faceSensing.showDetectedExpression",
            default: "show detected expression",
            description: "Block to display the detected face expression",
          }),
          blockType: BlockType.REPORTER,
          arguments: {},
          filter: [TargetType.SPRITE],
        }
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

  openCamera(args, util) {
    const state = Cast.toString(args.STATE);
    if (state === "on") {
      startVideo();
      console.log("video stream started");
    } else if (state === "off") {
      stopVideo();
      console.log("video stream stopped");
    }
  }
  

  showDetectedAge(args, util) {
    return getInterpolatedAge();
  }

  showDetectedExpression(args, util) {
    const dominantExpression = getPredictedExpression();
    return dominantExpression ? `${dominantExpression.expression} (${(dominantExpression.confidence * 100).toFixed(2)}%)` : "No face detected";
  }

  async startFaceDetection(args, util) {
    const state = Cast.toString(args.STATE);
  
    // Check if the API is loaded
    if (state === "on") {
      // If models are not loaded, load them
      if (!this.modelsLoaded) {
        await loadFaceDetectionModels();
        this.modelsLoaded = true;
        
        // Start face detection functionality here
        const video = document.querySelector('video'); // Make sure you have the correct video element
        handleVideoPlay(video); // Call your handleVideoPlay function to start detection
      }
    } else if (state === "off") {
      // Unload models and clear any intervals or cleanup
      unloadFaceApi();
      console.log("API unloaded");
      
      // Reset the modelsLoaded state
      this.modelsLoaded = false; // Resetting to allow for reloading
    }
  }
}

// Function to load the face detection models
async function loadFaceDetectionModels() {
  const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.14/model/';
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
    await faceapi.nets.ageGenderNet.loadFromUri(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
    await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);
    console.log("Face detection models loaded successfully.");
  } catch (error) {
    // console.error("Error loading face detection models:", error);
  }
}

// Function to unload face-api.js models and script
function unloadFaceApi(video) {
  try {
    // Dispose of all loaded models
    faceapi.nets.tinyFaceDetector.dispose();
    faceapi.nets.ageGenderNet.dispose();
    faceapi.nets.faceLandmark68Net.dispose();
    faceapi.nets.faceExpressionNet.dispose();

    console.log("Face-api.js models unloaded.");

    // Remove the face-api.js script
    const faceApiScript = document.querySelector("script[src*='face-api.js']");
    if (faceApiScript) {
      faceApiScript.remove();
      console.log("Face-api.js script removed from the DOM.");
    }

    // Clear the canvas if it exists
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.remove();
      console.log("Face detection canvas removed.");
    }

    // Clear the face detection interval to stop further detections
    if (video) {
      const intervalId = video.getAttribute('data-interval-id');
      if (intervalId) {
        clearInterval(intervalId);
        console.log("Face detection interval cleared.");
      }
    }
  } catch (error) {
    // console.error("Error during face-api.js unloading:", error);
  }
}


// Helper function to handle video and face detection
function handleVideoPlay(video) {
  const canvas = createCanvas(video); // Create canvas for face detection

  video.addEventListener('loadedmetadata', () => {
    const displaySize = { width: canvas.width, height: canvas.height };
    faceapi.matchDimensions(canvas, displaySize);

    const intervalId = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withAgeAndGender()
        .withFaceExpressions();

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

      if (detections.length > 0) { // If faces are detected
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        drawDetectionBoxes(canvas, resizedDetections); // Call to draw boxes
        drawFaceLandmarks(canvas, resizedDetections); // Call to draw landmarks

        detections.forEach(detection => {
          const age = detection.age;
          predictedAges.push(age);
          if (predictedAges.length > 30) predictedAges.shift();
          console.log(`Detected Age: ${age.toFixed(0)}`);

          const expression = getDominantExpression(detection.expressions);
          predictedExpressions.push(expression);
          if (predictedExpressions.length > 30) predictedExpressions.shift();
          console.log(`Detected Expression: ${JSON.stringify(expression)}`);
        });
      } else {
        console.log("No face detected");
        clearCanvas(video); // Call clearCanvas to handle no face detection
      }
    }, Scratch3API.INTERVAL);

    // Save interval ID to be able to clear it when stopping detection
    video.setAttribute('data-interval-id', intervalId);
  });
}

function clearCanvas(video) {
  const canvas = document.querySelector('canvas'); // Find the canvas element
  
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas content
    console.log("Canvas cleared.");
  }

  // Optionally, remove the canvas if you want to clear it from DOM
  if (canvas && video) {
    canvas.remove();
    console.log("Canvas removed from DOM.");
    
    // Stop the face detection interval
    const intervalId = video.getAttribute('data-interval-id');
    if (intervalId) {
      clearInterval(intervalId);
      console.log("Face detection interval cleared.");
    }
  }
}

function drawDetectionBoxes(canvas, resizedDetections) {
  const ctx = canvas.getContext('2d');
  faceapi.draw.drawDetections(canvas, resizedDetections);
  console.log("Detection boxes drawn.");
}

function drawFaceLandmarks(canvas, resizedDetections) {
  const ctx = canvas.getContext('2d');
  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  console.log("Face landmarks drawn.");
}



// Helper function to create a canvas for face detection
function createCanvas(video) {
  const canvas = document.createElement('canvas');
  canvas.width = Scratch3API.DIMENSIONS[0];
  canvas.height = Scratch3API.DIMENSIONS[1];
  canvas.style.position = 'absolute';
  canvas.style.top = '100px';
  canvas.style.right = '10px';
  canvas.style.zIndex = '1';

  document.body.appendChild(canvas);
  return canvas;
}

// Helper function to get the dominant facial expression
function getDominantExpression(expressions) {
  const expressionEntries = Object.entries(expressions);
  const maxEntry = expressionEntries.reduce((prev, current) => {
    return (prev[1] > current[1]) ? prev : current;
  });
  return { expression: maxEntry[0], confidence: maxEntry[1] };
}

// Function to return the most frequent predicted expression
function getPredictedExpression() {
  if (predictedExpressions.length > 0) {
    const expressionCounts = predictedExpressions.reduce((acc, curr) => {
      acc[curr.expression] = (acc[curr.expression] || 0) + 1;
      return acc;
    }, {});

    const maxEntry = Object.entries(expressionCounts).reduce((prev, current) => {
      return (prev[1] > current[1]) ? prev : current;
    });
    return { expression: maxEntry[0], count: maxEntry[1] };
  }
  return null;
} 

// Function to return the interpolated age
function getInterpolatedAge() {
  if (predictedAges.length === 0) return 0;
  const avgAge = predictedAges.reduce((acc, age) => acc + age, 0) / predictedAges.length;
  return avgAge.toFixed(0);
}

// Video start and stop functions
function startVideo() {
  const video = document.createElement('video');
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
      handleVideoPlay(video);
    })
    // .catch(err => console.error("Error accessing webcam:", err));
}

function stopVideo() {
  const video = document.querySelector('video');
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop()); // Stop the camera stream
    video.remove(); // Remove the video element
    console.log('Camera turned off');
  }

  const canvas = document.querySelector('canvas');
  if (canvas) {
    // canvas.remove(); // Remove the canvas element
    console.log('Canvas removed');
  }
}

module.exports = Scratch3API;


