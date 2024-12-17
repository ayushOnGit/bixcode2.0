/**
 * AudioCanvas Component
 * Dynamically renders audio waveforms using the Web Audio API.
 * Created by j_bleach on 2018/8/1.
 * Updated for better performance, React practices, and debugging.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";

class AudioCanvas extends Component {
    constructor(props) {
        super(props);

        // React ref for managing canvas element
        this.canvasRef = React.createRef();

        // Internal state for managing animation and audio context
        this.audioCtx = null; // Audio context
        this.analyser = null; // Audio analyser
        this.canvasCtx = null; // Canvas context
        this.animationId = null; // Animation frame ID
    }

    componentDidMount() {
        this.initCanvas(); // Initialize canvas
    }

    componentWillUnmount() {
        this.stopAudioAnalyser(); // Cleanup resources
    }

    /**
     * Configures the canvas properties (size, background, stroke color).
     */
    configCanvas() {
        const { height, width, backgroundColor, strokeColor } = this.props;

        const canvas = this.canvasRef.current;
        if (!canvas) return;

        this.canvasCtx = canvas.getContext("2d");
        this.canvasCtx.clearRect(0, 0, width, height); // Clear canvas
        this.canvasCtx.fillStyle = backgroundColor; // Set background color
        this.canvasCtx.fillRect(0, 0, width, height); // Fill canvas
        this.canvasCtx.lineWidth = 2; // Set line width
        this.canvasCtx.strokeStyle = strokeColor; // Set stroke color
        this.canvasCtx.beginPath(); // Begin new path
    }

    /**
     * Initializes the canvas and stops any ongoing animation.
     */
    initCanvas() {
        window.cancelAnimationFrame(this.animationId); // Cancel previous animation
        const { height, width } = this.props;
        this.configCanvas();
        this.canvasCtx.moveTo(0, height / 2);
        this.canvasCtx.lineTo(width, height / 2);
        this.canvasCtx.stroke();
    }

    /**
     * Starts audio analysis and begins rendering the waveform.
     * @param {MediaStream} stream - The audio stream to analyze.
     */
    startAudioAnalyser(stream) {
        if (stream) {
            this.initAudioAnalyser(stream);
            this.renderCurve();
        }
    }

    /**
     * Stops audio analysis and cancels animation.
     */
    stopAudioAnalyser() {
        if (this.audioCtx) {
            this.audioCtx.close(); // Close audio context
            this.audioCtx = null;
        }
        window.cancelAnimationFrame(this.animationId); // Cancel animation
    }

    /**
     * Initializes the audio analyser with the provided stream.
     * @param {MediaStream} stream - The audio stream to analyze.
     */
    initAudioAnalyser(stream) {
        // Cleanup previous audio context
        if (this.audioCtx) {
            this.audioCtx.close();
        }

        this.audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)(); // Create new audio context
        this.analyser = this.audioCtx.createAnalyser(); // Create analyser
        this.analyser.fftSize = 1024; // Set FFT size
        const source = this.audioCtx.createMediaStreamSource(stream); // Create audio source
        source.connect(this.analyser); // Connect source to analyser
    }

    /**
     * Renders the audio waveform dynamically.
     */
    renderCurve() {
        const { height, width } = this.props;
        this.animationId = window.requestAnimationFrame(
            this.renderCurve.bind(this)
        ); // Schedule next frame

        const bufferLength = this.analyser.fftSize; // FFT size
        const dataArray = new Uint8Array(bufferLength); // Create array to hold audio data

        this.analyser.getByteTimeDomainData(dataArray); // Populate array with audio data
        this.configCanvas();

        const sliceWidth = Number(width) / bufferLength; // Calculate slice width
        let x = 0;

        this.canvasCtx.moveTo(x, height / 2); // Start drawing
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0; // Normalize value
            const y = (v * height) / 2; // Calculate y-coordinate
            this.canvasCtx.lineTo(x, y); // Draw line to coordinate
            x += sliceWidth; // Move x-coordinate
        }
        this.canvasCtx.lineTo(width, height / 2); // Finish path
        this.canvasCtx.stroke(); // Stroke the path
    }

    /**
     * Renders the canvas element.
     */
    renderCanvas() {
        const { height, width } = this.props;
        return (
            <canvas
                ref={this.canvasRef}
                height={height}
                width={width}
                style={{ width, height, borderRadius: 5 }}
            />
        );
    }

    render() {
        const { className } = this.props;
        return <div className={className}>{this.renderCanvas()}</div>;
    }
}

// Default props for the component
AudioCanvas.defaultProps = {
    backgroundColor: "rgba(0, 0, 0, 1)",
    strokeColor: "#ffffff",
    width: 200,
    height: 50,
};

// Prop types validation
AudioCanvas.propTypes = {
    backgroundColor: PropTypes.string,
    strokeColor: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string,
};

export default AudioCanvas;
