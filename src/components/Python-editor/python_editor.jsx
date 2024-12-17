import React, { Component } from "react";
import PropTypes from "prop-types";
import Box from "../box/box.jsx";
import classNames from "classnames";
import CodeEditor from "../../containers/code-editor.jsx";
import styles from "./python-editor.css";
import icon from "./NoPyhton.png";
import fileicon from "./filebg1.png";
import NewTerminal from "./NewTerminal.jsx";

class PythonEditorComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabs: [],
            selectedTab: "",
            editorValues: {},
        };
    }

    componentDidMount() {
        const { vmobj } = this.props;

        if (vmobj && vmobj.length > 0) {
            const newTabs = vmobj
                .filter((target) => !target.isStage)
                .map((target) => `${target.sprite.name}.py`);

            this.setState((prevState) => ({
                tabs: [
                    ...prevState.tabs,
                    ...newTabs.filter((tab) => !prevState.tabs.includes(tab)),
                ],
                selectedTab: prevState.selectedTab || newTabs[0],
            }));
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { onSelectedTabChange, selectedTab, vmobj } = this.props;

        // Check if selected tab changed and call onSelectedTabChange if so
        if (onSelectedTabChange && prevState.selectedTab !== this.state.selectedTab) {
            onSelectedTabChange(this.state.selectedTab);
        }

        // Update tabs when vmobj changes
        if (vmobj !== prevProps.vmobj && vmobj && vmobj.length > 0) {
            const newTabs = vmobj
                .filter((target) => !target.isStage)
                .map((target) => `${target.sprite.name}.py`);

            this.setState((prevState) => ({
                tabs: [
                    ...prevState.tabs,
                    ...newTabs.filter((tab) => !prevState.tabs.includes(tab)),
                ],
                selectedTab: prevState.selectedTab || newTabs[0],
            }));
        }
    }

    handleTabClick = (tab) => {
        this.setState({ selectedTab: tab });
    };

    handleEditorChange = (value) => {
        const { selectedTab } = this.state;
        const { onpythonEditorChange } = this.props;

        if (selectedTab) {
            this.setState((prevState) => ({
                editorValues: { ...prevState.editorValues, [selectedTab]: value },
            }));

            // Call onpythonEditorChange if defined
            if (onpythonEditorChange) {
                onpythonEditorChange(value);
            }
        }
    };

    handleTerminalInput = (input) => {
        console.log(`Input from terminal: ${input}`);
    };

    render() {
        const {
            pythonEditorLanguage,
            pythonEditorOptions,
            pythonEditorTheme,
            onpythonEditorWillMount,
            onpythonEditorDidMount,
            onRun,
            output,
        } = this.props;

        const { tabs, selectedTab, editorValues } = this.state;

        return (
            <Box className={classNames(styles.pythonwrapper)}>
                <Box className={classNames(styles.editorSelector)}>
                    <Box className={classNames(styles.fileSelector)}>
                        <Box
                            style={{
                                backgroundColor: "#1f3a93",
                                color: "white",
                                borderRadius: "2px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                marginTop: "2px",
                                fontSize: "12px",
                                padding: "6px 6px",
                                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                fontWeight: "bold",
                            }}
                        >
                            <img
                                src={fileicon}
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    marginRight: "8px",
                                }}
                                alt="File icon"
                            />
                            Project Files
                        </Box>

                        {tabs.map((tab, index) => (
                            <div
                                key={index}
                                style={{
                                    color: selectedTab === tab ? "red" : "blue",
                                }}
                                onClick={() => this.handleTabClick(tab)}
                            >
                                <button
                                    style={{
                                        width: "150px",
                                        height: "40px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        padding: "6px 6px",
                                        backgroundColor: selectedTab === tab ? "#1f3a93" : "#5984c0",
                                        color: "white",
                                        border: "1px solid #b3b3b3",
                                        borderRadius: "15px",
                                        cursor: "pointer",
                                        fontWeight: selectedTab === tab ? "bold" : "normal",
                                        fontSize: "12px",
                                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                        transition: "background-color 0.3s ease, color 0.3s ease",
                                        marginTop: "2px",
                                        marginLeft: "5px",
                                        marginRight: "5px",
                                        outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    <img
                                        src={icon}
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            marginRight: "5px",
                                        }}
                                        alt="Tab icon"
                                    />
                                    {tab}
                                </button>
                            </div>
                        ))}
                    </Box>

                    <Box className={classNames(styles.pythonCodeeditorwrapper)}>
                        <CodeEditor
                            width={870}
                            value={editorValues[selectedTab] || ""}
                            language={pythonEditorLanguage}
                            editorWillMount={onpythonEditorWillMount}
                            editorDidMount={onpythonEditorDidMount}
                            onChange={this.handleEditorChange}
                            theme={pythonEditorTheme}
                            options={pythonEditorOptions}
                        />
                    </Box>
                </Box>
                <Box className={classNames(styles.pythonConsoleWrapper)}>
                    <Box className={classNames(styles.consoleArray)}>
                        <NewTerminal
                            output={output}
                            onRun={onRun}
                            style={{ outline: "none" }}
                        />
                    </Box>
                </Box>
            </Box>
        );
    }
}

PythonEditorComponent.propTypes = {
    pythonEditorLanguage: PropTypes.string,
    pythonEditorOptions: PropTypes.shape({
        highlightActiveIndentGuide: PropTypes.bool,
        cursorSmoothCaretAnimation: PropTypes.bool,
        contextmenu: PropTypes.bool,
        minimap: PropTypes.shape({
            enabled: PropTypes.bool,
        }),
    }),
    pythonEditorTheme: PropTypes.string,
    pythonEditorValue: PropTypes.string,
    ispythonEditorLocked: PropTypes.bool,
    onpythonEditorWillMount: PropTypes.func,
    onpythonEditorDidMount: PropTypes.func,
    onpythonEditorChange: PropTypes.func,
    onRun: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    output: PropTypes.string,
    vmobj: PropTypes.array,
    onSelectedTabChange: PropTypes.func.isRequired,
};

export default PythonEditorComponent;
