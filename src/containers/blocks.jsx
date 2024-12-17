import bindAll from "lodash.bindall";
import debounce from "lodash.debounce";
import defaultsDeep from "lodash.defaultsdeep";
import makeToolboxXML from "../lib/make-toolbox-xml";
import PropTypes from "prop-types";
import React from "react";
import VMScratchBlocks from "../lib/blocks";
import VM from "openblock-vm";

import log from "../lib/log.js";
import Prompt from "./prompt.jsx";
import BlocksComponent from "../components/blocks/blocks.jsx";
import ExtensionLibrary from "./extension-library.jsx";
import DeviceLibrary from "./device-library.jsx";
import extensionData from "../lib/libraries/extensions/index.jsx";
import CustomProcedures from "./custom-procedures.jsx";
import errorBoundaryHOC from "../lib/error-boundary-hoc.jsx";
import {
    BLOCKS_DEFAULT_SCALE,
    STAGE_DISPLAY_SIZES,
} from "../lib/layout-constants";
import DropAreaHOC from "../lib/drop-area-hoc.jsx";
import DragConstants from "../lib/drag-constants";
import defineDynamicBlock from "../lib/define-dynamic-block";
import { getGeneratorNameFromDeviceType } from "../lib/code-generator";

import { connect } from "react-redux";
import { updateToolbox, setIsUpdating } from "../reducers/toolbox";
import { showAlertWithTimeout } from "../reducers/alerts";
import { activateColorPicker } from "../reducers/color-picker";
import {
    closeExtensionLibrary,
    openSoundRecorder,
    openConnectionModal,
    closeDeviceLibrary,
} from "../reducers/modals";
import {
    activateCustomProcedures,
    deactivateCustomProcedures,
} from "../reducers/custom-procedures";
import { updateMetrics } from "../reducers/workspace-metrics";
import { setCodeEditorValue } from "../reducers/code";
import { setDeviceId, setDeviceName, setDeviceType } from "../reducers/device";
import { setSupportSwitchMode } from "../reducers/program-mode";
import { setBaudrate } from "../reducers/hardware-console";
//ai model blocks update
import {
    updateImageModels,
    updateImageModelsState,
    updateObjectModels,
    updateObjectModelsState,
    updateTrainModels,
    updateTrainModelsState,
} from "../reducers/models-ctl";

import { activateTab, SOUNDS_TAB_INDEX } from "../reducers/editor-tab";

import {
    openTrainModal,
    openTrainVideoModal,
    openRecognizeVideoModal,
} from "../reducers/modals";

const addFunctionListener = (object, property, callback) => {
    const oldFn = object[property];
    object[property] = function (...args) {
        const result = oldFn.apply(this, args);
        callback.apply(this, result);
        return result;
    };
};

const getBlocks = (models = []) => {
    const blocks = [];
    for (let index = 0; index < models.length; index++) {
        const m = models[index];
        const temp = {
            value: m,
            oneBlock: `modelExtension_blockOne${m.id}`,
            twoBlock: `modelExtension_blockTwo${m.id}`,
            threeBlock: `modelExtension_blockThree${m.id}`,
        };
        blocks.push(temp);
    }
    return blocks;
};
const getMenus = (models = []) => {
    return models.map((m) => {
        return {
            ipcode: `modelExtension_menu_blockMenu${m.id}`,
            menu: `blockMenu${m.id}`,
        };
    });
};

const getCoordinateMenu = () => {
    return {
        ipcode: "modelExtension_menu_XY",
        menu: "XY",
    };
};

const DroppableBlocks = DropAreaHOC([DragConstants.BACKPACK_CODE])(
    BlocksComponent
);

class Blocks extends React.Component {
    constructor(props) {
        super(props);
        this.ScratchBlocks = VMScratchBlocks(props.vm);
        bindAll(this, [
            "attachVM",
            "detachVM",
            "getToolboxXML",
            "handleBlocksInfoUpdate",
            "handleCategorySelected",
            "handleConnectionModalStart",
            "handleDeviceExtensionAdded",
            "handleDeviceExtensionRemoved",
            "handleDeviceSelected",
            "handleDrop",
            "handleScratchExtensionAdded",
            "handleScratchExtensionRemoved",
            "handleStatusButtonUpdate",
            "handleOpenSoundRecorder",
            "handlePromptStart",
            "handlePromptCallback",
            "handlePromptClose",
            "handleToolboxUploadFinish",
            "handleCustomProceduresClose",
            "onCodeNeedUpdate",
            "onScriptGlowOn",
            "onScriptGlowOff",
            "onBlockGlowOn",
            "onBlockGlowOff",
            "onProgramModeUpdate",
            "onTargetsUpdate",
            "onVisualReport",
            "onActivateColorPicker",
            "onWorkspaceUpdate",
            "onWorkspaceMetricsChange",
            "setBlocks",
            "setLocale",
            "workspaceToCode",
            "handleTrainOnclick",
            "handleTrainVideoOnclick",
            "handleRecognizeVideoOnclick",
            "handleImgModelButtonOnclick",
            "handleObjModelButtonOnclick",
            "handleDeviceTrainButtonOnclick",
            "handleLoadCdcModels",
        ]);
        this.ScratchBlocks.prompt = this.handlePromptStart;
        this.ScratchBlocks.statusButtonCallback =
            this.handleConnectionModalStart;
        this.ScratchBlocks.recordSoundCallback = this.handleOpenSoundRecorder;

        this.state = {
            prompt: null,
        };
        this.onTargetsUpdate = debounce(this.onTargetsUpdate, 100);
        this.toolboxUpdateQueue = [];
    }
    componentDidMount() {
        this.ScratchBlocks.FieldColourSlider.activateEyedropper_ =
            this.onActivateColorPicker;
        this.ScratchBlocks.Procedures.externalProcedureDefCallback =
            this.props.onActivateCustomProcedures;
        this.ScratchBlocks.ScratchMsgs.setLocale(this.props.locale);

        this.ScratchBlocks.Toolbox.extensionButtonClick =
            this.props.onExtensionDivClick;

        const workspaceConfig = defaultsDeep(
            {},
            Blocks.defaultOptions,
            this.props.options,
            { rtl: this.props.isRtl, toolbox: this.props.toolboxXML }
        );
        this.workspace = this.ScratchBlocks.inject(
            this.blocks,
            workspaceConfig
        );

        

        this.workspace.registerButtonCallback(
            "trainOnclick",
            this.handleTrainOnclick
        );
        this.workspace.registerButtonCallback(
            "trainVideoOnclick",
            this.handleTrainVideoOnclick
        );
        this.workspace.registerButtonCallback(
            "recognizeVideoOnclick",
            this.handleRecognizeVideoOnclick
        );

        this.workspace.registerButtonCallback(
            "imgModelButton",
            this.handleImgModelButtonOnclick
        );
        this.workspace.registerButtonCallback(
            "objModelButton",
            this.handleObjModelButtonOnclick
        );

        // Register buttons under new callback keys for creating variables,
        // lists, and procedures from extensions.

        const toolboxWorkspace = this.workspace.getFlyout().getWorkspace();
        console.log(toolboxWorkspace);

        const varListButtonCallback = (type) => () =>
            this.ScratchBlocks.Variables.createVariable(
                this.workspace,
                null,
                type
            );
        const procButtonCallback = () => {
            this.ScratchBlocks.Procedures.createProcedureDefCallback_(
                this.workspace
            );
        };

        toolboxWorkspace.registerButtonCallback(
            "MAKE_A_VARIABLE",
            varListButtonCallback("")
        );
        toolboxWorkspace.registerButtonCallback(
            "MAKE_A_BLOCK",
            varListButtonCallback("")
        );
        toolboxWorkspace.registerButtonCallback(
            "MAKE_A_LIST",
            varListButtonCallback("list")
        );
        toolboxWorkspace.registerButtonCallback(
            "MAKE_A_PROCEDURE",
            procButtonCallback
        );

        // Store the xml of the toolbox that is actually rendered.
        // This is used in componentDidUpdate instead of prevProps, because
        // the xml can change while e.g. on the costumes tab.
        this._renderedToolboxXML = this.props.toolboxXML;

        // Store the programmode.
        // This is used in componentDidUpdate to control should update toolbox xml.
        this._programMode = this.props.isRealtimeMode;

        // Creat a flag to control insert spaces that have no actual function after a device is added,
        // to forcefully update the blocks in the flyout area. In order to avoid the problem of the
        // rendering of the flyout blocks is not triggered because the contents of the toolbox are
        // exactly the same when the device blocks have the same opcode but different drop - down menus.
        this.deviceFakeToolboxHead = "";

        // we actually never want the workspace to enable "refresh toolbox" - this basically re-renders the
        // entire toolbox every time we reset the workspace.  We call updateToolbox as a part of
        // componentDidUpdate so the toolbox will still correctly be updated
        this.setToolboxRefreshEnabled =
            this.workspace.setToolboxRefreshEnabled.bind(this.workspace);
        this.workspace.setToolboxRefreshEnabled = () => {
            this.setToolboxRefreshEnabled(false);
        };

        // @todo change this when blockly supports UI events
        addFunctionListener(
            this.workspace,
            "translate",
            this.onWorkspaceMetricsChange
        );
        addFunctionListener(
            this.workspace,
            "zoom",
            this.onWorkspaceMetricsChange
        );

        this.attachVM();
        // Only update blocks/vm locale when visible to avoid sizing issues
        // If locale changes while not visible it will get handled in didUpdate
        if (this.props.isVisible) {
            this.setLocale();
        }

        // analytics.pageview('/editors/blocks');
    }

