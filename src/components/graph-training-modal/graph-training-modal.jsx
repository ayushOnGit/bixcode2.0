import React from "react";
import PropTypes from "prop-types";
import bindAll from "lodash.bindall";
import Prompt from "../prompt-special/prompt.jsx";
import { connect } from "react-redux";
import { FormattedMessage, defineMessages, injectIntl } from "react-intl";
import ml5 from "ml5";
const logo = require("./scratch-logo.svg");

// import ReactART from 'react-art';
import "art/modes/svg";
import SVGPath from "art/modes/svg/path";
// const {Shape, Transform, Surface, Text,Group,Path} = ReactART;

import classNames from "classnames";

import styles from "./graph-training-modal.css";
import iconClose from "./image/icon_modal_close.png";
import ImageClassification from "./image-classification.jsx";
import SelectPrompt from "./select-prompt.jsx";
import { getUserMedia } from "../video-modal/media.jsx";

import { closeTrainModal } from "../../reducers/modals";

import {
    setClassifier,
    setFeatureExtractor,
    setOptions,
    setClassificationList,
    setIsPredicting,
} from "../../reducers/train-mode";

const localMessages = defineMessages({
    category: {
        defaultMessage: "category",
        description: "category",
        id: "gui.trainModal.category",
    },
    cancel: {
        defaultMessage: "Cancel",
        description: "Cancel",
        id: "gui.trainModal.cancel",
    },
    confirm: {
        defaultMessage: "Confirm",
        description: "Confirm",
        id: "gui.trainModal.confirm",
    },
    title: {
        defaultMessage: "Machine Learning Module",
        description: "Model Training",
        id: "gui.trainModal.title",
    },
    result: {
        defaultMessage: "Predicted Result",
        description: "result",
        id: "gui.trainModal.result",
    },
    newModel: {
        defaultMessage: "New model",
        description: "newModel",
        id: "gui.trainModal.newModel",
    },
    usingModel: {
        defaultMessage: "Using the model",
        description: "usingModel",
        id: "gui.trainModal.usingModel",
    },
    modelResourceLoading: {
        defaultMessage: "Model resource loading......",
        description: "loading",
        id: "gui.trainModal.modelResourceLoading",
    },
    clearPrompt: {
        defaultMessage:
            "Are you sure you want to clear the current classification of samples?",
        description: "clearPrompt",
        id: "gui.trainModal.clearPrompt",
    },
    newModelPrompt: {
        defaultMessage:
            "New model will clear the current training data, determine new?",
        description: "newModelPrompt",
        id: "gui.trainModal.newModelPrompt",
    },
    modelCategoryNumber: {
        defaultMessage: "Number of model classifications",
        description: "modelCategoryNumber",
        id: "gui.trainModal.modelCategoryNumber",
    },
    notSupportMediaDevices: {
        defaultMessage:
            "Your browser does not support access to your media devices",
        description: "notSupportMediaDevices",
        id: "gui.trainModal.notSupportMediaDevices",
    },
});

const modelJson =
    "https://ide.tinkergen.com/ai_library/mobilenet_feature/model.json";

