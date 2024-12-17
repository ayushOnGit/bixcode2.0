importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");
importScripts("https://cdn.jsdelivr.net/npm/comlink/dist/umd/comlink.js");

let pyodide = null;

async function loadPyodideAndPackages() {
    try {
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
        });
        console.log("Pyodide loaded in worker");
        self.postMessage({ type: "pyodideStatus", status: "loaded" });
    } catch (error) {
        console.error("Error loading Pyodide:", error);
        self.postMessage({
            type: "pyodideStatus",
            status: "error",
            message: error.message,
        });
    }
}

// Redirect stdout and stderr
function redirectStdout() {
    let stdout = "";
    let stderr = "";

    function writeStdout(text) {
        stdout += text;
        self.postMessage({ type: "stdout", text }); // Post stdout messages
    }

    function writeStderr(text) {
        stderr += text;
        self.postMessage({ type: "stderr", text }); // Post stderr messages
    }

    return {
        writeStdout,
        writeStderr,
        getStdout: () => stdout,
        getStderr: () => stderr,
    };
}

function runPython(code) {
    if (!pyodide) {
        throw new Error("Pyodide is not loaded yet.");
    }

    try {
        // Load necessary Python packages if any
        // pyodide.loadPackagesFromImports(code);

        // Redirect stdout and stderr
        const sys = pyodide.pyimport("sys");
        let stdout = [];
        let stderr = [];

        // Store original stdout and stderr
        const originalStdout = sys.stdout;
        const originalStderr = sys.stderr;

        // Create Python objects to capture stdout and stderr
        sys.stdout = {
            write: (msg) => {
                self.postMessage({
                    type: "result",
                    msg: msg,
                    stdout: stdout,
                    stderr: stderr,
                });
            },
        };
        sys.stderr = {
            write: (msg) => {
                self.postMessage({
                    type: "result",
                    msg: msg,
                    stdout: stdout,
                    stderr: stderr,
                });
            },
        };

        // Run the Python code asynchronously
        const result = pyodide.runPython(code);
    } catch (error) {
        // Handle and send errors back to the main thread
        self.postMessage({ type: "stderr", text: `Error: ${error.message}` });
    }
}

self.onmessage = async (event) => {
    const { data } = event;
    if (data.type === "isTouchingObjectResult") {
        const result = data.result;
        // Process the result in Python
        self.postMessage({
            type: "isTouchingObjectResult",
        });
    }
};

async function moveSteps(steps, targetIndex) {
    self.postMessage({
        method: "moveSteps",
        steps: steps,
        targetIndex: targetIndex,
    });
}

async function turnRight(degrees, targetIndex) {
    self.postMessage({
        method: "turnRight",
        degrees: degrees,
        targetIndex: targetIndex,
    });
}
async function turnLeft(degrees, targetIndex) {
    self.postMessage({
        method: "turnRight",
        degrees: degrees,
        targetIndex: targetIndex,
    });
}

async function pointInDirection(degrees, targetIndex) {
    self.postMessage({
        method: "pointInDirection",
        degrees: degrees,
        targetIndex: targetIndex,
    });
}
async function goToXY(x, y, targetIndex) {
    self.postMessage({
        method: "goToXY",
        x: x,
        y: y,
        targetIndex: targetIndex,
    });
}

async function pointTowards(x, y, targetIndex) {
    self.postMessage({
        method: "pointTowards",
        x: x,
        y: y,
        targetIndex: targetIndex,
    });
}

async function glideTo(x, y, duration, targetIndex) {
    self.postMessage({
        method: "glideTo",
        x: x,
        y: y,
        duration: duration,
        targetIndex: targetIndex,
    });
}

async function changeX(change, targetIndex) {
    self.postMessage({
        method: "changeX",
        change: change,
        targetIndex: targetIndex,
    });
}

async function changeY(change, targetIndex) {
    self.postMessage({
        method: "changeY",
        change: change,
        targetIndex: targetIndex,
    });
}

async function setX(X, targetIndex) {
    self.postMessage({
        method: "setX",
        X: X,
        targetIndex: targetIndex,
    });
}

