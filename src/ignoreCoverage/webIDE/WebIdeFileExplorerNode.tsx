import React, {FunctionComponent, useState} from 'react';

import {TreeNode} from '@sinm/react-file-tree';
import FileItemWithFileIcon from '@sinm/react-file-tree/lib/FileItemWithFileIcon';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';

// @ts-ignore
export interface WebIdeFileExplorerNodeProps {
    treeNode: TreeNode;
    startUri: string;
    selectedFileInExplorer: string;
}

export const WebIdeFileExplorerNode : FunctionComponent<WebIdeFileExplorerNodeProps> = (props: WebIdeFileExplorerNodeProps) => {

    const {treeNode, startUri, selectedFileInExplorer} = props;
    const [mouseHovering, setMouseHovering] = useState(false);

    let uri = treeNode.uri;

    let treeNodeWithoutStart = uri.replace(startUri+"/", "");

    let style = {};
    if(treeNodeWithoutStart==selectedFileInExplorer){
        style = {
            border: "solid", borderColor: "orange", borderWidth: 1, display: "inline-block"
        }
    }

    let onMouseHoverStyle = {}

    if(mouseHovering){
        onMouseHoverStyle = {
            border: "solid",borderWidth: 1,
            borderColor: "gray"
        }
    }

    function onMouseEnter(){
        setMouseHovering(true);
    }

    function onMouseLeave(){
        setMouseHovering(false);
    }

    let innerFileNodeRendered = <FileItemWithFileIcon treeNode={treeNode} />;

    return <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{cursor: "pointer", width: "100%", ...onMouseHoverStyle}}
    >
        <div style={style}>
            {innerFileNodeRendered}
        </div>
    </div>;
}
