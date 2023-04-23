import React, {FunctionComponent} from 'react';
import {Menubar} from 'primereact/menubar';

// @ts-ignore
export interface WebIdeCodeActionBarProps {

}

export const WebIdeCodeActionBar : FunctionComponent<WebIdeCodeActionBarProps> = (props: WebIdeCodeActionBarProps) => {

    const items = [
        {
            label:'File',
            icon:'pi pi-fw pi-file',
            items:[
                {
                    label:'Open (TODO)',
                    icon:'pi pi-fw pi-folder',
                    command: () => {
                        console.log("open")
                    }
                },
                {
                    label:'Import from GitHub (TODO)',
                    icon:'pi pi-fw pi-folder',
                    command: () => {
                        console.log("open")
                    }
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
                    label:'Detected Data-Clumps (TODO)',
                    icon:'pi pi-fw pi-user-minus',
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