async function setY(Y, targetIndex) {
    self.postMessage({
        method: "setY",
        Y: Y,
        targetIndex: targetIndex,
    });
}

async function getX(targetIndex) {
    self.postMessage({
        method: "getX",
        targetIndex: targetIndex,
    });
}

async function getY(targetIndex) {
    self.postMessage({
        method: "getY",
        targetIndex: targetIndex,
    });
}

async function getDirection(targetIndex) {
    self.postMessage({
        method: "getDirection",
        targetIndex: targetIndex,
    });
}

async function ifOnEdgeBounce(targetIndex) {
    self.postMessage({
        method: "ifOnEdgeBounce",
        targetIndex: targetIndex,
    });
}

async function say(message, targetIndex) {
    self.postMessage({
        method: "say",
        message: message,
        targetIndex: targetIndex,
    });
}
async function think(message, targetIndex) {
    self.postMessage({
        method: "think",
        message: message,
        targetIndex: targetIndex,
    });
}
async function show(targetIndex) {
    self.postMessage({
        method: "show",
        targetIndex: targetIndex,
    });
}

async function hide(targetIndex) {
    self.postMessage({
        method: "hide",
        targetIndex: targetIndex,
    });
}

async function switchCostume(Costume, targetIndex) {
    self.postMessage({
        method: "switchCostume",
        Costume: Costume,
        targetIndex: targetIndex,
    });
}
async function nextCostume(targetIndex) {
    self.postMessage({
        method: "nextCostume",
        targetIndex: targetIndex,
    });
}
async function changeEffect(Effect, Change, targetIndex) {
    self.postMessage({
        method: "changeEffect",
        Effect: Effect,
        Change: Change,
        targetIndex: targetIndex,
    });
}

async function setEffect(Effect, Change, targetIndex) {
    self.postMessage({
        method: "setEffect",
        Effect: Effect,
        Change: Change,
        targetIndex: targetIndex,
    });
}
async function clearEffect(targetIndex) {
    self.postMessage({
        method: "clearEffect",
        targetIndex: targetIndex,
    });
}

async function changeSize(Change, targetIndex) {
    self.postMessage({
        method: "changeSize",
        Change: Change,
        targetIndex: targetIndex,
    });
}

async function setSize(Change, targetIndex) {
    self.postMessage({
        method: "setSize",
        Change: Change,
        targetIndex: targetIndex,
    });
}

async function goToFront(layer, targetIndex) {
    self.postMessage({
        method: "goToFront",
        Change: layer,
        targetIndex: targetIndex,
    });
}
async function isTouchingObject(object, targetIndex) {
    self.postMessage({
        method: "isTouchingObject",
        object: object,
        targetIndex: targetIndex,
    });
}
async function playSound(sound, storeWaiting, targetIndex) {
    self.postMessage({
        method: "playSound",
        sound: sound,
        storeWaiting: storeWaiting,
        targetIndex: targetIndex,
    });
}

async function stopAllSound(targetIndex) {
    self.postMessage({
        method: "stopAllSound",
        targetIndex: targetIndex,
    });
}

async function setEffectSound(Effect, Value, targetIndex) {
    self.postMessage({
        method: "setEffectSound",
        Effect: Effect,
        Value: Value,
        targetIndex: targetIndex,
    });
}

async function changeEffectSound(Effect, Value, targetIndex) {
    self.postMessage({
        method: "changeEffectSound",
        Effect: Effect,
        Value: Value,
        targetIndex: targetIndex,
    });
}
async function setVolume(volume, targetIndex) {
    self.postMessage({
        method: "setVolume",
        volume: volume,
        targetIndex: targetIndex,
    });
}
async function changeVolume(volume, targetIndex) {
    self.postMessage({
        method: "changeVolume",
        volume: volume,
        targetIndex: targetIndex,
    });
}
const api = {
    loadPyodideAndPackages,
    runPython,
    moveSteps,
    turnLeft,
    turnRight,
    glideTo,
    pointInDirection,
    pointTowards,
    goToXY,
    changeX,
    changeY,
    setX,
    setY,
};

Comlink.expose(api);

