import React, {FunctionComponent} from 'react';
import {Menubar} from 'primereact/menubar';
import {useSynchedJSONState, useSynchedModalState} from "../storage/SynchedStateHelper";
import {SynchedStates} from "../storage/SynchedStates";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";

// @ts-ignore
export interface WebIdeModalProps {
    onAbort: () => Promise<void>;
}

export const WebIdeModalProgress : FunctionComponent<WebIdeModalProps> = (props: WebIdeModalProps) => {

    const [modalOptions, setModalOptions] = useSynchedModalState(SynchedStates.modalOptions);

    const visible = modalOptions?.visible;

    async function onHide(){
        await props.onAbort();
    }

    const content = modalOptions?.content;


    return(
        <Dialog key={visible+""} visible={visible} header={"Progress"} onHide={onHide} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
            <div>{content}</div>
            <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
        </Dialog>
    )

}
