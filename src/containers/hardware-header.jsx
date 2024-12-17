import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';

import {connect} from 'react-redux';
import {compose} from 'redux';
import {injectIntl} from 'react-intl';

import VM from 'openblock-vm';

import {setStageSize} from '../reducers/stage-size';
import {STAGE_SIZE_MODES} from '../lib/layout-constants';
import {openUploadProgress} from '../reducers/modals';
import {showAlertWithTimeout} from '../reducers/alerts';

import HardwareHeaderComponent from '../components/hardware-header/hardware-header.jsx';

class HardwareHeader extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleUpload'
        ]);
    }

    handleUpload () {
        if (this.props.peripheralName) {
            const deviceID = this.props.deviceId;
            const codeEditorValue = this.props.codeEditorValue;
            
            const blocks = document.querySelector('.blocklyWorkspace .blocklyBlockCanvas');
            if (blocks.getBBox().height === 0) {
                this.props.onWorkspaceIsEmpty();
            }
            else if(deviceID === 'maxAI'){
                console.log("upload code in maxAI")
                console.log(codeEditorValue);
                console.log("Uploading code to maxAI");
                // Construct upload sequence
                const lines = codeEditorValue.split('\n').map(line => {
                    // Process each line, remove \r, trim, and add \n
                    return line.replace(/\r/g, '') + '\n';
                });
                console.log(lines)
                // Construct the initial setup code
                const setupCode = 
                    `f=open('boot.py','w');_=f.write('execfile("petal.py")');f.close();f=open('petal.py','w')\r`;
            
                // Send the setup code to the peripheral
                this.props.vm.writeToPeripheral(deviceID, setupCode);

                // Send each line of code sequentially
                for (const line of lines) {
                    const formattedLine = `_=f.write("${line.replace(/"/g, '\\"')}\\n");\n`; // Escape quotes and add newline
                    console.log(formattedLine);
                    this.props.vm.writeToPeripheral(deviceID, `${formattedLine}\r`);
                    // this.props.vm.writeToPeripheral(deviceID, `\n\r`);
                }

                // Close the file and execute the script
                const finalizeCode = `f.close();del f;print('Upload done!');execfile("petal.py");\n\r`; // Minify and format
                // Send the code to the peripheral
                this.props.vm.writeToPeripheral(deviceID, finalizeCode);
                
            } 
            else {
                console.log("upload to peropheral");
                this.props.vm.uploadToPeripheral(this.props.deviceId, this.props.codeEditorValue);
                this.props.onOpenUploadProgress();
            }
        } else {
            this.props.onNoPeripheralIsConnected();
        }
    }

    render () {
        const {
            ...props
        } = this.props;
        return (
            <HardwareHeaderComponent
                onUpload={this.handleUpload}
                {...props}
            />
        );
    }
}

HardwareHeader.propTypes = {
    codeEditorValue: PropTypes.string,
    deviceId: PropTypes.string,
    onNoPeripheralIsConnected: PropTypes.func.isRequired,
    onOpenUploadProgress: PropTypes.func,
    onWorkspaceIsEmpty: PropTypes.func.isRequired,
    peripheralName: PropTypes.string,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    codeEditorValue: state.scratchGui.code.codeEditorValue,
    deviceId: state.scratchGui.device.deviceId,
    peripheralName: state.scratchGui.connectionModal.peripheralName,
    stageSizeMode: state.scratchGui.stageSize.stageSize
});

const mapDispatchToProps = dispatch => ({
    onNoPeripheralIsConnected: () => showAlertWithTimeout(dispatch, 'connectAPeripheralFirst'),
    onSetStageLarge: () => dispatch(setStageSize(STAGE_SIZE_MODES.large)),
    onSetStageSmall: () => dispatch(setStageSize(STAGE_SIZE_MODES.small)),
    onSetStageHide: () => dispatch(setStageSize(STAGE_SIZE_MODES.hide)),
    onOpenUploadProgress: () => dispatch(openUploadProgress()),
    onWorkspaceIsEmpty: () => showAlertWithTimeout(dispatch, 'workspaceIsEmpty')
});

export default compose(
    injectIntl,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(HardwareHeader);