    //ai model handels
    handleTrainOnclick() {
        console.log("train On Click");
        console.log(this.props.vm.runtime.trainMode.isTrain);
        this.props.openTrainModalState();
    }
    handleTrainVideoOnclick() {
        this.props.openTrainVideoModalState();
    }
    handleRecognizeVideoOnclick() {
        this.props.openRecognizeVideoModalState();
    }
    handleImgModelButtonOnclick() {
        this.props.showImageModelsView();
    }

    handleObjModelButtonOnclick() {
        this.props.showObjectModelsView();
    }

    handleDeviceTrainButtonOnclick() {
        this.props.showTrainModelsView();
    }
    clearModels() {
        this.props.updateImageModels([]);
        this.props.updateObjectModels([]);
    }

    /**
     * 处理cdc模型加载回调
     * Load cdc model callback
     * @param {*} imageModels
     * @param {*} objectModels
     */

    handleLoadCdcModels(
        imageModels,
        objectModels,
        trainModels,
        createSkillModels
    ) {
        this.props.updateImageModels(imageModels);
        this.props.updateObjectModels(objectModels);
        this.props.updateTrainModels(trainModels);
        // this.props.updateCreateSkillModels(createSkillModels);
        // this.handleDefineCreateSkillBlocks({
        //     createSkillModels: createSkillModels
        // });
        this.handleDefineExtensionBlocks({
            imageModels: imageModels,
            objectModels: objectModels,
            trainModels: trainModels,
        });

        //更新扩展积木  Update extension blocks
        this.props.vm.refreshExtensionBlocks().then(() => {
            this.props.vm.refreshWorkspace();
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.state.prompt !== nextState.prompt ||
            this.props.isVisible !== nextProps.isVisible ||
            this._renderedToolboxXML !== nextProps.toolboxXML ||
            this.props.extensionLibraryVisible !==
                nextProps.extensionLibraryVisible ||
            this.props.customProceduresVisible !==
                nextProps.customProceduresVisible ||
            this.props.locale !== nextProps.locale ||
            this.props.anyModalVisible !== nextProps.anyModalVisible ||
            this.props.stageSize !== nextProps.stageSize ||
            this.props.isRealtimeMode !== nextProps.isRealtimeMode ||
            this.props.isCodeEditorLocked !== nextProps.isCodeEditorLocked
        );
    }
    componentDidUpdate(prevProps) {
        // If any modals are open, call hideChaff to close z-indexed field editors
        if (this.props.anyModalVisible && !prevProps.anyModalVisible) {
            this.ScratchBlocks.hideChaff();
        }

        // If program mode changed, call functio to update the toolbox
        if (this.props.isRealtimeMode !== this._programMode) {
            // Clear possible errors witch print in to code editor.
            this.props.onSetCodeEditorValue("");
            this.onProgramModeUpdate();
        }

        if (prevProps.toolboxXML !== this.props.toolboxXML) {
            // rather than update the toolbox "sync" -- update it in the next frame
            clearTimeout(this.toolboxUpdateTimeout);
            this.toolboxUpdateTimeout = setTimeout(() => {
                this.updateToolbox();
            }, 0);
        }

        // Only rerender the toolbox when the blocks are visible and the xml is
        // different from the previously rendered toolbox xml.
        // Do not check against prevProps.toolboxXML because that may not have been rendered.
        if (
            this.props.isVisible &&
            this.props.toolboxXML !== this._renderedToolboxXML
        ) {
            this.requestToolboxUpdate();
        }

        if (
            this.props.isCodeEditorLocked &&
            this.props.isCodeEditorLocked !== prevProps.isCodeEditorLocked
        ) {
            this.onCodeNeedUpdate();
        }

        if (this.props.isVisible === prevProps.isVisible) {
            if (this.props.stageSize !== prevProps.stageSize) {
                // force workspace to redraw for the new stage size
                window.dispatchEvent(new Event("resize"));
            }
            return;
        }
        // @todo hack to resize blockly manually in case resize happened while hidden
        // @todo hack to reload the workspace due to gui bug #413
        if (this.props.isVisible) {
            // Scripts tab
            this.workspace.setVisible(true);
            if (
                prevProps.locale !== this.props.locale ||
                this.props.locale !== this.props.vm.getLocale()
            ) {
                // call setLocale if the locale has changed, or changed while the blocks were hidden.
                // vm.getLocale() will be out of sync if locale was changed while not visible
                this.setLocale();
            } else {
                this.props.vm.refreshWorkspace();
                this.requestToolboxUpdate();
            }

            window.dispatchEvent(new Event("resize"));
        } else {
            this.workspace.setVisible(false);
        }
    }
    componentWillUnmount() {
        this.detachVM();

        this.workspace.removeButtonCallback("trainOnclick");
        this.workspace.removeButtonCallback("trainVideoOnclick");
        this.workspace.removeButtonCallback("recognizeVideoOnclick");
        // this.workspace.removeButtonCallback('accelerometerOnclick');
        // this.workspace.removeButtonCallback('meteostationOnclick');
        // this.workspace.removeButtonCallback('createSkillOnclick');
        // this.workspace.removeButtonCallback('cailbrateOnclick');
        // this.workspace.removeButtonCallback('restoreFactorySettingsOnclick');

        this.workspace.removeButtonCallback("imgModelButton");
        this.workspace.removeButtonCallback("objModelButton");
        this.workspace.dispose();
        clearTimeout(this.toolboxUpdateTimeout);
        clearTimeout(this.getXMLAndUpdateToolboxTimeout);
    }
    requestToolboxUpdate() {
        clearTimeout(this.toolboxUpdateTimeout);
        this.toolboxUpdateTimeout = setTimeout(() => {
            this.updateToolbox();
        }, 0);
    }
    setLocale(refreshWorkspace = true) {
        this.ScratchBlocks.ScratchMsgs.setLocale(this.props.locale);
        this.props.vm
            .setLocale(this.props.locale, this.props.messages)
            .then(() => {
                this.workspace.getFlyout().setRecyclingEnabled(false);
                if (refreshWorkspace) {
                    this.props.vm.refreshWorkspace();
                }
                this.requestToolboxUpdate();
                this.withToolboxUpdates(() => {
                    this.workspace.getFlyout().setRecyclingEnabled(true);
                });
            });
    }
    onProgramModeUpdate() {
        if (this.props.isRealtimeMode) {
            this.ScratchBlocks.ProgramMode.setProgramMode(
                this.ScratchBlocks.ProgramMode.REALTIME
            );
        } else {
            this.ScratchBlocks.ProgramMode.setProgramMode(
                this.ScratchBlocks.ProgramMode.UPLOAD
            );
        }
        this._programMode = this.props.isRealtimeMode;
        const toolboxXML = this.getToolboxXML();
        if (toolboxXML) {
            this.props.updateToolboxState(toolboxXML);
        }
    }
    updateToolbox() {
        this.toolboxUpdateTimeout = false;

        this.props.onToolboxWillUpdate();

        const categoryId = this.workspace.toolbox_.getSelectedCategoryId();
        const offset = this.workspace.toolbox_.getCategoryScrollOffset();
        this.workspace.updateToolbox(this.props.toolboxXML);
        this._renderedToolboxXML = this.props.toolboxXML;

        // In order to catch any changes that mutate the toolbox during "normal runtime"
        // (variable changes/etc), re-enable toolbox refresh.
        // Using the setter function will rerender the entire toolbox which we just rendered.
        this.workspace.toolboxRefreshEnabled_ = true;

        const currentCategoryPos =
            this.workspace.toolbox_.getCategoryPositionById(categoryId);
        const currentCategoryLen =
            this.workspace.toolbox_.getCategoryLengthById(categoryId);
        if (offset < currentCategoryLen) {
            this.workspace.toolbox_.setFlyoutScrollPos(
                currentCategoryPos + offset
            );
        } else {
            this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos);
        }

        const queue = this.toolboxUpdateQueue;
        this.toolboxUpdateQueue = [];
        queue.forEach((fn) => fn());
    }

