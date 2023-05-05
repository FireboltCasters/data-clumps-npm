import React, {FunctionComponent} from 'react';
import {
    useSynchedFileExplorerTree,
    useSynchedModalState,
    useSynchedViewOptions,
    ViewOptionValues, ViewPanelValues
} from "../storage/SynchedStateHelper";
import {Languages, SoftwareProject} from "../../api/src";
import {WebIdeCodeActionBar} from "./WebIdeActionBar";
import {SynchedStates} from "../storage/SynchedStates";
import ProjectImportExportHelper from "../helper/ProjectImportExportHelper";
import DownloadHelper from "../helper/DownloadHelper";
import {ProjectHolder} from "../main/Demo";
import {TestCaseBaseClassGroup} from "../../api/src/ignoreCoverage/TestCaseBaseClass";

// @ts-ignore
export interface WebIdeCodeActionBarDataClumpsProps {
    onStartDetection: () => void;
    loadSoftwareProject: (project: SoftwareProject) => Promise<void>;
}

export const WebIdeCodeActionBarDataClumps : FunctionComponent<WebIdeCodeActionBarDataClumpsProps> = (props: WebIdeCodeActionBarDataClumpsProps) => {

    const [viewOptions, setViewOptions] = useSynchedViewOptions()
    const [tree, setTree] = useSynchedFileExplorerTree();

    const [dropZoneModalOptions, setDropZoneModalOptions] = useSynchedModalState(SynchedStates.dropzoneModal);
    const [githubModalOptions, setGitHubModalOptions] = useSynchedModalState(SynchedStates.githubImportModal);

    function getViewOptionItemEditorHighlightFieldAndParameters(){
        let active = viewOptions.editor === ViewOptionValues.decorationFieldAndParameters

        return {
            label:'Highlight Field and Parameters',
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions.editor = ViewOptionValues.decorationFieldAndParameters
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
                command: async () => {
                    //console.log("load test case", testCaseName)
                    //console.log("testCaseProject")
                    //console.log(testCaseProject)
                    await props.loadSoftwareProject(testCaseProject)
                }
            }
            testCasesItems.push(testCaseItem);
        }
        return testCasesItems;
    }


    function getTestCaseGroupsMenuItems(testCaseGroups: TestCaseBaseClassGroup[]){
        let testCasesItems: any[] = [];
        for(let testCaseGroup of testCaseGroups){
            let testCasesItemsOfGroup: any[] = [];

            let subGroups = testCaseGroup.subGroups;
            if(!!subGroups){
                let subGroupsItems = getTestCaseGroupsMenuItems(subGroups);
                testCasesItemsOfGroup.push(...subGroupsItems);
            }

            let testCases = testCaseGroup.testCases
            for(let testCase of testCases){
                let testCaseProject = testCase.getSoftwareProject()
                let testCaseName = testCase.getName();
                let testCaseItem = {
                    label: testCaseName,
                    icon:'pi pi-fw',
                    command: async () => {
                        //console.log("load test case", testCaseName)
                        //console.log("testCaseProject")
                        //console.log(testCaseProject)
                        await props.loadSoftwareProject(testCaseProject)
                    }
                }
                testCasesItemsOfGroup.push(testCaseItem);
            }

            let testCaseItem = {
                label: testCaseGroup.name,
                icon:'pi pi-fw',
                items: testCasesItemsOfGroup
            }

            testCasesItems.push(testCaseItem);
        }
        return testCasesItems;
    }

    function renderTestCasesMenuItems(){
        let languages = Languages.getLanguages();
        let items: any[] = [];
        for(let language of languages){
            let identifier = language.getIdentifier();
            //console.log("identifier", identifier)



            let positiveTestCases = language.getPositiveTestCasesGroupsDataClumps();
            let testCasePositiveItem = {
                label: "Positives",
                icon:'pi pi-fw',
                items: getTestCaseGroupsMenuItems(positiveTestCases)
            }

            let negativeTestCases = language.getNegativeTestCasesCasesDataClumps();
            let testCaseNegativeItem = {
                label: "Negatives",
                icon:'pi pi-fw',
                items: getTestCaseGroupsMenuItems(negativeTestCases)
            }

            let testCasesDataClumps = {
                label: "Data-Clumps",
                icon:'pi pi-fw',
                items: [
                    testCasePositiveItem,
                    testCaseNegativeItem
                ]
            }

            let parserTestCasesGroups = language.getTestCasesGroupsParser();
            let testCasesParser = {
                label: "Parser",
                icon:'pi pi-fw',
                items: getTestCaseGroupsMenuItems(parserTestCasesGroups)
            }

            items.push({
                label: identifier,
                icon:'pi pi-fw',
                items: [
                    testCasesDataClumps,
                    testCasesParser
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
                    label:'Test Cases',
                    icon:'pi pi-fw pi-book',
                    items: renderTestCasesMenuItems()
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
                                let project = ProjectHolder.project
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
            label: "Editor",
            icon: "pi pi-fw pi-pencil",
            items: [
                getViewOptionItemEditorHighlightFieldAndParameters(),
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
            label:'All right reserved 2023 (C)',
            icon: <div style={{marginRight: "8px"}}>{"§"}</div>,
            items:[
                {
                    label: "Nils Baumgartner",
                    icon: "pi pi-fw pi-user",
                    url: "https://nilsbaumgartner.de"
                },
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

    let logoUrl = "https://github.com/FireboltCasters/data-clumps/raw/master/public/logo.png"
    let startItem = (
        <div>
            <a href={"https://github.com/FireboltCasters/data-clumps"}>
                <img src={logoUrl} style={{height: "40px", marginRight: "8px"}} />
            </a>
        </div>
    )

    return(
        <WebIdeCodeActionBar startComponent={startItem} items={items} />
    )

}
