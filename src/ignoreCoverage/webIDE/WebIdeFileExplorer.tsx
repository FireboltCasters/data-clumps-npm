import React, {FunctionComponent, useState} from 'react';

import {FileTree, FileTreeProps, TreeNode, utils} from '@sinm/react-file-tree';
import FileItemWithFileIcon from '@sinm/react-file-tree/lib/FileItemWithFileIcon';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import {
    useSynchedActiveFileKey,
    useSynchedFileExplorerTree,
    useSynchedOpenedFiles,
} from "../storage/SynchedStateHelper";
import {SoftwareProject} from "../../api/src";
import {WebIdeFileExplorerDropZone} from "./WebIdeFileExplorerDropZone";

// @ts-ignore
export interface WebIdeFileExplorerProps {
    loadSoftwareProject: (project: SoftwareProject) => Promise<void>;
}

export const startUri = "/root";

function getTreeDictFromSoftwareProject(project: SoftwareProject): any{

    let treeAsDict = {
        type: "directory",
        expanded: true,
        uri: startUri,
        children: {}
    }

    let filePaths = project.getFilePaths();
    for(let path of filePaths){
        let pathParts = path.split("/");
        let currentDictTree = treeAsDict;
        let currentPath = startUri+"/"+"";
        for(let i = 0; i < pathParts.length; i++){
            let pathPart = pathParts[i];
            currentPath += pathPart;
            if(i === pathParts.length - 1){
                // Last part
                let fileNode: TreeNode = {
                    type: "file",
                    uri: currentPath,
                    children: undefined
                }
                currentDictTree.children[currentPath] = fileNode;
            } else {
                let currentDictTreeChild = currentDictTree.children[currentPath];
                if(!currentDictTreeChild){
                    let directoryNode: TreeNode = {
                        type: "directory",
                        uri: currentPath,
                        // @ts-ignore
                        children: {}
                    }
                    currentDictTree.children[currentPath] = directoryNode;
                    currentDictTreeChild = directoryNode;
                }
                currentPath += "/";
                currentDictTree = currentDictTreeChild;
            }
        }
    }
    return treeAsDict;
}

function getTreeFromTreeDict(treeDict){
    let childrenKeys = Object.keys(treeDict.children);
    let children = [];
    for(let key of childrenKeys){
        let child = treeDict.children[key];
        // @ts-ignore
        children.push(child);
        if(child.type === "directory"){
            child.children = getTreeFromTreeDict(child);
        }
    }
    return children;
}

export function getTreeFromSoftwareProject(project: SoftwareProject): TreeNode{
    const tree: TreeNode = {
        type: "directory",
        uri: startUri,
        expanded: true,
        children: []
    }
    if(!project){
        return tree;
    }

    let treeDict = getTreeDictFromSoftwareProject(project);
    tree.children = getTreeFromTreeDict(treeDict);

    return tree;
}

export const WebIdeFileExplorer : FunctionComponent<WebIdeFileExplorerProps> = (props: WebIdeFileExplorerProps) => {

    const [activeFile, setActiveFile] = useSynchedActiveFileKey();
    const [openedFiles, setOpenedFiles] = useSynchedOpenedFiles();
    const [loading, setLoading] = useState(false);
    const [tree, setTree] = useSynchedFileExplorerTree();
    const [selectedFileInExplorer, setSelectedFileInExplorer] = useState<string>(activeFile);

    const toggleExpanded: FileTreeProps["onItemClick"] = (treeNode) => {
        let fileUri = treeNode.uri;
        let fileUriWithoutStart = fileUri.replace(startUri+"/", "");
        //console.log("fileUriWithoutStart: "+fileUriWithoutStart)


        if(treeNode.type=="directory"){
            // @ts-ignore
            let newTree = utils.assignTreeNode(tree, fileUri, { expanded: !treeNode.expanded });
            setTree(newTree);
        }
        if(treeNode.type=="file"){
            //console.log("selectedFileInExplorer: "+selectedFileInExplorer)
            if(selectedFileInExplorer==fileUriWithoutStart){
                //console.log("file already selected")
                let newOpenedFiles = [...openedFiles];
                let fileAlreadyOpened = false;
                for(let i=0; i<newOpenedFiles.length; i++){
                    let openedFile = newOpenedFiles[i];
                    if(openedFile==fileUriWithoutStart){
                        fileAlreadyOpened = true;
                    }
                }
                //console.log("fileAlreadyOpened: "+fileAlreadyOpened)
                if(!fileAlreadyOpened){
                    newOpenedFiles.push(fileUriWithoutStart);
                }
                //console.log("newOpenedFiles: ")
                //console.log(newOpenedFiles)
                setActiveFile(fileUriWithoutStart);
                setOpenedFiles(newOpenedFiles);
            }
        }
        setSelectedFileInExplorer(fileUriWithoutStart);
    };

    function itemRenderer(treeNode: TreeNode) {
        let uri = treeNode.uri;

        let treeNodeWithoutStart = uri.replace(startUri+"/", "");

        let style = {};
        if(treeNodeWithoutStart==selectedFileInExplorer){
            style = {
                border: "solid", borderColor: "gray", borderWidth: 1
            }
        }

        return (
            <div style={{...style}}>
                <FileItemWithFileIcon treeNode={treeNode} />
            </div>
        )
    }

    if(loading){
        return (
            <div>
                <h1>{"Loading"}</h1>
            </div>
        )
    }

    let content: any = null;
    content = <FileTree key={tree} tree={tree} itemRenderer={itemRenderer} onItemClick={toggleExpanded} />

    return(
        <div style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>
            <WebIdeFileExplorerDropZone loadSoftwareProject={props?.loadSoftwareProject}>
                {content}
            </WebIdeFileExplorerDropZone>
        </div>
    )
}
