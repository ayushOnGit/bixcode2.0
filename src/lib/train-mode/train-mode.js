
class TrainMode {
    constructor () {
        this.classificationList = [];
        this.predictionID = 0;
        this.blockOnclick;
        this.isTrain = false;
        this.options = {};
        this.restoreWorkspaceRetrainCallback;
        this.restoreWorkspaceRepredictCallback;
    }

    setClassificationList (classificationList) {
        this.classificationList = classificationList;
    }

    setOptions (options) {
        this.options = Object.assign({}, options);
    }

    setPredictionID (predictionID) {
        this.predictionID = predictionID;
    }

    setIsTrain (isTrain) {
        this.isTrain = isTrain;
    }

    clear() {
        this.classificationList = [];
        this.predictionID = 0;
        this.isTrain = false;
    }

    setRestoreWorkspaceRetrainCallback (restoreWorkspaceRetrainCallback) {
        this.restoreWorkspaceRetrainCallback = restoreWorkspaceRetrainCallback;
    }

    setRestoreWorkspaceRepredictCallback (restoreWorkspaceRepredictCallback) {
        this.restoreWorkspaceRepredictCallback = restoreWorkspaceRepredictCallback;
    }

    saveWorkspace(onLine) {
        let modelStr=''
        if(this.isTrain){
            const modelObj = {
                classificationList:this.classificationList,
                options:this.options
            }
            modelStr = JSON.stringify(modelObj)
        }
        return modelStr;
    }

    repredict() {
        if(this.restoreWorkspaceRepredictCallback){
            this.restoreWorkspaceRepredictCallback()
        }
    }

    async restoreWorkspace(params,onLine,onFinish) {
        let isFinish = false;
        if(typeof params == 'string') {
            if(params!=null&&params!='') {
                const jsonObj = JSON.parse(params)
                if(typeof jsonObj == 'object'){
                    if(this.restoreWorkspaceRetrainCallback){
                        isFinish = true;
                        await this.restoreWorkspaceRetrainCallback(jsonObj,onLine,onFinish)
                    }
                }
            }
        }
        if(!isFinish&&onFinish){
            onFinish();
        }
    }
}

export default TrainMode;
