import React, {FunctionComponent, useEffect, useState} from 'react';

import {FileTree, FileTreeProps, TreeNode, utils} from '@sinm/react-file-tree';
import FileItemWithFileIcon from '@sinm/react-file-tree/lib/FileItemWithFileIcon';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import {
    useSynchedActiveFileKey,
    useSynchedFileExplorerTree,
    useSynchedOpenedFiles,
    useSynchedProject
} from "../storage/SynchedStateHelper";
import {SoftwareProject} from "../../api/src";
import {MyFile} from "../../api/src/ignoreCoverage/ParsedAstTypes";

// @ts-ignore
export interface WebIdeFileExplorerProps {

}

const startUri = "/root";
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

    const [project, setProject] = useSynchedProject();
    const [activeFile, setActiveFile] = useSynchedActiveFileKey();
    const [openedFiles, setOpenedFiles] = useSynchedOpenedFiles();
    const [loading, setLoading] = useState(false);
    const [tree, setTree] = useSynchedFileExplorerTree();
    const [selectedFileInExplorer, setSelectedFileInExplorer] = useState<string>(activeFile);


    useEffect(() => {
        if(!project){
            return;
        }
        setTree(getTreeFromSoftwareProject(project));
    }, []);


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

    function getFileFromEntry(entry): Promise<File> {
        return new Promise((resolve, reject) => {
            entry.file((file) => {
                resolve(file);
            }, (error) => {
                reject(error);
            });
        });
    }

    function getFileEntriesFromDictionary(entry): Promise<File[]> {
        return new Promise((resolve, reject) => {
            const dirReader = entry.createReader();

            dirReader.readEntries((entries) => {
                resolve(entries);
            }, (error) => {
                reject(error);
            });
        });
    }

    async function handleDrop(event){
        event.preventDefault();
        setLoading(true);
        const data = event.dataTransfer;
        const items = data.items;

        const fileList = [];
        const newProject = new SoftwareProject();

        for (let i = 0; i < items.length; i++) {
            const item = items[i].webkitGetAsEntry();
            if (item) {
                await traverseFileTree(item, '', newProject);
            }
        }

        setProject(newProject);
        // @ts-ignore
        setTree(getTreeFromSoftwareProject(newProject));
        setOpenedFiles([]);
        setActiveFile(null);
        setLoading(false);
    }

    async function traverseFileTree(item, path, newProject){
        path = path || '';
        if (item.isFile) {
            try{
                let file = await getFileFromEntry(item);
                // @ts-ignore
                const fileContent = await file.text();
                let name = file.name;
                let myFile: MyFile = new MyFile(
                    path+name,
                    fileContent
                );
                newProject.addFile(myFile);
            } catch (err){
                //console.log("Error while reading file");
                //console.log(err);
            }

        } else if (item.isDirectory) {

            let dirName = item.name;
            if(dirName === "node_modules"){
                //console.log("Ignore node_modules");
                return;
            }


            let entries = await getFileEntriesFromDictionary(item);
            for (let i = 0; i < entries.length; i++) {
                await traverseFileTree(entries[i], path + item.name + '/', newProject);
            }
        }
    }

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

    return(
        <div
            className="dropzone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            style={{display: "flex", flexDirection: "column", flex: 1, backgroundColor: "transparent", height: "100vh"}}>
            <FileTree key={tree} tree={tree} itemRenderer={itemRenderer} onItemClick={toggleExpanded} />
        </div>
    )
}
