import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {Panel} from "primereact/panel";
import {Divider} from "primereact/divider";
import {SoftwareProject, JavaLanguageSupport} from "../../api/src/";
import Editor  from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { Tree } from 'primereact/tree';
import {DataClumpsTypeContext} from "../../api/src/ignoreCoverage/DataClumpTypes";

const nodesSource = [
    {
        "key": "0",
        "label": "Documents",
        "data": "Documents Folder",
        "icon": "pi pi-fw pi-inbox",
        "children": [{
            "key": "0-0",
            "label": "Work",
            "data": "Work Folder",
            "icon": "pi pi-fw pi-cog",
            "children": [{ "key": "0-0-0", "label": "Expenses.doc", "icon": "pi pi-fw pi-file", "data": "Expenses Document" }, { "key": "0-0-1", "label": "Resume.doc", "icon": "pi pi-fw pi-file", "data": "Resume Document" }]
        },
            {
                "key": "0-1",
                "label": "Home",
                "data": "Home Folder",
                "icon": "pi pi-fw pi-home",
                "children": [{ "key": "0-1-0", "label": "Invoices.txt", "icon": "pi pi-fw pi-file", "data": "Invoices for this month" }]
            }]
    },
    {
        "key": "1",
        "label": "Events",
        "data": "Events Folder",
        "icon": "pi pi-fw pi-calendar",
        "children": [
            { "key": "1-0", "label": "Meeting", "icon": "pi pi-fw pi-calendar-plus", "data": "Meeting" },
            { "key": "1-1", "label": "Product Launch", "icon": "pi pi-fw pi-calendar-plus", "data": "Product Launch" },
            { "key": "1-2", "label": "Report Review", "icon": "pi pi-fw pi-calendar-plus", "data": "Report Review" }]
    },
    {
        "key": "2",
        "label": "Movies",
        "data": "Movies Folder",
        "icon": "pi pi-fw pi-star-fill",
        "children": [{
            "key": "2-0",
            "icon": "pi pi-fw pi-star-fill",
            "label": "Al Pacino",
            "data": "Pacino Movies",
            "children": [{ "key": "2-0-0", "label": "Scarface", "icon": "pi pi-fw pi-video", "data": "Scarface Movie" }, { "key": "2-0-1", "label": "Serpico", "icon": "pi pi-fw pi-video", "data": "Serpico Movie" }]
        },
            {
                "key": "2-1",
                "label": "Robert De Niro",
                "icon": "pi pi-fw pi-star-fill",
                "data": "De Niro Movies",
                "children": [{ "key": "2-1-0", "label": "Goodfellas", "icon": "pi pi-fw pi-video", "data": "Goodfellas Movie" }, { "key": "2-1-1", "label": "Untouchables", "icon": "pi pi-fw pi-video", "data": "Untouchables Movie" }]
            }]
    }
]

loader.config({ monaco });

export const Demo : FunctionComponent = (props) => {

    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(); // declare the timer variable
    // @ts-ignore
    const [code, setCode] = useState<string>(JavaLanguageSupport.testCasesDataClumps.Positive.SimpleFields[0].content);
//    const [code, setCode] = useState<string>("");
    const [result, setResult] = useState<string>("");

    const [nodes, setNodes] = useState(nodesSource);
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);
    // implement expandedKeys like a file viewer https://www.primefaces.org/primereact-v8/tree/

    const onNodeSelect = (node) => {
//        toast.current.show({ severity: 'success', summary: 'Node Selected', detail: node.label, life: 3000 });
    }

    const onNodeUnselect = (node) => {
//        toast.current.show({ severity: 'success', summary: 'Node Unselected', detail: node.label, life: 3000 });
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
                <div style={{width: "100%", height: "100vh"}}>
                        <div style={{display: "flex", flexDirection: "column", margin: "3%"}}>
                            <h3>data-clumps api Demo</h3>
                            <Panel header={"Description"} toggleable collapsed={true}>
                                <div style={{whiteSpace: "pre-line", display: "flex", width: "100%", flexDirection: "column"}}>
                                    {"More information about data-clumps."}
                                </div>
                            </Panel>

                            <Divider />
                        </div>
                    <div style={{width: "100%", display: "flex", flexDirection: "row", backgroundColor: "transparent"}}>
                        <div style={{width: "100%", flex: 2, display: "flex", flexDirection: "column", backgroundColor: "transparent"}}>
                            <h3>Java Source code</h3>
                            <div style={{width: "100%", flex: 1, display: "flex", flexDirection: "row", backgroundColor: "transparent"}}>
                                <Tree
                                    style={{width: "40%", flex: 1, backgroundColor: "transparent"}}
                                    value={nodes} selectionMode="single" selectionKeys={selectedNodeKey} onSelectionChange={
                                        // @ts-ignore
                                        e => setSelectedNodeKey(e.value)
                                    } onSelect={onNodeSelect} onUnselect={onNodeUnselect}/>
                                <Editor
                                    height="90vh"
                                    width={"60%"}
                                    defaultLanguage="java"
                                    defaultValue={code}
                                    onChange={handleCodeChange}
                                />
                            </div>
                        </div>
                        <div style={{width: "100%", flex: 1, display: "flex", flexDirection: "column", backgroundColor: "transparent"}}>
                            <div style={{width: "100%", flex: 1, display: "flex", flexDirection: "column", backgroundColor: "transparent"}}>
                                <h3>Extracted Variables with Types</h3>
                                <Editor
                                    key={result}
                                    height="90vh"
                                    width={"100%"}
                                    defaultLanguage="javascript"
                                    defaultValue={result}
                                    options={{ readOnly: true }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
        );
}