    withToolboxUpdates(fn) {
        // if there is a queued toolbox update, we need to wait
        if (this.toolboxUpdateTimeout) {
            this.toolboxUpdateQueue.push(fn);
        } else {
            fn();
        }
    }

    attachVM() {
        this.workspace.addChangeListener(this.props.vm.blockListener);
        this.flyoutWorkspace = this.workspace.getFlyout().getWorkspace();
        this.flyoutWorkspace.addChangeListener(
            this.props.vm.flyoutBlockListener
        );
        this.flyoutWorkspace.addChangeListener(
            this.props.vm.monitorBlockListener
        );
        this.props.vm.addListener("SCRIPT_GLOW_ON", this.onScriptGlowOn);
        this.props.vm.addListener("SCRIPT_GLOW_OFF", this.onScriptGlowOff);
        this.props.vm.addListener("BLOCK_GLOW_ON", this.onBlockGlowOn);
        this.props.vm.addListener("BLOCK_GLOW_OFF", this.onBlockGlowOff);
        this.props.vm.addListener("VISUAL_REPORT", this.onVisualReport);
        this.props.vm.addListener("workspaceUpdate", this.onWorkspaceUpdate);
        this.props.vm.addListener("targetsUpdate", this.onTargetsUpdate);
        this.props.vm.addListener(
            "SCRATCH_EXTENSION_ADDED",
            this.handleScratchExtensionAdded
        );
        this.props.vm.addListener(
            "SCRATCH_EXTENSION_REMOVED",
            this.handleScratchExtensionRemoved
        );
        this.props.vm.addListener(
            "DEVICE_EXTENSION_ADDED",
            this.handleDeviceExtensionAdded
        );
        this.props.vm.addListener(
            "DEVICE_EXTENSION_REMOVED",
            this.handleDeviceExtensionRemoved
        );
        this.props.vm.addListener(
            "BLOCKSINFO_UPDATE",
            this.handleBlocksInfoUpdate
        );
        this.props.vm.addListener(
            "PERIPHERAL_CONNECTED",
            this.handleStatusButtonUpdate
        );
        this.props.vm.addListener(
            "PERIPHERAL_DISCONNECTED",
            this.handleStatusButtonUpdate
        );
        this.props.vm.addListener("CODE_NEED_UPDATE", this.onCodeNeedUpdate);
        this.props.vm.addListener(
            "TOOLBOX_UPLOAD_FINISH",
            this.handleToolboxUploadFinish
        );
    }
    detachVM() {
        this.props.vm.removeListener("SCRIPT_GLOW_ON", this.onScriptGlowOn);
        this.props.vm.removeListener("SCRIPT_GLOW_OFF", this.onScriptGlowOff);
        this.props.vm.removeListener("BLOCK_GLOW_ON", this.onBlockGlowOn);
        this.props.vm.removeListener("BLOCK_GLOW_OFF", this.onBlockGlowOff);
        this.props.vm.removeListener("VISUAL_REPORT", this.onVisualReport);
        this.props.vm.removeListener("workspaceUpdate", this.onWorkspaceUpdate);
        this.props.vm.removeListener("targetsUpdate", this.onTargetsUpdate);
        this.props.vm.removeListener(
            "SCRATCH_EXTENSION_ADDED",
            this.handleScratchExtensionAdded
        );
        this.props.vm.removeListener(
            "SCRATCH_EXTENSION_REMOVED",
            this.handleScratchExtensionRemoved
        );
        this.props.vm.removeListener(
            "DEVICE_EXTENSION_ADDED",
            this.handleDeviceExtensionAdded
        );
        this.props.vm.removeListener(
            "DEVICE_EXTENSION_REMOVED",
            this.handleDeviceExtensionRemoved
        );
        this.props.vm.removeListener(
            "BLOCKSINFO_UPDATE",
            this.handleBlocksInfoUpdate
        );
        this.props.vm.removeListener(
            "PERIPHERAL_CONNECTED",
            this.handleStatusButtonUpdate
        );
        this.props.vm.removeListener(
            "PERIPHERAL_DISCONNECTED",
            this.handleStatusButtonUpdate
        );
        this.props.vm.removeListener("CODE_NEED_UPDATE", this.onCodeNeedUpdate);
        this.props.vm.removeListener(
            "TOOLBOX_UPLOAD_FINISH",
            this.handleToolboxUploadFinish
        );
    }

