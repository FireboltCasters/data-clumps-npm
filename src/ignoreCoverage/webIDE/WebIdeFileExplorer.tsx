import React, {FunctionComponent, useState} from 'react';

import {FileTree, FileTreeProps, TreeNode, utils} from '@sinm/react-file-tree';
import FileItemWithFileIcon from '@sinm/react-file-tree/lib/FileItemWithFileIcon';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import {useSynchedState} from "../storage/SynchedStateHelper";
import {SynchedStates} from "../storage/SynchedStates";

// @ts-ignore
export interface WebIdeFileExplorerProps {

}

export const WebIdeFileExplorer : FunctionComponent<WebIdeFileExplorerProps> = (props: WebIdeFileExplorerProps) => {

    const [exampleState, setExampleState] = useSynchedState(SynchedStates.exampleSynchedText)
    const [exampleState2, setExampleState2] = useSynchedState(SynchedStates.exampleSynchedText)


    const defaultTree: TreeNode = {
        type: "directory",
        uri: "/root",
        children: [
            {
                type: "file",
                uri: "/root/README.md",
                children: undefined
            },
            {
                type: "directory",
                uri: "/root/fileIconTest",
                children: [
                    {
                        type: "file",
                        uri: "/root/fileIconTest/Test.java",
                        children: undefined
                    },
                    {
                        type: "file",
                        uri: "/root/fileIconTest/Test.c",
                        children: undefined
                    },
                    {
                        type: "file",
                        uri: "/root/fileIconTest/Test.cpp",
                        children: undefined
                    },
                    {
                        type: "file",
                        uri: "/root/fileIconTest/Test.class",
                        children: undefined
                    },
                    {
                        type: "file",
                        uri: "/root/fileIconTest/Test.interface",
                        children: undefined
                    },
                    {
                        type: "file",
                        uri: "/root/fileIconTest/Test.json",
                        children: undefined
                    },
                    {
                        type: "file",
                        uri: "/root/fileIconTest/.babelrc",
                        children: undefined
                    },
                    {
                        type: "file",
                        uri: "/root/fileIconTest/.gitignore",
                        children: undefined
                    },
                    {
                        type: "file",
                        uri: "/root/fileIconTest/.npmignore",
                        children: undefined
                    },
                    {
                        type: "file",
                        uri: "/root/fileIconTest/.eslintrc",
                        children: undefined
                    },
                    {
                        type: "file",
                        uri: "/root/fileIconTest/Test.py",
                        children: undefined
                    }
                ]
            }
        ]
    }



    const [tree, setTree] = useState(defaultTree);
    const toggleExpanded: FileTreeProps["onItemClick"] = (treeNode) => {
        // @ts-ignore
        setTree((tree) =>
            // @ts-ignore
            utils.assignTreeNode(tree, treeNode.uri, { expanded: !treeNode.expanded })
        );
    };


    // https://www.npmjs.com/package/@sinm/react-file-tree // only 6 downloads per week :( so not really usable
    // sticking back to this
    // here is a better tutorial: https://github.com/pansinm/react-file-tree

    // https://github.com/jaredLunde/exploration
    // okay huge tutorial, but sadly no easy example for a small file tree
    // https://codesandbox.io/s/basic-example-p1udcm?file=/src/mock-fs.ts

    const itemRenderer = (treeNode: TreeNode) => <FileItemWithFileIcon treeNode={treeNode} />

    return(
        <div style={{display: "flex", flexDirection: "column", flex: 1, backgroundColor: "transparent", height: "100vh"}}>
            <FileTree tree={tree} itemRenderer={itemRenderer} onItemClick={toggleExpanded} />
        </div>
    )
}
