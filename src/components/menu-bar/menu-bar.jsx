import classNames from "classnames";
import { connect } from "react-redux";
import { compose } from "redux";
import {
    defineMessages,
    FormattedMessage,
    injectIntl,
    intlShape,
} from "react-intl";

import PropTypes from "prop-types";
import bindAll from "lodash.bindall";
import bowser from "bowser";
import React, { useState } from "react";
import { Component } from "react";
import VM from "openblock-vm";
import FileUploadForm from "../upload-section/upload.jsx";
import Box from "../box/box.jsx";
import Button from "../button/button.jsx";
import CommunityButton from "./community-button.jsx"; // eslint-disable-line no-unused-vars
import ShareButton from "./share-button.jsx"; // eslint-disable-line no-unused-vars
import { ComingSoonTooltip } from "../coming-soon/coming-soon.jsx";
import Divider from "../divider/divider.jsx";
import LanguageSelector from "../../containers/language-selector.jsx";
import SaveStatus from "./save-status.jsx"; // eslint-disable-line no-unused-vars
import ProjectWatcher from "../../containers/project-watcher.jsx"; // eslint-disable-line no-unused-vars
import MenuBarMenu from "./menu-bar-menu.jsx";
import { MenuItem, MenuSection } from "../menu/menu.jsx";
import ProjectTitleInput from "./project-title-input.jsx";
import AuthorInfo from "./author-info.jsx";
import AccountNav from "../../containers/account-nav.jsx"; // eslint-disable-line no-unused-vars
import LoginDropdown from "./login-dropdown.jsx"; // eslint-disable-line no-unused-vars
import SB3Downloader from "../../containers/sb3-downloader.jsx";
import DeletionRestorer from "../../containers/deletion-restorer.jsx";
import TurboMode from "../../containers/turbo-mode.jsx";
import MenuBarHOC from "../../containers/menu-bar-hoc.jsx";
import { isScratchDesktop } from "../../lib/isScratchDesktop";
import { UPDATE_MODAL_STATE } from "../../lib/update-state.js";

import {
    openTipsLibrary,
    openUploadProgress,
    openUpdateModal,
    openConnectionModal,
    openDeviceLibrary,
} from "../../reducers/modals";
import { setPlayer } from "../../reducers/mode";
import {
    autoUpdateProject,
    getIsUpdating,
    getIsShowingProject,
    manualUpdateProject,
    requestNewProject,
    remixProject,
    saveProjectAsCopy,
} from "../../reducers/project-state";
import {
    openAboutMenu,
    closeAboutMenu,
    aboutMenuOpen,
    openAccountMenu,
    closeAccountMenu,
    accountMenuOpen,
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openSettingMenu,
    closeSettingMenu,
    settingMenuOpen,
    openLanguageMenu,
    closeLanguageMenu,
    languageMenuOpen,
    openLoginMenu,
    closeLoginMenu,
    loginMenuOpen,
} from "../../reducers/menus";
import { setStageSize } from "../../reducers/stage-size";
import { setUploadMode, setRealtimeMode } from "../../reducers/program-mode";
import {
    setRealtimeConnection,
    clearConnectionModalPeripheralName,
} from "../../reducers/connection-modal";
import { setUpdate } from "../../reducers/update";
import { STAGE_SIZE_MODES } from "../../lib/layout-constants";

import collectMetadata from "../../lib/collect-metadata";

import styles from "./menu-bar.css";

import helpIcon from "../../lib/assets/icon--tutorials.svg";
import mystuffIcon from "./icon--mystuff.png"; // eslint-disable-line no-unused-vars
import profileIcon from "./icon--profile.png"; // eslint-disable-line no-unused-vars
import remixIcon from "./icon--remix.svg";
import dropdownCaret from "./dropdown-caret.svg";
import languageIcon from "../language-selector/language-icon.svg";
import aboutIcon from "./icon--about.svg";
import saveIcon from "./icon--save.svg";
import linkSocketIcon from "./icon--link-socket.svg"; // eslint-disable-line no-unused-vars
import communityIcon from "./icon--community.svg";
import wikiIcon from "./icon--wiki.svg";

import scratchLogo from "./scratch-logo.svg";

import sharedMessages from "../../lib/shared-messages";

import Switch from "react-switch";

import deviceIcon from "./icon--device.svg";
import unconnectedIcon from "./icon--unconnected.svg";
import connectedIcon from "./icon--connected.svg";
import screenshotIcon from "./icon--screenshot.svg";
import settingIcon from "./icon--setting.svg";

import uploadFirmwareIcon from "./icon--upload-firmware.svg";
import saveSvgAsPng from "openblock-save-svg-as-png";
import { showAlertWithTimeout } from "../../reducers/alerts";
import SignIn from "../signin/signin.jsx";

const ariaMessages = defineMessages({
    language: {
        id: "gui.menuBar.LanguageSelector",
        defaultMessage: "language selector",
        description: "accessibility text for the language selection menu",
    },
    tutorials: {
        id: "gui.menuBar.tutorialsLibrary",
        defaultMessage: "Tutorials",
        description: "accessibility text for the tutorials button",
    },
    community: {
        id: "gui.menuBar.community",
        defaultMessage: "Open Community",
        description: "accessibility text for the community button",
    },
    wiki: {
        id: "gui.menuBar.wiki",
        defaultMessage: "Wiki",
        description: "accessibility text for the wiki button",
    },
});

const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = "bottom",
}) => {
    if (enable) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};

MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};

