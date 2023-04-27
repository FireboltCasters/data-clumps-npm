import React, {FunctionComponent, ReactNode, useState} from 'react';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import {useSynchedModalState} from "../storage/SynchedStateHelper";
import {SynchedStates} from "../storage/SynchedStates";
import {Dialog} from "primereact/dialog";
import {WebIdeFileExplorerDropZone} from "./WebIdeFileExplorerDropZone";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";

export interface WebIdeFileExplorerDropZoneModalProps {
    children?: ReactNode;
}

export const WebIdeProjectImportGithubModal : FunctionComponent<WebIdeFileExplorerDropZoneModalProps> = (props: WebIdeFileExplorerDropZoneModalProps) => {

    const [githubModalOptions, setGitHubModalOptions] = useSynchedModalState(SynchedStates.githubImportModal);

    const [value1, setValue1] = useState<string | undefined>(undefined);

    const visible = githubModalOptions?.visible;

    function onHide(){
        githubModalOptions.visible = false;
        setGitHubModalOptions(githubModalOptions)
    }

    const content = githubModalOptions?.content;

    return(
        <Dialog key={visible+""} visible={visible} header={"Import from GitHub"} onHide={onHide} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
            <div className="col-12 md:col-4">
                <div className="p-inputgroup">
                    <InputText placeholder="https://github.com/..." value={value1} onChange={(e) => setValue1(e.target.value)} />
                    <Button icon="pi pi-download" className="p-button-warning"/>
                </div>
            </div>
        </Dialog>
    )

}
