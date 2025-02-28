import analytics from '../lib/analytics';
const OPEN_MODAL = 'scratch-gui/modals/OPEN_MODAL';
const CLOSE_MODAL = 'scratch-gui/modals/CLOSE_MODAL';

const MODAL_BACKDROP_LIBRARY = 'backdropLibrary';
const MODAL_COSTUME_LIBRARY = 'costumeLibrary';
const MODAL_EXTENSION_LIBRARY = 'extensionLibrary';
const MODAL_LOADING_PROJECT = 'loadingProject';
const MODAL_TELEMETRY = 'telemetryModal';
const MODAL_SOUND_LIBRARY = 'soundLibrary';
const MODAL_SPRITE_LIBRARY = 'spriteLibrary';
const MODAL_SOUND_RECORDER = 'soundRecorder';
const MODAL_CONNECTION = 'connectionModal';
const MODAL_TIPS_LIBRARY = 'tipsLibrary';
const MODAL_UPLOAD_PROGRESS = 'uploadProgress';
const MODAL_DEVICE_LIBRARY = 'deviceLibrary';
const MODAL_UPDATE = 'updateModal';
const MODAL_CAMERA_CAPTURE = 'cameraCapture';
const MODAL_IMPORT_INFO = 'importInfo';
const MODAL_CONNECT = 'connect';

//train model
const MODAL_TRAIN = 'trainModal';

//train video model
const MODAL_TRAIN_VIDEO = 'trainVideoModal';

//recognize video modal
const MODAL_RECOGNIZE_VIDEO = 'recognizeVideoModal';



const initialState = {
    [MODAL_CAMERA_CAPTURE]: false,
    [MODAL_BACKDROP_LIBRARY]: false,
    [MODAL_IMPORT_INFO]: false,
    [MODAL_COSTUME_LIBRARY]: false,
    [MODAL_EXTENSION_LIBRARY]: false,
    [MODAL_LOADING_PROJECT]: false,
    [MODAL_TELEMETRY]: false,
    [MODAL_SOUND_LIBRARY]: false,
    [MODAL_SPRITE_LIBRARY]: false,
    [MODAL_SOUND_RECORDER]: false,
    [MODAL_CONNECTION]: false,
    [MODAL_UPLOAD_PROGRESS]: false,
    [MODAL_DEVICE_LIBRARY]: false,
    [MODAL_TIPS_LIBRARY]: false,
    [MODAL_UPDATE]: false,
    [MODAL_CONNECT]: false,
    [MODAL_TRAIN]: false,
    [MODAL_TRAIN_VIDEO]: false,
    [MODAL_RECOGNIZE_VIDEO]: false,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case OPEN_MODAL:
        return Object.assign({}, state, {
            [action.modal]: true
        });
    case CLOSE_MODAL:
        return Object.assign({}, state, {
            [action.modal]: false
        });
    default:
        return state;
    }
};
const openModal = function (modal) {
    return {
        type: OPEN_MODAL,
        modal: modal
    };
};
const closeModal = function (modal) {
    return {
        type: CLOSE_MODAL,
        modal: modal
    };
};
const openCameraCapture = function () {
    analytics.pageview('/modals/camera');
    return openModal(MODAL_CAMERA_CAPTURE);
};
const openImportInfo = function () {
    analytics.pageview('modals/import');
    return openModal(MODAL_IMPORT_INFO);
};
const openBackdropLibrary = function () {
    return openModal(MODAL_BACKDROP_LIBRARY);
};
const openCostumeLibrary = function () {
    return openModal(MODAL_COSTUME_LIBRARY);
};
const openExtensionLibrary = function () {
    return openModal(MODAL_EXTENSION_LIBRARY);
};
const openLoadingProject = function () {
    return openModal(MODAL_LOADING_PROJECT);
};
const openTelemetryModal = function () {
    return openModal(MODAL_TELEMETRY);
};
const openSoundLibrary = function () {
    return openModal(MODAL_SOUND_LIBRARY);
};
const openSpriteLibrary = function () {
    return openModal(MODAL_SPRITE_LIBRARY);
};
const openSoundRecorder = function () {
    return openModal(MODAL_SOUND_RECORDER);
};
const openConnectionModal = function () {
    return openModal(MODAL_CONNECTION);
};
const openUploadProgress = function () {
    return openModal(MODAL_UPLOAD_PROGRESS);
};
const openDeviceLibrary = function () {
    return openModal(MODAL_DEVICE_LIBRARY);
};
const openTipsLibrary = function () {
    return openModal(MODAL_TIPS_LIBRARY);
};
const openUpdateModal = function () {
    return openModal(MODAL_UPDATE);
};
const closeBackdropLibrary = function () {
    return closeModal(MODAL_BACKDROP_LIBRARY);
};
const closeCostumeLibrary = function () {
    return closeModal(MODAL_COSTUME_LIBRARY);
};
const closeExtensionLibrary = function () {
    return closeModal(MODAL_EXTENSION_LIBRARY);
};
const closeLoadingProject = function () {
    return closeModal(MODAL_LOADING_PROJECT);
};
const closeTelemetryModal = function () {
    return closeModal(MODAL_TELEMETRY);
};
const closeSpriteLibrary = function () {
    return closeModal(MODAL_SPRITE_LIBRARY);
};
const closeSoundLibrary = function () {
    return closeModal(MODAL_SOUND_LIBRARY);
};
const closeSoundRecorder = function () {
    return closeModal(MODAL_SOUND_RECORDER);
};
const closeTipsLibrary = function () {
    return closeModal(MODAL_TIPS_LIBRARY);
};
const closeConnectionModal = function () {
    return closeModal(MODAL_CONNECTION);
};
const closeUploadProgress = function () {
    return closeModal(MODAL_UPLOAD_PROGRESS);
};
const closeDeviceLibrary = function () {
    return closeModal(MODAL_DEVICE_LIBRARY);
};
const closeUpdateModal = function () {
    return closeModal(MODAL_UPDATE);
};