const MenuItemTooltip = ({ id, isRtl, children, className }) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        isRtl={isRtl}
        place={isRtl ? "left" : "right"}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    isRtl: PropTypes.bool,
};

const AboutButton = (props) => (
    <Button
        className={classNames(styles.menuBarItem, styles.hoverable)}
        iconClassName={styles.aboutIcon}
        iconSrc={aboutIcon}
        onClick={props.onClick}
    />
);

const RedirectButton = ({ url, label }) => {
    const handleClick = () => {
        window.location.href = url; // Redirects to the specified URL
    };

    return (
        <button onClick={handleClick} className="redirect-button">
            {label}
        </button>
    );
};

AboutButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

class UploadButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
        };
    }

    // Handle button click to show the modal
    handleClick = () => {
        this.setState({ modal: true });
    };

    // Handle closing the modal
    closeModal = () => {
        this.setState({ modal: false });
    };

    render() {
        const { modal } = this.state;

        const modalStyles = {
            overlay: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            popup: {
                position: "relative",
                width: "500px",
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
            },
            closeButton: {
                position: "absolute",
                top: "10px",
                right: "10px",
                fontSize: "20px",
                cursor: "pointer",
                border: "none",
                backgroundColor: "transparent",
            },
        };

        return (
            <div>
                <button
                    onClick={this.handleClick}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "5px",
                    }}
                >
                    <img
                        src="https://www.svgrepo.com/show/5500/upload-file.svg"
                        style={{ width: "30px", height: "20px" }}
                        alt="Upload"
                    />
                    Upload files
                </button>

                {/* Conditionally render the modal popup */}
                {modal && (
                    <div style={modalStyles.overlay}>
                        <div style={modalStyles.popup}>
                            {/* Cross button in the top-right corner */}
                            <button
                                onClick={this.closeModal}
                                style={modalStyles.closeButton}
                            >
                                &times;
                            </button>

                            <FileUploadForm />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const user = JSON.parse(localStorage.getItem("user") || "null");
// console.log(user);

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            showLogoutConfirmation: false,
        };
    }

    handleClick = () => {
        this.setState({ modal: true });
    };

    handleLogout = () => {
        localStorage.removeItem("user");
        console.log("User has been logged out successfully.");
        this.closeModal();
    };

    closeModal = () => {
        this.setState({ modal: false, showLogoutConfirmation: false });
    };

    showLogoutConfirmation = () => {
        this.setState({ showLogoutConfirmation: true });
    };

    render() {
        const { modal, showLogoutConfirmation } = this.state;

        const modalStyles = {
            overlay: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            popup: {
                position: "relative",
                width: "80%",
                maxWidth: "800px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                overflow: "hidden",
                padding: "20px",
            },
            closeButton: {
                position: "absolute",
                top: "10px",
                right: "10px",
                fontSize: "20px",
                cursor: "pointer",
                border: "none",
                backgroundColor: "transparent",
            },
        };

        const user = JSON.parse(localStorage.getItem("user") || "null");

        return (
            <div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "5px",
                    }}
                    onClick={this.handleClick}
                >
                    <h3 style={{ color: "white" }}>
                        {/* Show the user's name if signed in, otherwise "Sign In" */}
                        {user && (user.name || user.displayName || user.email)
                            ? `Hello, ${
                                  user.name.split[0] ||
                                  user.displayName ||
                                  user.email.split("@")[0]
                              }`
                            : "Sign In"}
                    </h3>
                </div>

                {modal && (
                    <div style={modalStyles.overlay}>
                        <div style={modalStyles.popup}>
                            <button
                                onClick={this.closeModal}
                                style={modalStyles.closeButton}
                            >
                                &times;
                            </button>
                            {user ? (
                                showLogoutConfirmation ? (
                                    <div>
                                        <p
                                            style={{
                                                textAlign: "center",
                                                fontSize: "18px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            Are you sure you want to log out?
                                        </p>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-around",
                                                marginTop: "20px",
                                            }}
                                        >
                                            <button
                                                onClick={this.handleLogout}
                                                style={{
                                                    padding: "10px 20px",
                                                    fontSize: "16px",
                                                    fontWeight: "500",
                                                    borderRadius: "5px",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    backgroundColor: "#e74c3c",
                                                    color: "#fff",
                                                }}
                                            >
                                                Yes, Log Out
                                            </button>
                                            <button
                                                onClick={() =>
                                                    this.setState({
                                                        showLogoutConfirmation: false,
                                                    })
                                                }
                                                style={{
                                                    padding: "10px 20px",
                                                    fontSize: "16px",
                                                    fontWeight: "500",
                                                    borderRadius: "5px",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    backgroundColor: "#3498db",
                                                    color: "#fff",
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "center" }}>
                                        <p
                                            style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            Hello,{" "}
                                            {user.name ||
                                                user.displayName ||
                                                user.email.split("@")[0]}
                                            ! Ready to log out?
                                        </p>
                                        <button
                                            onClick={
                                                this.showLogoutConfirmation
                                            }
                                            style={{
                                                padding: "10px 20px",
                                                fontSize: "16px",
                                                fontWeight: "500",
                                                borderRadius: "5px",
                                                border: "none",
                                                cursor: "pointer",
                                                backgroundColor: "#e74c3c",
                                                color: "#fff",
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )
                            ) : (
                                <SignIn closeModal={this.closeModal} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

// Define styles for the modal popup
// const modalStyles = {
//     overlay: {
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 1000,
//     },
//     popup: {
//         backgroundColor: "#fff",
//         padding: "20px",
//         borderRadius: "8px",
//         boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//         width: "500px",
//         textAlign: "center",
//     },
// };

class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            "handleClickNew",
            "handleClickRemix",
            "handleClickOpenCommunity",
            "handleClickOpenWiki",
            "handleClickSave",
            "handleClickSaveAsCopy",
            "handleClickSeeCommunity",
            "handleClickShare",
            "handleKeyPress",
            "handleLanguageMouseUp",
            "handleRestoreOption",
            "getSaveToComputerHandler",
            "restoreOptionMessage",
            "handleConnectionMouseUp",
            "handleUploadFirmware",
            "handleSelectDeviceMouseUp",
            "handleProgramModeSwitchOnChange",
            "handleProgramModeUpdate",
            "handleScreenshot",
            "handleCheckUpdate",
            "handleClearCache",
        ]);
    }
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);
        this.props.vm.on("PERIPHERAL_DISCONNECTED", this.props.onDisconnect);
        this.props.vm.on("PROGRAM_MODE_UPDATE", this.handleProgramModeUpdate);
        window.removeEventListener("storage", this.handleStorageChange);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
        this.props.vm.removeListener(
            "PERIPHERAL_DISCONNECTED",
            this.props.onDisconnect
        );
        this.props.vm.removeListener(
            "PROGRAM_MODE_UPDATE",
            this.handleProgramModeUpdate
        );
        window.removeEventListener("storage", this.handleStorageChange);
    }
    handleClickNew() {
        // if the project is dirty, and user owns the project, we will autosave.
        // but if they are not logged in and can't save, user should consider
        // downloading or logging in first.
        // Note that if user is logged in and editing someone else's project,
        // they'll lose their work.
        const readyToReplaceProject = this.props.confirmReadyToReplaceProject(
            this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
        );
        this.props.onRequestCloseFile();
        if (readyToReplaceProject) {
            this.props.onClickNew(
                this.props.canSave && this.props.canCreateNew
            );
        }
        this.props.onRequestCloseFile();
    }
    handleClickRemix() {
        this.props.onClickRemix();
        this.props.onRequestCloseFile();
    }
    handleClickSave() {
        this.props.onClickSave();
        this.props.onRequestCloseFile();
    }
    handleClickSaveAsCopy() {
        this.props.onClickSaveAsCopy();
        this.props.onRequestCloseFile();
    }
    handleClickSeeCommunity(waitForUpdate) {
        if (this.props.shouldSaveBeforeTransition()) {
            this.props.autoUpdateProject(); // save before transitioning to project page
            waitForUpdate(true); // queue the transition to project page
        } else {
            waitForUpdate(false); // immediately transition to project page
        }
    }
    handleClickShare(waitForUpdate) {
        if (!this.props.isShared) {
            if (this.props.canShare) {
                // save before transitioning to project page
                this.props.onShare();
            }
            if (this.props.canSave) {
                // save before transitioning to project page
                this.props.autoUpdateProject();
                waitForUpdate(true); // queue the transition to project page
            } else {
                waitForUpdate(false); // immediately transition to project page
            }
        }
    }
    handleRestoreOption(restoreFun) {
        return () => {
            restoreFun();
            this.props.onRequestCloseEdit();
        };
    }
    handleKeyPress(event) {
        const modifier = bowser.mac ? event.metaKey : event.ctrlKey;
        if (modifier && event.key === "s") {
            this.props.onClickSave();
            event.preventDefault();
        }
    }
    getSaveToComputerHandler(downloadProjectCallback) {
        return () => {
            this.props.onRequestCloseFile();
            downloadProjectCallback();
            if (this.props.onProjectTelemetryEvent) {
                const metadata = collectMetadata(
                    this.props.vm,
                    this.props.projectTitle,
                    this.props.locale
                );
                this.props.onProjectTelemetryEvent("projectDidSave", metadata);
            }
        };
    }
    handleLanguageMouseUp(e) {
        if (!this.props.languageMenuOpen) {
            this.props.onClickLanguage(e);
        }
    }
    handleClickOpenCommunity() {
        window.open("https://bixcommunity-bbpa.vercel.app/");
    }
    handleClickOpenWiki() {
        window.open("https://edgefxtech.com/");
    }
    restoreOptionMessage(deletedItem) {
        switch (deletedItem) {
            case "Sprite":
                return (
                    <FormattedMessage
                        defaultMessage="Restore Sprite"
                        description="Menu bar item for restoring the last deleted sprite."
                        id="gui.menuBar.restoreSprite"
                    />
                );
            case "Sound":
                return (
                    <FormattedMessage
                        defaultMessage="Restore Sound"
                        description="Menu bar item for restoring the last deleted sound."
                        id="gui.menuBar.restoreSound"
                    />
                );
            case "Costume":
                return (
                    <FormattedMessage
                        defaultMessage="Restore Costume"
                        description="Menu bar item for restoring the last deleted costume."
                        id="gui.menuBar.restoreCostume"
                    />
                );
            default: {
                return (
                    <FormattedMessage
                        defaultMessage="Restore"
                        description="Menu bar item for restoring the last deleted item in its disabled state." /* eslint-disable-line max-len */
                        id="gui.menuBar.restore"
                    />
                );
            }
        }
    }
    handleConnectionMouseUp() {
        if (this.props.deviceId) {
            this.props.onOpenConnectionModal();
        } else {
            this.props.onDeviceIsEmpty();
        }
    }
    handleSelectDeviceMouseUp() {
        const blocks = document.querySelector(
            ".blocklyWorkspace .blocklyBlockCanvas"
        );
        if (blocks.getBBox().height === 0) {
            this.props.onOpenDeviceLibrary();
        } else {
            this.props.onWorkspaceIsNotEmpty();
        }
    }
    handleProgramModeSwitchOnChange() {
        if (this.props.isRealtimeMode) {
            this.props.vm.runtime.setRealtimeMode(false);
        } else {
            /**
             * The realtime stage framwork didn't support STAGE_SIZE_MODES.hide,
             * so if the mode is hide switch to large mode.
             *  */
            if (this.props.stageSizeMode === STAGE_SIZE_MODES.hide) {
                this.props.onSetStageLarge();
            }
            this.props.vm.runtime.setRealtimeMode(true);
        }
    }
    handleProgramModeUpdate(data) {
        if (data.isRealtimeMode) {
            this.props.onSetRealtimeMode();
        } else {
            this.props.onSetUploadMode();
        }
    }

    handleStorageChange = (event) => {
        if (event.key === "user") {
            // Change "user" to the relevant localStorage key
            this.loadDataFromLocalStorage(); // Call function to update state
        }
    };

    loadDataFromLocalStorage = () => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        this.setState({ someData: user });
    };

    handleUploadFirmware() {
        if (this.props.deviceId) {
            this.props.vm.uploadFirmwareToPeripheral(this.props.deviceId);
            this.props.onSetRealtimeConnection(false);
            this.props.onOpenUploadProgress();
        } else {
            this.props.onNoPeripheralIsConnected();
        }
    }
    handleScreenshot() {
        const blocks = document.querySelector(
            ".blocklyWorkspace .blocklyBlockCanvas"
        );
        if (blocks.getBBox().height === 0) {
            this.props.onWorkspaceIsEmpty();
        } else {
            const transform = blocks.getAttribute("transform");
            const scale = parseFloat(
                transform.substring(
                    transform.indexOf("scale") + 6,
                    transform.length - 1
                )
            );
            const data = new Date();

            saveSvgAsPng.saveSvgAsPng(
                blocks,
                `${this.props.projectTitle}-${data.getTime()}.png`,
                {
                    left: blocks.getBBox().x * scale,
                    top: blocks.getBBox().y * scale,
                    height: blocks.getBBox().height * scale,
                    width: blocks.getBBox().width * scale,
                    scale: 2 / scale,
                    encoderOptions: 1,
                }
            );
        }
    }
    handleCheckUpdate() {
        this.props.onSetUpdate({
            phase: UPDATE_MODAL_STATE.checkingApplication,
        });
        this.props.onClickCheckUpdate();
    }
    handleClearCache() {
        const readyClearCache = this.props.confirmClearCache(
            this.props.intl.formatMessage(sharedMessages.clearCacheWarning)
        );
        if (readyClearCache) {
            this.props.onClickClearCache();
        }
    }
    buildAboutMenu(onClickAbout) {
        if (!onClickAbout) {
            // hide the button
            return null;
        }
        if (typeof onClickAbout === "function") {
            // make a button which calls a function
            return <AboutButton onClick={onClickAbout} />;
        }
        // assume it's an array of objects
        // each item must have a 'title' FormattedMessage and a 'handleClick' function
        // generate a menu with items for each object in the array
        return onClickAbout.map((itemProps) => (
            <MenuItem
                key={itemProps.title}
                isRtl={this.props.isRtl}
                onClick={this.wrapAboutMenuCallback(itemProps.onClick)}
            >
                {itemProps.title}
            </MenuItem>
        ));
    }
    wrapAboutMenuCallback(callback) {
        return () => {
            callback();
            this.props.onRequestCloseAbout();
        };
    }
    render() {
        const saveNowMessage = (
            <FormattedMessage
                defaultMessage="Save now"
                description="Menu bar item for saving now"
                id="gui.menuBar.saveNow"
            />
        );
        const createCopyMessage = (
            <FormattedMessage
                defaultMessage="Save as a copy"
                description="Menu bar item for saving as a copy"
                id="gui.menuBar.saveAsCopy"
            />
        );
        const remixMessage = (
            <FormattedMessage
                defaultMessage="Remix"
                description="Menu bar item for remixing"
                id="gui.menuBar.remix"
            />
        );
        const newProjectMessage = (
            <FormattedMessage
                defaultMessage="New"
                description="Menu bar item for creating a new project"
                id="gui.menuBar.new"
            />
        );
        const checkUpdate = (
            <FormattedMessage
                defaultMessage="Check update"
                description="Menu bar item for check update"
                id="gui.menuBar.checkUpdate"
            />
        );
        const installDriver = (
            <FormattedMessage
                defaultMessage="Install driver"
                description="Menu bar item for install drivers"
                id="gui.menuBar.installDriver"
            />
        );
        const clearCache = (
            <FormattedMessage
                defaultMessage="Clear cache and restart"
                description="Menu bar item for clear cache and restart"
                id="gui.menuBar.clearCacheAndRestart"
            />
        );
        // eslint-disable-next-line no-unused-vars
        const remixButton = (
            <Button
                className={classNames(styles.menuBarButton, styles.remixButton)}
                iconClassName={styles.remixButtonIcon}
                iconSrc={remixIcon}
                onClick={this.handleClickRemix}
            >
                {remixMessage}
            </Button>
        );
        // Show the About button only if we have a handler for it (like in the desktop app)
        const aboutButton = this.buildAboutMenu(this.props.onClickAbout);
        return (
            <Box className={classNames(this.props.className, styles.menuBar)}>
                <div className={styles.mainMenu}>
                    <div className={classNames(styles.menuBarItem)}>
                        <img
                            alt="LearningBix"
                            className={classNames(styles.scratchLogo, {
                                [styles.clickable]:
                                    typeof this.props.onClickLogo !==
                                    "undefined",
                            })}
                            draggable={false}
                            src={"https://edgefxtech.com/images/logo-edgefx.png"}
                            onClick={this.handleClickOpenWiki}
                        />
                    </div>
                   
                    {this.props.canManageFiles && (
                        <div
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                {
                                    [styles.active]: this.props.fileMenuOpen,
                                }
                            )}
                            onMouseUp={this.props.onClickFile}
                        >
                            <FormattedMessage
                                defaultMessage="File"
                                description="Text for file dropdown menu"
                                id="gui.menuBar.file"
                            />
                            <MenuBarMenu
                                className={classNames(styles.menuBarMenu)}
                                open={this.props.fileMenuOpen}
                                place={this.props.isRtl ? "left" : "right"}
                                onRequestClose={this.props.onRequestCloseFile}
                            >
                                <MenuSection>
                                    <MenuItem
                                        isRtl={this.props.isRtl}
                                        onClick={this.handleClickNew}
                                    >
                                        {newProjectMessage}
                                    </MenuItem>
                                </MenuSection>
                                {(this.props.canSave ||
                                    this.props.canCreateCopy ||
                                    this.props.canRemix) && (
                                    <MenuSection>
                                        {this.props.canSave && (
                                            <MenuItem
                                                onClick={this.handleClickSave}
                                            >
                                                {saveNowMessage}
                                            </MenuItem>
                                        )}
                                        {this.props.canCreateCopy && (
                                            <MenuItem
                                                onClick={
                                                    this.handleClickSaveAsCopy
                                                }
                                            >
                                                {createCopyMessage}
                                            </MenuItem>
                                        )}
                                        {this.props.canRemix && (
                                            <MenuItem
                                                onClick={this.handleClickRemix}
                                            >
                                                {remixMessage}
                                            </MenuItem>
                                        )}
                                    </MenuSection>
                                )}
                                <MenuSection>
                                    <MenuItem
                                        onClick={
                                            this.props
                                                .onStartSelectingFileUpload
                                        }
                                    >
                                        {this.props.intl.formatMessage(
                                            sharedMessages.loadFromComputerTitle
                                        )}
                                    </MenuItem>
                                    <SB3Downloader>
                                        {(
                                            className,
                                            downloadProjectCallback
                                        ) => (
                                            <MenuItem
                                                className={className}
                                                onClick={this.getSaveToComputerHandler(
                                                    downloadProjectCallback
                                                )}
                                            >
                                                <FormattedMessage
                                                    defaultMessage="Save to your computer"
                                                    description="Menu bar item for downloading a project to your computer" // eslint-disable-line max-len
                                                    id="gui.menuBar.downloadToComputer"
                                                />
                                            </MenuItem>
                                        )}
                                    </SB3Downloader>
                                </MenuSection>
                            </MenuBarMenu>
                        </div>
                    )}
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            this.props.isRealtimeMode
                                ? styles.hoverable
                                : styles.disabled,
                            { [styles.active]: this.props.editMenuOpen }
                        )}
                        onMouseUp={
                            this.props.isRealtimeMode
                                ? this.props.onClickEdit
                                : null
                        }
                    >
                        <div className={classNames(styles.editMenu)}>
                            <FormattedMessage
                                defaultMessage="Edit"
                                description="Text for edit dropdown menu"
                                id="gui.menuBar.edit"
                            />
                        </div>
                        <MenuBarMenu
                            className={classNames(styles.menuBarMenu)}
                            open={this.props.editMenuOpen}
                            place={this.props.isRtl ? "left" : "right"}
                            onRequestClose={this.props.onRequestCloseEdit}
                        >
                            <DeletionRestorer>
                                {(
                                    handleRestore,
                                    { restorable, deletedItem }
                                ) => (
                                    <MenuItem
                                        className={classNames({
                                            [styles.disabled]: !restorable,
                                        })}
                                        onClick={this.handleRestoreOption(
                                            handleRestore
                                        )}
                                    >
                                        {this.restoreOptionMessage(deletedItem)}
                                    </MenuItem>
                                )}
                            </DeletionRestorer>
                            <MenuSection>
                                <TurboMode>
                                    {(toggleTurboMode, { turboMode }) => (
                                        <MenuItem onClick={toggleTurboMode}>
                                            {turboMode ? (
                                                <FormattedMessage
                                                    defaultMessage="Turn off Turbo Mode"
                                                    description="Menu bar item for turning off turbo mode"
                                                    id="gui.menuBar.turboModeOff"
                                                />
                                            ) : (
                                                <FormattedMessage
                                                    defaultMessage="Turn on Turbo Mode"
                                                    description="Menu bar item for turning on turbo mode"
                                                    id="gui.menuBar.turboModeOn"
                                                />
                                            )}
                                        </MenuItem>
                                    )}
                                </TurboMode>
                            </MenuSection>
                        </MenuBarMenu>
                    </div>
                    <Divider className={classNames(styles.divider)} />
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable
                        )}
                        onMouseUp={this.handleSelectDeviceMouseUp}
                    >
                        <img className={styles.deviceIcon} src={deviceIcon} />
                        {this.props.deviceName ? (
                            <div>{this.props.deviceName}</div>
                        ) : (
                            <FormattedMessage
                                defaultMessage="No device"
                                description="Text for menubar no device select button"
                                id="gui.menuBar.noDeviceSelected"
                            />
                        )}
                    </div>
                    {/* <Divider className={classNames(styles.divider)} /> */}
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable
                        )}
                        onMouseUp={this.handleConnectionMouseUp}
                    >
                        {this.props.peripheralName ? (
                            <React.Fragment>
                                <img
                                    className={styles.connectedIcon}
                                    src={connectedIcon}
                                />
                                {this.props.peripheralName}
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <img
                                    className={styles.unconnectedIcon}
                                    src={unconnectedIcon}
                                />
                                <FormattedMessage
                                    defaultMessage="Unconnected"
                                    description="Text for menubar unconnected button"
                                    id="gui.menuBar.noConnection"
                                />
                            </React.Fragment>
                        )}
                    </div>
                    {/* <div className={classNames(styles.menuBarItem)}>
                            <img
                                className={classNames(styles.linkSocketIcon)}
                                src={linkSocketIcon}
                            />
                        </div> */}
                </div>
                <div className={styles.fileMenu}>
                    {/* {this.props.canEditTitle ? (
                        <div
                            className={classNames(
                                styles.menuBarItem,
                                styles.growable
                            )}
                        >
                            <MenuBarItemTooltip enable id="My Project">
                                <ProjectTitleInput
                                    className={classNames(
                                        styles.titleFieldGrowable
                                    )}
                                />
                            </MenuBarItemTooltip>
                        </div>
                    ) : this.props.authorUsername &&
                      this.props.authorUsername !== this.props.username ? (
                        <AuthorInfo
                            className={styles.authorInfo}
                            imageUrl={this.props.authorThumbnailUrl}
                            projectTitle={this.props.projectTitle}
                            userId={this.props.authorId}
                            username={this.props.authorUsername}
                        />
                    ) : null} */}
                    {/* {this.props.canManageFiles && (
                        <SB3Downloader>
                            {(className, downloadProjectCallback) => (
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable
                                    )}
                                    onClick={this.getSaveToComputerHandler(
                                        downloadProjectCallback
                                    )}
                                >
                                    <img
                                        className={styles.saveIcon}
                                        src={saveIcon}
                                    />
                                </div>
                            )}
                        </SB3Downloader>
                    )} */}

                    {/* <RedirectButton url="https://bixcommunity-bbpa.vercel.app/" label="Go to Bix Community" /> */}
                  
                </div>

                <div className={styles.tailMenu}>
                    {/* <Divider className={classNames(styles.divider)} /> */}
                    {/* <div
                        aria-label={this.props.intl.formatMessage(
                            ariaMessages.community
                        )}
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable
                        )}
                        onClick={this.handleClickOpenCommunity}
                    >
                        <img
                            className={styles.communityIcon}
                            src={communityIcon}
                        />
                        Community
                    </div> */}
                    {/* <Divider className={classNames(styles.divider)} /> */}
                    {/* <div
                        aria-label={this.props.intl.formatMessage(ariaMessages.wiki)}
                        className={classNames(styles.menuBarItem, styles.hoverable)}
                        onClick={this.handleClickOpenWiki}
                    >
                        <img
                            className={styles.wikiIcon}
                            src={wikiIcon}
                        />
                        <FormattedMessage {...ariaMessages.wiki} />
                    </div> */}
                    <div
                        aria-label={this.props.intl.formatMessage(
                            ariaMessages.tutorials
                        )}
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable
                        )}
                        onClick={this.props.onOpenTipLibrary}
                    >
                        <img className={styles.helpIcon} src={helpIcon} />
                        <FormattedMessage {...ariaMessages.tutorials} />
                    </div>
                    {/* <Divider className={classNames(styles.divider)} />
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.hoverable
                        )}
                        onMouseUp={this.handleScreenshot}
                    >
                        <img
                            alt="Screenshot"
                            className={classNames(styles.screenShotLogo)}
                            draggable={false}
                            src={screenshotIcon}
                        />
                    </div>
                    <Divider className={classNames(styles.divider)} /> */}
                    {/* <div
                        className={classNames(
                            styles.menuBarItem,
                            this.props.isRealtimeMode &&
                                this.props.peripheralName
                                ? styles.hoverable
                                : styles.disabled
                        )}
                        onMouseUp={
                            this.props.isRealtimeMode &&
                            this.props.peripheralName
                                ? this.handleUploadFirmware
                                : null
                        }
                    >
                        <img
                            alt="UploadFirmware"
                            className={classNames(styles.uploadFirmwareLogo)}
                            draggable={false}
                            src={uploadFirmwareIcon}
                        />
                        <FormattedMessage
                            defaultMessage="Upload firmware"
                            description="Button to upload the realtime firmware"
                            id="gui.menuBar.uploadFirmware"
                        />
                    </div> */}
                    {/* <Divider className={classNames(styles.divider)} /> */}
                    {this.props.canChangeLanguage && (
                        <div
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                styles.languageMenu
                            )}
                        >
                            <div>
                                <img
                                    className={styles.languageIcon}
                                    src={languageIcon}
                                />
                                <img
                                    className={styles.languageCaret}
                                    src={dropdownCaret}
                                />
                            </div>
                            <LanguageSelector
                                label={this.props.intl.formatMessage(
                                    ariaMessages.language
                                )}
                            />
                        </div>
                    )}
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.programModeGroup
                        )}
                    >
                        <Switch
                            className={styles.programModeSwitch}
                            onChange={this.handleProgramModeSwitchOnChange}
                            checked={!this.props.isRealtimeMode}
                            disabled={
                                this.props.isToolboxUpdating ||
                                !this.props.isSupportSwitchMode
                            }
                            height={25}
                            width={90}
                            onColor={
                                this.props.isToolboxUpdating ||
                                !this.props.isSupportSwitchMode
                                    ? "#888888"
                                    : "#008800"
                            }
                            offColor={
                                this.props.isToolboxUpdating ||
                                !this.props.isSupportSwitchMode
                                    ? "#888888"
                                    : "#FF8C1A"
                            }
                            uncheckedIcon={
                                <div className={styles.modeSwitchRealtime}>
                                    <FormattedMessage
                                        defaultMessage="Live"
                                        description="Button to switch to upload mode"
                                        id="gui.menu-bar.modeSwitchRealtime"
                                    />
                                </div>
                            }
                            checkedIcon={
                                <div className={styles.modeSwitchUpload}>
                                    <FormattedMessage
                                        defaultMessage="Upload"
                                        description="Button to switch to realtime mode"
                                        id="gui.menu-bar.modeSwitchRealtimeUpload"
                                    />
                                </div>
                            }
                        />
                    </div>
                    {/* <Divider className={classNames(styles.divider)} /> */}
                    {/* <SignUp /> */}

                    {isScratchDesktop() ? (
                        <div
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                {
                                    [styles.active]: this.props.settingMenuOpen,
                                }
                            )}
                            onMouseUp={this.props.onClickSetting}
                        >
                            <img
                                className={styles.settingIcon}
                                src={settingIcon}
                            />
                            <MenuBarMenu
                                className={classNames(styles.menuBarMenu)}
                                open={this.props.settingMenuOpen}
                                place={this.props.isRtl ? "right" : "left"}
                                onRequestClose={
                                    this.props.onRequestCloseSetting
                                }
                            >
                                <MenuSection>
                                    <MenuItem
                                        isRtl={this.props.isRtl}
                                        onClick={this.handleCheckUpdate}
                                    >
                                        {checkUpdate}
                                    </MenuItem>
                                    <MenuItem
                                        isRtl={this.props.isRtl}
                                        onClick={this.handleClearCache}
                                    >
                                        {clearCache}
                                    </MenuItem>
                                </MenuSection>
                                <MenuSection>
                                    <MenuItem
                                        isRtl={this.props.isRtl}
                                        onClick={
                                            this.props.onClickInstallDriver
                                        }
                                    >
                                        {installDriver}
                                    </MenuItem>
                                </MenuSection>
                                <MenuSection>
                                    {typeof this.props.onClickAbout === "object"
                                        ? aboutButton
                                        : null}
                                </MenuSection>
                            </MenuBarMenu>
                        </div>
                    ) : null}
                </div>
                {typeof this.props.onClickAbout === "function"
                    ? aboutButton
                    : null}
            </Box>
        );
    }
}

