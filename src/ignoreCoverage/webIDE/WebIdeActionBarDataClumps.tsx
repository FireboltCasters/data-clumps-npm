import React, {FunctionComponent} from 'react';
import {Menubar} from 'primereact/menubar';
import {
    useSynchedActiveFileKey,
    useSynchedFileExplorerTree,
    useSynchedJSONState, useSynchedOpenedFiles,
    useSynchedProject
} from "../storage/SynchedStateHelper";
import {SynchedStates} from "../storage/SynchedStates";
import {Languages} from "../../api/src";
import {getTreeFromSoftwareProject} from "./WebIdeFileExplorer";
import {WebIdeCodeActionBar} from "./WebIdeActionBar";

// @ts-ignore
export interface WebIdeCodeActionBarDataClumpsProps {
    onStartDetection: () => void;
}

export const WebIdeCodeActionBarDataClumps : FunctionComponent<WebIdeCodeActionBarDataClumpsProps> = (props: WebIdeCodeActionBarDataClumpsProps) => {

    const [viewOptions, setViewOptions] = useSynchedJSONState(SynchedStates.viewOptions);
    const [project, setProject] = useSynchedProject();
    const [tree, setTree] = useSynchedFileExplorerTree();
    const [activeFile, setActiveFile] = useSynchedActiveFileKey();
    const [openedFiles, setOpenedFiles] = useSynchedOpenedFiles();

    function getViewOptionResultsItem(){
        let active = viewOptions?.showResults;

        return {
            label:'Detected Data-Clumps',
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                setViewOptions({...viewOptions, showResults: !active})
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
                    label:'Open (TODO) (Drop works)',
                    disabled: true,
                    icon:'pi pi-fw pi-folder',
                    command: () => {
                        //console.log("open")
                    }
                },
                {
                    label:'Import from GitHub (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-github',
                    command: () => {
                        //console.log("open")
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
                    label:'Export (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-file-export'
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
                    getViewOptionResultsItem(),
                {
                    label:'Parsed AST (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-user-plus',
                },
                {
                    label:'Speed evaluation (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-clock',
                },
                {
                    label:'Graph (TODO)',
                    disabled: true,
                    icon:'pi pi-fw pi-share-alt',
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
                    label:'All (Testing)',
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
