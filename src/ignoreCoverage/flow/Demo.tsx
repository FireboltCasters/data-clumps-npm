import React, {FunctionComponent, useEffect, useState} from 'react';
import {DataClumpsTypeContext} from "../../api/src/ignoreCoverage/DataClumpTypes";
// default style
import {
    useSynchedActiveFileKey,
    useSynchedJSONState,
    useSynchedProject,
    useSynchedResult
} from "../storage/SynchedStateHelper";
import {WebIdeLayout} from "../webIDE/WebIdeLayout";
import {WebIdeCodeEditor} from "../webIDE/WebIdeCodeEditor";
import {WebIdeFileExplorer} from "../webIDE/WebIdeFileExplorer";
import {WebIdeCodeActionBar} from "../webIDE/WebIdeActionBar";
import {WebIdeCodeEditorLastOpenedFiles} from "../webIDE/WebIdeCodeEditorLastOpenedFiles";
import {MyFile} from "../../api/src/ignoreCoverage/ParsedAstTypes";
import {WebIdeCodeEditorActiveFilePath} from "../webIDE/WebIdeCodeEditorActiveFilePath";
import {SynchedStates} from "../storage/SynchedStates";
import {WebIdeCodeActionBarDataClumps} from "../webIDE/WebIdeActionBarDataClumps";

export const Demo : FunctionComponent = (props) => {

    const [project, setProject] = useSynchedProject();
    const [activeFileKey, setActiveFileKey] = useSynchedActiveFileKey();

    const [viewOptions, setViewOptions] = useSynchedJSONState(SynchedStates.viewOptions);
    let showResults = viewOptions?.showResults;

    // @ts-ignore
    const [result, setResult] = useSynchedResult();

    const [code, setCode] = useState<string>("");


    useEffect(() => {
        document.title = "data-clumps api Demo"
    }, [])


    // Automatically load the active file
    useEffect(() => {
        if(activeFileKey && project){
            let activeProjectFile: MyFile = project.getFile(activeFileKey);
            if(activeProjectFile){
                setCode(activeProjectFile?.content || "");
            }
        } else {
            setCode("")
        }
    }, [activeFileKey])

    //TODO viszualize Graph?: react-graph-vis


    function renderFileExplorer(){
        return(
            <WebIdeFileExplorer />
        )
    }

    async function onStartDetection(){
        console.log("onStartDetection");
        console.log("project");
        console.log(project);
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
            <WebIdeCodeActionBarDataClumps onStartDetection={onStartDetection} />
        )
    }

    function renderOpenedFiles(){
        return(
            <WebIdeCodeEditorLastOpenedFiles />
        )
    }

    function onChangeCode(newCode: string | undefined){
        if(activeFileKey && project){
            console.log("onChangeCode");
            console.log("activeFileKey")
            console.log(activeFileKey);
            let activeProjectFile: MyFile = project.getFile(activeFileKey);
            console.log("activeProjectFile");
            console.log(activeProjectFile);
            if(activeProjectFile){
                activeProjectFile.content = newCode || "";
                console.log(project);
                setProject(project);
                setResult("")
                setCode(activeProjectFile?.content || "");
            }
        }
    }

    function renderCodeEditor(){
        return(
            <WebIdeCodeEditor
                key={code}
                defaultValue={code}
                onDebounce={onChangeCode}
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

    function renderActiveFilePath(){
        return <WebIdeCodeEditorActiveFilePath />
    }

    function renderResultsPanel(){
        if(!showResults){
            return null;
        }

        return(
            <div style={{backgroundColor: "transparent"}}>
                <div>{"Result"}</div>
                {renderResult()}
            </div>
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
                        {renderActiveFilePath()}
                        {renderCodeEditor()}
                    </div>
                    {renderResultsPanel()}
                </WebIdeLayout>
            </div>
        );
}
