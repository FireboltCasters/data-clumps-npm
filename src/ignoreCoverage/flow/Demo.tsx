import React, {FunctionComponent, ReactNode, useEffect, useRef, useState} from 'react';
import {Panel} from "primereact/panel";
import {Divider} from "primereact/divider";
import {SoftwareProject, JavaLanguageSupport} from "../../api/src/";
import Editor  from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { Splitter, SplitterPanel } from 'primereact/splitter';
import {DataClumpsTypeContext} from "../../api/src/ignoreCoverage/DataClumpTypes";
import { Menubar } from 'primereact/menubar';
import { Skeleton } from 'primereact/skeleton';


loader.config({ monaco });

export const Demo : FunctionComponent = (props) => {

    const files = JavaLanguageSupport.testCasesDataClumps.Positive.SimpleFields;

    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(); // declare the timer variable
    // @ts-ignore
    const [result, setResult] = useState<string>("");

    const [reloadForResize, setReloadForResize] = useState<boolean>(false);

    const initialOpenedFiles = files.map((file) => file.path);

    const [openedFiles, setOpenedFiles] = useState<string[]>(initialOpenedFiles);
    const [activeFile, setActiveFile] = useState<string>(openedFiles[0]);
    const [code, setCode] = useState<string>(files[0].content);

    const splitterHandleRef = useRef();

    function handleMouseDown(event) {
        event.preventDefault(); // Prevent text selection

        if(!reloadForResize){
            let target = event?.target;
            console.log(target.classList);
            for(let i = 0; i < target.classList.length; i++) {
                let className = target.classList[i];
                console.log("- "+className);
                if (className === "p-splitter-gutter" || className === "p-splitter-gutter-handle") {
                    console.log("oh yes im inside")
                    setReloadForResize(true);
                    break;
                }
            }
        }
    }

    useEffect(() => {
        document.title = "data-clumps api Demo"
    }, [])

    useEffect(() => {
        handleParser(code);
    }, [])

    /**
     <Divider />
     <div style={{display: "flex", width: "100%", flexDirection: "row"}}>
     <Panel header={"Test"} style={{display: "flex", flexDirection: "column", flex: 3}}>
     <div style={{display: "flex", flex: 1, flexDirection: "column"}}>
     {"Domain"}
     <Button disabled={false} label="Save & Use" icon="pi pi-save" className="p-button-success" style={{margin: 5}} onClick={() => {

                                            }} />
     </div>
     </Panel>
     </div>
     */

    //TODO viszualize Graph?: react-graph-vis

    function handleCodeChange(newCode: string | undefined) {
        if (newCode) {
            setCode(newCode);
        } else {
            setCode("");
        }
        // check if timeout is already set and clear it
        if (timerId) {
            clearTimeout(timerId);
        }
        // set a new timeout
        let newTimerId = setTimeout(() => {
            // do something
            console.log("timeout");
            handleParser(newCode)
        }, 1000);
        setTimerId(newTimerId);
    }


    function renderResizingContent(){
        return(
            <div style={{flex: 1, width: "100%", height: "100vh", backgroundColor: "transparent"}}>
                <Skeleton width={"100%"} height={"100%"}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
                        <div style={{display: "inline-block", backgroundColor: "white", alignItems: "center", justifyContent: "center"}}>
                            {"Wait to end resizing"}
                        </div>
                    </div>
                </Skeleton>
            </div>
        )
    }


    function renderMenuBar(){
        const items = [
            {
                label:'File',
                icon:'pi pi-fw pi-file',
                items:[
                    {
                        label:'Open (TODO)',
                        icon:'pi pi-fw pi-folder',
                        command: () => {
                            console.log("open")
                        }
                    },
                    {
                        label:'New',
                        icon:'pi pi-fw pi-plus',
                        items:[
                            {
                                label:'Project... (TODO)',
                                icon:'pi pi-fw'
                            },
                            {
                                separator:true
                            },
                            {
                                label:'File (TODO)',
                                icon:'pi pi-fw pi-file'
                            },
                            {
                                label:'Folder (TODO)',
                                icon:'pi pi-fw pi-folder'
                            }
                        ]
                    },
                    {
                        label:'Export (TODO)',
                        icon:'pi pi-fw pi-external-link'
                    }
                ]
            },
            {
                label:'Edit',
                icon:'pi pi-fw pi-pencil',
                items:[
                    {
                        label:'Undo (TODO)',
                        icon:'pi pi-fw pi-arrow-left'
                    },
                    {
                        label:'Redo (TODO)',
                        icon:'pi pi-fw pi-arrow-right'
                    },
                ]
            },
            {
                label:'View',
                icon:'pi pi-fw pi-user',
                items:[
                    {
                        label:'Parsed AST (TODO)',
                        icon:'pi pi-fw pi-user-plus',
                    },
                    {
                        label:'Detected Data-Clumps (TODO)',
                        icon:'pi pi-fw pi-user-minus',
                    },
                ]
            },
            {
                label:'Refactor',
                icon:'pi pi-fw pi-calendar',
                items:[
                    {
                        label:'Auto (TODO)',
                        icon:'pi pi-fw pi-pencil',
                    },
                    {
                        label:'Field Data-Clumps (TODO)',
                        icon:'pi pi-fw pi-pencil',
                    },
                    {
                        label:'Parameter Data-Clumps (TODO)',
                        icon:'pi pi-fw pi-pencil',
                    },
                ]
            },
            {
                label:'Tools',
                icon:'pi pi-fw pi-power-off',
                items:[
                    {
                        label:'Console (TODO)',
                        icon:'pi pi-fw pi-pencil',
                    },
                    {
                        label:'Speed evaluation (TODO)',
                        icon:'pi pi-fw pi-pencil',
                    },
                ]
            }
        ];

        let startItem = (
            <div>
                {"Data-Clumps"}
            </div>
        )

        return(
            <div style={{display: "flex", flexDirection: "row", flex: 1}}>
                <Menubar
                    style={{height: "40px"}}
                    start={startItem}
                    model={items}/>
            </div>
        )
    }

    function renderFileExplorer(){
        if(reloadForResize){
            return renderResizingContent();
        }

        // https://www.npmjs.com/package/@sinm/react-file-tree


        // https://www.npmjs.com/package/exploration
        // https://codesandbox.io/s/basic-example-p1udcm?file=/src/mock-fs.ts

        return(
            <div style={{display: "flex", flexDirection: "column", flex: 1}}>

            </div>
        )
    }

    function renderOpenFileTab(openFileKey: string){
        const paddingHorizontally = 5;
        const paddingVertically = 3;

        return(
            <div style={{display: "inline-block", flexDirection: "column", backgroundColor: "gray", paddingTop: paddingVertically+"px", paddingBottom: paddingVertically+"px", paddingLeft: paddingHorizontally+"px", paddingRight: paddingHorizontally+"px"}}>
                <div style={{display: "inline-block"}}>
                    <i className="pi pi-file"></i>
                </div>
                <div style={{display: "inline-block"}}>
                    {openFileKey}
                </div>
                <div style={{display: "inline-block"}}>
                    <i className="pi pi-times"></i>
                </div>
            </div>
        )
    }

    function renderOpenedFiles(){
        if(reloadForResize){
            return renderResizingContent();
        }

        let renderOpenedFiles: ReactNode[] = [];
        for(let i = 0; i < openedFiles.length; i++){
            let openFileKey = openedFiles[i];
            renderOpenedFiles.push(
                renderOpenFileTab(openFileKey)
            )
        }


        return(
            <div style={{display: "flex", justifyContent: "flex-start", flexDirection: "row", flex: 1, backgroundColor: "transparent"}}>
                {renderOpenedFiles}
            </div>
        )
    }

    function renderCodeEditor(){
        if(reloadForResize){
            return renderResizingContent();
        }

        return(
            <Editor
                height="90vh"
                width={"auto"}
                defaultLanguage="java"
                defaultValue={code}
                onChange={handleCodeChange}
            />
        )
    }

    function renderResult(){
        if(reloadForResize){
            return renderResizingContent();
        }

        return(
            <Editor
                key={result}
                height="90vh"
                width={"100%"}
                defaultLanguage="javascript"
                defaultValue={result}
                options={{ readOnly: true }}
            />
        )
    }

    function renderWebIDE(){
        return(
            <div style={{width: "100%", display: "flex", flexDirection: "row", backgroundColor: "transparent"}}>
                {/* Render Action bar */}
                <div style={{width: "100%", display: "flex", flexDirection: "column", backgroundColor: "transparent"}}>
                    {renderMenuBar()}
                    {/*  */}
                    <Splitter style={{height: "100%"}} layout="horizontal" gutterSize={3}
                        onResizeEnd={() => {
                            console.log("onResizeEnd");
                            setReloadForResize(false);
                        }}
                        ref={splitterHandleRef} className="p-splitter-handle" onMouseDown={handleMouseDown}
                    >
                        <SplitterPanel size={20}>
                            <div style={{backgroundColor: "transparent"}}>
                                <div>{"File-Explorer"}</div>
                                {renderFileExplorer()}
                            </div>
                        </SplitterPanel>
                        <SplitterPanel >
                            <div style={{backgroundColor: "transparent"}}>
                                {renderOpenedFiles()}
                                {renderCodeEditor()}
                            </div>
                        </SplitterPanel>
                        <SplitterPanel size={30}>
                            <div style={{backgroundColor: "transparent"}}>
                                <div>{"Result"}</div>
                                {renderResult()}
                            </div>
                        </SplitterPanel>
                    </Splitter>
                </div>
            </div>
        )
    }

    async function handleParser(newCode){
        console.log("handleParser");

        let fakeFilePath = "test.java";
        // newly added
        let softwareProject = new SoftwareProject();
        softwareProject.addFileContent(fakeFilePath, newCode);
        softwareProject.generateAstForFiles();
        let file = softwareProject.getFile(fakeFilePath);
        let result = file.ast;
        let dataClumpsContext: DataClumpsTypeContext = await softwareProject.detectDataClumps()

        setResult(JSON.stringify(dataClumpsContext, null, 2));
    }

    return (
            <div style={{width: "100%", height: "100vh", display: "flex", flexDirection: "row"}}>
                {renderWebIDE()}
            </div>
        );
}
