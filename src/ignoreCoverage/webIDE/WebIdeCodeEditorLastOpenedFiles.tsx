import React, {FunctionComponent, ReactNode, useState} from 'react';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import FileItemWithFileIcon from "@sinm/react-file-tree/lib/FileItemWithFileIcon";
import {TreeNode} from "@sinm/react-file-tree";
import {useSynchedActiveFile, useSynchedOpenedFiles} from "../storage/SynchedStateHelper";

// @ts-ignore
export interface WebIdeCodeEditorLastOpenedFilesProps {

}

export const WebIdeCodeEditorLastOpenedFiles : FunctionComponent<WebIdeCodeEditorLastOpenedFilesProps> = (props: WebIdeCodeEditorLastOpenedFilesProps) => {

    const [openedFiles, setOpenedFiles] = useSynchedOpenedFiles();
    const [activeFile, setActiveFile] = useSynchedActiveFile();

    function handleCloseOpenedFile(openFileKey){
        let newOpenedFiles: any[] = [];
        for(let i=0; i<openedFiles.length; i++){
            let openedFile = openedFiles[i];
            if(openedFile!=openFileKey){
                newOpenedFiles.push(openedFile);
            }
        }
        //TODO check if closed the active file, then set the active file as the next open one
        setOpenedFiles(newOpenedFiles);
    }

    function handleSelectActiveFile(openFileKey: string){
        setActiveFile(openFileKey);
    }

    function renderOpenFileTab(openFileKey: string, invisible: boolean){
        const paddingHorizontally = 5;
        const paddingVertically = 3;

        let treeNode: TreeNode = {
            type: "file",
            uri: openFileKey,
            children: undefined
        }

        let invisibleStyle = invisible ? {opacity: 0} : {}

        let isActive = openFileKey == activeFile;
        let activeStyle = isActive ? {backgroundColor: "orange"} : {}

        return(
            <div style={{paddingRight: "5px", ...invisibleStyle}}
                onClick={handleSelectActiveFile.bind(null, openFileKey)}
            >
                <div style={{...activeStyle, display: "inline-block", flexDirection: "row", border: "solid", borderColor: "gray", borderWidth: 1, paddingTop: paddingVertically+"px", paddingBottom: paddingVertically+"px", paddingLeft: paddingHorizontally+"px", paddingRight: paddingHorizontally+"px"}}>
                    <div style={{display: "inline-block", ...activeStyle}}>
                        <FileItemWithFileIcon treeNode={treeNode} />
                    </div>
                    <div style={{display: "inline-block"}} onClick={handleCloseOpenedFile.bind(null, openFileKey)}>
                        <i className={"pi pi-times"} />
                    </div>
                </div>
            </div>
        )
    }


    let renderOpenedFiles: ReactNode[] = [];
    for(let i = 0; i < openedFiles.length; i++){
        let openFileKey = openedFiles[i];
        renderOpenedFiles.push(
            renderOpenFileTab(openFileKey, false)
        )
    }
    if(renderOpenedFiles.length==0){
        renderOpenedFiles.push(renderOpenFileTab("", true))
    }


    return(
        <div style={{width: "100%", backgroundColor: "transparent", display: "flex", justifyContent: "flex-start", flexDirection: "row", flex: 1}}>
            {renderOpenedFiles}
        </div>
    )
}
