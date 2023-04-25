import React, {FunctionComponent, ReactNode, useState} from 'react';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import FileItemWithFileIcon from "@sinm/react-file-tree/lib/FileItemWithFileIcon";
import {TreeNode} from "@sinm/react-file-tree";
import {useSynchedActiveFileKey, useSynchedOpenedFiles, useSynchedProject} from "../storage/SynchedStateHelper";

// @ts-ignore
export interface WebIdeCodeEditorActiveFilePathProps {

}

export const WebIdeCodeEditorActiveFilePath : FunctionComponent<WebIdeCodeEditorActiveFilePathProps> = (props: WebIdeCodeEditorActiveFilePathProps) => {

    const [activeFileKey, setActiveFileKey] = useSynchedActiveFileKey();
    const [project, setProject] = useSynchedProject();

    function handleSelectActiveFile(openFileKey: string){

    }

    return(
        <div style={{width: "100%", backgroundColor: "transparent", display: "flex", justifyContent: "flex-start", flexDirection: "row", flex: 1}}>
            {activeFileKey}
        </div>
    )
}
