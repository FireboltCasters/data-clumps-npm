import React, {FunctionComponent} from 'react';
import {
    useSynchedActiveFileKey,
    useSynchedDataClumpsDict,
    useSynchedFileExplorerTree, useSynchedModalState,
    useSynchedOpenedFiles,
    useSynchedProject,
    useSynchedViewOptions,
    ViewOptionValues
} from "../storage/SynchedStateHelper";
import {Languages} from "../../api/src";
import {getTreeFromSoftwareProject} from "./WebIdeFileExplorer";
import {WebIdeCodeActionBar} from "./WebIdeActionBar";
import {SynchedStates} from "../storage/SynchedStates";
import ProjectImportExportHelper from "../helper/ProjectImportExportHelper";
import DownloadHelper from "../helper/DownloadHelper";

// @ts-ignore
export interface WebIdeCodeActionBarDataClumpsProps {
    onStartDetection: () => void;
}

export const WebIdeCodeActionBarDataClumps : FunctionComponent<WebIdeCodeActionBarDataClumpsProps> = (props: WebIdeCodeActionBarDataClumpsProps) => {

    const [viewOptions, setViewOptions] = useSynchedViewOptions()
    const [project, setProject] = useSynchedProject();
    const [tree, setTree] = useSynchedFileExplorerTree();
    const [activeFile, setActiveFile] = useSynchedActiveFileKey();
    const [openedFiles, setOpenedFiles] = useSynchedOpenedFiles();
    const [dataClumpsDict, setDataClumpsDict] = useSynchedDataClumpsDict();

    const [dropZoneModalOptions, setDropZoneModalOptions] = useSynchedModalState(SynchedStates.dropzoneModal);
    const [githubModalOptions, setGitHubModalOptions] = useSynchedModalState(SynchedStates.githubImportModal);

    function getViewOptionItemDataClumpsGraph(){
        let active = viewOptions.rightPanel === ViewOptionValues.dataClumpsGraph

        return {
            label:'Data-Clumps Graph (Experimental)',
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions.rightPanel = ViewOptionValues.dataClumpsGraph
                setViewOptions({...viewOptions})
            }
        }
    }

    function getViewOptionItemDataClumpsDict(){
        let active = viewOptions.rightPanel === ViewOptionValues.dataClumpsDictionary

        return {
            label:'Data-Clumps Dict',
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions.rightPanel = ViewOptionValues.dataClumpsDictionary
                setViewOptions({...viewOptions})
            }
        }
    }

    function getViewOptionItemFileAst(){
        let active = viewOptions.rightPanel === ViewOptionValues.fileAst

        return {
            label:'File AST',
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions.rightPanel = ViewOptionValues.fileAst
                setViewOptions({...viewOptions})
            }
        }
    }



    function getTestCaseMenuItems(testCases){
        let testCasesItems: any[] = [];
        for(let testCase of testCases){
            let testCaseProject = testCase.getSoftwareProject()
            let testCaseName = testCase.getName();
            let testCaseItem = {
                label: testCaseName,
                icon:'pi pi-fw',
                command: () => {
                    setProject(testCaseProject);
                    setTree(getTreeFromSoftwareProject(testCaseProject));
                    setOpenedFiles([]);
                    setActiveFile(null);
                    setDataClumpsDict(null)
                }
            }
            testCasesItems.push(testCaseItem);
        }
        return testCasesItems;
    }

    function renderExampleLanguageMenuItems(){
        let languages = Languages.getLanguages();
        let items: any[] = [];
        for(let language of languages){
            let identifier = language.getIdentifier();
            console.log("identifier", identifier)

            let positiveTestCases = language.getPositiveTestCasesDataClumps();
            let testCasePositiveItem = {
                label: "Positives",
                icon:'pi pi-fw',
                items: getTestCaseMenuItems(positiveTestCases)
            }

            let negativeTestCases = language.getNegativeTestCasesDataClumps();
            let testCaseNegativeItem = {
                label: "Negatives",
                icon:'pi pi-fw',
                items: getTestCaseMenuItems(negativeTestCases)
            }


            items.push({
                label: identifier,
                icon:'pi pi-fw',
                items: [
                    testCasePositiveItem,
                    testCaseNegativeItem
                ]
            });
        }
        return items;
    }

    const items = [
        {
            label:'File',
            icon:'pi pi-fw pi-file',
            items:[
                {
                    label:'New',
                    icon:'pi pi-fw pi-plus',
                    items:[
                        {
                            label:'Project... (TODO)',
                            disabled: true,
                            icon:'pi pi-fw pi-book'
                        },
                        {
                            separator:true
                        },
                        {
                            label:'File (TODO)',
                            disabled: true,
                            icon:'pi pi-fw pi-file'
                        },
                        {
                            label:'Folder (TODO)',
                            disabled: true,
                            icon:'pi pi-fw pi-folder'
                        }
                    ]
                },
                {
                    label:'Open',
                    icon:'pi pi-fw pi-folder',
                    command: () => {
                        dropZoneModalOptions.visible = true;
                        setDropZoneModalOptions({...dropZoneModalOptions});
                    }
                },
                {
                    label:'Import from GitHub (Experimental)',
                    icon:'pi pi-fw pi-github',
                    command: () => {
                        githubModalOptions.visible = true;
                        setGitHubModalOptions({...githubModalOptions});
                    }
                },
                {
                    separator:true
                },
                {
                    label:'Examples',
                    icon:'pi pi-fw pi-book',
                    items: renderExampleLanguageMenuItems()
                },
                {
                    separator:true
                },
                {
                    label:'Export as ... (Experimental)',
                    icon:'pi pi-fw pi-file-export',
                    items:[
                        {
                            label:'JSON (Experimental)',
                            icon:'pi pi-fw pi-book',
                            command: () => {
                                let asString = ProjectImportExportHelper.getDownloadString(project, tree);
                                DownloadHelper.downloadTextAsFiletile(asString, "project.json");
                            }
                        }
                    ]
                }
            ]
        },
        {
            label:'Edit',
            icon:'pi pi-fw pi-pencil',
            items:[
                {
                    label:'Undo (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-undo'
                },
                {
                    label:'Redo (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-refresh'
                },
            ]
        },
        {
            label:'View',
            icon:'pi pi-fw pi-user',
            items:[
                    getViewOptionItemDataClumpsDict(),
                    getViewOptionItemFileAst(),
                    getViewOptionItemDataClumpsGraph(),
                {
                    label:'Speed evaluation (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-clock',
                },
                {
                    label:'Chart (Most Data Clumps) (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-chart-bar',
                },
            ]
        },
        {
            label:'Detect',
            icon:'pi pi-fw pi-search',
            items:[
                {
                    label:'All Data-Clumps',
                    icon:'pi pi-fw pi-pencil',
                    command: () => {
                        if(props?.onStartDetection){
                            props.onStartDetection();
                        }
                    }
                },
                {
                    label:'Field Data-Clumps (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-pencil',
                },
                {
                    label:'Parameter Data-Clumps (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-pencil',
                },
            ]
        },
        {
            label:'Refactor',
            icon:'pi pi-fw pi-code',
            items:[
                {
                    label:'Auto (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-pencil',
                },
                {
                    label:'Field Data-Clumps (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-pencil',
                },
                {
                    label:'Parameter Data-Clumps (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-pencil',
                },
            ]
        },
        {
            label:'Tools',
            icon:'pi pi-fw pi-cog',
            items:[
                {
                    label:'Console (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-pencil',
                },

            ]
        },
        {
            label:'All right reserved 2023 (C) Nils Baumgartner',
            icon: <div style={{marginRight: "8px"}}>{"§"}</div>,
            items:[
                {
                    label:'GitHub project',
                    icon:'pi pi-fw pi-github',
                    url: "https://github.com/FireboltCasters/data-clumps"
                },
                {
                    label:'Homepage',
                    icon:'pi pi-fw pi-external-link',
                    url: "https://nilsbaumgartner.de"
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
        <WebIdeCodeActionBar startComponent={startItem} items={items} />
    )

}
