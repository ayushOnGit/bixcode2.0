import classNames from "classnames";
import omit from "lodash.omit";
import PropTypes from "prop-types";
import React from "react";
import {
    defineMessages,
    FormattedMessage,
    injectIntl,
    intlShape,
} from "react-intl";
import { connect } from "react-redux";
import MediaQuery from "react-responsive";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import tabStyles from "react-tabs/style/react-tabs.css";

import Renderer from "scratch-render";
import Divider from "../divider/divider.jsx";

import Blocks from "../../containers/blocks.jsx";
import CostumeTab from "../../containers/costume-tab.jsx";
import TargetPane from "../../containers/target-pane.jsx";
import SoundTab from "../../containers/sound-tab.jsx";
import StageWrapper from "../../containers/stage-wrapper.jsx";
import Loader from "../loader/loader.jsx";
import Box from "../box/box.jsx";
import MenuBar from "../menu-bar/menu-bar.jsx";
import CostumeLibrary from "../../containers/costume-library.jsx";
import BackdropLibrary from "../../containers/backdrop-library.jsx";
import Watermark from "../../containers/watermark.jsx";
import Hardware from "../../containers/hardware.jsx";

import HardwareHeader from "../../containers/hardware-header.jsx";

import PythonCode from "../../containers/python_editor.jsx";

//Model Control
import ModelControl from "../../containers/models-ctrl.jsx";

// AI Module
import ToastComponent, { toasts } from "../toast-special/toast.jsx";
import GraphTrainingModal from "../graph-training-modal/graph-training-modal.jsx";
import TrainVideoModal from "../video-modal/train-video-modal.jsx";
import RecognizeVideoModal from "../video-modal/recognize-video-modal.jsx";
// import App from "../ML Model/App.js";

// eslint-disable-next-line no-unused-vars
import Backpack from "../../containers/backpack.jsx";
import WebGlModal from "../../containers/webgl-modal.jsx";
import TipsLibrary from "../../containers/tips-library.jsx";
import Cards from "../../containers/cards.jsx";
import Alerts from "../../containers/alerts.jsx";
import DragLayer from "../../containers/drag-layer.jsx";
import ConnectionModal from "../../containers/connection-modal.jsx";
import UploadProgress from "../../containers/upload-progress.jsx";
import TelemetryModal from "../telemetry-modal/telemetry-modal.jsx";
import UpdateModal from "../../containers/update-modal.jsx";

import layout, { STAGE_SIZE_MODES } from "../../lib/layout-constants";
import { resolveStageSize } from "../../lib/screen-utils";

import styles from "./gui.css";
import addExtensionIcon from "./icon--extensions.svg";
import codeIcon from "./icon--code.svg";
import costumesIcon from "./icon--costumes.svg";
import soundsIcon from "./icon--sounds.svg";
import VM from "openblock-vm";
import pythonIcon from './pythontab.svg'

const messages = defineMessages({
    addExtension: {
        id: "gui.gui.addExtension",
        description: "Button to add an extension in the target pane",
        defaultMessage: "Add Extension",
    },
});

