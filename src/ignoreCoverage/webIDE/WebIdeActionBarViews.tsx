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

// @ts-ignore
export interface WebIdeCodeActionBarDataClumpsProps {
    panel: string
}

export const WebIdeCodeActionBarViews : FunctionComponent<WebIdeCodeActionBarDataClumpsProps> = (props: WebIdeCodeActionBarDataClumpsProps) => {

    const [viewOptions, setViewOptions] = useSynchedViewOptions()
    const panel = props.panel
    const selectedViewOption = viewOptions[panel];

    const dictLabel = {
        [ViewOptionValues.dataClumpsGraph]: "Data-Clumps Graph",
        [ViewOptionValues.dataClumpsDictionary]: "Data-Clumps Dictionary",
        [ViewOptionValues.fileAst]: "File AST",
        [ViewOptionValues.fileContent]: "File Content",
        [ViewOptionValues.explorerFile]: "FileExplorer",
        [ViewOptionValues.explorerDataClumps]: "Data-Clumps Explorer",
    }

    function getViewOptionItemDataClumpsGraph(){
        let active = selectedViewOption === ViewOptionValues.dataClumpsGraph

        return {
            label: dictLabel[ViewOptionValues.dataClumpsGraph],
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions[panel] = ViewOptionValues.dataClumpsGraph
                setViewOptions({...viewOptions})
            }
        }
    }

    function getViewOptionItemDataClumpsDict(){
        let active = selectedViewOption === ViewOptionValues.dataClumpsDictionary

        return {
            label: dictLabel[ViewOptionValues.dataClumpsDictionary],
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions[panel] = ViewOptionValues.dataClumpsDictionary
                setViewOptions({...viewOptions})
            }
        }
    }

    function getViewOptionItemFileAst(){
        let active = selectedViewOption === ViewOptionValues.fileAst

        return {
            label: dictLabel[ViewOptionValues.fileAst],
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions[panel] = ViewOptionValues.fileAst
                setViewOptions({...viewOptions})
            }
        }
    }

    function getViewOptionItemExplorerFile(){
        let active = selectedViewOption === ViewOptionValues.explorerFile

        return {
            label: dictLabel[ViewOptionValues.explorerFile],
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions[panel] = ViewOptionValues.explorerFile
                setViewOptions({...viewOptions})
            }
        }
    }

    function getViewOptionItemFileContent(){
        let active = selectedViewOption === ViewOptionValues.fileContent

        return {
            label: dictLabel[ViewOptionValues.fileContent],
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions[panel] = ViewOptionValues.fileContent
                setViewOptions({...viewOptions})
            }
        }
    }

    function getViewOptionItemExplorerDataClumps(){
        let active = selectedViewOption === ViewOptionValues.explorerDataClumps

        return {
            label: dictLabel[ViewOptionValues.explorerDataClumps],
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions[panel] = ViewOptionValues.explorerDataClumps
                setViewOptions({...viewOptions})
            }
        }
    }

    const selectedLabel = dictLabel[selectedViewOption]

    const items = [
        {
            label: selectedLabel,
            icon:'pi pi-fw pi-user',
            items: [
                {
                    label: "Explorer",
                    icon:'pi pi-fw pi-user',
                    items: [
                        getViewOptionItemExplorerFile(),
                        getViewOptionItemExplorerDataClumps(),
                    ]
                },
                {
                    label: "Editor",
                    icon:'pi pi-fw pi-user',
                    items: [
                        getViewOptionItemFileContent(),
                    ]
                },
                {
                    label: "Result",
                    icon:'pi pi-fw pi-user',
                    items: [
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
                }
            ]
        }
    ];

    return(
        <WebIdeCodeActionBar startComponent={<div>{"View: "}</div>} items={items} />
    )

}