class GraphTrainingModal extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, [
            "handleClose",
            "handleTrain",
            "handleReset",
            "handleNameChange",
            "trainResult",
            "predictResult",
            "changeState",
            "handleScroll",
            "handleCreateModel",
            "handleUseModel",
            "handleClearCancel",
            "handleClearOK",
            "handleConfirmCancel",
            "handleConfirmOK",
            "handleCreateCancel",
            "handleCreateOK",
            "restoreWorkspaceRetrainCallback",
        ]);

        // variables for internationalization
        this.category = props.intl.formatMessage(localMessages.category);
        this.cancel = props.intl.formatMessage(localMessages.cancel);
        this.confirm = props.intl.formatMessage(localMessages.confirm);
        this.title = props.intl.formatMessage(localMessages.title);
        this.result = props.intl.formatMessage(localMessages.result);
        this.newModel = props.intl.formatMessage(localMessages.newModel);
        this.modelResourceLoading = props.intl.formatMessage(
            localMessages.modelResourceLoading
        );
        this.usingModel = props.intl.formatMessage(localMessages.usingModel);
        this.clearPrompt = props.intl.formatMessage(localMessages.clearPrompt);
        this.newModelPrompt = props.intl.formatMessage(
            localMessages.newModelPrompt
        );
        this.modelCategoryNumber = props.intl.formatMessage(
            localMessages.modelCategoryNumber
        );
        this.notSupportMediaDevices = props.intl.formatMessage(
            localMessages.notSupportMediaDevices
        );

        // Video Dom
        this.video;
        //  media stream
        this.mediaStreamTrack;
        // camera canvas
        this.canvas;
        // reset
        this.resetting = false;

        //object of classifier
        this.featureExtractor = props.featureExtractor;
        this.classifier = props.classifier;

        //options for classifier
        this.options = props.options;

        // reduce
        this.isPredicting = props.isPredicting; //if currently predicting
        //
        // If the classifier has not been set, will not start predicting
        if (this.classifier == null || this.featureExtractor == null) {
            this.isPredicting = false;
        }
        // redux redux data
        let propsClassificationList = this.props.classificationList;

        let classificationList = [];
        // trained classification count
        this.trainedClassificationCount = 0;
        // total image count
        let imageCount = 0;
        // mark traind classification
        let trainedClassification = {};

        // state redux
        // Deep copy to prevent interference to redux state
        for (let i = 0; i < propsClassificationList.length; i++) {
            let classification = {};
            let propsclassification = propsClassificationList[i];
            if (propsclassification.name == null) {
                classification.name = this.category + (i + 1);
            } else {
                classification.name = propsclassification.name;
            }

            classification.confidence = propsclassification.confidence;
            classification.imageList = [].concat(propsclassification.imageList);
            if (propsclassification.imageList.length > 0) {
                trainedClassification[i] = true;
                this.trainedClassificationCount++;
            }
            imageCount += classification.imageList.length;
            classification.isNameEdited = propsclassification.isNameEdited;
            classificationList.push(classification);
        }

        this.addedImageCount = imageCount; //count of images been added
        this.showImageCount = imageCount; //count of images been showed
        this.resetIndex = -1; //ID  the index of classification being reset
        this.trainedClassification = trainedClassification; //trained classification

        this.restoreOnFinish;

        this.state = {
            classificationList,
            predictionID: 0,
            trainedClassificationCount: this.trainedClassificationCount, //trained classification count
            clearVisible: false, //clear prompt
            confirmVisible: false, //confirm prompt
            createVisible: false, //create prompt
            startPointList: [], //starting position
            endPoint: {}, //ending position
            modelLoading: true, //if model is loading
            restore: false, //if restore data from file
            hasWebcam: false, //if there is media stream
        };
        let bakclassificationList = classificationList.map((obj) =>
            Object.assign({}, obj, { imageList: [].concat(obj.imageList) })
        );
        console.log(bakclassificationList);
        // console.log(props.vm.runtime.trainMode.setClassificationList(bakclassificationList));
        // console.log(props.vm.runtime.trainMode.setClassificationList(bakclassificationList));
        // props.vm.runtime.trainMode.setClassificationList(bakclassificationList);
        // Retrain if there are saved modal data while opening the workspace
        // props.vm.runtime.trainMode.setRestoreWorkspaceRetrainCallback(this.restoreWorkspaceRetrainCallback)
    }

    componentDidMount() {
        //GPU, GPU
        // Ban GPU if the current machine has not one
        this.canvas = document.createElement("canvas");
        this.canvas.width = 2400;
        this.canvas.height = 240;
        ml5.tf.ENV.set("WEBGL_PACK", false);
    }

    componentDidUpdate(prevProps) {
        //
        // State change means the hidden status of the page changed
        if (this.props.hidden != prevProps.hidden) {
            if (!this.props.hidden) {
                //check if support media
                if (
                    !navigator.mediaDevices ||
                    !navigator.mediaDevices.enumerateDevices
                ) {
                    // alert(this.notSupportMediaDevices);
                    this.setState({
                        hasWebcam: false,
                        modelLoading: false,
                    });
                    return;
                }
                //amount of camera
                let videoNum = 0;
                //amount of microphone
                let microphoneNum = 0;
                navigator.mediaDevices
                    .enumerateDevices()
                    .then((devices) => {
                        //iterate through each device
                        devices.forEach((device) => {
                            // deviceList.push(device.kind);
                            if (device.kind === "videoinput") videoNum++;
                            if (device.kind === "audioinput") microphoneNum++;
                        });
                        console.log("video number" + videoNum);
                        console.log("microphone num" + microphoneNum);
                        if (videoNum > 0) {
                            this.initMedia();
                        } else {
                            // alert(this.notSupportMediaDevices);
                            this.setState({
                                hasWebcam: false,
                                modelLoading: false,
                            });
                        }
                    })
                    .catch(function (err) {
                        // alert(this.notSupportMediaDevices);
                        this.setState({
                            hasWebcam: false,
                            modelLoading: false,
                        });
                    });
            }
        }
    }

    // neuralNetwork(){
    //     const options = {
    //         task: 'classification',
    //         debug: true
    //       }

    //       // Step 3: initialize your neural network
    //       const nn = ml5.neuralNetwork(options);
    //       console(nn);
    //       return nn;

    // }

    async initMedia() {
        this.video = document.getElementById("graphTrainVideo");
        let size = this.video.offsetWidth;
        let constraints = {
            video: { width: size, height: size },
        };
        //Update the canvas size
        this.canvas.width = size * 1;
        this.canvas.height = size * 1;

        const stream = await getUserMedia(constraints);
        this.setState({
            hasWebcam: stream != null,
        });
        if (stream) {
            this.mediaStreamTrack =
                typeof stream.stop === "function"
                    ? stream
                    : stream.getTracks()[0];
            this.video.srcObject = stream;
            this.video.play();
            this.loadClassifier(this.video);
        }
        this.setState({
            modelLoading: false,
        });
    }

    // async initPoseNet(video) {
    //     try {
    //         this.poseNet = await ml5.poseNet(video, () => {
    //             console.log('PoseNet model loaded');
    //         });

    //         this.poseNet.on('pose', this.extractFeatures);
    //     } catch (error) {
    //         console.error("Error initializing PoseNet:", error);
    //     }
    // }

    // extractFeatures(poses) {
    //     if (poses.length > 0) {
    //         const keypoints = poses[0].pose.keypoints.map(point => ({
    //             x: point.position.x,
    //             y: point.position.y
    //         }));

    //         // Use keypoints as features for your classifier or other purposes
    //         console.log(keypoints);
    //     }
    // }

    //classifier  Initialize classifier
    async initClassifier(video) {
        this.featureExtractor = await ml5.featureExtractor("MobileNet");

        if (this.featureExtractor) {
            this.classifier = await this.featureExtractor.classification(
                video,
                this.options
            );
        }
    }
    //Load classifier
    async loadClassifier(video) {
        //If classifier is null, initialize it
        if (this.classifier == null || this.featureExtractor == null) {
            await this.initClassifier(video);
        }
        if (this.isPredicting) {
            this.classifyVideo();
        }
        this.setState({
            modelLoading: false,
        });
        this.refreshLine();
        console.log("classifire loaded");
    }
    // Add an image. Start training if the last image be added
    async addImageForTrain(image, numberID) {
        try {
            await this.classifier.addImage(image, numberID);
            // If the last image has been added, start training
            if (this.addedImageCount + 1 == this.showImageCount) {
                // Training
                this.classifier.train(this.trainResult);
                this.resetting = false;
            }
            this.addedImageCount++;
        } catch (error) {
            console.log(error);
            if (this.restoreOnFinish) {
                this.restoreOnFinish();
            }
        }
    }
    // Reload all images
    async addImageList(classificationList) {
        let keys = Object.keys(classificationList);
        for (let i = 0; i < keys.length; i++) {
            let numberID = Number(keys[i]);
            let classification = classificationList[numberID];
            let imageList = classification.imageList;
            for (let j = 0; j < imageList.length; j++) {
                var img = document.createElement("img");
                img.src = imageList[j];
                img.width = this.canvas.width;
                img.height = this.canvas.height;
                await this.addImageForTrain(img, numberID);
            }
        }
    }

    // Reload other images after reseting a classification
    async reloadImage(id) {
        const { classificationList } = this.state;

        let classification = classificationList[id];

        classification.imageList = [];
        classification.confidence = 0;

        // load images
        let keys = Object.keys(classificationList);
        let imageCount = 0;
        keys.map((id, i) => {
            let numberID = Number(id);
            let classification = classificationList[numberID];
            let imageList = classification.imageList;
            let length = imageList.length;
            if (length > 0) {
                if (!this.trainedClassification[numberID]) {
                    this.trainedClassification[numberID] = true;
                    this.trainedClassificationCount++;
                }
            }
            imageCount += imageList.length;
        });
        this.showImageCount = imageCount;
        this.addedImageCount = 0;

        await this.addImageList(classificationList);
        //Update GUI
        this.setState({
            classificationList,
            trainedClassificationCount: this.trainedClassificationCount,
        });
    }

    // Get training data from workspace then retrain
    async restoreWorkspaceRetrainCallback(params, onLine, onFinish) {
        let options = params.options;
        let classificationList = params.classificationList;
        //Check for null
        if (options != null && classificationList != null) {
            this.restoreOnFinish = onFinish;
            this.resetting = true;
            this.isPredicting = false;
            this.options = options;

            // Update GUI
            this.setState({
                restore: true,
            });

            // Update classifications and options to vm
            let bakclassificationList = classificationList.map((obj) =>
                Object.assign({}, obj, { imageList: [].concat(obj.imageList) })
            );
            this.props.vm.runtime.trainMode.setClassificationList(
                bakclassificationList
            );
            this.props.vm.runtime.trainMode.setOptions(options);
            this.props.vm.runtime.trainMode.setIsTrain(true);

            await this.initClassifier();

            this.trainedClassification = {};
            this.trainedClassificationCount = 0;
            let imageCount = 0;
            // Load images
            let keys = Object.keys(classificationList);

            keys.map((id, i) => {
                let numberID = Number(id);
                let classification = classificationList[numberID];
                let imageList = classification.imageList;
                let length = imageList.length;
                if (length > 0) {
                    if (!this.trainedClassification[numberID]) {
                        this.trainedClassification[numberID] = true;
                        this.trainedClassificationCount++;
                    }
                }
                imageCount += imageList.length;
            });
            this.showImageCount = imageCount;
            this.addedImageCount = 0;

            if (this.showImageCount > 0) {
                await this.addImageList(classificationList);
            } else {
                // Restore result if no image
                if (this.restoreOnFinish) {
                    this.restoreOnFinish();
                }
            }

            this.resetIndex = -1;

            //Update GUI
            this.setState(
                {
                    classificationList,
                    predictionID: 0,
                    trainedClassificationCount: this.trainedClassificationCount,
                    clearVisible: false, //Clear prompt
                    confirmVisible: false, //Confirm prompt
                    createVisible: false, //Create prompt
                    startPointList: [], //Starting position
                    endPoint: {}, //Ending position
                },
                () => {
                    this.refreshLine();
                }
            );
        }
    }

    //Scroll event
    handleScroll(e) {
        this.refreshLine();
    }

    //Refresh line
    refreshLine() {
        var leftBessel = document.getElementById("leftBessel");
        var leftBesselRect = leftBessel.getBoundingClientRect();

        var rightBessel = document.getElementById("rightBessel");
        var rightBesselRect = rightBessel.getBoundingClientRect();

        var centerBody = document.getElementById("centerBody");
        var centerBodyRect = centerBody.getBoundingClientRect();

        const { classificationList } = this.state;

        let startPointList = [];
        let endPoint = {};

        var endLeftX = 0;
        var endLeftY = centerBodyRect.height / 2.0 - leftBesselRect.top + 64;

        var endRightX = rightBesselRect.width;
        var endRightY = centerBodyRect.height / 2.0 - rightBesselRect.top;

        endPoint.leftX = endLeftX;
        endPoint.leftY = endLeftY;
        endPoint.rightX = endRightX;
        endPoint.rightY = endRightY;

        classificationList.map((item, i) => {
            var classification = document.getElementById("classification" + i);
            var classificationRect = classification.getBoundingClientRect();

            var startXRight =
                rightBesselRect.left -
                classificationRect.left -
                classificationRect.width;
            var startY = (classificationRect.height + 16) * (i + 0.5);

            var startXLeft = classificationRect.left - centerBodyRect.left;

            let start = {};
            start.leftX = startXLeft;
            start.leftY = startY;
            start.rightX = startXRight;
            start.rightY = startY;

            startPointList.push(start);
        });

        this.setState({
            startPointList: startPointList,
            endPoint: endPoint,
        });
    }

    //Close button event
    handleClose() {
        this.mediaStreamTrack && this.mediaStreamTrack.stop();
        this.props.closeTrainModalState();
    }

    //Create modal
    handleCreateModel() {
        if (!this.state.hasWebcam) {
            return;
        }
        this.setState({
            confirmVisible: true,
        });
    }

    //Use modal
    handleUseModel() {
        if (!this.state.hasWebcam) {
            return;
        }
        const { classificationList, trainedClassificationCount } = this.state;
        if (trainedClassificationCount != classificationList.length) return;

        //redux   Update redux
        this.props.setOptions(this.options);
        this.props.setFeatureExtractor(this.featureExtractor);
        this.props.setClassifier(this.classifier);
        this.props.setClassificationList(classificationList);
        this.props.setIsPredicting(this.isPredicting);

        //vm  Update vm
        let bakclassificationList = classificationList.map((obj) =>
            Object.assign({}, obj, { imageList: [].concat(obj.imageList) })
        );
        this.props.vm.runtime.trainMode.setClassificationList(
            bakclassificationList
        );
        this.props.vm.runtime.trainMode.setOptions(this.options);
        this.props.vm.runtime.trainMode.setIsTrain(true);
        this.props.vm.refreshExtensionBlocks().then(() => {
            this.props.vm.refreshWorkspace();
        });

        //Close the window
        this.handleClose();
    }

    //Cancel the confirm prompt
    handleConfirmCancel() {
        this.setState({
            confirmVisible: false,
        });
    }

    //Show create prompt after confirm
    handleConfirmOK() {
        this.setState({
            confirmVisible: false,
            createVisible: true,
        });
    }

    //Cancel the create prompt
    handleCreateCancel() {
        this.setState({
            createVisible: false,
        });
    }

    //Confirm on create prompt
    handleCreateOK(item) {
        this.setState({
            createVisible: false,
        });
        this.resetModel(item.value);
    }

    //Reset all classification after creating a new modal
    async resetModel(number) {
        this.resetting = true;
        this.isPredicting = false;

        this.options = {
            alpha: 1,
            numLabels: number,
            hiddenUnits: 10,
            batchSize: 0.2,
        };

        await this.initClassifier(this.video);

        let classificationList = [];

        for (let i = 0; i < number; i++) {
            let classification = {
                name: this.category + (i + 1),
                confidence: 0,
                imageList: [],
                isNameEdited: false,
            };
            classificationList.push(classification);
        }

        this.addedImageCount = 0;
        this.showImageCount = 0;
        this.resetIndex = -1;
        this.trainedClassification = {};
        this.trainedClassificationCount = 0;
        this.setState(
            {
                classificationList: classificationList,
                predictionID: 0,
                trainedClassificationCount: 0,
            },
            () => {
                this.refreshLine();
            }
        );
    }

    handleClearCancel() {
        this.setState({
            clearVisible: false,
        });
    }

    //Reset classification
    async handleClearOK() {
        if (!this.state.hasWebcam) {
            return;
        }

        this.resetting = true;
        this.isPredicting = false;

        await this.initClassifier(this.video);

        await this.reloadImage(this.resetIndex);
        this.trainedClassification[this.resetIndex] = false;
        this.trainedClassificationCount--;
        this.resetIndex = -1;
        this.setState({
            clearVisible: false,
            trainedClassificationCount: this.trainedClassificationCount,
        });
    }

    //Modify classification's name
    handleNameChange(index, name) {
        const { classificationList } = this.state;

        let classification = classificationList[index];
        classification.name = name;
        classification.isNameEdited = true;
        //Update GUI
        this.setState({
            classificationList,
        });
    }

    //Train classification
    async handleTrain(index) {
        if (!this.state.hasWebcam) {
            return;
        }
        const { classificationList } = this.state;

        let classification = classificationList[index];
        let imageList = classification.imageList;
        //Screenshot/capture
        this.canvas
            .getContext("2d")
            .drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        let src = this.canvas.toDataURL("image/png");
        imageList.push(src);
        //Image count + 1
        this.showImageCount++;
        //pdate GUI
        this.setState({
            classificationList,
        });
        var img = document.createElement("img");
        img.src = src;
        img.width = this.canvas.width;
        img.height = this.canvas.height;
        if (!this.trainedClassification[index]) {
            this.trainedClassification[index] = true;
            this.trainedClassificationCount++;
        }

        await this.addImageForTrain(img, index);

        this.setState({
            trainedClassificationCount: this.trainedClassificationCount,
        });
    }

    handleReset(index) {
        if (!this.state.hasWebcam) {
            return;
        }
        this.setState({
            clearVisible: true,
        });
        this.resetIndex = index;
    }

    //Training result
    trainResult(lossValue) {
        if (!lossValue) {
            console.log("train!");
            //Predicting
            if (!this.isPredicting) {
                this.classifyVideo();
                this.isPredicting = true;
            }

            const { restore, classificationList } = this.state;

            if (restore) {
                //redux   Update redux
                this.props.setOptions(this.options);
                this.props.setFeatureExtractor(this.featureExtractor);
                this.props.setClassifier(this.classifier);
                this.props.setClassificationList(classificationList);
                this.props.setIsPredicting(this.isPredicting);

                //vm  Update vm

                let bakclassificationList = classificationList.map((obj) =>
                    Object.assign({}, obj, {
                        imageList: [].concat(obj.imageList),
                    })
                );
                this.props.vm.runtime.trainMode.setClassificationList(
                    bakclassificationList
                );
                this.props.vm.runtime.trainMode.setOptions(this.options);
                this.props.vm.runtime.trainMode.setIsTrain(true);
                //Repredict
                this.props.vm.runtime.trainMode.repredict();
                this.props.vm.refreshExtensionBlocks().then(() => {
                    this.props.vm.refreshWorkspace();
                });

                if (this.restoreOnFinish) {
                    this.restoreOnFinish();
                }
                this.setState({
                    restore: false,
                });
            }
        }
    }

    // Get a prediction for the current video frame
    classifyVideo() {
        if (this.resetting || this.props.hidden) return;
        if (this.state.hasWebcam) {
            try {
                this.classifier.classify(this.video, this.predictResult);
            } catch (error) {}
        }
    }

    //Predict result callback
    predictResult(err, results) {
        // The results are in an array ordered by confidence.
        console.log("predictResult:", results);
        if (results) {
            let v = results[0].label;
            const { classificationList } = this.state;

            results.map((item, i) => {
                let label = item.label;
                let confidence = item.confidence;
                let classification = classificationList[label];
                console.log(classificationList);
                classification.confidence = Number(confidence.toFixed(4));

                // If no image the the confidence is 0
                if (classification.imageList.length == 0) {
                    classification.confidence = 0;
                }
            });

            this.setState({
                predictionID: v,
                classificationList,
            });
        }
        setTimeout(() => {
            if (!this.resetting || this.props.hidden) {
                this.classifyVideo();
            }
        }, 1000);
    }

    changeState(e) {
        const stateToChange = e.target.id;
        this.setState({
            [stateToChange]: e.target.value,
        });
    }

    render() {
        const { hidden } = this.props;

        const {
            classificationList,
            predictionID,
            trainedClassificationCount,
            startPointList,
            endPoint,
            clearVisible,
            confirmVisible,
            createVisible,
            modelLoading,
            restore,
            hasWebcam,
        } = this.state;

        let classification = classificationList[predictionID];

        let curveLeft = {};
        let curveRight = {};

        startPointList.map((startPoint, i) => {
            let left = new SVGPath()
                .moveTo(startPoint.leftX, startPoint.leftY)
                .lineTo(endPoint.leftX, endPoint.leftY);
            curveLeft[i] = left;

            let right = new SVGPath()
                .moveTo(startPoint.rightX, startPoint.rightY)
                .lineTo(endPoint.rightX, endPoint.rightY + 64);
            curveRight[i] = right;
        });

        return (
            <div
                className={styles.modal}
                style={{ display: hidden ? "none" : "block" }}
            >
                <div className={styles.top}>
                    <div className={styles.topItem}></div>
                    <div className={styles.topItem}>
                        <div className={styles.title}>{this.title}</div>
                    </div>
                    <div
                        className={classNames(styles.topItem, styles.topRight)}
                    >
                        <div
                            className={styles.closeBtn}
                            onClick={this.handleClose}
                        >
                            <img
                                className={styles.closeIcon}
                                src={iconClose}
                            ></img>
                        </div>
                    </div>
                </div>
                <div className={styles.center}>
                    <div className={styles.centerLeft}>
                        <div className={styles.cameraContainer}>
                            <video
                                id="graphTrainVideo"
                                className={styles.camera}
                                width="100%"
                                height="100%"
                            ></video>
                        </div>
                    </div>
                    <div
                        id="centerBody"
                        className={styles.centerBody}
                        onScroll={this.handleScroll}
                    >
                        <div
                            id="leftBessel"
                            className={styles.leftBessel}
                            style={{
                                height:
                                    classificationList.length * 216 + 16 + "px",
                            }}
                        >
                            <svg style={{ width: "100%", height: "100%" }}>
                                {classificationList.map((item, i) => (
                                    <path
                                        key={i}
                                        d={curveLeft[i]}
                                        stroke={"#cfd1d2"}
                                        strokeWidth={2}
                                        fill={"transparent"}
                                    ></path>
                                ))}
                            </svg>
                        </div>
                        <div className={styles.classificationGroup}>
                            {classificationList.map((item, i) => (
                                <ImageClassification
                                    key={i}
                                    restore={restore}
                                    item={item}
                                    index={i}
                                    trainDisable={
                                        item.imageList.length >= 20 && hasWebcam
                                    }
                                    onNameChange={this.handleNameChange}
                                    onTrain={this.handleTrain}
                                    onReset={this.handleReset}
                                />
                            ))}
                        </div>
                        <div
                            id="rightBessel"
                            className={styles.rightBessel}
                            style={{
                                height:
                                    classificationList.length * 216 + 16 + "px",
                            }}
                        >
                            <svg style={{ width: "100%", height: "100%" }}>
                                {classificationList.map((item, i) => (
                                    <path
                                        key={i}
                                        d={curveRight[i]}
                                        stroke={
                                            i == predictionID
                                                ? "#95de64"
                                                : "#cfd1d2"
                                        }
                                        strokeWidth={2}
                                        fill={"transparent"}
                                    ></path>
                                ))}
                            </svg>
                        </div>
                    </div>
                    <div className={styles.centerRight}>
                        <div className={styles.resultContainer}>
                            <div className={styles.resultLabel}>
                                {this.result}
                            </div>
                            <div className={styles.resultValue}>
                                Predicted Name: {classification.name}
                            </div>
                            <div className={styles.resultValue}>
                                Confidence: {classification.confidence}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div
                        className={classNames(
                            styles.previous,
                            styles.button,
                            hasWebcam
                                ? styles.buttonEnable
                                : styles.buttonDisable
                        )}
                        onClick={this.handleCreateModel}
                    >
                        {this.newModel}
                    </div>
                    <div
                        className={classNames(
                            styles.button,
                            trainedClassificationCount ==
                                classificationList.length && hasWebcam
                                ? styles.buttonEnable
                                : styles.buttonDisable
                        )}
                        onClick={this.handleUseModel}
                    >
                        {this.usingModel}
                    </div>
                </div>
                {clearVisible ? (
                    <Prompt
                        id={"clearPrompt"}
                        showClose={false}
                        isDefaultLeft={true}
                        message={this.clearPrompt}
                        contentLabel={""}
                        cancelLabel={this.cancel}
                        okLabel={this.confirm}
                        onCancel={this.handleClearCancel}
                        onOk={this.handleClearOK}
                    ></Prompt>
                ) : null}
                {confirmVisible ? (
                    <Prompt
                        id={"confirmPrompt"}
                        showClose={false}
                        isDefaultLeft={true}
                        message={this.newModelPrompt}
                        contentLabel={""}
                        cancelLabel={this.cancel}
                        okLabel={this.confirm}
                        onCancel={this.handleConfirmCancel}
                        onOk={this.handleConfirmOK}
                    ></Prompt>
                ) : null}
                {createVisible ? (
                    <SelectPrompt
                        id={"createPrompt"}
                        showClose={false}
                        label={this.newModel}
                        message={this.modelCategoryNumber}
                        cancelLabel={this.cancel}
                        okLabel={this.confirm}
                        onCancel={this.handleCreateCancel}
                        onOk={this.handleCreateOK}
                    ></SelectPrompt>
                ) : null}
                {modelLoading ? (
                    <div className={styles.loading}>
                        <div className={styles.tip}>
                            {this.modelResourceLoading}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    classifier: state.scratchGui.trainMode.classifier,
    featureExtractor: state.scratchGui.trainMode.featureExtractor,
    options: state.scratchGui.trainMode.options,
    classificationList: state.scratchGui.trainMode.classificationList,
    isPredicting: state.scratchGui.trainMode.isPredicting,
});

const mapDispatchToProps = (dispatch) => ({
    closeTrainModalState: () => {
        dispatch(closeTrainModal());
    },
    setClassifier: (classifier) => {
        dispatch(setClassifier(classifier));
    },
    setFeatureExtractor: (featureExtractor) => {
        dispatch(setFeatureExtractor(featureExtractor));
    },
    setOptions: (options) => {
        dispatch(setOptions(options));
    },
    setClassificationList: (classificationList) => {
        dispatch(setClassificationList(classificationList));
    },
    setIsPredicting: (isPredicting) => {
        dispatch(setIsPredicting(isPredicting));
    },
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(GraphTrainingModal)
);
