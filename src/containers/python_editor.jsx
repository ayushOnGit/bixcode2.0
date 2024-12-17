import React from "react";
import PropTypes, { string } from "prop-types";
import bindAll from "lodash.bindall";
import PythonEditorComponent from "../components/Python-editor/python_editor.jsx";
// import VM from "openblock-vm";
import * as Comlink from "comlink";
import SpriteController from "./SpriteObject.js"; // Adjust the import path

class PythonCode extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            "handleCodeEditorDidMount",
            "handleCodeEditorChange",
            "handleRunCode",
            "handleStopCode",
            "handleSelectedTabChange",
            "handleMoveSteps",
        ]);

        this.state = {
            result: null,
            worker: null,
            pyodideProxy: null,
            output: "", // To store real-time output from the worker
            pythonEditorValue: "",
            editorValues: {},
            selectedTab: null,
            previousTargetsCount: 0,
            targetIndex: null,
        };
    }

    async componentDidMount() {
        // Initialize the worker and Pyodide
        const worker = new Worker("../static/python_worker.worker.js");
        console.log(worker);
        this.setState({ worker });
        this.pyodideProxy = Comlink.wrap(worker);

        // Handle messages from the worker
        worker.onmessage = (event) => {
            const { data } = event;

            console.log(data);

            if (data.type === "pyodideStatus") {
                if (data.status === "loaded") {
                    console.log("Pyodide successfully loaded in worker.");
                } else if (data.status === "error") {
                    console.error(
                        "Error loading Pyodide in worker:",
                        data.message
                    );
                } else if (data.method === runPython) {
                    console.log("runPython executed");
                    console.log(data.method);
                }
            }
            // motion blocks events
            else if (data.method === "moveSteps") {
                this.handleMoveSteps(data.steps, data.targetIndex);
            } else if (data.method === "turnRight") {
                this.handleTurnRight(data.degrees, data.targetIndex);
            } else if (data.method === "turnLeft") {
                this.handleTurnLeft(data.degrees, data.targetIndex);
            } else if (data.method === "pointInDirection") {
                this.handlePointInDirection(data.degrees, data.targetIndex);
            } else if (data.method === "goToXY") {
                this.handlegoToXY(data.x, data.y, data.targetIndex);
            } else if (data.method === "pointTowards") {
                this.handlePointTowards(data.x, data.y, data.targetIndex);
            } else if (data.method === "glideTo") {
                this.handleGlideTo(
                    data.x,
                    data.y,
                    data.duration,
                    data.targetIndex
                );
            } else if (data.method === "changeX") {
                this.handleChangeX(data.change, data.targetIndex);
            } else if (data.method === "changeY") {
                this.handleChangeY(data.change, data.targetIndex);
            } else if (data.method === "setX") {
                this.handleSetX(data.X, data.targetIndex);
            } else if (data.method === "setY") {
                this.handleSetY(data.Y, data.targetIndex);
            } else if (data.method === "getX") {
                this.handlegetX(data.targetIndex);
            } else if (data.method === "getY") {
                this.handlegetY(data.targetIndex);
            } else if (data.method === "getDirection") {
                this.handlegetDirection(data.targetIndex);
            } else if (data.method === "ifOnEdgeBounce") {
                this.handleifOnEdgeBounce(data.targetIndex);
            }

            // Looks Blocks Events
            else if (data.method === "say") {
                this.handleSay(data.message, data.targetIndex);
            } else if (data.method === "think") {
                this.handleThink(data.message, data.targetIndex);
            } else if (data.method === "show") {
                this.handleShow(data.message, data.targetIndex);
            } else if (data.method === "hide") {
                this.handleHide(data.message, data.targetIndex);
            } else if (data.method === "switchCostume") {
                this.handleSwitchCostume(data.Costume, data.targetIndex);
            } else if (data.method === "nextCostume") {
                this.handleNextCostume(data.targetIndex);
            } else if (data.method === "changeEffect") {
                this.handleChangeEffect(
                    data.Effect,
                    data.Change,
                    data.targetIndex
                );
            } else if (data.method === "setEffect") {
                this.handleSetEffect(
                    data.Effect,
                    data.Change,
                    data.targetIndex
                );
            } else if (data.method === "clearEffect") {
                this.handleClearEffect(data.targetIndex);
            } else if (data.method === "changeSize") {
                this.handleChangeSize(data.Change, data.targetIndex);
            } else if (data.method === "setSize") {
                this.handleSetSize(data.Change, data.targetIndex);
            } else if (data.method === "goToFront") {
                this.handleGoToFront(data.layer, data.targetIndex);
            }
            // Sensing Blocks Event
            else if (data.method === "isTouchingObject") {
                this.handleisTouchingObject(data.object, data.targetIndex);
            } else if (data.method === "isTouchingResult") {
                this.handleisTouchingResult(data.result);
            }
            // sound blocks
            else if (data.method === "playSound") {
                this.handlePlaySound(
                    data.sound,
                    data.storeWaiting,
                    data.targetIndex
                );
            } else if (data.method === "setEffectSound") {
                this.handlesetEffectSound(
                    data.Effect,
                    data.Value,
                    data.targetIndex
                );
            } else if (data.method === "changeEffectSound") {
                this.handlesetEffectSound(
                    data.Effect,
                    data.Value,
                    data.targetIndex
                );
            } else if (data.method === "stopAllSound") {
                this.handleStopAllSound(data.targetIndex);
            } else if (data.method === "setVolume") {
                this.handleSetVolume(data.volume, data.targetIndex);
            } else if (data.method === "changeVolume") {
                this.handleChangeVolume(data.volume, data.targetIndex);
            } else if (data.type === "result") {
                console.log("Execution result:", data.msg);

                if (data.msg.length > 0) {
                    this.setState((prevState) => ({
                        output: data.msg, // Append new result to existing output
                    }));
                }
            }
        };

        // Load Pyodide in the worker
        try {
            await this.pyodideProxy.loadPyodideAndPackages();
            console.log("Pyodide loaded successfully");
        } catch (error) {
            console.error("Failed to load Pyodide:", error);
        }
    }

    componentWillUnmount() {
        // Terminate the worker when the component is unmounted
        if (this.state.worker) {
            this.state.worker.terminate();
        }
    }

    handleCodeEditorDidMount(editor) {
        const messageContribution = editor.getContribution(
            "editor.contrib.messageController"
        );
        if (messageContribution) {
            messageContribution.dispose();
        }

        editor.onDidAttemptReadOnlyEdit(() => {
            this.props.onCodeEditorIsLocked();
        });
    }

    handleSpriteChange = () => {
        const { vm } = this.props;
        const targets = vm.runtime.targets;

        // Check if a new target (sprite) has been added
        if (targets.length > this.state.previousTargetsCount) {
            const latestSprite = targets[targets.length - 1]; // Get the last added target
            if (latestSprite && !latestSprite.isStage) {
                // Ensure it's not the stage
                this.setState(
                    {
                        latestSpriteName: latestSprite.sprite.name, // Set the latest sprite's name
                        previousTargetsCount: targets.length, // Update the count of targets
                    },
                    () => {
                        console.log(
                            "This is real:",
                            this.state.latestSpriteName
                        ); // Log the latest sprite's name
                        this.handleAddTabForSprite(this.state.latestSpriteName); // Add a tab for the latest sprite
                    }
                );
            }
        }
    };

    handleAddTabForSprite = (spriteName) => {
        this.setState({ latestSpriteName: spriteName });
        this.props.onAddTab(spriteName);
    };

    handleCodeEditorChange(newValue) {
        const { selectedTab } = this.state;
        this.setState((prevState) => ({
            pythonEditorValue: newValue,
            editorValues: {
                ...prevState.editorValues,
                [selectedTab]: newValue,
            },
        }));
        this.props.onSetCodeEditorValue(newValue);
    }

    handleSelectedTabChange = (selectedTab) => {
        this.setState((prevState) => ({
            selectedTab,
            pythonEditorValue: prevState.editorValues[selectedTab] || "",
        }));
        this.props.onSetCodeEditorValue(
            this.state.editorValues[selectedTab] || ""
        );
    };

    async handleRunCode() {
        const { pyodideProxy, pythonEditorValue, selectedTab } = this.state;

        if (!this.pyodideProxy) {
            this.setState({ output: "Pyodide proxy is not initialized." });
            return;
        }

        if (!selectedTab) {
            this.setState({ output: "No tab selected." });
            return;
        }

        const targetIndex = this.props.vm.runtime.targets.findIndex(
            (target) => target.sprite.name === selectedTab.replace(".py", "")
        );

        if (targetIndex === -1) {
            this.setState({ output: "Selected sprite not found." });
            return;
        }

        this.setState({ targetIndex });

        try {
            const formattedCode = `
import sys
from io import StringIO

# Define stdout and stderr
stdout = StringIO()
stderr = StringIO()

class Sprite:
    def __init__(self, name):
        self.name = name
        self.position = 0

    def move_steps(self, steps):
        import js
        from js import moveSteps
        print(f"Moving {self.name} by {steps} steps.")
        moveSteps(steps, ${targetIndex})
    
    def turn_right(self, degrees):
        import js
        from js import turnRight
        print(f"Rotate {self.name} by {degrees} degrees.")
        turnRight(degrees, ${targetIndex})
    def turn_left(self, degrees):
        import js
        from js import turnLeft
        print(f"Rotate {self.name} by {degrees} degrees.")
        turnLeft(degrees, ${targetIndex})
    def inDirection(self, degrees):
        import js
        from js import pointInDirection
        print(f"Rotate {self.name} by {degrees} degrees.")
        pointInDirection(degrees, ${targetIndex})
    def goto(self,x,y):
        import js
        from js import goToXY
        print(f"Rotate {self.name} by {x,y} degrees.")
        goToXY(x,y, ${targetIndex})
    def pointTo(self,x,y):
        import js
        from js import pointTowards
        print(f"pointtowards {self.name} by {x,y} degrees.")
        pointTowards(x,y, ${targetIndex})
    def glideTo(self,x,y,duration=1):
        import js
        from js import glideTo
        print(f"pointtowards {self.name} by {x,y,duration} degrees.")
        glideTo(x,y,duration, ${targetIndex})
    
    def changeX(self,change):
        import js
        from js import changeX
        changeX(change, ${targetIndex})
    
    def changeY(self,change):
        import js
        from js import changeY
        changeY(change, ${targetIndex})
    
    def setX(self,X):
        import js
        from js import setX
        setX(X, ${targetIndex})
    
    def setY(self,Y):
        import js
        from js import setY
        setY(Y, ${targetIndex})
    
    def getX(self):
        import js
        from js import getX
        getX( ${targetIndex})
    
    def getY(self):
        import js
        from js import getY
        getY( ${targetIndex})
    
    def getDirection(self):
        import js
        from js import getDirection
        getDirection( ${targetIndex})
    
    def ifOnEdgeBounce(self):
        import js
        from js import ifOnEdgeBounce
        ifOnEdgeBounce(${targetIndex})  
    
    def say(self, message=None):
        import js
        from js import say
        if message == None:
            say("", ${targetIndex})
        else:   
            say(message, ${targetIndex})

    def think(self, message=None):
        import js
        from js import think
        if message == None:
            think("", ${targetIndex})
        else:   
            think(message, ${targetIndex})
    def show(self):
        import js
        from js import think,show,say
        say("",${targetIndex})
        think("", ${targetIndex})
        show(${targetIndex})
    
    def hide(self):
        import js
        from js import think,hide,say
        say("",${targetIndex})
        think("", ${targetIndex})
        hide(${targetIndex})
    
    def switchCostume(self,Costume):
        import js
        from js import switchCostume
        switchCostume(Costume,${targetIndex})
    
    def nextCostume(self):
        import js
        from js import nextCostume
        nextCostume(${targetIndex})
    
    def changeEffect(self,Effect,Change):
        import js
        from js import changeEffect
        changeEffect(Effect,Change,${targetIndex})
    def setEffect(self,Effect,Change):
        import js
        from js import setEffect
        setEffect(Effect,Change,${targetIndex})
    def clearEffect(self):
        import js
        from js import clearEffect
        clearEffect(${targetIndex})
    def changeSize(self,Change):
        import js
        from js import changeSize
        changeSize(Change,${targetIndex})
    def setSize(self,Size):
        import js
        from js import setSize
        setSize(Size,${targetIndex})
    def goToFront(self,layer):
        import js
        from js import goToFront
        goToFront(layer,${targetIndex})
    def isTouchingObject(self,object):
        import js
        from js import isTouchingObject
        isTouchingObject(object,${targetIndex})
    def isTochingResult(self,result):
        import js
        from js import isTouchingResult
        print(result)
        isTouchingResult(result)
    def playSound(self,sound,soundWaiting=False):
        import js
        from js import playSound
        playSound(sound,soundWaiting,${targetIndex})

    def stopAllSound(self):
        import js
        from js import stopAllSound
        stopAllSound(${targetIndex})

    def setEffectSound(self,Effect,Value):
        import js
        from js import setEffectSound
        setEffectSound(Effect,Value,${targetIndex})
    
    def changeEffectSound(self,Effect,Value):
        import js
        from js import setEffectSound
        setEffectSound(Effect,Value,${targetIndex})
    def setVolume(self, volume):
        import js
        from js import setVolume
        setVolume(volume,${targetIndex})
    def changeVolume(self, volume):
        import js
        from js import changeVolume
        changeVolume(volume,${targetIndex})
    
    
        
        
    
sprite = Sprite('${selectedTab.replace(".py", "")}')

try:
    exec("""
${pythonEditorValue.replace(/"/g, '\\"').replace(/\n/g, "\\n")}
    """)
except Exception as e:
    print(f"Error: {e}")
`;
            await this.pyodideProxy.runPython(formattedCode);
        } catch (error) {
            console.error("Execution error:", error);
            this.setState({ output: `Execution error: ${error.message}` });
        }
    }

    handleStopCode() {
        this.setState({ output: "Execution stopped." });
    }

    handleMoveSteps(steps, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }

        const target = this.props.vm.runtime.targets[targetIndex];

        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.moveSteps(steps);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handleTurnRight(degrees, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }

        const target = this.props.vm.runtime.targets[targetIndex];

        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.turnRight(degrees);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handleTurnLeft(degrees, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }

        const target = this.props.vm.runtime.targets[targetIndex];

        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.turnLeft(degrees);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handlePointInDirection(degrees, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }

        const target = this.props.vm.runtime.targets[targetIndex];

        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.pointInDirection(degrees);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handlegoToXY(x, y, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }

        const target = this.props.vm.runtime.targets[targetIndex];

        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.goToXY(x, y);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handlePointTowards(x, y, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }

        const target = this.props.vm.runtime.targets[targetIndex];

        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.pointTowards(x, y);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handleGlideTo(x, y, duration, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }

        const target = this.props.vm.runtime.targets[targetIndex];

        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.glideTo(x, y, duration);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handleChangeX(change, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }

        const target = this.props.vm.runtime.targets[targetIndex];

        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.changeX(change);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handleSetX(X, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }

        const target = this.props.vm.runtime.targets[targetIndex];

        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.setX(X);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handleChangeY(change, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }

        const target = this.props.vm.runtime.targets[targetIndex];

        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.changeY(change);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handleSetY(Y, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.setY(Y);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handlegetDirection(targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.getDirection();
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handlegetX(targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.getX();
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handlegetY(targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.getY();
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handleifOnEdgeBounce(targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.ifOnEdgeBounce();
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    // Looks blocks handle functions
    handleSay(message, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.say(message);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handleThink(message, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.think(message);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handleShow(message, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.show(message);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handleHide(message, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.hide(message);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handleSwitchCostume(costume, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.switchCostume(costume);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handleNextCostume(targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.nextCostume();
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handleChangeEffect(effect, change, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.changeEffect(effect, change);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handleSetEffect(effect, change, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.setEffect(effect, change);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handleClearEffect(targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.ClearEffect();
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handleChangeSize(change, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.changeSize(change);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handleSetSize(size, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.setSize(size);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handleGoToFront(layer, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.goToFront(layer);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }
    handleisTouchingObject(object, targetIndex) {
        const target = this.props.vm.runtime.targets[targetIndex];
        const spriteController = new SpriteController(
            this.props.vm,
            targetIndex
        );
        let result = "";
        const isTouching = target.isTouchingObject(object);
        if (isTouching === false) {
            result = "false";
        } else {
            result = "true";
        }
        pyodide.globals.set("js_result", result);
        console.log(pyodide.globals.get("js_result"));
        console.log(result);
        this.setState((prevState) => ({
            output: result, // Update the output state with the new result
        }));

        if (this.state.worker) {
            this.state.worker.postMessage({
                type: "isTouchingObjectResult",
                result: result,
            });
        }
    }

    handleisTouchingResult(result) {
        return result;
    }

    handlePlaySound(sound, storeWaiting, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        console.log(targetIndex);
        const target = this.props.vm.runtime.targets[targetIndex];
        console.log(target);
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController._playSound(sound, storeWaiting);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handlesetEffectSound(Effect, Value, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];

        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.setEffectSound(Effect, Value);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handlechangeEffectSound(Effect, Value, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];

        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.changeEffectSound(Effect, Value);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handleStopAllSound(targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        console.log(target);
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.stopAllSounds();
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handleSetVolume(volume, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        console.log(target);
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.setVolume(volume);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    handleChangeVolume(volume, targetIndex) {
        if (
            targetIndex === null ||
            targetIndex >= this.props.vm.runtime.targets.length
        ) {
            console.error("Invalid targetIndex:", targetIndex);
            return;
        }
        const target = this.props.vm.runtime.targets[targetIndex];
        console.log(target);
        if (target) {
            const spriteController = new SpriteController(
                this.props.vm,
                targetIndex
            );
            spriteController.changeVolume(volume);
        } else {
            console.error("Target is undefined at index:", targetIndex);
        }
    }

    render() {
        const { output, pythonEditorValue } = this.state;
        const { vm, ...props } = this.props;
        console.log("output value", output);
        return (
            <div>
                <PythonEditorComponent
                    pythonEditorLanguage="python"
                    pythonEditorOptions={{ readOnly: false }}
                    pythonEditorTheme="vs"
                    pythonEditorValue={pythonEditorValue}
                    onpythonEditorChange={this.handleCodeEditorChange}
                    onRun={this.handleRunCode}
                    onStop={this.handleStopCode}
                    output={output}
                    vmobj={vm.runtime.targets}
                    onSelectedTabChange={this.handleSelectedTabChange}
                    {...props}
                />
                {/* <div style={{ whiteSpace: "pre-wrap" }}>Output: {output}</div> */}
            </div>
        );
    }
}

PythonCode.propTypes = {
    pythonEditorValue: PropTypes.string,
    onSetCodeEditorValue: PropTypes.func.isRequired,
    // vm: PropTypes.instanceOf(VM).isRequired,
    onCodeEditorIsLocked: PropTypes.func,
    onAddTab: PropTypes.func,
};

export default PythonCode;