    updateToolboxBlockValue(id, value) {
        this.withToolboxUpdates(() => {
            const block = this.workspace
                .getFlyout()
                .getWorkspace()
                .getBlockById(id);
            if (block) {
                block.inputList[0].fieldRow[0].setValue(value);
            }
        });
    }

    onTargetsUpdate() {
        if (this.props.vm.editingTarget && this.workspace.getFlyout()) {
            ["glide", "move", "set"].forEach((prefix) => {
                this.updateToolboxBlockValue(
                    `${prefix}x`,
                    Math.round(this.props.vm.editingTarget.x).toString()
                );
                this.updateToolboxBlockValue(
                    `${prefix}y`,
                    Math.round(this.props.vm.editingTarget.y).toString()
                );
            });
        }
    }
    onWorkspaceMetricsChange() {
        const target = this.props.vm.editingTarget;
        if (target && target.id) {
            // Dispatch updateMetrics later, since onWorkspaceMetricsChange may be (very indirectly)
            // called from a reducer, i.e. when you create a custom procedure.
            // TODO: Is this a vehement hack?
            setTimeout(() => {
                this.props.updateMetrics({
                    targetID: target.id,
                    scrollX: this.workspace.scrollX,
                    scrollY: this.workspace.scrollY,
                    scale: this.workspace.scale,
                });
            }, 0);
        }
    }
    onScriptGlowOn(data) {
        this.workspace.glowStack(data.id, true);
    }
    onScriptGlowOff(data) {
        this.workspace.glowStack(data.id, false);
    }
    onBlockGlowOn(data) {
        this.workspace.glowBlock(data.id, true);
    }
    onBlockGlowOff(data) {
        this.workspace.glowBlock(data.id, false);
    }
    onVisualReport(data) {
        this.workspace.reportValue(data.id, data.value);
    }
    onActivateColorPicker(callback) {
        if (this.props.isRealtimeMode) {
            this.props.onActivateColorPicker(callback);
        }
    }
    getToolboxXML() {
        // Use try/catch because this requires digging pretty deep into the VM
        // Code inside intentionally ignores several error situations (no stage, etc.)
        // Because they would get caught by this try/catch
        try {
            let { editingTarget: target, runtime } = this.props.vm;
            const stage = runtime.getTargetForStage();
            if (!target) target = stage; // If no editingTarget, use the stage
            const stageCostumes = stage.getCostumes();
            const targetCostumes = target.getCostumes();
            const targetSounds = target.getSounds();
            const dynamicBlocksXML = this.props.vm.runtime.getBlocksXML(target);
            const device = this.props.deviceData.find(
                (item) => item.deviceId === this.props.deviceId
            );
            console.log(device);

            return makeToolboxXML(
                false,
                device,
                target.isStage,
                target.id,
                dynamicBlocksXML,
                this.props.isRealtimeMode,
                targetCostumes[targetCostumes.length - 1].name,
                stageCostumes[stageCostumes.length - 1].name,
                targetSounds.length > 0
                    ? targetSounds[targetSounds.length - 1].name
                    : ""
            );
        } catch (error) {
            log.warn(error);
            return null;
        }
    }
    onWorkspaceUpdate(data) {
        // When we change sprites, update the toolbox to have the new sprite's blocks
        const toolboxXML = this.getToolboxXML();
        if (toolboxXML) {
            this.props.updateToolboxState(toolboxXML);
        }

        if (
            this.props.vm.editingTarget &&
            !this.props.workspaceMetrics.targets[this.props.vm.editingTarget.id]
        ) {
            this.onWorkspaceMetricsChange();
        }

        // Remove and reattach the workspace listener (but allow flyout events)
        this.workspace.removeChangeListener(this.props.vm.blockListener);
        const dom = this.ScratchBlocks.Xml.textToDom(data.xml);
        try {
            this.ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(
                dom,
                this.workspace
            );
        } catch (error) {
            // The workspace is likely incomplete. What did update should be
            // functional.
            //
            // Instead of throwing the error, by logging it and continuing as
            // normal lets the other workspace update processes complete in the
            // gui and vm, which lets the vm run even if the workspace is
            // incomplete. Throwing the error would keep things like setting the
            // correct editing target from happening which can interfere with
            // some blocks and processes in the vm.
            if (error.message) {
                error.message = `Workspace Update Error: ${error.message}`;
            }
            log.error(error);
        }
        this.workspace.addChangeListener(this.props.vm.blockListener);

        if (
            this.props.vm.editingTarget &&
            this.props.workspaceMetrics.targets[this.props.vm.editingTarget.id]
        ) {
            const { scrollX, scrollY, scale } =
                this.props.workspaceMetrics.targets[
                    this.props.vm.editingTarget.id
                ];
            this.workspace.scrollX = scrollX;
            this.workspace.scrollY = scrollY;
            this.workspace.scale = scale;
            this.workspace.resize();
        }

        // Clear the undo state of the workspace since this is a
        // fresh workspace and we don't want any changes made to another sprites
        // workspace to be 'undone' here.
        this.workspace.clearUndo();
    }
    handleScratchExtensionAdded(extensionInfo) {
        const { deviceId, categoryInfoArray } = extensionInfo;

        if (deviceId) {
            const dev = this.props.deviceData.find(
                (ext) => ext.deviceId === deviceId
            );
            this.props.onDeviceSelected(dev.deviceId, dev.name, dev.type);
            this.ScratchBlocks.Device.setDevice(dev.deviceId, dev.type);
            if (dev.defaultBaudRate) {
                this.props.onSetBaudrate(dev.defaultBaudRate);
            }

            const supportUploadMode = dev.programMode.includes("upload");
            const supportRealtimeMode = dev.programMode.includes("realtime");

            // eslint-disable-next-line no-negated-condition
            if (supportUploadMode && supportRealtimeMode) {
                this.props.onSetSupportSwitchMode(true);

                const defaultProgramMode = dev.defaultProgramMode;
                if (dev.programMode.includes(defaultProgramMode)) {
                    if (defaultProgramMode === "upload") {
                        this.props.vm.runtime.setRealtimeMode(false);
                    }
                }
            } else {
                if (supportUploadMode) {
                    this.props.vm.runtime.setRealtimeMode(false);
                } else {
                    this.props.vm.runtime.setRealtimeMode(true);
                }
                this.props.onSetSupportSwitchMode(false);
            }

            if (this.deviceFakeToolboxHead) {
                this.deviceFakeToolboxHead = "";
            } else {
                this.deviceFakeToolboxHead = " ";
            }
        }

        categoryInfoArray.forEach((categoryInfo) => {
            const defineBlocks = (blockInfoArray) => {
                if (blockInfoArray && blockInfoArray.length > 0) {
                    const staticBlocksJson = [];
                    const dynamicBlocksInfo = [];
                    blockInfoArray.forEach((blockInfo) => {
                        if (blockInfo.info && blockInfo.info.isDynamic) {
                            dynamicBlocksInfo.push(blockInfo);
                        } else if (blockInfo.json) {
                            staticBlocksJson.push(blockInfo.json);
                        }
                        // otherwise it's a non-block entry such as '---'
                    });

                    this.ScratchBlocks.defineBlocksWithJsonArray(
                        staticBlocksJson
                    );
                    dynamicBlocksInfo.forEach((blockInfo) => {
                        // This is creating the block factory / constructor -- NOT a specific instance of the block.
                        // The factory should only know static info about the block: the category info and the opcode.
                        // Anything else will be picked up from the XML attached to the block instance.
                        const extendedOpcode = `${categoryInfo.id}_${blockInfo.info.opcode}`;
                        // console.log(extendedOpcode);
                        const blockDefinition = defineDynamicBlock(
                            this.ScratchBlocks,
                            categoryInfo,
                            blockInfo,
                            extendedOpcode
                        );
                        this.ScratchBlocks.Blocks[extendedOpcode] =
                            blockDefinition;
                    });
                }
            };

            // openblock-blocks implements a menu or custom field as a special kind of block ("shadow" block)
            // these actually define blocks and MUST run regardless of the UI state
            defineBlocks(
                Object.getOwnPropertyNames(categoryInfo.customFieldTypes).map(
                    (fieldTypeName) =>
                        categoryInfo.customFieldTypes[fieldTypeName]
                            .scratchBlocksDefinition
                )
            );
            defineBlocks(categoryInfo.menus);
            defineBlocks(categoryInfo.blocks);
        });
        // Update the toolbox with new blocks if possible, use timeout to let props update first
        setTimeout(() => {
            const toolboxXML = this.getToolboxXML();
            if (toolboxXML) {
                this.props.updateToolboxState(
                    this.deviceFakeToolboxHead + toolboxXML
                );
            }
        }, 0);
    }

