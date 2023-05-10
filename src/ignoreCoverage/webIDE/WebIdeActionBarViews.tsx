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
        [ViewOptionValues.explorerDataClumpsJSON]: "Data-Clumps FileLevel JSON",
        [ViewOptionValues.explorerDataClumpsCSV]: "Data-Clumps FileLevel CSV",
        [ViewOptionValues.classOrInterfaceDictionary]: "Class/Interface Dictionary",
        [ViewOptionValues.methodsDictionary]: "Methods Dictionary",
    }

    function getViewOptionItem(viewOptionValue){
        let active = selectedViewOption === viewOptionValue

        return {
            label: dictLabel[viewOptionValue],
            icon: active ? 'pi pi-check': "pi",
            command: () => {
                viewOptions[panel] = viewOptionValue
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
                        getViewOptionItem(ViewOptionValues.explorerFile),
                    ]
                },
                {
                    label: "Editor",
                    icon:'pi pi-fw pi-user',
                    items: [
                        getViewOptionItem(ViewOptionValues.fileContent)
                    ]
                },
                {
                    label: "Result",
                    icon:'pi pi-fw pi-user',
                    items: [
                        getViewOptionItem(ViewOptionValues.dataClumpsDictionary),
                        getViewOptionItem(ViewOptionValues.fileAst),
                        getViewOptionItem(ViewOptionValues.dataClumpsGraph),
                        getViewOptionItem(ViewOptionValues.explorerDataClumpsJSON),
                        getViewOptionItem(ViewOptionValues.explorerDataClumpsCSV),
                        getViewOptionItem(ViewOptionValues.classOrInterfaceDictionary),
                        getViewOptionItem(ViewOptionValues.methodsDictionary),
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