// Cache this value to only retrieve it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = (props) => {
    const {
        language,
        width,
        height,
        theme,
        accountNavOpen,
        activeTabIndex,
        alertsVisible,
        authorId,
        authorThumbnailUrl,
        authorUsername,
        basePath,
        backdropLibraryVisible,
        // eslint-disable-next-line no-unused-vars
        backpackHost,
        // eslint-disable-next-line no-unused-vars
        backpackVisible,
        blocksTabVisible,
        pythonTabVisible,
        cardsVisible,
        canChangeLanguage,
        canCreateNew,
        canEditTitle,
        canManageFiles,
        canRemix,
        canSave,
        canCreateCopy,
        canShare,
        canUseCloud,
        children,
        connectionModalVisible,
        uploadProgressVisible,
        costumeLibraryVisible,
        costumesTabVisible,
        updateModalVisible,
        enableCommunity,
        intl,
        isCreating,
        isFullScreen,
        isPlayerOnly,
        isRtl,
        isShared,
        isTelemetryEnabled,
        loading,
        logo,
        renderLogin,
        onClickAbout,
        onClickAccountNav,
        onCloseAccountNav,
        onLogOut,
        onOpenRegistration,
        onToggleLoginOpen,
        onAbortUpdate,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateTab,
        onClickLogo,
        onClickCheckUpdate,
        onClickUpdate,
        onClickClearCache,
        onClickInstallDriver,
        onExtensionButtonClick,
        onProjectTelemetryEvent,
        onRequestCloseBackdropLibrary,
        onRequestCloseCostumeLibrary,
        onRequestCloseTelemetryModal,
        onSeeCommunity,
        onShare,
        onShowPrivacyPolicy,
        onStartSelectingFileUpload,
        onShowMessageBox,
        onTelemetryModalCancel,
        onTelemetryModalOptIn,
        onTelemetryModalOptOut,
        showComingSoon,
        soundsTabVisible,
        stageSizeMode,
        targetIsStage,
        telemetryModalVisible,
        tipsLibraryVisible,
        vm,

        //ai props

        trainModalVisible,
        trainVideoModalVisible,
        recognizeVideoModalVisible,
        imageModelsVisiabel,
        objectModelsVisiabel,
        trainModelsVisiabel,

        isRealtimeMode,
        ...componentProps
    } = omit(props, "dispatch");
    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }

    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(
            tabStyles.reactTabsTabPanelSelected,
            styles.isSelected
        ),
        tabSelected: classNames(
            tabStyles.reactTabsTabSelected,
            styles.isSelected
        ),
    };

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
    }

    return (
        <MediaQuery minWidth={layout.fullSizeMinWidth}>
            {(isFullSize) => {
                const stageSize = resolveStageSize(stageSizeMode, isFullSize);

                return isPlayerOnly ? (
                    <StageWrapper
                        isFullScreen={isFullScreen}
                        isRendererSupported={isRendererSupported}
                        isRtl={isRtl}
                        loading={loading}
                        stageSize={STAGE_SIZE_MODES.large}
                        vm={vm}
                    >
                        {alertsVisible ? (
                            <Alerts
                                vm={vm}
                                className={styles.alertsContainer}
                            />
                        ) : null}
                    </StageWrapper>
                ) : (
                    <Box
                        className={styles.pageWrapper}
                        dir={isRtl ? "rtl" : "ltr"}
                        {...componentProps}
                    >
                        {telemetryModalVisible ? (
                            <TelemetryModal
                                isRtl={isRtl}
                                isTelemetryEnabled={isTelemetryEnabled}
                                onCancel={onTelemetryModalCancel}
                                onOptIn={onTelemetryModalOptIn}
                                onOptOut={onTelemetryModalOptOut}
                                onRequestClose={onRequestCloseTelemetryModal}
                                onShowPrivacyPolicy={onShowPrivacyPolicy}
                            />
                        ) : null}
                        {loading ? <Loader /> : null}
                        {isCreating ? (
                            <Loader messageId="gui.loader.creating" />
                        ) : null}
                        {isRendererSupported ? null : (
                            <WebGlModal isRtl={isRtl} />
                        )}
                        {tipsLibraryVisible ? <TipsLibrary /> : null}
                        {cardsVisible ? <Cards /> : null}
                        {alertsVisible ? (
                            <Alerts
                                vm={vm}
                                className={styles.alertsContainer}
                            />
                        ) : null}
                        {connectionModalVisible ? (
                            <ConnectionModal vm={vm} />
                        ) : null}
                        {uploadProgressVisible ? (
                            <UploadProgress vm={vm} />
                        ) : null}
                        {costumeLibraryVisible ? (
                            <CostumeLibrary
                                vm={vm}
                                onRequestClose={onRequestCloseCostumeLibrary}
                            />
                        ) : null}
                        {backdropLibraryVisible ? (
                            <BackdropLibrary
                                vm={vm}
                                onRequestClose={onRequestCloseBackdropLibrary}
                            />
                        ) : null}
                        {updateModalVisible ? (
                            <UpdateModal
                                vm={vm}
                                onAbortUpdate={onAbortUpdate}
                                onClickUpdate={onClickUpdate}
                                onShowMessageBox={onShowMessageBox}
                            />
                        ) : null}
                        <MenuBar
                            accountNavOpen={accountNavOpen}
                            authorId={authorId}
                            authorThumbnailUrl={authorThumbnailUrl}
                            authorUsername={authorUsername}
                            canChangeLanguage={canChangeLanguage}
                            canCreateCopy={canCreateCopy}
                            canCreateNew={canCreateNew}
                            canEditTitle={canEditTitle}
                            canManageFiles={canManageFiles}
                            canRemix={canRemix}
                            canSave={canSave}
                            canShare={canShare}
                            className={styles.menuBarPosition}
                            enableCommunity={enableCommunity}
                            isShared={isShared}
                            logo={logo}
                            renderLogin={renderLogin}
                            showComingSoon={showComingSoon}
                            onClickAbout={onClickAbout}
                            onClickAccountNav={onClickAccountNav}
                            onClickLogo={onClickLogo}
                            onCloseAccountNav={onCloseAccountNav}
                            onLogOut={onLogOut}
                            onOpenRegistration={onOpenRegistration}
                            onProjectTelemetryEvent={onProjectTelemetryEvent}
                            onSeeCommunity={onSeeCommunity}
                            onShare={onShare}
                            onStartSelectingFileUpload={
                                onStartSelectingFileUpload
                            }
                            onShowMessageBox={onShowMessageBox}
                            onToggleLoginOpen={onToggleLoginOpen}
                            onClickCheckUpdate={onClickCheckUpdate}
                            onClickClearCache={onClickClearCache}
                            onClickInstallDriver={onClickInstallDriver}
                        />
                        <Box className={styles.bodyWrapper}>
                            <Box className={styles.flexWrapper}>
                                <Box className={styles.editorWrapper}>
                                    <Tabs
                                        forceRenderTabPanel
                                        className={tabClassNames.tabs}
                                        selectedIndex={activeTabIndex}
                                        selectedTabClassName={
                                            tabClassNames.tabSelected
                                        }
                                        selectedTabPanelClassName={
                                            tabClassNames.tabPanelSelected
                                        }
                                        onSelect={onActivateTab}
                                    >
                                        <TabList
                                            className={tabClassNames.tabList}
                                        >
                                            <Tab className={tabClassNames.tab}>
                                                <img
                                                    draggable={false}
                                                    src={codeIcon}
                                                />
                                                <FormattedMessage
                                                    defaultMessage="Blocks"
                                                    description="Button to get to the code panel"
                                                    id="gui.gui.codeTab"
                                                />
                                            </Tab>
                                            <Tab className={tabClassNames.tab}>
                                                <img
                                                    draggable={false}
                                                    src={pythonIcon}
                                                />
                                                <FormattedMessage
                                                    defaultMessage="Code"
                                                    description="Button to get to the code panel"
                                                    id="gui.gui.pythonTab"
                                                />
                                            </Tab>
                                            <Tab
                                                className={classNames(
                                                    tabClassNames.tab,
                                                    isRealtimeMode
                                                        ? styles.hideCustomAndSoundTab
                                                        : styles.showCustomAndSoundTab
                                                )}
                                                onClick={onActivateCostumesTab}
                                            >
                                                <img
                                                    draggable={false}
                                                    src={costumesIcon}
                                                />
                                                {targetIsStage ? (
                                                    <FormattedMessage
                                                        defaultMessage="Backdrops"
                                                        description="Button to get to the backdrops panel"
                                                        id="gui.gui.backdropsTab"
                                                    />
                                                ) : (
                                                    <FormattedMessage
                                                        defaultMessage="Costumes"
                                                        description="Button to get to the costumes panel"
                                                        id="gui.gui.costumesTab"
                                                    />
                                                )}
                                            </Tab>
                                            <Tab
                                                className={classNames(
                                                    tabClassNames.tab,
                                                    isRealtimeMode
                                                        ? styles.hideCustomAndSoundTab
                                                        : styles.showCustomAndSoundTab
                                                )}
                                                onClick={onActivateSoundsTab}
                                            >
                                                <img
                                                    draggable={false}
                                                    src={soundsIcon}
                                                />
                                                <FormattedMessage
                                                    defaultMessage="Sounds"
                                                    description="Button to get to the sounds panel"
                                                    id="gui.gui.soundsTab"
                                                />
                                            </Tab>
                                        </TabList>
                                        {/* blocks */}
                                        <TabPanel
                                            className={tabClassNames.tabPanel}
                                        >
                                            <Box
                                                className={styles.blocksWrapper}
                                            >
                                                <Blocks
                                                    canUseCloud={canUseCloud}
                                                    grow={1}
                                                    isVisible={blocksTabVisible}
                                                    options={{
                                                        media: `${basePath}static/blocks-media/`,
                                                    }}
                                                    stageSize={stageSize}
                                                    vm={vm}
                                                />
                                            </Box>
                                            <Box
                                                className={
                                                    styles.extensionButtonContainer
                                                }
                                            >
                                                <button
                                                    className={
                                                        styles.extensionButton
                                                    }
                                                    title={intl.formatMessage(
                                                        messages.addExtension
                                                    )}
                                                    onClick={
                                                        onExtensionButtonClick
                                                    }
                                                >
                                                    <img
                                                        className={
                                                            styles.extensionButtonIcon
                                                        }
                                                        draggable={false}
                                                        src={addExtensionIcon}
                                                    />
                                                </button>
                                            </Box>
                                            <Box className={styles.watermark}>
                                                <Watermark />
                                            </Box>
                                        </TabPanel>

                                        <TabPanel
                                            className={tabClassNames.tabPanel}
                                        >
                                            {pythonTabVisible ? (
                                                <PythonCode
                                                    vm={vm}
                                                    onSetCodeEditorValue={(
                                                        newValue
                                                    ) => newValue}
                                                />
                                            ) : null}
                                        </TabPanel>

                                        {/* coustme */}
                                        <TabPanel
                                            className={tabClassNames.tabPanel}
                                        >
                                            {costumesTabVisible ? (
                                                <CostumeTab vm={vm} />
                                            ) : null}
                                        </TabPanel>
                                        {/* sound */}
                                        <TabPanel
                                            className={tabClassNames.tabPanel}
                                        >
                                            {soundsTabVisible ? (
                                                <SoundTab
                                                    vm={vm}
                                                    onShowMessageBox={
                                                        onShowMessageBox
                                                    }
                                                />
                                            ) : null}
                                        </TabPanel>
                                    </Tabs>
                                    {/*
                                    backpackVisible ? (
                                        <Backpack host={backpackHost} />
                                    ) : null
                                */}
                                </Box>
                                <Box
                                    className={classNames(
                                        styles.stageAndTargetWrapper,
                                        styles[stageSize],
                                        isRealtimeMode
                                            ? styles.showStage
                                            : styles.hideStage
                                    )}
                                >
                                    <StageWrapper
                                        isFullScreen={isFullScreen}
                                        isRendererSupported={
                                            isRendererSupported
                                        }
                                        isRtl={isRtl}
                                        stageSize={stageSize}
                                        vm={vm}
                                    />
                                    <Box className={styles.targetWrapper}>
                                        <TargetPane
                                            stageSize={stageSize}
                                            vm={vm}
                                        />
                                    </Box>
                                </Box>
                                {isRealtimeMode === false ? (
                                    <HardwareHeader vm={vm} />
                                ) : null}
                                {isRealtimeMode === false &&
                                stageSizeMode !== STAGE_SIZE_MODES.hide ? (
                                    <Hardware vm={vm} />
                                ) : null}
                            </Box>

                            <DragLayer />
                            <ToastComponent />

                            {/* traning model component */}

                            {/* {<App hidden={!trainModalVisible} vm={vm}></App>} */}

                            {
                                <GraphTrainingModal
                                    hidden={!trainModalVisible}
                                    vm={vm}
                                ></GraphTrainingModal>
                            }
                            {/* recogination window component */}
                            {
                                <TrainVideoModal
                                    hidden={!trainVideoModalVisible}
                                    vm={vm}
                                ></TrainVideoModal>
                            }
                            {/* cognitive traning model */}
                            {
                                <RecognizeVideoModal
                                    hidden={!recognizeVideoModalVisible}
                                    vm={vm}
                                ></RecognizeVideoModal>
                            }
                            {imageModelsVisiabel && <ModelControl type={0} />}
                            {objectModelsVisiabel && <ModelControl type={1} />}
                            {trainModelsVisiabel && <ModelControl type={2} />}
                        </Box>
                    </Box>
                );
            }}
        </MediaQuery>
    );
};