    handleDefineExtensionBlocks(data) {
        const { imageModels, objectModels, trainModels } = data || this.props;

        const imageModelsTemp = imageModels.map((i) =>
            Object.assign({}, i, { modelType: "image" })
        );
        const objectModelsTemp = objectModels.map((i) =>
            Object.assign({}, i, { modelType: "object" })
        );
        const trainModelsTemp = trainModels.map((i) =>
            Object.assign({}, i, { modelType: "train" })
        );

        const Blockly = this.ScratchBlocks;

        const models = []
            .concat(imageModelsTemp)
            .concat(objectModelsTemp)
            .concat(trainModelsTemp);

        const blocks = getBlocks(models);

        const blocksMenus = getMenus(models);
        const coordinatMenu = getCoordinateMenu();

        const menus = [].concat(blocksMenus).concat(coordinatMenu);

        // define blocks
        for (let index = 0; index < blocks.length; index++) {
            let {
                value: {
                    id,
                    modelName, //modelName
                    modelFilePath: fpath, // file path
                    modelData: mlable,
                    modelAnchors: manchors,
                    modelType = "",
                    modelSamplesNum: samplesNum = 15,
                },
                oneBlock,
                twoBlock,
                threeBlock,
            } = blocks[index];
            //  Generate filename for the model
            let fname = fpath.indexOf("0x") != -1 ? fpath : `"${fpath}"`;
            //  Generate a label for the model
            let lable = `[${mlable.map((i) => `'${i.value}'`).join(",")}]`;
            // Generate anchors for the model
            let anchors = `(${
                manchors ||
                "0.57273, 0.677385, 1.87446, 2.06253, 3.33843, 5.47434, 7.88282, 3.52778, 9.77052, 9.16828"
            })`;

            //Define image model block
            if (modelType == "image") {
                Blockly.Maixduino[`${oneBlock}`] = function (block) {
                    Blockly.Maixduino.definitions_["import_imageModel"] =
                        "from image_classification import *";
                    var imageInitCode = [
                        `image${id}_filename = ${fname}`,
                        `image${id}_labels = ${lable}`,
                        `image${id} = ImageClassification(image${id}_filename, image${id}_labels, 1)`,
                    ];
                    Blockly.Maixduino.definitions_[
                        `var_image${id}_init`
                    ] = `${imageInitCode.join("\n")}`;
                    let result =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "RESULT",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || "";
                    let probability =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "PROBABILITY",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || 50;
                    return [
                        `image${id}.is_class('${result}', ${probability})`,
                        Blockly.Maixduino.ORDER_ATOMIC,
                    ];
                };
                Blockly.Maixduino[`${twoBlock}`] = function (block) {
                    Blockly.Maixduino.definitions_["import_imageModel"] =
                        "from image_classification import *";
                    var imageInitCode = [
                        `image${id}_filename = ${fname}`,
                        `image${id}_labels = ${lable}`,
                        `image${id} = ImageClassification(image${id}_filename, image${id}_labels, 1)`,
                    ];
                    Blockly.Maixduino.definitions_[
                        `var_image${id}_init`
                    ] = `${imageInitCode.join("\n")}`;
                    let probability =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "PROBABILITY",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || 50;
                    return [
                        `image${id}.get_classification_result(${probability})`,
                        Blockly.Maixduino.ORDER_ATOMIC,
                    ];
                };
            }
            //Define object model block
            else if (modelType == "object") {
                Blockly.Maixduino[`${oneBlock}`] = function (block) {
                    Blockly.Maixduino.definitions_["import_objectModel"] =
                        "from object_detection import *";
                    var objectInitCode = [
                        `object${id}_filename = ${fname}`,
                        `object${id}_classes = ${lable}`,
                        `object${id}_anchor = ${anchors}`,
                        `object${id} = ObjectDetection(object${id}_filename, object${id}_classes, object${id}_anchor, 1)`,
                    ];
                    Blockly.Maixduino.definitions_[
                        `var_object${id}_init`
                    ] = `${objectInitCode.join("\n")}`;
                    let result =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "RESULT",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || "";
                    let probability =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "PROBABILITY",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || 50;
                    return [
                        `object${id}.is_object('${result}', ${probability})`,
                        Blockly.Maixduino.ORDER_ATOMIC,
                    ];
                };
                Blockly.Maixduino[`${twoBlock}`] = function (block) {
                    Blockly.Maixduino.definitions_["import_objectModel"] =
                        "from object_detection import *";
                    var objectInitCode = [
                        `object${id}_filename = ${fname}`,
                        `object${id}_classes = ${lable}`,
                        `object${id}_anchor = ${anchors}`,
                        `object${id} = ObjectDetection(object${id}_filename, object${id}_classes, object${id}_anchor, 1)`,
                    ];
                    Blockly.Maixduino.definitions_[
                        `var_object${id}_init`
                    ] = `${objectInitCode.join("\n")}`;
                    let probability =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "PROBABILITY",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || 50;
                    return [
                        `object${id}.get_detection_results(${probability})`,
                        Blockly.Maixduino.ORDER_ATOMIC,
                    ];
                };
                Blockly.Maixduino[`${threeBlock}`] = function (block) {
                    Blockly.Maixduino.definitions_["import_objectModel"] =
                        "from object_detection import *";
                    var objectInitCode = [
                        `object${id}_filename = ${fname}`,
                        `object${id}_classes = ${lable}`,
                        `object${id}_anchor = ${anchors}`,
                        `object${id} = ObjectDetection(object${id}_filename, object${id}_classes, object${id}_anchor, 1)`,
                    ];
                    Blockly.Maixduino.definitions_[
                        `var_object${id}_init`
                    ] = `${objectInitCode.join("\n")}`;
                    let xy =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "XY",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || "1";
                    let result =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "RESULT",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || "";
                    let probability =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "PROBABILITY",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || 50;
                    return [
                        `object${id}.get_object_property('${result}', ${probability}, ${xy})`,
                        Blockly.Maixduino.ORDER_ATOMIC,
                    ];
                };
            }
            //Define train model block
            else if (modelType == "train") {
                Blockly.Maixduino[`modelExtension_recordSeedSample${id}`] =
                    function (block) {
                        Blockly.Maixduino.definitions_["import_localtrain"] =
                            "from local_training import *";
                        var objectInitCode = [
                            `modeltrain${id}_classes = ${lable}`,
                            `modeltrain${id}_samplesnumber = ${samplesNum}`,
                            `modeltrain${id} = OnDeviceTraining(modeltrain${id}_classes, modeltrain${id}_samplesnumber, 1)`,
                        ];
                        Blockly.Maixduino.definitions_[
                            `var_localtrain${id}_init`
                        ] = `${objectInitCode.join("\n")}`;
                        let result =
                            Blockly.Maixduino.valueToCode(
                                block,
                                "RESULT",
                                Blockly.Maixduino.ORDER_ATOMIC
                            ) || "";
                        return `modeltrain${id}.record_seed_sample('${result}')\n`;
                    };

                Blockly.Maixduino[`modelExtension_recordSample${id}`] =
                    function (block) {
                        Blockly.Maixduino.definitions_["import_localtrain"] =
                            "from local_training import *";
                        var objectInitCode = [
                            `modeltrain${id}_classes = ${lable}`,
                            `modeltrain${id}_samplesnumber = ${samplesNum}`,
                            `modeltrain${id} = OnDeviceTraining(modeltrain${id}_classes, modeltrain${id}_samplesnumber, 1)`,
                        ];
                        Blockly.Maixduino.definitions_[
                            `var_localtrain${id}_init`
                        ] = `${objectInitCode.join("\n")}`;
                        return `modeltrain${id}.record_samples_training()\n`;
                    };

                Blockly.Maixduino[`modelExtension_recognized${id}`] = function (
                    block
                ) {
                    Blockly.Maixduino.definitions_["import_localtrain"] =
                        "from local_training import *";
                    var objectInitCode = [
                        `modeltrain${id}_classes = ${lable}`,
                        `modeltrain${id}_samplesnumber = ${samplesNum}`,
                        `modeltrain${id} = OnDeviceTraining(modeltrain${id}_classes, modeltrain${id}_samplesnumber, 1)`,
                    ];
                    Blockly.Maixduino.definitions_[
                        `var_localtrain${id}_init`
                    ] = `${objectInitCode.join("\n")}`;
                    let result =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "RESULT",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || "";
                    let probability =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "PROBABILITY",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || 50;
                    return [
                        `modeltrain${id}.is_class('${result}', ${probability})`,
                        Blockly.Maixduino.ORDER_ATOMIC,
                    ];
                };

                Blockly.Maixduino[`modelExtension_recognizedResult${id}`] =
                    function (block) {
                        Blockly.Maixduino.definitions_["import_localtrain"] =
                            "from local_training import *";
                        var objectInitCode = [
                            `modeltrain${id}_classes = ${lable}`,
                            `modeltrain${id}_samplesnumber = ${samplesNum}`,
                            `modeltrain${id} = OnDeviceTraining(modeltrain${id}_classes, modeltrain${id}_samplesnumber, 1)`,
                        ];
                        Blockly.Maixduino.definitions_[
                            `var_localtrain${id}_init`
                        ] = `${objectInitCode.join("\n")}`;
                        let probability =
                            Blockly.Maixduino.valueToCode(
                                block,
                                "PROBABILITY",
                                Blockly.Maixduino.ORDER_ATOMIC
                            ) || 50;
                        return [
                            `modeltrain${id}.get_classification_result(${probability})`,
                            Blockly.Maixduino.ORDER_ATOMIC,
                        ];
                    };

                Blockly.Maixduino[`modelExtension_modelSave${id}`] = function (
                    block
                ) {
                    Blockly.Maixduino.definitions_["import_localtrain"] =
                        "from local_training import *";
                    var objectInitCode = [
                        `modeltrain${id}_classes = ${lable}`,
                        `modeltrain${id}_samplesnumber = ${samplesNum}`,
                        `modeltrain${id} = OnDeviceTraining(modeltrain${id}_classes, modeltrain${id}_samplesnumber, 1)`,
                    ];
                    Blockly.Maixduino.definitions_[
                        `var_localtrain${id}_init`
                    ] = `${objectInitCode.join("\n")}`;
                    let filename =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "NAME",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || "";
                    return `modeltrain${id}.save_model_file(${filename})\n`;
                };

                Blockly.Maixduino[`modelExtension_modelLoad${id}`] = function (
                    block
                ) {
                    Blockly.Maixduino.definitions_["import_localtrain"] =
                        "from local_training import *";
                    var objectInitCode = [
                        `modeltrain${id}_classes = ${lable}`,
                        `modeltrain${id}_samplesnumber = ${samplesNum}`,
                        `modeltrain${id} = OnDeviceTraining(modeltrain${id}_classes, modeltrain${id}_samplesnumber, 1)`,
                    ];
                    Blockly.Maixduino.definitions_[
                        `var_localtrain${id}_init`
                    ] = `${objectInitCode.join("\n")}`;
                    let filename =
                        Blockly.Maixduino.valueToCode(
                            block,
                            "NAME",
                            Blockly.Maixduino.ORDER_ATOMIC
                        ) || "";
                    return `modeltrain${id}.load_model_file(${filename})\n`;
                };
            }
        }

        //Definition menu
        for (let index = 0; index < menus.length; index++) {
            let { ipcode, menu } = menus[index];
            Blockly.Maixduino[`${ipcode}`] = function (block) {
                let branch = block.getFieldValue(`${menu}`);
                return [branch, Blockly.Maixduino.ORDER_ATOMIC];
            };
        }
    }

