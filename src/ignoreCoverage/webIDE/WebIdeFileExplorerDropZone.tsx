import React, {FunctionComponent, ReactNode, useState} from 'react';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import {SoftwareProject} from "../../api/src";
import {MyFile} from "../../api/src/ignoreCoverage/ParsedAstTypes";

// @ts-ignore
export interface WebIdeFileExplorerDropZoneProps {
    children?: ReactNode;
    onDropComplete?: () => void;
    loadSoftwareProject: (project: SoftwareProject) => Promise<void>;
}

export const WebIdeFileExplorerDropZone : FunctionComponent<WebIdeFileExplorerDropZoneProps> = (props: WebIdeFileExplorerDropZoneProps) => {

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

    async function handleLoadFiles(files){
        const items = files;

        const newProject = new SoftwareProject();

        for (let i = 0; i < items.length; i++) {
            const item = items[i].webkitGetAsEntry();
            if (item) {
                await traverseFileTree(item, '', newProject);
            }
        }

        await props.loadSoftwareProject(newProject);
    }

    async function handleDrop(event){
        event.preventDefault();
        console.log("handleDrop")
        console.log(event)
        const data = event.dataTransfer;
        const items = data.items;
        await handleLoadFiles(items);
        if(props.onDropComplete){
            await props.onDropComplete();
        }
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

    const defaultDropZoneContent = (
        <div style={{height: "100%", flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div style={{alignItems: 'center',
                justifyContent: 'center', display: "inline-block", flex: "row"}}>
                <div style={{alignItems: 'center',
                    justifyContent: 'center', display: 'flex'}}>
                    <div style={{display: "inline-block"}}>
                        <i className="pi pi-download" style={{fontSize: "3em"}}/>
                    </div>
                </div>
                <div style={{alignItems: 'center',
                    justifyContent: 'center', display: 'flex'}}>
                    <div style={{display: "inline-block"}}>
                        {"Drop your project here"}
                    </div>
                </div>
            </div>

        </div>
    )

    return(
        <div
            className="dropzone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            style={{display: "flex", flexDirection: "column", flex: 1, backgroundColor: "transparent", height: "100%"}}>
            {props?.children || defaultDropZoneContent}
        </div>
    )
}
