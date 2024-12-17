import React from "react";
import { FormattedMessage } from "react-intl";

import musicIconURL from "./music/music.png";
import musicInsetIconURL from "./music/music-small.svg";

import penIconURL from "./pen/pen.png";
import penInsetIconURL from "./pen/pen-small.svg";

import videoSensingIconURL from "./videoSensing/video-sensing.png";
import videoSensingInsetIconURL from "./videoSensing/video-sensing-small.svg";

import text2speechIconURL from "./text2speech/text2speech.png";
import text2speechInsetIconURL from "./text2speech/text2speech-small.svg";

import translateIconURL from "./translate/translate.png";
import translateInsetIconURL from "./translate/translate-small.png";

import makeymakeyIconURL from "./makeymakey/makeymakey.png";
import makeymakeyInsetIconURL from "./makeymakey/makeymakey-small.svg";

import ev3IconURL from "./ev3/ev3.png";
import ev3InsetIconURL from "./ev3/ev3-small.svg";
import ev3ConnectionIconURL from "./ev3/ev3-hub-illustration.svg";
import ev3ConnectionSmallIconURL from "./ev3/ev3-small.svg";

import GeminiIconUrl from "./scratch3_gemini/gemini_image.png";
import GeminiIcon from "./chatgpt/GemeniIcon.png";

// import wedo2IconURL from './wedo2/wedo.png'; // TODO: Rename file names to match variable/prop names?
// import wedo2InsetIconURL from './wedo2/wedo-small.svg';
// import wedo2ConnectionIconURL from './wedo2/wedo-illustration.svg';
// import wedo2ConnectionSmallIconURL from './wedo2/wedo-small.svg';
// import wedo2ConnectionTipIconURL from './wedo2/wedo-button-illustration.svg';

// import boostIconURL from './boost/boost.png';
// import boostInsetIconURL from './boost/boost-small.svg';
// import boostConnectionIconURL from './boost/boost-illustration.svg';
// import boostConnectionSmallIconURL from './boost/boost-small.svg';
// import boostConnectionTipIconURL from './boost/boost-button-illustration.svg';

// import gdxforIconURL from './gdxfor/gdxfor.png';
// import gdxforInsetIconURL from './gdxfor/gdxfor-small.svg';
// import gdxforConnectionIconURL from './gdxfor/gdxfor-illustration.svg';
// import gdxforConnectionSmallIconURL from './gdxfor/gdxfor-small.svg';
import faceDetectionUrl from "./face_detection/face_detection2x.png";
import faceDetctionIconUrl from "./face_detection/facescanner.svg";

import handposUrl from "./handpose2scratch/hand.jpg";
import handpossmallUrl from "./handpose2scratch/handpose2scratch-smalll.png";

import poseUrl from "./PoseNet/pose_url.png";
import poseUrlSmall from "./PoseNet/pose.png";

import objectDetectionUrl from "./object_detection/ob.png";
import objectDetectionSmallUrl from "./object_detection/ob_icon.svg";

import qrcodescanUrl from "./qrCode/scan.png";
import qrcodescanSmallUrl from "./qrCode/scan_small.png";

import textRecoUrl from "./text_reco/text_reco.png";
import textRecoIconUrl from "./text_reco/text_icon.png";

import machineLearningUrl from "./machineLearning/ML_Cover.jpg";
import machineLearningIconUrl from "./machineLearning/ML_ICON.png";

import speech2textURL from "./speechReco/spReco.png";
import speech2textIconURL from "./speechReco/speech2Text.png";

import weather_imageUrl from "./weatherData/weatherBg.jpg";
import weather_imageIconUrl from "./weatherData/weatherIcon.png";

import firebase_imageurl from "./firebase/firebaseIcon.png";
import firabse_imageIconUrl from "./firebase/firebaseBg.jpg";

import cognitiveURL from "./cognitive learning/CG.jpg";

import CVURL from "./computer_vision/CV.png";

