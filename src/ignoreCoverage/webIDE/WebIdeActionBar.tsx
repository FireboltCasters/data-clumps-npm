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

// @ts-ignore
export interface WebIdeCodeActionBarProps {
    onStartDetection: () => void;
}

export const WebIdeCodeActionBar : FunctionComponent<WebIdeCodeActionBarProps> = (props: WebIdeCodeActionBarProps) => {

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

    function renderExampleLanguageMenuItems(){
        let languages = Languages.getLanguages();
        let items: any[] = [];
        for(let language of languages){
            let identifier = language.getIdentifier();
            console.log("identifier", identifier)

            let testCases = language.getTestCasesDataClumps();
            console.log("testCases")
            console.log(testCases)
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

            items.push({
                label: identifier,
                icon:'pi pi-fw',
                items: testCasesItems
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
                    label:'Open (TODO)',
                    icon:'pi pi-fw pi-folder',
                    command: () => {
                        //console.log("open")
                    }
                },
                {
                    label:'Import from GitHub (TODO)',
                    icon:'pi pi-fw pi-folder',
                    command: () => {
                        //console.log("open")
                    }
                },
                {
                    separator:true
                },
                {
                    label:'Examples (TODO)',
                    icon:'pi pi-fw pi-folder',
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
                    ...getViewOptionResultsItem(),
                },
            ]
        },
        {
            label:'Detect',
            icon:'pi pi-fw pi-calendar',
            items:[
                {
                    label:'All (TODO)',
                    icon:'pi pi-fw pi-pencil',
                    command: () => {
                        if(props?.onStartDetection){
                            props.onStartDetection();
                        }
                    }
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
