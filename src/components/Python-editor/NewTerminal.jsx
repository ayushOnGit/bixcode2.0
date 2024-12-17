import React, { Component, createRef } from "react";
import "./NewTerminal.css"; // Import the CSS file
import terminal from "./terminal-logo.png";
import stop from "./stop.png";
import deleted from "./delete.png";
import run from "./run.png";

class NewTerminal extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            terminalLines: [`${this.props.prompt || ">>"} ${this.props.welcomeMessage || "Welcome to the Python Terminal!"}`],
            currentInput: "",
            isFocused: false,
            pyodideInstance: null
        };

        this.terminalRef = createRef();
        this.inputRef = createRef();
    }

    componentDidMount() {
        this.loadPyodideScript();
        document.addEventListener("keydown", this.handleKeyDown);
    }

    componentDidUpdate(prevProps) {
        if (this.terminalRef.current) {
            this.terminalRef.current.scrollTop = this.terminalRef.current.scrollHeight;
        }

        if (this.props.output && this.props.output !== prevProps.output) {
            const formattedOutput = this.props.output
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line) => `${this.props.prompt || ">>"} ${line}`);

            this.setState((prevState) => ({
                terminalLines: [...prevState.terminalLines, ...formattedOutput]
            }));
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    loadPyodideScript = async () => {
        if (!window.pyodide) {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
            script.onload = async () => {
                try {
                    window.pyodide = await window.loadPyodide({
                        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/"
                    });
                    this.setState({ pyodideInstance: window.pyodide });
                } catch (error) {
                    console.error("Failed to load Pyodide:", error);
                }
            };
            document.body.appendChild(script);
        } else {
            this.setState({ pyodideInstance: window.pyodide });
        }
    };

    handleInput = async (input) => {
        if (input.trim().toLowerCase() === "clear") {
            this.setState({
                terminalLines: [`${this.props.prompt || ">>"} ${this.props.welcomeMessage || "Welcome to the Python Terminal!"}`]
            });
            return;
        }

        const { pyodideInstance } = this.state;

        if (pyodideInstance) {
            try {
                const result = await pyodideInstance.runPythonAsync(input);
                const resultText = result !== undefined && result !== null ? result.toString().trim() : "No result";
                const resultLines = resultText.split("\n").filter((line) => line.trim() !== "");

                this.setState((prevState) => ({
                    terminalLines: [
                        ...prevState.terminalLines,
                        `${this.props.prompt || ">>"} ${input}`,
                        ...resultLines.map((line) => `${this.props.prompt || ">>"} ${line}`)
                    ]
                }));
            } catch (error) {
                this.setState((prevState) => ({
                    terminalLines: [
                        ...prevState.terminalLines,
                        `${this.props.prompt || ">>"} ${input}`,
                        `${this.props.prompt || ">>"} Error: ${error.message}`
                    ]
                }));
            }
        } else {
            this.setState((prevState) => ({
                terminalLines: [
                    ...prevState.terminalLines,
                    `${this.props.prompt || ">>"} ${input}`,
                    `${this.props.prompt || ">>"} Pyodide not initialized yet.`
                ]
            }));
        }

        // Trigger onInput callback if provided
        if (this.props.onInput) {
            this.props.onInput(input);
        }
    };

    handleKeyDown = (e) => {
        if (!this.state.isFocused) return;

        if (e.key === "Enter") {
            const input = this.state.currentInput.trim();
            if (input) {
                this.handleInput(input);
                this.setState({ currentInput: "" });
            }
        } else if (e.key.length === 1) {
            this.setState((prevState) => ({ currentInput: prevState.currentInput + e.key }));
        } else if (e.key === "Backspace") {
            this.setState((prevState) => ({ currentInput: prevState.currentInput.slice(0, -1) }));
        }
    };

    handleRun = () => {
        const input = this.state.currentInput.trim();
        if (input) {
            this.handleInput(input);
            this.setState({ currentInput: "" });
        }
    };

    handleStop = () => {
        this.setState((prevState) => ({
            terminalLines: [...prevState.terminalLines, `${this.props.prompt || ">>"} Stopped.`]
        }));
    };

    handleClear = () => {
        this.setState({
            terminalLines: [`${this.props.prompt || ">>"} ${this.props.welcomeMessage || "Welcome to the Python Terminal!"}`]
        });
    };

    handleFocus = () => {
        this.setState({ isFocused: true });
        this.inputRef.current.focus();
    };

    handleBlur = () => {
        this.setState({ isFocused: false });
    };

    render() {
        const { terminalLines, currentInput } = this.state;

        return (
            <div
                className="terminal-container"
                tabIndex={0}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                style={{
                    outline: "2px solid #1f3a93",
                    position: "relative",
                    borderRadius: "0.5rem"
                }}
            >
                <div className="terminal-header" style={{ display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#1f3a93",
                    padding: "6px 20px",
                    borderRadius: "0.5rem",
                    marginTop: "2px", }}>
                    <span style={{ color: "white",
                        fontWeight: "bold",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        margin: "0", }}>
                        <img src={terminal} alt="Terminal Logo" style={{  width: "20px",
                            height: "20px",
                            marginRight: "10px", }} />
                        Console
                    </span>
                    <div className="terminal-buttons">
                        <div onClick={this.handleRun} style={{ cursor: "pointer",
                                display: "inline-block",
                                backgroundColor: "transparent",
                                padding: 0,
                                margin: 0,
                                border: "none", }}>
                            <img src={run} style={{width: "22px",
                                    height: "22px",
                                    marginRight: "10px",}} alt="Run" onClick={this.props.onRun} />
                        </div>
                        <div onClick={this.handleStop} style={{ cursor: "pointer",
                                display: "inline-block",
                                backgroundColor: "transparent",
                                padding: 0,
                                margin: 0,
                                border: "none", }}>
                            <img src={stop} alt="Stop" style={{ width: "25px",
                                    height: "25px",
                                    marginRight: "5px",}} />
                        </div>
                        <div onClick={this.handleClear} style={{  cursor: "pointer",
                                display: "inline-block",
                                backgroundColor: "transparent",
                                padding: 0,
                                margin: 0,
                                border: "none", }}>
                            <img src={deleted} alt="Clear" style={{width: "25px",
                                    height: "25px",
                                    marginRight: "5px",}} />
                        </div>
                    </div>
                </div>

                <div ref={this.terminalRef} className="terminal-output" style={{ 
                    fontSize: "15px",
                    color: "gray",
                    height: "300px", // Fixed height to ensure scrolling
                    overflowY: "scroll", // Scrollbar enabled
                    padding: "10px",
                    backgroundColor: "white", // Black background for terminal
                    borderRadius: "0.5rem", // To match the header
                    border: "1px solid #1f3a93", // Border for terminal window
                 }}>
                    {terminalLines.map((line, index) => (
                        <div key={index}>{line}</div>
                    ))}
                    <div>
                        {this.props.prompt || ">>"} <span>{currentInput}</span>
                        <span className="blinking-cursor"></span>
                    </div>
                </div>
                
                <input
                    ref={this.inputRef}
                    type="text"
                    style={{ position: "absolute", opacity: 0, top: 0, left: 0 }}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onKeyDown={this.handleKeyDown}
                />
            </div>
        );
    }
}

export default NewTerminal;
