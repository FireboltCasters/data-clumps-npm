import React, {FunctionComponent, ReactNode} from 'react';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import {useSynchedModalState} from "../storage/SynchedStateHelper";
import {SynchedStates} from "../storage/SynchedStates";
import {Dialog} from "primereact/dialog";
import {WebIdeFileExplorerDropZone} from "./WebIdeFileExplorerDropZone";

export interface WebIdeFileExplorerDropZoneModalProps {
    children?: ReactNode;
}

export const WebIdeFileExplorerDropZoneModal : FunctionComponent<WebIdeFileExplorerDropZoneModalProps> = (props: WebIdeFileExplorerDropZoneModalProps) => {

    const [modalOptions, setModalOptions] = useSynchedModalState(SynchedStates.dropzoneModal);

    const visible = modalOptions?.visible;

    function onHide(){
        modalOptions.visible = false;
        setModalOptions(modalOptions)
    }

    const content = modalOptions?.content;

    return(
        <Dialog key={visible+""} visible={visible} header={"Open File"} onHide={onHide} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw', height: "50vh"}}>
            <WebIdeFileExplorerDropZone onDropComplete={() => {
                onHide();
            }}>
                {props?.children}
            </WebIdeFileExplorerDropZone>
        </Dialog>
    )

}
