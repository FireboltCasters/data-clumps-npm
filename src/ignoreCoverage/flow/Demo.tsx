import React, {FunctionComponent, useEffect, useState} from 'react';
import {JavaLanguageSupport, SoftwareProject, TestCaseBaseClassForDataClumps} from "../../api/src/";
import {DataClumpsTypeContext} from "../../api/src/ignoreCoverage/DataClumpTypes";
// default style
import {useSynchedActiveFile, useSynchedProject, useSynchedResult} from "../storage/SynchedStateHelper";
import {WebIdeLayout} from "../webIDE/WebIdeLayout";
import {WebIdeCodeEditor} from "../webIDE/WebIdeCodeEditor";
import {WebIdeFileExplorer} from "../webIDE/WebIdeFileExplorer";
import {WebIdeCodeActionBar} from "../webIDE/WebIdeActionBar";
import {WebIdeCodeEditorLastOpenedFiles} from "../webIDE/WebIdeCodeEditorLastOpenedFiles";
import {MyFile} from "../../api/src/ignoreCoverage/ParsedAstTypes";

export const Demo : FunctionComponent = (props) => {

    const [project, setProject] = useSynchedProject();
    const [activeFile, setActiveFile] = useSynchedActiveFile();

    const testCase: TestCaseBaseClassForDataClumps = JavaLanguageSupport.testCasesDataClumps.Positive.SimpleFields;
    const files = testCase.getFiles()

    // @ts-ignore
    const [result, setResult] = useSynchedResult();

    const [code, setCode] = useState<string>("");


    useEffect(() => {
        document.title = "data-clumps api Demo"
    }, [])


    // Automatically load the active file
    useEffect(() => {
        if(activeFile && project){
            let activeProjectFile: MyFile = project.getFile(activeFile);
            if(activeProjectFile){
                setCode(activeProjectFile?.content || "");
            }
        } else {
            setCode("")
        }
    }, [activeFile])

    //TODO viszualize Graph?: react-graph-vis


    function renderFileExplorer(){
        return(
            <WebIdeFileExplorer />
        )
    }

    async function onStartDetection(){
        console.log("onStartDetection");
        let files = project.getFilePaths();
        console.log("files");
        console.log(files);
        console.log("project.generateAstForFiles();");
        project.generateAstForFiles();
        let dataClumpsContext: DataClumpsTypeContext = await project.detectDataClumps()
        console.log("dataClumpsContext");
        console.log(dataClumpsContext);
        setResult(JSON.stringify(dataClumpsContext, null, 2));
    }

    function renderActionBar(){
        return(
            <WebIdeCodeActionBar onStartDetection={onStartDetection} />
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
                key={code}
                defaultValue={code}
                //onDebounce={handleParser}
            />
        )
    }

    function renderResult(){
        return(
            <WebIdeCodeEditor
                key={result}
                defaultValue={result}
                options={{ readOnly: true }}
            />
        )
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
                        {renderResult()}
                    </div>
                </WebIdeLayout>
            </div>
        );
}
