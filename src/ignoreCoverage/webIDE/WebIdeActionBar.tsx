import React, {FunctionComponent} from 'react';
import {Menubar} from 'primereact/menubar';

// @ts-ignore
export interface WebIdeCodeActionBarProps {
    startComponent?: any;
    endComponent?: any;
    items: any[];
}

export const WebIdeCodeActionBar : FunctionComponent<WebIdeCodeActionBarProps> = (props: WebIdeCodeActionBarProps) => {

    return(
        <div style={{display: "flex", flexDirection: "row", flex: 1}}>
            <Menubar
                style={{height: "40px"}}
                start={props?.startComponent}
                model={props?.items}/>
        </div>
    )

}