MenuBar.propTypes = {
    aboutMenuOpen: PropTypes.bool,
    accountMenuOpen: PropTypes.bool,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    autoUpdateProject: PropTypes.func,
    canChangeLanguage: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    className: PropTypes.string,
    confirmReadyToReplaceProject: PropTypes.func,
    confirmClearCache: PropTypes.func,
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    settingMenuOpen: PropTypes.bool,
    intl: intlShape,
    isUpdating: PropTypes.bool,
    isRealtimeMode: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    isSupportSwitchMode: PropTypes.bool,
    isToolboxUpdating: PropTypes.bool.isRequired,
    languageMenuOpen: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    loginMenuOpen: PropTypes.bool,
    logo: PropTypes.string,
    onClickAbout: PropTypes.oneOfType([
        PropTypes.func, // button mode: call this callback when the About button is clicked
        PropTypes.arrayOf(
            // menu mode: list of items in the About menu
            PropTypes.shape({
                title: PropTypes.string, // text for the menu item
                onClick: PropTypes.func, // call this callback when the menu item is clicked
            })
        ),
    ]),
    onClickAccount: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickSetting: PropTypes.func,
    onClickLanguage: PropTypes.func,
    onClickLogin: PropTypes.func,
    onClickLogo: PropTypes.func,
    onClickNew: PropTypes.func,
    onClickRemix: PropTypes.func,
    onClickSave: PropTypes.func,
    onClickSaveAsCopy: PropTypes.func,
    onClickCheckUpdate: PropTypes.func,
    onClickClearCache: PropTypes.func,
    onClickInstallDriver: PropTypes.func,
    onLogOut: PropTypes.func,
    onNoPeripheralIsConnected: PropTypes.func.isRequired,
    onOpenRegistration: PropTypes.func,
    onOpenTipLibrary: PropTypes.func,
    onProjectTelemetryEvent: PropTypes.func,
    onRequestOpenAbout: PropTypes.func,
    onRequestCloseAbout: PropTypes.func,
    onRequestCloseAccount: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestCloseSetting: PropTypes.func,
    onRequestCloseLanguage: PropTypes.func,
    onRequestCloseLogin: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    projectTitle: PropTypes.string,
    realtimeConnection: PropTypes.bool.isRequired,
    renderLogin: PropTypes.func,
    sessionExists: PropTypes.bool,
    shouldSaveBeforeTransition: PropTypes.func,
    showComingSoon: PropTypes.bool,
    userOwnsProject: PropTypes.bool,
    username: PropTypes.string,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    vm: PropTypes.instanceOf(VM).isRequired,
    onSetUploadMode: PropTypes.func,
    onSetRealtimeConnection: PropTypes.func.isRequired,
    onSetRealtimeMode: PropTypes.func,
    onSetUpdate: PropTypes.func.isRequired,
    onOpenConnectionModal: PropTypes.func,
    onOpenUploadProgress: PropTypes.func,
    peripheralName: PropTypes.string,
    onDisconnect: PropTypes.func.isRequired,
    onWorkspaceIsEmpty: PropTypes.func.isRequired,
    onWorkspaceIsNotEmpty: PropTypes.func.isRequired,
    onOpenDeviceLibrary: PropTypes.func,
    onSetStageLarge: PropTypes.func.isRequired,
    deviceId: PropTypes.string,
    deviceName: PropTypes.string,
    onDeviceIsEmpty: PropTypes.func,
};

