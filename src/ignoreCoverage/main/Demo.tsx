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
    ViewOptionValues, ViewPanelValues
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
import {DetectorOptions} from "../../api/src/ignoreCoverage/Detector";
import {ParserOptions} from "../../api/src";
import DecorationHelper from "../helper/DecorationHelper";
import {WebIdeCodeActionBarViews} from "../webIDE/WebIdeActionBarViews";

let abortController = new MyAbortController(); // Dont initialize in the component, otherwise the abortController will be new Instance

export class ProjectHolder{
    public static project: SoftwareProject = new SoftwareProject(["java"]);
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
        //console.log("Demo: onAbort")
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
            let decorations = getEditorDecorations();
            setDecorations(decorations)
        } else {
            setCode("")
        }
    }, [activeFileKey])

    //TODO viszualize Graph?: react-graph-vis

    function getParserOptions(){
        let parserOptions = new ParserOptions({
            includePositions: true,
        });
        return parserOptions;
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
            setDataClumpsDict({});
            let project: SoftwareProject = ProjectHolder.project;

            modalOptions.content = "Detecting Data Clumps..."
            modalOptions.visible = true;
            setModalOptions(modalOptions)
            let options = new DetectorOptions({

            });
            let dataClumpsContext: DataClumpsTypeContext = await project.detectDataClumps(options)
            setDataClumpsDict(dataClumpsContext);

            let decorations = await getEditorDecorations();
            setDecorations(decorations)

            await sleep(1000);

            modalOptions.visible = false;
            modalOptions.content = "";
            setModalOptions(modalOptions)
        } else {
            //console.log("project is undefined");
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

    function getEditorDecorations(){
        let decorationFieldAndParametersActive = viewOptions.editor === ViewOptionValues.decorationFieldAndParameters
        if(decorationFieldAndParametersActive){
            let ast = getActiveFileAstDict();
            // @ts-ignore
            return DecorationHelper.getDecorationForFieldsAndParameters(ast);
        }

        return [];
    }

    async function onChangeCode(newCode: string | undefined){
        if(activeFileKey && ProjectHolder.project){
            setDataClumpsDict(undefined)
            let project: SoftwareProject = ProjectHolder.project;
            let activeProjectFile: MyFile = project.getFile(activeFileKey);
            if(activeProjectFile){
                activeProjectFile.content = newCode || "";
                let parserOptions = getParserOptions();
                await project.generateAstForFiles(parserOptions, generateAstCallback, abortController);
                ProjectHolder.project = project;
                modalOptions.visible = false;
                modalOptions.content = "";
                setModalOptions(modalOptions)
                setCode(activeProjectFile?.content || "");
                setDataClumpsDict(undefined)
                let decorations = await getEditorDecorations();
                setDecorations(decorations)
            }
        }
    }

    async function loadSoftwareProject(newProject: SoftwareProject){
        //console.log("loadSoftwareProject")
        //console.log(newProject)
        setLoading(true);
        abortController.reset();
        modalOptions.visible = true;
        modalOptions.content = "Loading project...";
        setModalOptions(modalOptions);
        //console.log("generateAstForFiles")
        let parserOptions = getParserOptions();
        await newProject.generateAstForFiles(parserOptions, generateAstCallback, abortController);
        ProjectHolder.project = newProject;
        //console.log("getTreeFromSoftwareProject")
        setTree(getTreeFromSoftwareProject(newProject));
        setOpenedFiles([]);
        setActiveFileKey(null);
        modalOptions.visible = false;
        modalOptions.content = "";
        setModalOptions(modalOptions);
        setLoading(false);
        let autoDetectOnProjectLoad = true;
        if(autoDetectOnProjectLoad){
            await onStartDetection();
        }
    }

    function renderCodeEditor(){
        return(
            <WebIdeCodeEditor
                key={code+JSON.stringify(decorations)}
                defaultValue={code}
                onDebounce={onChangeCode}
                decorations={decorations}
            />
        )
    }

    function renderDataClumpsGraph(){
        let softwareProjectDicts = ProjectHolder.project.getSoftwareProjectDicts();

        return(
            <DataClumpsGraph key={JSON.stringify(dataClumpsDict)+activeFileKey} activeFileKey={activeFileKey} dataClumpsDict={dataClumpsDict} softwareProjectDicts={softwareProjectDicts} />
        )
    }

    function renderDataClumpsDict(){
        let defaultValue = "";
        if(dataClumpsDict && JSON.stringify(dataClumpsDict) !== "{}"){
            defaultValue = JSON.stringify(dataClumpsDict, null, 2);
        }

        return(
            <WebIdeCodeEditor
                key={JSON.stringify(dataClumpsDict)}
                defaultValue={defaultValue}
                options={{ readOnly: true }}
            />
        )
    }

    function getActiveFileAstDict(){
        let project: SoftwareProject = ProjectHolder.project;
        let activeProjectFile: MyFile = project.getFile(activeFileKey);
        let ast = activeProjectFile?.ast;
        if(!ast){
            return {};
        }
        return ast;
    }

    function renderFileAst(){
        //console.log("renderFileAst")
        let ast = getActiveFileAstDict()
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

    function renderPanel(panel: string){
        let content: any = null;

        let selectedViewOption = viewOptions[panel];

        let explorerFileActive = selectedViewOption === ViewOptionValues.explorerFile;
        if(explorerFileActive){
            content = <WebIdeFileExplorer loadSoftwareProject={loadSoftwareProject} />
        }
        let editorActive = selectedViewOption === ViewOptionValues.fileContent;
        if(editorActive){
            content = (
                <>
                    {renderOpenedFiles()}
                    {renderActiveFilePath()}
                    {renderCodeEditor()}
                </>
            )
        }

        if(selectedViewOption === ViewOptionValues.dataClumpsDictionary){
            content = renderDataClumpsDict();
        }
        if(selectedViewOption === ViewOptionValues.dataClumpsGraph){
            content = renderDataClumpsGraph();
        }
        if(selectedViewOption === ViewOptionValues.fileAst){
            content = renderFileAst();
        }

        return(
            <>
                <div style={{backgroundColor: 'transparent'}}>
                    <WebIdeCodeActionBarViews panel={panel} />
                </div>
                <div style={{backgroundColor: 'transparent', flex: '1'}}>
                    {content}
                </div>
            </>
        )
    }

    return (
        <div style={{width: "100%", height: "100vh", display: "flex", flexDirection: "row"}}>
            <WebIdeLayout
                menuBarItems={renderActionBar()}
                panelInitialSizes={[20, 50, 30]}
            >
                <div style={{backgroundColor: 'transparent', height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
                    {renderPanel(ViewPanelValues.leftPanel)}
                </div>
                <div style={{backgroundColor: 'transparent', height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
                    {renderPanel(ViewPanelValues.middlePanel)}
                </div>
                <div style={{backgroundColor: 'transparent', height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
                    {renderPanel(ViewPanelValues.rightPanel)}
                </div>
            </WebIdeLayout>
            <WebIdeModalProgress onAbort={onAbort} />
            <WebIdeFileExplorerDropZoneModal loadSoftwareProject={loadSoftwareProject} />
            <WebIdeProjectImportGithubModal loadSoftwareProject={loadSoftwareProject} />
        </div>
    );
}