export default [
    {
        name: (
            <FormattedMessage
                defaultMessage="Face Detection"
                description="Detect & recognize human face"
                id="gui.extension.FaceDetection.name"
            />
        ),
        extensionId: "facedetection",
        iconURL: faceDetectionUrl,
        insetIconURL: faceDetctionIconUrl,
        description: (
            <FormattedMessage
                defaultMessage="Use extension for face detection"
                description="Description for the Face Detection extension"
                id="gui.extension.FaceDetection.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Computer Vision"
                description="Detect & recognize human face age & emotion"
                id="gui.extension.cv.name"
            />
        ),
        extensionId: "computer_vision",
        iconURL: CVURL,
        insetIconURL: faceDetctionIconUrl,
        description: (
            <FormattedMessage
                defaultMessage="Use extension for human age and emotion"
                description="Description for the human age and emotion"
                id="gui.extension.cv.description"
            />
        ),
        featured: true,
    },

    {
        name: (
            <FormattedMessage
                defaultMessage="IP webcam"
                description="Communicate with the cloud."
                id="gui.extension.ipwebcam.name"
            />
        ),
        extensionId: "camerastream",
        iconURL: firabse_imageIconUrl,
        insetIconURL: firebase_imageurl,
        description: (
            <FormattedMessage
                defaultMessage="Use extension for remote camera."
                description="Description for the firebase data"
                id="gui.extension.ipwebcam.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Google Assistant"
                description="Get AI Response"
                id="gui.extension.gemini.name"
            />
        ),
        extensionId: "gemini",
        iconURL: GeminiIconUrl,
        insetIconURL: GeminiIcon,
        description: (
            <FormattedMessage
                defaultMessage="Use extension to for getting ai response"
                description="Description for the gemini extension"
                id="gui.extension.gemini.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Machine Learning Model"
                description="Detect & recognize human face"
                id="gui.extension.machineLearning.name"
            />
        ),
        extensionId: "teachableMachine",
        iconURL: machineLearningUrl,
        insetIconURL: machineLearningIconUrl,
        description: (
            <FormattedMessage
                defaultMessage="Use extension to create machine learning model"
                description="Description for the Machine Learning extension"
                id="gui.extension.machineLearning.description"
            />
        ),
        featured: true,
    },

   

    {
        name: (
            <FormattedMessage
                defaultMessage="Hand Detection"
                description="Detect hand with camera"
                id="gui.extension.HandDetection.name"
            />
        ),
        extensionId: "handpose2scratch",
        iconURL: handposUrl,
        insetIconURL: handpossmallUrl,
        description: (
            <FormattedMessage
                defaultMessage="Use extension for Hand detection"
                description="Description for the Hand Detection extension"
                id="gui.extension.HandDetection.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Human Body Pose Detection"
                description="Detect hand with Human Body Pose Using Camera"
                id="gui.extension.PoseDetection.name"
            />
        ),
        extensionId: "posenet2scratch",
        iconURL: poseUrl,
        insetIconURL: poseUrlSmall,
        description: (
            <FormattedMessage
                defaultMessage="Use extension for human body pose detection"
                description="Description for the Human Body PoseDetection extension"
                id="gui.extension.PoseDetection.description"
            />
        ),
        featured: true,
    },

    {
        name: (
            <FormattedMessage
                defaultMessage="Object Detection"
                description="Detect objects using camera"
                id="gui.extension.ObjectDetection.name"
            />
        ),
        extensionId: "objectDetection",
        iconURL: objectDetectionUrl,
        insetIconURL: objectDetectionSmallUrl,
        description: (
            <FormattedMessage
                defaultMessage="Use extension for object detection"
                description="Description for the Human Body object detection extension"
                id="gui.extension.ObjectDetection.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="QR Code Scanner"
                description="Scan qr code using camera"
                id="gui.extension.QRScanner.name"
            />
        ),
        extensionId: "qrCodeScanner",

        iconURL: qrcodescanUrl,
        insetIconURL: qrcodescanSmallUrl,
        description: (
            <FormattedMessage
                defaultMessage="Use extension for object detection"
                description="Description for the Human Body object detection extension"
                id="gui.extension.ObjectDetection.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Real Time Weather Data"
                description="Get weather data by location."
                id="gui.extension.WeatherData.name"
            />
        ),
        extensionId: "WeatherData",
        iconURL: weather_imageUrl,
        insetIconURL: weather_imageIconUrl,
        description: (
            <FormattedMessage
                defaultMessage="Use extension for Weather Data Report"
                description="Description for the Weather Data"
                id="gui.extension.WeatherData.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Firebase Cloud"
                description="Communicate with the cloud."
                id="gui.extension.Firebase.name"
            />
        ),
        extensionId: "Firebase",
        iconURL: firabse_imageIconUrl,
        insetIconURL: firebase_imageurl,
        description: (
            <FormattedMessage
                defaultMessage="Use extension to Communicate with the cloud."
                description="Description for the firebase data"
                id="gui.extension.Firebase.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Speech Recognition"
                description="Speech Recognition Extension"
                id="gui.extension.SpeechRecgnition"
            />
        ),
        extensionId: "SpeechRecognition",
        iconURL: speech2textURL,
        insetIconURL: speech2textIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Speech Recognition"
                description="Description for the Speech Recogination extension"
                id="gui.extension.SpeechRecognition.description"
            />
        ),
        featured: true,
    },

    {
        name: (
            <FormattedMessage
                defaultMessage="Text Recognition"
                description="Use Extesnion for text recogination"
                id="gui.extension.text_reco.name"
            />
        ),
        extensionId: "textRecognition",

        iconURL: textRecoUrl,
        insetIconURL: textRecoIconUrl,
        description: (
            <FormattedMessage
                defaultMessage="Use extension for object detection"
                description="Description for the Human Body object detection extension"
                id="gui.extension.ObjectDetection.description"
            />
        ),
        featured: true,
    },

    {
        name: (
            <FormattedMessage
                defaultMessage="Music"
                description="Name for the 'Music' extension"
                id="gui.extension.music.name"
            />
        ),
        extensionId: "music",
        iconURL: musicIconURL,
        insetIconURL: musicInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Play instruments and drums."
                description="Description for the 'Music' extension"
                id="gui.extension.music.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Pen"
                description="Name for the 'Pen' extension"
                id="gui.extension.pen.name"
            />
        ),
        extensionId: "pen",
        iconURL: penIconURL,
        insetIconURL: penInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Draw with your sprites."
                description="Description for the 'Pen' extension"
                id="gui.extension.pen.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Video Sensing"
                description="Name for the 'Video Sensing' extension"
                id="gui.extension.videosensing.name"
            />
        ),
        extensionId: "videoSensing",
        iconURL: videoSensingIconURL,
        insetIconURL: videoSensingInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Sense motion with the camera."
                description="Description for the 'Video Sensing' extension"
                id="gui.extension.videosensing.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Text to Speech"
                description="Name for the Text to Speech extension"
                id="gui.extension.text2speech.name"
            />
        ),
        extensionId: "text2speech",
        collaborator: "Amazon Web Services",
        iconURL: text2speechIconURL,
        insetIconURL: text2speechInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Make your projects talk."
                description="Description for the Text to speech extension"
                id="gui.extension.text2speech.description"
            />
        ),
        featured: true,
        internetConnectionRequired: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Translate"
                description="Name for the Translate extension"
                id="gui.extension.translate.name"
            />
        ),
        extensionId: "translate",
        collaborator: "Google",
        iconURL: translateIconURL,
        insetIconURL: translateInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Translate text into many languages."
                description="Description for the Translate extension"
                id="gui.extension.translate.description"
            />
        ),
        featured: true,
        internetConnectionRequired: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Makey Makey"
                description="Name for the Makey Makey extension"
                id="gui.extension.makeymakey.name"
            />
        ),
        extensionId: "makeymakey",
        collaborator: "JoyLabz",
        iconURL: makeymakeyIconURL,
        insetIconURL: makeymakeyInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Make anything into a key."
                description="Description for the 'Makey Makey' extension"
                id="gui.extension.makeymakey.description"
            />
        ),
        featured: true,
    },
    {
        name: "LEGO MINDSTORMS EV3",
        extensionId: "ev3",
        collaborator: "LEGO",
        iconURL: ev3IconURL,
        insetIconURL: ev3InsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Build interactive robots and more."
                description="Description for the 'LEGO MINDSTORMS EV3' extension"
                id="gui.extension.ev3.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: ev3ConnectionIconURL,
        connectionSmallIconURL: ev3ConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting. Make sure the pin on your EV3 is set to 1234."
                description="Message to help people connect to their EV3. Must note the PIN should be 1234."
                id="gui.extension.ev3.connectingMessage"
            />
        ),
        helpLink: "https://scratch.mit.edu/ev3",
    },
    // {
    //     name: 'LEGO BOOST',
    //     extensionId: 'boost',
    //     collaborator: 'LEGO',
    //     iconURL: boostIconURL,
    //     insetIconURL: boostInsetIconURL,
    //     description: (
    //         <FormattedMessage
    //             defaultMessage="Bring robotic creations to life."
    //             description="Description for the 'LEGO BOOST' extension"
    //             id="gui.extension.boost.description"
    //         />
    //     ),
    //     featured: true,
    //     disabled: false,
    //     bluetoothRequired: true,
    //     internetConnectionRequired: true,
    //     launchPeripheralConnectionFlow: true,
    //     useAutoScan: true,
    //     connectionIconURL: boostConnectionIconURL,
    //     connectionSmallIconURL: boostConnectionSmallIconURL,
    //     connectionTipIconURL: boostConnectionTipIconURL,
    //     connectingMessage: (
    //         <FormattedMessage
    //             defaultMessage="Connecting"
    //             description="Message to help people connect to their BOOST."
    //             id="gui.extension.boost.connectingMessage"
    //         />
    //     ),
    //     helpLink: 'https://scratch.mit.edu/boost'
    // },
    // {
    //     name: 'LEGO Education WeDo 2.0',
    //     extensionId: 'wedo2',
    //     collaborator: 'LEGO',
    //     iconURL: wedo2IconURL,
    //     insetIconURL: wedo2InsetIconURL,
    //     description: (
    //         <FormattedMessage
    //             defaultMessage="Build with motors and sensors."
    //             description="Description for the 'LEGO WeDo 2.0' extension"
    //             id="gui.extension.wedo2.description"
    //         />
    //     ),
    //     featured: true,
    //     disabled: false,
    //     bluetoothRequired: true,
    //     internetConnectionRequired: true,
    //     launchPeripheralConnectionFlow: true,
    //     useAutoScan: true,
    //     connectionIconURL: wedo2ConnectionIconURL,
    //     connectionSmallIconURL: wedo2ConnectionSmallIconURL,
    //     connectionTipIconURL: wedo2ConnectionTipIconURL,
    //     connectingMessage: (
    //         <FormattedMessage
    //             defaultMessage="Connecting"
    //             description="Message to help people connect to their WeDo."
    //             id="gui.extension.wedo2.connectingMessage"
    //         />
    //     ),
    //     helpLink: 'https://scratch.mit.edu/wedo'
    // },
    // {
    //     name: 'Go Direct Force & Acceleration',
    //     extensionId: 'gdxfor',
    //     collaborator: 'Vernier',
    //     iconURL: gdxforIconURL,
    //     insetIconURL: gdxforInsetIconURL,
    //     description: (
    //         <FormattedMessage
    //             defaultMessage="Sense push, pull, motion, and spin."
    //             description="Description for the Vernier Go Direct Force and Acceleration sensor extension"
    //             id="gui.extension.gdxfor.description"
    //         />
    //     ),
    //     featured: true,
    //     disabled: false,
    //     bluetoothRequired: true,
    //     internetConnectionRequired: true,
    //     launchPeripheralConnectionFlow: true,
    //     useAutoScan: false,
    //     connectionIconURL: gdxforConnectionIconURL,
    //     connectionSmallIconURL: gdxforConnectionSmallIconURL,
    //     connectingMessage: (
    //         <FormattedMessage
    //             defaultMessage="Connecting"
    //             description="Message to help people connect to their force and acceleration sensor."
    //             id="gui.extension.gdxfor.connectingMessage"
    //         />
    //     ),
    //     helpLink: 'https://scratch.mit.edu/vernier'
    // }
];
