import React, { useState, useEffect } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import styles from "./python-editor.css";

const usePyodide = () => {
    const [pyodideInstance, setPyodideInstance] = useState(null);

    useEffect(() => {
        const loadPyodideScript = async () => {
            if (!window.pyodide) {
                const script = document.createElement("script");
                script.src =
                    "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
                script.onload = async () => {
                    try {
                        window.pyodide = await window.loadPyodide({
                            indexURL:
                                "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
                        });
                        setPyodideInstance(window.pyodide);
                    } catch (error) {
                        console.error("Failed to load Pyodide:", error);
                    }
                };
                document.body.appendChild(script);
            } else {
                setPyodideInstance(window.pyodide);
            }
        };

        loadPyodideScript();
    }, []);

    return pyodideInstance;
};

const TerminalController = ({ onTerminalInput, output }) => {
    const [terminalLineData, setTerminalLineData] = useState([
        <TerminalOutput key="welcome">
            Welcome to the Python Terminal!
        </TerminalOutput>,
    ]);

    const pyodideInstance = usePyodide();

    useEffect(() => {
        if (output) {
            const currentLength = terminalLineData.length; // Use the current length to ensure unique keys
            const formattedOutput = output
                .split("\n")
                .filter((line) => line.trim() !== "") // Remove empty lines
                .map((line, index) => (
                    <TerminalOutput
                        key={`formatted-output-${currentLength + index}`}
                    >
                        {line}
                    </TerminalOutput>
                ));

            setTerminalLineData((prevData) => [
                ...prevData,
                ...formattedOutput,
            ]);
        }
    }, [output]); // Ensure the effect runs whenever the output prop changes

    const handleInput = async (input) => {
        console.log(`New terminal input received: '${input}'`);
        if (onTerminalInput) {
            onTerminalInput(input);
        }

        if (pyodideInstance) {
            try {
                const result = await pyodideInstance.runPythonAsync(input);
                console.log("Pyodide result:", result);

                const resultText =
                    result !== undefined && result !== null
                        ? result.toString().trim()
                        : "No result";

                const resultLines = resultText
                    .split("\n")
                    .filter((line) => line.trim() !== ""); // Remove empty lines

                const currentLength = terminalLineData.length; // Ensure unique keys for input and output

                setTerminalLineData((prevData) => [
                    ...prevData,
                    <TerminalOutput key={`input-${currentLength}`}>
                        {`>>> ${input}`}
                    </TerminalOutput>,
                    ...resultLines.map((line, index) => (
                        <TerminalOutput
                            key={`output-${currentLength}-${index}`}
                        >
                            {line}
                        </TerminalOutput>
                    )),
                ]);
            } catch (error) {
                console.error("Error executing Python code:", error);
                const currentLength = terminalLineData.length;

                setTerminalLineData((prevData) => [
                    ...prevData,
                    <TerminalOutput key={`input-${currentLength}`}>
                        {`>>> ${input}`}
                    </TerminalOutput>,
                    <TerminalOutput key={`error-${currentLength}`}>
                        {`Error: ${error.message}`}
                    </TerminalOutput>,
                ]);
            }
        } else {
            const currentLength = terminalLineData.length;

            setTerminalLineData((prevData) => [
                ...prevData,
                <TerminalOutput key={`input-${currentLength}`}>
                    {`>>> ${input}`}
                </TerminalOutput>,
                <TerminalOutput key={`not-ready-${currentLength}`}>
                    Pyodide not initialized yet.
                </TerminalOutput>,
            ]);
        }
    };

    return (
        <div className={styles.terminalWrapper}>
            <Terminal
              
                colorMode={ColorMode.Dark}
                onInput={handleInput}
                style={{ height: "100%", width: "100%" }}
            >
                {terminalLineData}
            </Terminal>
        </div>
    );
};

export default TerminalController;