const openConnectView = function () {
    analytics.pageview('/modals/connect');
    return openModal(MODAL_CONNECT);
};
const openTrainModal = function () {
    analytics.pageview('/modals/trainModal');
    return openModal(MODAL_TRAIN);
};
const openTrainVideoModal = function () {
    analytics.pageview('/modals/trainVideoModal');
    return openModal(MODAL_TRAIN_VIDEO);
};
const openRecognizeVideoModal = function () {
    analytics.pageview('/modals/recognizeVideoModal');
    return openModal(MODAL_RECOGNIZE_VIDEO);
};


const closeCameraCapture = function () {
    return closeModal(MODAL_CAMERA_CAPTURE);
};

const closeImportInfo = function () {
    return closeModal(MODAL_IMPORT_INFO);
};

const closeConnectView = function () {
    return closeModal(MODAL_CONNECT);
};
const closeTrainModal = function () {
    console.log("trainModel Closed")
    return closeModal(MODAL_TRAIN);
};
const closeTrainVideoModal = function () {
    return closeModal(MODAL_TRAIN_VIDEO);
};
 const closeRecognizeVideoModal = function () {
    return closeModal(MODAL_RECOGNIZE_VIDEO);
};
export {
    reducer as default,
    initialState as modalsInitialState,
    openCameraCapture,
    openImportInfo,
    openBackdropLibrary,
    openConnectionModal,
    openCostumeLibrary,
    openDeviceLibrary,
    openExtensionLibrary,
    openLoadingProject,
    openSoundLibrary,
    openSpriteLibrary,
    openSoundRecorder,
    openTelemetryModal,
    openTipsLibrary,
    openUploadProgress,
    openUpdateModal,
    openTrainModal,
    openTrainVideoModal,
    openRecognizeVideoModal,
    closeCameraCapture,
    closeImportInfo,
    closeBackdropLibrary,
    closeConnectionModal,
    closeCostumeLibrary,
    closeDeviceLibrary,
    closeExtensionLibrary,
    closeLoadingProject,
    closeSpriteLibrary,
    closeSoundLibrary,
    closeSoundRecorder,
    closeTelemetryModal,
    closeTipsLibrary,
    closeUploadProgress,
    closeUpdateModal,
    closeTrainModal,
    closeTrainVideoModal,
    closeRecognizeVideoModal,
};
