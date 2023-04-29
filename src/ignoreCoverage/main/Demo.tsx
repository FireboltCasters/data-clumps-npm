import React, {FunctionComponent, useEffect, useState} from 'react';
import {DataClumpsTypeContext} from "../../api/src/ignoreCoverage/DataClumpTypes";
// default style
import {
    useSynchedActiveFileKey,
    useSynchedDataClumpsDict,
    useSynchedFileExplorerTree,
    useSynchedModalState,
    useSynchedOpenedFiles,
    useSynchedViewOptions,
    ViewOptionValues
} from "../storage/SynchedStateHelper";
import {WebIdeLayout} from "../webIDE/WebIdeLayout";
import {WebIdeCodeEditor} from "../webIDE/WebIdeCodeEditor";
import {getTreeFromSoftwareProject, WebIdeFileExplorer} from "../webIDE/WebIdeFileExplorer";
import {WebIdeCodeEditorLastOpenedFiles} from "../webIDE/WebIdeCodeEditorLastOpenedFiles";
import {MyFile} from "../../api/src/ignoreCoverage/ParsedAstTypes";
import {WebIdeCodeEditorActiveFilePath} from "../webIDE/WebIdeCodeEditorActiveFilePath";
import {SynchedStates} from "../storage/SynchedStates";
import {WebIdeCodeActionBarDataClumps} from "../webIDE/WebIdeActionBarDataClumps";
import {WebIdeModalProgress} from "../webIDE/WebIdeModalProgress";
import {MyAbortController} from "../../api/src/";
import {WebIdeFileExplorerDropZoneModal} from "../webIDE/WebIdeFileExplorerDropZoneModal";
import {WebIdeProjectImportGithubModal} from "../webIDE/WebIdeProjectImportGithubModal";
import {DataClumpsGraph} from "../graph/DataClumpsGraph";
import {SoftwareProject} from "../../api/src";

let abortController = new MyAbortController(); // Dont initialize in the component, otherwise the abortController will be new Instance

export class ProjectHolder{
    public static project: SoftwareProject = new SoftwareProject();
}

export const Demo : FunctionComponent = (props) => {

    const [activeFileKey, setActiveFileKey] = useSynchedActiveFileKey();
    const [decorations, setDecorations] = useState<any[]>([]);
    const [modalOptions, setModalOptions] = useSynchedModalState(SynchedStates.modalOptions);
    const [viewOptions, setViewOptions] = useSynchedViewOptions();

    const [openedFiles, setOpenedFiles] = useSynchedOpenedFiles();
    const [loading, setLoading] = useState(false);
    const [tree, setTree] = useSynchedFileExplorerTree();

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
        if(activeFileKey && ProjectHolder.project){
            let project: SoftwareProject = ProjectHolder.project;
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
            <WebIdeFileExplorer loadSoftwareProject={loadSoftwareProject} />
        )
    }

    async function generateAstCallback(message, index, total): Promise<void> {
        let content = `${index}/${total}: ${message}`;
        let isEveryHundreds = index % 100 === 0;
        if(isEveryHundreds) {
            modalOptions.content = content;
            modalOptions.visible = true;
            setModalOptions(modalOptions);
            await sleep(0); // Allow the UI to update before the next message is set
        }
    }

    async function sleep(ms: number) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    async function onStartDetection(){
        abortController.reset();
        if(ProjectHolder.project){
            let project: SoftwareProject = ProjectHolder.project;
            console.log("onStartDetection");
            console.log("project");
            console.log(project);
            let files = project.getFilePaths();
            console.log("files");
            console.log(files);

            if(activeFileKey && false){
                console.log("project.generateAstForFiles();");
                modalOptions.content = "Generating AST for files..."
                modalOptions.visible = true;
                setModalOptions(modalOptions)

                let activeProjectFile: MyFile = project.getFile(activeFileKey);
                await project.generateAstForFile(activeProjectFile, generateAstCallback);
                ProjectHolder.project = project;
            }

            modalOptions.content = "Detecting Data Clumps..."
            modalOptions.visible = true;
            setModalOptions(modalOptions)
            console.log("project.detectDataClumps();");
            console.log(project)
            let dataClumpsContext: DataClumpsTypeContext = await project.detectDataClumps()
            console.log("dataClumpsContext");
            console.log(dataClumpsContext);
            setDataClumpsDict(JSON.stringify(dataClumpsContext, null, 2));

            await sleep(1000);

            modalOptions.visible = false;
            modalOptions.content = "";
            setModalOptions(modalOptions)
        } else {
            console.log("project is undefined");
            modalOptions.visible = true;
            modalOptions.content = "No project is loaded";
            setModalOptions(modalOptions)
            await sleep(5000);
            modalOptions.visible = false;
            modalOptions.content = "";
            setModalOptions(modalOptions)
        }
    }

    function renderActionBar(){
        return(
            <WebIdeCodeActionBarDataClumps onStartDetection={onStartDetection} loadSoftwareProject={loadSoftwareProject} />
        )
    }

    function renderOpenedFiles(){
        return(
            <WebIdeCodeEditorLastOpenedFiles />
        )
    }

    async function onChangeCode(newCode: string | undefined){
        if(activeFileKey && ProjectHolder.project){
            console.log("onChangeCode");
            console.log("activeFileKey")
            let project: SoftwareProject = ProjectHolder.project;
            console.log(activeFileKey);
            let activeProjectFile: MyFile = project.getFile(activeFileKey);
            console.log("activeProjectFile");
            console.log(activeProjectFile);
            if(activeProjectFile){
                activeProjectFile.content = newCode || "";
                await project.generateAstForFile(activeProjectFile, generateAstCallback);
                ProjectHolder.project = project;
                modalOptions.visible = false;
                modalOptions.content = "";
                setModalOptions(modalOptions)
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

    async function loadSoftwareProject(newProject: SoftwareProject){
        console.log("loadSoftwareProject")
        console.log(newProject)
        setLoading(true);
        abortController.reset();
        modalOptions.visible = true;
        modalOptions.content = "Loading project...";
        setModalOptions(modalOptions);
        console.log("generateAstForFiles")
        await newProject.generateAstForFiles(generateAstCallback, abortController);
        ProjectHolder.project = newProject;
        console.log("getTreeFromSoftwareProject")
        setTree(getTreeFromSoftwareProject(newProject));
        setOpenedFiles([]);
        setActiveFileKey(null);
        modalOptions.visible = false;
        modalOptions.content = "";
        setModalOptions(modalOptions);
        setLoading(false);
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

    function renderDataClumpsGraph(){
        return(
            <DataClumpsGraph key={dataClumpsDict} dataClumpsDict={dataClumpsDict} />
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
        let project: SoftwareProject = ProjectHolder.project;
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
        if(viewOptions.rightPanel === ViewOptionValues.dataClumpsGraph){
            content = renderDataClumpsGraph();
        }
        if(viewOptions.rightPanel === ViewOptionValues.fileAst){
            content = renderFileAst();
        }

        return(
            <div style={{backgroundColor: "transparent", height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
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
                <WebIdeFileExplorerDropZoneModal loadSoftwareProject={loadSoftwareProject} />
                <WebIdeProjectImportGithubModal loadSoftwareProject={loadSoftwareProject} />
            </div>
        );
}