    handleScratchExtensionRemoved(extensionInfo) {
        const { deviceId } = extensionInfo;

        if (deviceId) {
            this.props.onDeviceSelected(null, null, null);
            this.props.vm.runtime.setRealtimeMode(true);
            this.props.onSetSupportSwitchMode(false);
        }
        const toolboxXML = this.getToolboxXML();
        if (toolboxXML) {
            this.props.updateToolboxState(
                this.deviceFakeToolboxHead + toolboxXML
            );
        }
    }
    handleDeviceExtensionAdded(deviceExtensionsRegister) {
        if (deviceExtensionsRegister.defineMessages) {
            this.ScratchBlocks = deviceExtensionsRegister.defineMessages(
                this.ScratchBlocks
            );
        }
        if (deviceExtensionsRegister.defineGenerators) {
            this.ScratchBlocks = deviceExtensionsRegister.defineGenerators(
                this.ScratchBlocks
            );
        }
        if (deviceExtensionsRegister.defineBlocks) {
            this.ScratchBlocks = deviceExtensionsRegister.defineBlocks(
                this.ScratchBlocks
            );
        }

        this.setLocale(false);

        const toolboxXML = this.getToolboxXML();
        if (toolboxXML) {
            this.props.updateToolboxState(toolboxXML);
        }
    }
    handleDeviceExtensionRemoved() {
        const toolboxXML = this.getToolboxXML();
        if (toolboxXML) {
            this.props.updateToolboxState(toolboxXML);
        }
    }
    handleBlocksInfoUpdate(extensionInfo) {
        // @todo Later we should replace this to avoid all the warnings from redefining blocks.
        this.handleScratchExtensionAdded(extensionInfo);
        this.handleDefineExtensionBlocks();
    }
    handleCategorySelected(categoryId) {
        const extension = extensionData.find(
            (ext) => ext.extensionId === categoryId
        );
        if (extension && extension.launchPeripheralConnectionFlow) {
            this.handleConnectionModalStart();
        }

        this.withToolboxUpdates(() => {
            this.workspace.toolbox_.setSelectedCategoryById(categoryId);
        });
    }
    handleDeviceSelected(categoryId) {
        const device = this.props.deviceData.find(
            (ext) => ext.deviceId === categoryId
        );

        if (device && device.launchPeripheralConnectionFlow) {
            this.handleConnectionModalStart();
        }

        this.withToolboxUpdates(() => {
            this.workspace.toolbox_.setSelectedCategoryById(categoryId);
        });
    }
    setBlocks(blocks) {
        this.blocks = blocks;
    }
    handlePromptStart(message, defaultValue, callback, optTitle, optVarType) {
        const p = { prompt: { callback, message, defaultValue } };
        p.prompt.title = optTitle
            ? optTitle
            : this.ScratchBlocks.Msg.VARIABLE_MODAL_TITLE;
        p.prompt.varType =
            typeof optVarType === "string"
                ? optVarType
                : this.ScratchBlocks.SCALAR_VARIABLE_TYPE;
        p.prompt.showVariableOptions = // This flag means that we should show variable/list options about scope
            optVarType !== this.ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE &&
            p.prompt.title !==
                this.ScratchBlocks.Msg.RENAME_VARIABLE_MODAL_TITLE &&
            p.prompt.title !== this.ScratchBlocks.Msg.RENAME_LIST_MODAL_TITLE;
        p.prompt.showCloudOption =
            optVarType === this.ScratchBlocks.SCALAR_VARIABLE_TYPE &&
            this.props.canUseCloud;
        this.setState(p);
    }
    handleConnectionModalStart() {
        this.props.onOpenConnectionModal();
    }
    handleStatusButtonUpdate() {
        this.ScratchBlocks.refreshStatusButtons(this.workspace);
    }
    workspaceToCode() {
        let code;
        try {
            const generatorName = getGeneratorNameFromDeviceType(
                this.props.deviceType
            );
            console.log(generatorName);

            code = this.ScratchBlocks[generatorName].workspaceToCode(
                this.workspace
            );
        
        } catch (e) {
            code = e.message;
        }
        console.log(code);
        return code;
    }
    handleToolboxUploadFinish() {
        this.props.onToolboxDidUpdate();
    }
    onCodeNeedUpdate() {
        if (this.props.isCodeEditorLocked) {
            if (this.props.isRealtimeMode === false) {
                this.props.onSetCodeEditorValue(this.workspaceToCode());
            }
        } else {
            this.props.onCodeEditorIsUnlocked();
        }
    }
    handleOpenSoundRecorder() {
        this.props.onOpenSoundRecorder();
    }

