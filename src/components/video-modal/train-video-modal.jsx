import React from "react";
import bindAll from "lodash.bindall";

import { connect } from "react-redux";

import classNames from "classnames";
import styles from "./train-video-modal.css";
import iconClose from "./image/icon_close.png";
import iconMinimize from "./image/icon_minimize.png";
import iconMaximize from "./image/icon_maximize.png";
import AudioCanvas from "./audio-canvas.jsx";
import { getUserMedia } from "./media.jsx";
import { defineMessages, injectIntl } from "react-intl";

import { closeTrainVideoModal } from "../../reducers/modals";

import { setClassificationList } from "../../reducers/train-mode";

const localMessages = defineMessages({
    recognitionWindow: {
        defaultMessage: "Recognition Window",
        description: "recognitionWindow",
        id: "gui.trainModal.recognitionWindow",
    },
    notSupportMediaDevices: {
        defaultMessage:
            "Your browser does not support access to your media devices",
        description: "notSupportMediaDevices",
        id: "gui.trainModal.notSupportMediaDevices",
    },
});

class TrainVideoModal extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, [
            "handleClose",
            "handleMinimize",
            "predictResult",
            "handleMouseDown",
            "handleMouseUp",
            "restoreWorkspaceRepredictCallback",
        ]);

        this.video;
        this.videoStreamTrack;
        this.audioStreamTrack;

        let classificationList = props.classificationList.map((obj) =>
            Object.assign({}, obj)
        );

        this.state = {
            classificationList,
            predictionID: 0,
            minimizeState: false, //Minimize
        };

        this.modelDiv;
        this.moving = false; //If moving
        this.isDestroy = false; //If the page is destroied
        //left  Max left for x
        this.maxLeft;
        //left  Min left for x
        this.minLeft = 0;
        //top  Max top for y
        this.maxTop;
        //top  Min top for y
        this.minTop = 45.5;

        this.recognitionWindow = props.intl.formatMessage(
            localMessages.recognitionWindow
        );
        this.notSupportMediaDevices = props.intl.formatMessage(
            localMessages.notSupportMediaDevices
        );

        // Retrain if there is saved model data while opening the workspace
        // props.vm.runtime.trainMode.setRestoreWorkspaceRepredictCallback(this.restoreWorkspaceRepredictCallback)
    }

    componentDidMount() {
        this.modelDiv = document.getElementById("train-modal");
    }

    componentWillUnmount() {
        this.isDestroy = true;
        this.handleClose();
    }

    componentWillReceiveProps(nextProps) {
        this.setClassificationListFromProps(nextProps);
    }

    restoreWorkspaceRepredictCallback() {
        this.setClassificationListFromProps(this.props);
        this.classifyVideo();
    }

    setClassificationListFromProps(props) {
        let classificationList = props.classificationList.map((obj) =>
            Object.assign({}, obj)
        );
        this.setState({
            classificationList,
        });
    }

    componentDidUpdate(prevProps) {
        //State changed means the hidden state will change
        if (this.props.hidden != prevProps.hidden) {
            if (!this.props.hidden) {
                //Check if media is supported
                if (
                    !navigator.mediaDevices ||
                    !navigator.mediaDevices.enumerateDevices
                ) {
                    // alert(this.notSupportMediaDevices);
                    return;
                }
                //Number of camera
                let videoNum = 0;
                //Number of microphone
                let microphoneNum = 0;
                navigator.mediaDevices
                    .enumerateDevices()
                    .then((devices) => {
                        //Iterate device list
                        devices.forEach((device) => {
                            if (device.kind === "videoinput") videoNum++;
                            if (device.kind === "audioinput") microphoneNum++;
                        });
                        console.log("video num[" + videoNum);
                        console.log("microphone[" + microphoneNum);
                        this.initMedia(videoNum > 0, microphoneNum > 0);
                    })
                    .catch(function (err) {
                        // alert(this.notSupportMediaDevices);
                    });
            }
        }
    }

    async initMedia(hasWebcam, hasMicrophone) {
        if (!hasWebcam && !hasMicrophone) return;
        this.video = document.getElementById("trainVideo");

        const constraints = {
            audio: hasMicrophone,
            video: hasWebcam ? { width: 260, height: 226 } : false,
        };

        try {
            const stream = await getUserMedia(constraints);
            if (hasWebcam) {
                this.videoStreamTrack = stream.getVideoTracks()[0];
                this.video.srcObject = stream;
                this.video.play();
                this.classifyVideo();
            }
            if (hasMicrophone) {
                this.audioStreamTrack = stream.getAudioTracks()[0];
            }
        } catch (error) {
            console.error("Error initializing media:", error);
        }
    }

    handleClose() {
        this.videoStreamTrack && this.videoStreamTrack.stop();
        this.audioStreamTrack && this.audioStreamTrack.stop();

        this.props.closeTrainVideoModalState();
        const { classificationList } = this.state;
        //redux  Update the classified result to redux
        this.props.setClassificationList(classificationList);
    }

    handleMinimize() {
        const { minimizeState } = this.state;
        this.setState({
            minimizeState: !minimizeState,
        });
    }

    handleMouseDown(e) {
        // e.stopPropagation();
        this.moving = true;
        //Size of the browser
        let clientWidth = document.documentElement.clientWidth;
        let clientHeight = document.documentElement.clientHeight;
        //modelThe size and offset of model
        let width = this.modelDiv.offsetWidth;
        let height = this.modelDiv.offsetHeight;

        this.maxLeft = clientWidth - width;
        this.maxTop = clientHeight - height;

        this.addx = e.clientX - this.modelDiv.offsetLeft;
        this.addy = e.clientY - this.modelDiv.offsetTop;

        this.modelDiv.style.cursor = "move";

        document.onmousemove = (e) => {
            if (this.moving) {
                let left = e.clientX - this.addx;
                let top = e.clientY - this.addy;
                if (left < this.minLeft) {
                    left = this.minLeft;
                }
                if (left > this.maxLeft) {
                    left = this.maxLeft;
                }
                if (top < this.minTop) {
                    top = this.minTop;
                }
                if (top > this.maxTop) {
                    top = this.maxTop;
                }

                this.modelDiv.style.left = left + "px";
                this.modelDiv.style.top = top + "px";
            }
        };

        document.onmouseup = () => {
            this.stopMove();
        };
    }

    handleMouseUp(e) {
        this.stopMove();
    }

    stopMove() {
        this.moving = false;
        this.modelDiv.style.cursor = "default";
        document.onmousemove = null;
    }

    // Get a prediction for the current video frame
    classifyVideo() {
        if (this.props.hidden || this.isDestroy) return;
        if (this.props.classifier && this.videoStreamTrack) {
            this.props.classifier.classify(this.video, this.predictResult);
        }
    }

    // When we get a result
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
                classification.confidence = Number(confidence.toFixed(4));
                //0  Confidence is 0 if no image
                if (classification.imageList.length == 0) {
                    classification.confidence = 0;
                }
            });

            this.setState({
                predictionID: v,
                classificationList,
            });
            //vm  Update the classified result to vm
            this.props.vm.runtime.trainMode.setClassificationList(
                classificationList
            );
            this.props.vm.runtime.trainMode.setPredictionID(v);

            setTimeout(() => {
                if (!this.props.hidden && !this.isDestroy) {
                    this.classifyVideo();
                }
            }, 1000);
        }
    }

    render() {
        const { hidden } = this.props;

        const { predictionID, minimizeState, classificationList } = this.state;

        let classification = classificationList[predictionID];
        //predictionID
        // PredictionID may go out of bound if retrain model during predicting, set it to 0 and restore after predict succeed.
        if (classification == null) {
            classification = classificationList[0];
        }

        let confidence = classification.confidence;
        if (classification == null) {
            confidence = 0;
        }
        let hundredConfidence = (confidence * 100).toFixed(2);

        return (
            <div
                id={"train-modal"}
                className={styles.modal}
                style={{
                    display: hidden ? "none" : "block",
                    height: minimizeState ? "56px" : "388px",
                }}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
            >
                <div
                    className={styles.top}
                    style={{
                        borderRadius: minimizeState ? "10px" : "10px 10px 0 0",
                    }}
                >
                    <div className={styles.title}>{this.recognitionWindow}</div>
                    <div className={styles.topRight}>
                        <div
                            className={styles.itemBtn}
                            onClick={this.handleMinimize}
                        >
                            <img
                                className={styles.minimizeIcon}
                                src={
                                    minimizeState ? iconMaximize : iconMinimize
                                }
                            ></img>
                        </div>
                        <div
                            className={styles.itemBtn}
                            onClick={this.handleClose}
                        >
                            <img
                                className={styles.closeIcon}
                                src={iconClose}
                            ></img>
                        </div>
                    </div>
                </div>
                <div
                    className={styles.body}
                    style={{ display: minimizeState ? "none" : "block" }}
                >
                    <div className={styles.cameraContainer}>
                        <video
                            id="trainVideo"
                            className={styles.camera}
                            width="260"
                            height="226"
                            muted="true"
                        ></video>
                    </div>

                    <div className={styles.progress}>
                        <div
                            className={classNames(
                                styles.blue,
                                confidence == 1 && styles.allBorderRadius
                            )}
                            style={{ width: confidence * 100 + "%" }}
                        ></div>
                        <div
                            className={classNames(
                                styles.gray,
                                confidence == 0 && styles.allBorderRadius
                            )}
                            style={{ width: (1 - confidence) * 100 + "%" }}
                        ></div>
                        <span className={styles.confidence}>
                            {" "}
                            {classification.name}（{hundredConfidence}%）
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    classifier: state.scratchGui.trainMode.classifier,
    classificationList: state.scratchGui.trainMode.classificationList,
});

const mapDispatchToProps = (dispatch) => ({
    closeTrainVideoModalState: () => {
        dispatch(closeTrainVideoModal());
    },
    setClassificationList: (classificationList) => {
        dispatch(setClassificationList(classificationList));
    },
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(TrainVideoModal)
);
