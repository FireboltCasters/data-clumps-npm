import React, {FunctionComponent, ReactNode, useState} from 'react';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import FileItemWithFileIcon from "@sinm/react-file-tree/lib/FileItemWithFileIcon";
import {TreeNode} from "@sinm/react-file-tree";

// @ts-ignore
export interface WebIdeCodeEditorLastOpenedFilesProps {

}

export const WebIdeCodeEditorLastOpenedFiles : FunctionComponent<WebIdeCodeEditorLastOpenedFilesProps> = (props: WebIdeCodeEditorLastOpenedFilesProps) => {

    const [openedFiles, setOpenedFiles] = useState<string[]>(["Test.java", "Test.c"]);



    function renderOpenFileTab(openFileKey: string){
        const paddingHorizontally = 5;
        const paddingVertically = 3;

        let treeNode: TreeNode = {
            type: "file",
            uri: openFileKey,
            children: undefined
        }

        return(
            <div style={{paddingRight: "5px"}}>
                <div style={{display: "inline-block", flexDirection: "column", border: "solid", borderColor: "gray", borderWidth: 1, backgroundColor: "white", paddingTop: paddingVertically+"px", paddingBottom: paddingVertically+"px", paddingLeft: paddingHorizontally+"px", paddingRight: paddingHorizontally+"px"}}>
                    <FileItemWithFileIcon treeNode={treeNode} />
                </div>
            </div>
        )
    }


    let renderOpenedFiles: ReactNode[] = [];
    for(let i = 0; i < openedFiles.length; i++){
        let openFileKey = openedFiles[i];
        renderOpenedFiles.push(
            renderOpenFileTab(openFileKey)
        )
    }


    return(
        <div style={{width: "100%", backgroundColor: "transparent", display: "flex", justifyContent: "flex-start", flexDirection: "row", flex: 1}}>
            {renderOpenedFiles}
        </div>
    )
}