    /*
     * Pass along information about proposed name and variable options (scope and isCloud)
     * and additional potentially conflicting variable names from the VM
     * to the variable validation prompt callback used in openblock-blocks.
     */
    handlePromptCallback(input, variableOptions) {
        this.state.prompt.callback(
            input,
            this.props.vm.runtime.getAllVarNamesOfType(
                this.state.prompt.varType
            ),
            variableOptions
        );
        this.handlePromptClose();
    }
    handlePromptClose() {
        this.setState({ prompt: null });
    }
    handleCustomProceduresClose(data) {
        this.props.onRequestCloseCustomProcedures(data);
        const ws = this.workspace;
        ws.refreshToolboxSelection_();
        ws.toolbox_.scrollToCategoryById("myBlocks");
    }
    handleDrop(dragInfo) {
        fetch(dragInfo.payload.bodyUrl)
            .then((response) => response.json())
            .then((blocks) =>
                this.props.vm.shareBlocksToTarget(
                    blocks,
                    this.props.vm.editingTarget.id
                )
            )
            .then(() => {
                this.props.vm.refreshWorkspace();
                this.updateToolbox(); // To show new variables/custom blocks
            });
    }
    render() {
        /* eslint-disable no-unused-vars */
        const {
            anyModalVisible,
            canUseCloud,
            customProceduresVisible,
            deviceData,
            deviceId,
            deviceLibraryVisible,
            deviceType,
            onExtensionDivClick,
            peripheralName,
            extensionLibraryVisible,
            options,
            stageSize,
            vm,
            isCodeEditorLocked,
            isRealtimeMode,
            isRtl,
            isVisible,
            onActivateColorPicker,
            onDeviceSelected,
            //AI Model
            openTrainModalState,
            openTrainVideoModalState,
            openRecognizeVideoModalState,
            showImageModelsView,
            showObjectModelsView,
            showTrainModelsView,
            updateImageModels,
            updateObjectModels,
            updateCreateSkillModels,
            updateTrainModels,
            trainModels,
            imageModels,
            objectModels,

            onOpenConnectionModal,
            onOpenSoundRecorder,
            onToolboxWillUpdate,
            onToolboxDidUpdate,
            updateToolboxState,
            onActivateCustomProcedures,
            onCodeEditorIsUnlocked,
            onRequestCloseExtensionLibrary,
            onRequestCloseDeviceLibrary,
            onRequestCloseCustomProcedures,
            onSetCodeEditorValue,
            onSetSupportSwitchMode,
            onSetBaudrate,
            toolboxXML,
            updateMetrics: updateMetricsProp,
            workspaceMetrics,
            ...props
        } = this.props;
        /* eslint-enable no-unused-vars */
        return (
            <React.Fragment>
                <DroppableBlocks
                    componentRef={this.setBlocks}
                    onDrop={this.handleDrop}
                    {...props}
                />
                {this.state.prompt ? (
                    <Prompt
                        defaultValue={this.state.prompt.defaultValue}
                        isStage={vm.runtime.getEditingTarget().isStage}
                        showListMessage={
                            this.state.prompt.varType ===
                            this.ScratchBlocks.LIST_VARIABLE_TYPE
                        }
                        label={this.state.prompt.message}
                        showCloudOption={this.state.prompt.showCloudOption}
                        showVariableOptions={
                            this.state.prompt.showVariableOptions
                        }
                        title={this.state.prompt.title}
                        vm={vm}
                        onCancel={this.handlePromptClose}
                        onOk={this.handlePromptCallback}
                    />
                ) : null}
                {deviceLibraryVisible ? (
                    <DeviceLibrary
                        vm={vm}
                        onDeviceSelected={this.handleDeviceSelected}
                        onRequestClose={onRequestCloseDeviceLibrary}
                    />
                ) : null}
                {extensionLibraryVisible ? (
                    <ExtensionLibrary
                        vm={vm}
                        onCategorySelected={this.handleCategorySelected}
                        onRequestClose={onRequestCloseExtensionLibrary}
                    />
                ) : null}
                {customProceduresVisible ? (
                    <CustomProcedures
                        options={{
                            media: options.media
                        }}
                        onRequestClose={this.handleCustomProceduresClose}
                    />
                ) : null} 
            </React.Fragment>
        );
    }
}

