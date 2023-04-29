import React, {FunctionComponent} from 'react';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import {useSynchedActiveFileKey} from "../storage/SynchedStateHelper";

// @ts-ignore
export interface WebIdeCodeEditorActiveFilePathProps {

}

export const WebIdeCodeEditorActiveFilePath : FunctionComponent<WebIdeCodeEditorActiveFilePathProps> = (props: WebIdeCodeEditorActiveFilePathProps) => {

    const [activeFileKey, setActiveFileKey] = useSynchedActiveFileKey();

    return(
        <div style={{width: "100%", backgroundColor: "transparent", display: "flex", justifyContent: "flex-start", flexDirection: "row", flex: 1}}>
            {activeFileKey}
        </div>
    )
}
