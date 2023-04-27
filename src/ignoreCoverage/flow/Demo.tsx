import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {DataClumpsTypeContext} from "../../api/src/ignoreCoverage/DataClumpTypes";
// default style
import {
    useSynchedActiveFileKey,
    useSynchedJSONState,
    useSynchedProject,
    useSynchedDataClumpsDict, useSynchedViewOptions, ViewOptionValues
} from "../storage/SynchedStateHelper";
import {WebIdeLayout} from "../webIDE/WebIdeLayout";
import {WebIdeCodeEditor} from "../webIDE/WebIdeCodeEditor";
import {WebIdeFileExplorer} from "../webIDE/WebIdeFileExplorer";
import {WebIdeCodeEditorLastOpenedFiles} from "../webIDE/WebIdeCodeEditorLastOpenedFiles";
import {MyFile} from "../../api/src/ignoreCoverage/ParsedAstTypes";
import {WebIdeCodeEditorActiveFilePath} from "../webIDE/WebIdeCodeEditorActiveFilePath";
import {SynchedStates} from "../storage/SynchedStates";
import {WebIdeCodeActionBarDataClumps} from "../webIDE/WebIdeActionBarDataClumps";
import {WebIdeModalProgress} from "../webIDE/WebIdeModalProgress";
import {MyAbortController} from "../../api/src/";
import {WebIdeFileExplorerDropZoneModal} from "../webIDE/WebIdeFileExplorerDropZoneModal";

let abortController = new MyAbortController(); // Dont initialize in the component, otherwise the abortController will be new Instance

export const Demo : FunctionComponent = (props) => {

    const [project, setProject] = useSynchedProject();
    const [activeFileKey, setActiveFileKey] = useSynchedActiveFileKey();
    const [decorations, setDecorations] = useState<any[]>([]);
    const [modalOptions, setModalOptions] = useSynchedJSONState(SynchedStates.modalOptions);

    const [viewOptions, setViewOptions] = useSynchedViewOptions();

    let onAbort = async () => {
        console.log("Demo: onAbort")
        abortController.abort();

    }

    const [dataClumpsDict, setDataClumpsDict] = useSynchedDataClumpsDict();

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

    async function generateAstCallback(message, index, total){
        let content = `${index}/${total}: ${message}`;
        setModalOptions({visible: true, content: content});
        await sleep(0); // Allow the UI to update before the next message is set
    }

    async function sleep(ms: number) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    async function onStartDetection(){
        abortController.reset();
        console.log("onStartDetection");
        console.log("project");
        console.log(project);
        let files = project.getFilePaths();
        console.log("files");
        console.log(files);
        console.log("project.generateAstForFiles();");
        setModalOptions({visible: true, content: "Generating AST for files..."})

        // For web 100 files took 30 seconds, which is long
        await project.generateAstForFiles(generateAstCallback, abortController);
        setProject(project);

        let dataClumpsContext: DataClumpsTypeContext = await project.detectDataClumps()
        console.log("dataClumpsContext");
        console.log(dataClumpsContext);
        setDataClumpsDict(JSON.stringify(dataClumpsContext, null, 2));

        await sleep(1000);
        setModalOptions({visible: false, content: ""})
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
                setDataClumpsDict("")
                setCode(activeProjectFile?.content || "");
                setDecorations(
                    [
                        {
                            range: {
                                startLineNumber: 2,
                                startColumn: 4,
                                endLineNumber: 2,
                                endColumn: 10
                            },
                            options: {
                                isWholeLine: false,
//                            inlineClassName: "myLineDecoration",
                                className: "myContentClass",
                                glyphMarginClassName: "myGlyphMarginClass",
                                hoverMessage: {
                                    value: "Hallo"
                                }
                            },
                        }
                    ]
                )
            }
        }
    }

    function renderCodeEditor(){
        return(
            <WebIdeCodeEditor
                key={code}
                defaultValue={code}
                onDebounce={onChangeCode}
                decorations={decorations}
            />
        )
    }

    function renderDataClumpsDict(){
        return(
            <WebIdeCodeEditor
                key={dataClumpsDict}
                defaultValue={dataClumpsDict}
                options={{ readOnly: true }}
            />
        )
    }

    function renderFileAst(){
        console.log("renderFileAst")
        console.log("activeFileKey")
        console.log(activeFileKey);
        let activeProjectFile: MyFile = project.getFile(activeFileKey);
        console.log("activeProjectFile");
        console.log(activeProjectFile);
        let ast = activeProjectFile?.ast;
        console.log("ast");
        console.log(ast);
        let astString = JSON.stringify(ast, null, 2);

        return(
            <WebIdeCodeEditor
                key={astString}
                defaultValue={astString}
                options={{ readOnly: true }}
            />
        )
    }

    function renderActiveFilePath(){
        return <WebIdeCodeEditorActiveFilePath />
    }

    function renderRightPanel(){
        let content: any = null;
        if(viewOptions.rightPanel === ViewOptionValues.dataClumpsDictionary){
            content = renderDataClumpsDict();
        }
        if(viewOptions.rightPanel === ViewOptionValues.fileAst){
            content = renderFileAst();
        }

        return(
            <div style={{backgroundColor: "transparent"}}>
                <div>{"Result"}</div>
                {content}
            </div>
        )
    }

    return (
            <div style={{width: "100%", height: "100vh", display: "flex", flexDirection: "row"}}>
                <WebIdeLayout
                    menuBarItems={renderActionBar()}
                    panelInitialSizes={[20, 50, 30]}
                >
                    <div style={{backgroundColor: 'transparent', height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
                        <div style={{backgroundColor: 'transparent'}}>
                            {"File Explorer"}
                        </div>
                        <div style={{backgroundColor: 'transparent', flex: '1'}}>
                            {renderFileExplorer()}
                        </div>
                    </div>

                    <div style={{backgroundColor: "transparent", height: "100%"}}>
                        {renderOpenedFiles()}
                        {renderActiveFilePath()}
                        {renderCodeEditor()}
                    </div>
                    {renderRightPanel()}
                </WebIdeLayout>
                <WebIdeModalProgress onAbort={onAbort} />
                <WebIdeFileExplorerDropZoneModal />
            </div>
        );
}