MenuBar.defaultProps = {
    logo: scratchLogo,
    onShare: () => {},
};

const mapStateToProps = (state, ownProps) => {
    const loadingState = state.scratchGui.projectState.loadingState;
    const user =
        state.session && state.session.session && state.session.session.user;
    return {
        aboutMenuOpen: aboutMenuOpen(state),
        accountMenuOpen: accountMenuOpen(state),
        fileMenuOpen: fileMenuOpen(state),
        settingMenuOpen: settingMenuOpen(state),
        editMenuOpen: editMenuOpen(state),
        isUpdating: getIsUpdating(loadingState),
        isRealtimeMode: state.scratchGui.programMode.isRealtimeMode,
        isRtl: state.locales.isRtl,
        isShowingProject: getIsShowingProject(loadingState),
        isSupportSwitchMode: state.scratchGui.programMode.isSupportSwitchMode,
        isToolboxUpdating: state.scratchGui.toolbox.isToolboxUpdating,
        languageMenuOpen: languageMenuOpen(state),
        locale: state.locales.locale,
        loginMenuOpen: loginMenuOpen(state),
        projectTitle: state.scratchGui.projectTitle,
        realtimeConnection: state.scratchGui.connectionModal.realtimeConnection,
        sessionExists:
            state.session && typeof state.session.session !== "undefined",
        username: user ? user.username : null,
        userOwnsProject:
            ownProps.authorUsername &&
            user &&
            ownProps.authorUsername === user.username,
        stageSizeMode: state.scratchGui.stageSize.stageSize,
        vm: state.scratchGui.vm,
        peripheralName: state.scratchGui.connectionModal.peripheralName,
        deviceId: state.scratchGui.device.deviceId,
        deviceName: state.scratchGui.device.deviceName,
    };
};

