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

    function handleCloseOpenedFile(fileKeyToClose){
        //console.log("close file: "+fileKeyToClose)
        //console.log("active file: "+activeFile)
        let newOpenedFiles: any[] = [];
        let nextActiveFile = activeFile;
        if(activeFile == fileKeyToClose){
            nextActiveFile = undefined;
        }

        if(openedFiles.length>1){
            let indexOfClosedFile = openedFiles.indexOf(fileKeyToClose);
            if(indexOfClosedFile!=-1){
                // get neareast next file
                let nextFileIndex = indexOfClosedFile+1;
                if(nextFileIndex < openedFiles.length){
                    nextActiveFile = openedFiles[nextFileIndex];
                } else {
                    // get the previous one
                    nextActiveFile = openedFiles[indexOfClosedFile-1];
                }
            }
        }

        // get list of opened files, except the one to close
        for(let i=0; i<openedFiles.length; i++){
            let openedFileKey = openedFiles[i];
            if(openedFileKey!=fileKeyToClose){
                newOpenedFiles.push(openedFileKey);
            }
        }
        //TODO check if closed the active file, then set the active file as the next open one
        setActiveFile(nextActiveFile);
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
            >
                <div style={{...activeStyle, display: "inline-block", flexDirection: "row", border: "solid", borderColor: "gray", borderWidth: 1, paddingTop: paddingVertically+"px", paddingBottom: paddingVertically+"px", paddingLeft: paddingHorizontally+"px", paddingRight: paddingHorizontally+"px"}}>
                    <div style={{display: "inline-block", ...activeStyle}}
                         onClick={handleSelectActiveFile.bind(null, openFileKey)}
                    >
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
