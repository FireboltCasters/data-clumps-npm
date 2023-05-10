import React, {FunctionComponent, ReactNode} from 'react';
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

    /**
     * Does not read all files in a directory
     *
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
     */

    function getFileEntriesFromDictionary(entry): Promise<File[]> {
        return new Promise((resolve, reject) => {
            const dirReader = entry.createReader();
            let entries = [];

            /**
             * Race condition: The function getFileEntriesFromDictionary() reads the directory entries asynchronously, but it doesn't wait for them to be fully read before resolving the Promise. This can result in a race condition where the Promise resolves before all entries have been read.
             */

            const readEntries = () => {
                dirReader.readEntries((result) => {
                    /**
                     * This modified function uses a recursive function readEntries() to read all the entries in the directory. It concatenates the results to the entries array and checks if there are any more entries. If there are, it recursively calls itself again to read more entries. If there are no more entries, it resolves the Promise with the complete entries array.
                     */
                    if (!result.length) {
                        resolve(entries);
                    } else {
                        entries = entries.concat(Array.from(result));
                        readEntries();
                    }
                }, reject);
            };

            readEntries();
        });
    }

    async function handleLoadFiles(files): Promise<SoftwareProject>{
        const items = files;

        const newProject = new SoftwareProject(["java"]);

        for (let i = 0; i < items.length; i++) {
            const item = items[i].webkitGetAsEntry();
            if (item) {
                await traverseFileTree(item, '', newProject);
            }
        }

        return newProject;
    }

    async function handleDrop(event){
        event.preventDefault();
        //console.log("handleDrop")
        //console.log(event)
        const data = event.dataTransfer;
        const items = data.items;
        let newProject = await handleLoadFiles(items);
        await props.loadSoftwareProject(newProject);

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
                let entry = entries[i];
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