Blocks.propTypes = {
    anyModalVisible: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    customProceduresVisible: PropTypes.bool,
    deviceData: PropTypes.instanceOf(Array).isRequired,
    deviceId: PropTypes.string,
    deviceType: PropTypes.string,
    peripheralName: PropTypes.string,
    deviceLibraryVisible: PropTypes.bool,
    extensionLibraryVisible: PropTypes.bool,
    isCodeEditorLocked: PropTypes.bool.isRequired,
    isRealtimeMode: PropTypes.bool,
    isRtl: PropTypes.bool,
    isVisible: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    messages: PropTypes.oneOfType([
        PropTypes.objectOf(PropTypes.string),
        PropTypes.shape({
            format: PropTypes.func,
            message: PropTypes.string,
        }),
    ]),
    onActivateColorPicker: PropTypes.func,
    onActivateCustomProcedures: PropTypes.func,
    onCodeEditorIsUnlocked: PropTypes.func,
    onDeviceSelected: PropTypes.func,
    onOpenConnectionModal: PropTypes.func,
    onOpenSoundRecorder: PropTypes.func,
    onToolboxWillUpdate: PropTypes.func,
    onToolboxDidUpdate: PropTypes.func,
    onRequestCloseCustomProcedures: PropTypes.func,
    onRequestCloseExtensionLibrary: PropTypes.func,
    onRequestCloseDeviceLibrary: PropTypes.func,
    options: PropTypes.shape({
        media: PropTypes.string,
        zoom: PropTypes.shape({
            controls: PropTypes.bool,
            wheel: PropTypes.bool,
            startScale: PropTypes.number,
        }),
        colours: PropTypes.shape({
            workspace: PropTypes.string,
            flyout: PropTypes.string,
            toolbox: PropTypes.string,
            toolboxSelected: PropTypes.string,
            scrollbar: PropTypes.string,
            scrollbarHover: PropTypes.string,
            insertionMarker: PropTypes.string,
            insertionMarkerOpacity: PropTypes.number,
            fieldShadow: PropTypes.string,
            dragShadowOpacity: PropTypes.number,
        }),
        comments: PropTypes.bool,
        collapse: PropTypes.bool,
    }),
    onSetBaudrate: PropTypes.func.isRequired,
    onSetCodeEditorValue: PropTypes.func,
    onSetSupportSwitchMode: PropTypes.func,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    toolboxXML: PropTypes.string,
    updateMetrics: PropTypes.func,
    updateToolboxState: PropTypes.func,
    onExtensionDivClick: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
    workspaceMetrics: PropTypes.shape({
        targets: PropTypes.objectOf(PropTypes.object),
    }),
};

Blocks.defaultOptions = {
    zoom: {
        controls: true,
        wheel: true,
        startScale: BLOCKS_DEFAULT_SCALE,
    },
    grid: {
        spacing: 40,
        length: 2,
        colour: "#ddd",
    },
    colours: {
        workspace: "#F9F9F9",
        text: "#575E75",
        flyout: "#a7bdd6",
        toolbox: "#FFFFFF",
        toolboxSelected: "#E9EEF2",
        scrollbar: "#CECDCE",
        scrollbarHover: "#CECDCE",
        insertionMarker: "#000000",
        insertionMarkerOpacity: 0.2,
        fieldShadow: "rgba(255, 255, 255, 0.3)",
        dragShadowOpacity: 0.6,
    },
    comments: true,
    collapse: false,
    sounds: false,
};

Blocks.defaultProps = {
    isVisible: true,
    options: Blocks.defaultOptions,
};

const mapStateToProps = (state) => ({
    anyModalVisible:
        Object.keys(state.scratchGui.modals).some(
            (key) => state.scratchGui.modals[key]
        ) || state.scratchGui.mode.isFullScreen,
    deviceData: state.scratchGui.deviceData.deviceData,
    deviceId: state.scratchGui.device.deviceId,
    deviceType: state.scratchGui.device.deviceType,
    peripheralName: state.scratchGui.connectionModal.peripheralName,
    deviceLibraryVisible: state.scratchGui.modals.deviceLibrary,
    extensionLibraryVisible: state.scratchGui.modals.extensionLibrary,
    isCodeEditorLocked: state.scratchGui.code.isCodeEditorLocked,
    isRealtimeMode: state.scratchGui.programMode.isRealtimeMode,
    isRtl: state.locales.isRtl,
    locale: state.locales.locale,
    messages: state.locales.messages,
    toolboxXML: state.scratchGui.toolbox.toolboxXML,
    customProceduresVisible: state.scratchGui.customProcedures.active,
    workspaceMetrics: state.scratchGui.workspaceMetrics,
    imageModels: state.scratchGui.modelsCtr.imageModels,
    objectModels: state.scratchGui.modelsCtr.objectModels,
    trainModels: state.scratchGui.modelsCtr.trainModels,
});

const mapDispatchToProps = (dispatch) => ({
    onActivateColorPicker: (callback) =>
        dispatch(activateColorPicker(callback)),
    onActivateCustomProcedures: (data, callback) =>
        dispatch(activateCustomProcedures(data, callback)),
    onDeviceSelected: (id, name, type) => {
        dispatch(setDeviceId(id));
        dispatch(setDeviceName(name));
        dispatch(setDeviceType(type));
    },
    onOpenConnectionModal: () => {
        dispatch(openConnectionModal());
    },
    onOpenSoundRecorder: () => {
        dispatch(activateTab(SOUNDS_TAB_INDEX));
        dispatch(openSoundRecorder());
    },
    onExtensionDivClick: () => {
        dispatch(openExtensionLibrary());
    },
    onRequestCloseExtensionLibrary: () => {
        dispatch(closeExtensionLibrary());
    },
    onRequestCloseDeviceLibrary: () => {
        dispatch(closeDeviceLibrary());
    },
    onRequestCloseCustomProcedures: (data) => {
        dispatch(deactivateCustomProcedures(data));
    },
    onSetBaudrate: (baudrate) => dispatch(setBaudrate(baudrate)),
    onToolboxWillUpdate: () => {
        dispatch(setIsUpdating(true));
    },
    onToolboxDidUpdate: () => {
        dispatch(setIsUpdating(false));
    },
    openTrainModalState: () => {
        dispatch(openTrainModal());
    },
    openTrainVideoModalState: () => {
        dispatch(openTrainVideoModal());
    },
    openRecognizeVideoModalState: () => {
        dispatch(openRecognizeVideoModal());
    },

    showImageModelsView: () => {
        dispatch(updateImageModelsState(true));
    },
    showObjectModelsView: () => {
        dispatch(updateObjectModelsState(true));
    },
    showTrainModelsView: () => {
        dispatch(updateTrainModelsState(true));
    },

    updateToolboxState: (toolboxXML) => {
        dispatch(updateToolbox(toolboxXML));
    },
    updateMetrics: (metrics) => {
        dispatch(updateMetrics(metrics));
    },
    onSetCodeEditorValue: (value) => {
        dispatch(setCodeEditorValue(value));
    },
    updateImageModels: (data) => dispatch(updateImageModels(data)),
    updateObjectModels: (data) => dispatch(updateObjectModels(data)),
    updateTrainModels: (data) => dispatch(updateTrainModels(data)),
    onSetSupportSwitchMode: (state) => dispatch(setSupportSwitchMode(state)),
    onCodeEditorIsUnlocked: () =>
        showAlertWithTimeout(dispatch, "codeEditorIsUnlocked"),
});

export default errorBoundaryHOC("Blocks")(
    connect(mapStateToProps, mapDispatchToProps)(Blocks)
);