GUIComponent.propTypes = {
    accountNavOpen: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    backdropLibraryVisible: PropTypes.bool,
    backpackHost: PropTypes.string,
    backpackVisible: PropTypes.bool,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    pythonTabVisible: PropTypes.bool,
    canChangeLanguage: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    intl: intlShape.isRequired,
    isCreating: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onClickAccountNav: PropTypes.func,
    onClickLogo: PropTypes.func,
    onClickCheckUpdate: PropTypes.func,
    onAbortUpdate: PropTypes.func,
    onClickUpdate: PropTypes.func,
    onClickClearCache: PropTypes.func,
    onClickInstallDriver: PropTypes.func,
    onCloseAccountNav: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onRequestCloseTelemetryModal: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onShowPrivacyPolicy: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onShowMessageBox: PropTypes.func.isRequired,
    onTabSelect: PropTypes.func,
    onTelemetryModalCancel: PropTypes.func,
    onTelemetryModalOptIn: PropTypes.func,
    onTelemetryModalOptOut: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    renderLogin: PropTypes.func,
    showComingSoon: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    targetIsStage: PropTypes.bool,
    telemetryModalVisible: PropTypes.bool,
    tipsLibraryVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM),
    isRealtimeMode: PropTypes.bool,
};
GUIComponent.defaultProps = {
    backpackHost: null,
    backpackVisible: false,
    basePath: "./",
    canChangeLanguage: true,
    canCreateNew: false,
    canEditTitle: false,
    canManageFiles: true,
    canRemix: false,
    canSave: false,
    canCreateCopy: false,
    canShare: false,
    canUseCloud: false,
    enableCommunity: false,
    isCreating: false,
    isShared: false,
    loading: false,
    showComingSoon: false,
    stageSizeMode: STAGE_SIZE_MODES.large,
    // language='python',
    // width={1000} ,
    // height={700},
    // theme='vs-dark'
};

const mapStateToProps = (state) => ({
    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    trainModalVisible: state.scratchGui.modals.trainModal,
    trainVideoModalVisible: state.scratchGui.modals.trainVideoModal,
    recognizeVideoModalVisible: state.scratchGui.modals.recognizeVideoModal,

    imageModelsVisiabel: state.scratchGui.modelsCtr.imageModelsVisiabel,
    objectModelsVisiabel: state.scratchGui.modelsCtr.objectModelsVisiabel,
    trainModelsVisiabel: state.scratchGui.modelsCtr.trainModelsVisiabel,
});

export default injectIntl(connect(mapStateToProps)(GUIComponent));