const mapDispatchToProps = (dispatch) => ({
    autoUpdateProject: () => dispatch(autoUpdateProject()),
    onOpenTipLibrary: () => dispatch(openTipsLibrary()),
    onClickAccount: () => dispatch(openAccountMenu()),
    onRequestCloseAccount: () => dispatch(closeAccountMenu()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickSetting: () => dispatch(openSettingMenu()),
    onRequestCloseSetting: () => dispatch(closeSettingMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickLanguage: () => dispatch(openLanguageMenu()),
    onRequestCloseLanguage: () => dispatch(closeLanguageMenu()),
    onClickLogin: () => dispatch(openLoginMenu()),
    onRequestCloseLogin: () => dispatch(closeLoginMenu()),
    onRequestOpenAbout: () => dispatch(openAboutMenu()),
    onRequestCloseAbout: () => dispatch(closeAboutMenu()),
    onClickNew: (needSave) => dispatch(requestNewProject(needSave)),
    onClickRemix: () => dispatch(remixProject()),
    onClickSave: () => dispatch(manualUpdateProject()),
    onClickSaveAsCopy: () => dispatch(saveProjectAsCopy()),
    onSeeCommunity: () => dispatch(setPlayer(true)),
    onSetUploadMode: () => {
        dispatch(setUploadMode());
        dispatch(setRealtimeConnection(false));
    },
    onSetRealtimeConnection: (state) => dispatch(setRealtimeConnection(state)),
    onSetRealtimeMode: () => dispatch(setRealtimeMode()),
    onSetStageLarge: () => dispatch(setStageSize(STAGE_SIZE_MODES.large)),
    onOpenConnectionModal: () => dispatch(openConnectionModal()),
    onOpenUploadProgress: () => dispatch(openUploadProgress()),
    onDisconnect: () => {
        dispatch(clearConnectionModalPeripheralName());
        dispatch(setRealtimeConnection(false));
    },
    onSetUpdate: (message) => {
        dispatch(setUpdate(message));
        dispatch(openUpdateModal());
    },
    onNoPeripheralIsConnected: () =>
        showAlertWithTimeout(dispatch, "connectAPeripheralFirst"),
    onWorkspaceIsEmpty: () =>
        showAlertWithTimeout(dispatch, "workspaceIsEmpty"),
    onWorkspaceIsNotEmpty: () =>
        showAlertWithTimeout(dispatch, "workspaceIsNotEmpty"),
    onOpenDeviceLibrary: () => dispatch(openDeviceLibrary()),
    onDeviceIsEmpty: () => showAlertWithTimeout(dispatch, "selectADeviceFirst"),
});

export default compose(
    injectIntl,
    MenuBarHOC,
    connect(mapStateToProps, mapDispatchToProps)
)(MenuBar);
