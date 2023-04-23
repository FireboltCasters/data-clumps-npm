import React, {FunctionComponent, useEffect, useState} from 'react';
import {JavaLanguageSupport, SoftwareProject, TestCaseBaseClassForDataClumps} from "../../api/src/";
import {DataClumpsTypeContext} from "../../api/src/ignoreCoverage/DataClumpTypes";
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import {useSynchedState} from "../storage/SynchedStateHelper";
import {SynchedStates} from "../storage/SynchedStates";
import {WebIdeLayout} from "../webIDE/WebIdeLayout";
import {WebIdeCodeEditor} from "../webIDE/WebIdeCodeEditor";
import {WebIdeFileExplorer} from "../webIDE/WebIdeFileExplorer";
import {WebIdeCodeActionBar} from "../webIDE/WebIdeActionBar";
import {WebIdeCodeEditorLastOpenedFiles} from "../webIDE/WebIdeCodeEditorLastOpenedFiles";

export const Demo : FunctionComponent = (props) => {

    const [exampleState, setExampleState] = useSynchedState(SynchedStates.exampleSynchedText)
    const [exampleState2, setExampleState2] = useSynchedState(SynchedStates.exampleSynchedText)

    const testCase: TestCaseBaseClassForDataClumps = JavaLanguageSupport.testCasesDataClumps.Positive.SimpleFields;
    const files = testCase.getFiles()

    // @ts-ignore
    const [result, setResult] = useState<string>("");

    const [code, setCode] = useState<string>(files[0].content);


    useEffect(() => {
        document.title = "data-clumps api Demo"
    }, [])

    useEffect(() => {
        handleParser(code);
    }, [])

    //TODO viszualize Graph?: react-graph-vis


    function renderFileExplorer(){
        return(
            <WebIdeFileExplorer />
        )
    }

    function renderActionBar(){
        return(
            <WebIdeCodeActionBar />
        )
    }

    function renderOpenedFiles(){
        return(
            <WebIdeCodeEditorLastOpenedFiles />
        )
    }

    function renderCodeEditor(){
        return(
            <WebIdeCodeEditor
                defaultValue={code}
                onDebounce={handleParser}
            />
        )
    }

    function renderResult(){
        return(
            <WebIdeCodeEditor
                defaultValue={result}
                options={{ readOnly: true }}
            />
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
                <WebIdeLayout
                    menuBarItems={renderActionBar()}
                    panelInitialSizes={[20, 50, 30]}
                >
                    <div style={{backgroundColor: "transparent"}}>
                        <div>{"File-Explorer"}</div>
                        {renderFileExplorer()}
                    </div>
                    <div style={{backgroundColor: "transparent"}}>
                        {renderOpenedFiles()}
                        {renderCodeEditor()}
                    </div>
                    <div style={{backgroundColor: "transparent"}}>
                        <div>{"Result"}</div>
                        <div>{JSON.stringify(exampleState, null, 2)}</div>
                        <div>{JSON.stringify(exampleState2, null, 2)}</div>
                        {renderResult()}
                    </div>
                </WebIdeLayout>
            </div>
        );
}
