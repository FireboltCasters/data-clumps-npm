import React, {Component} from "react";

export default class ProjectImportExportHelper extends Component {

    static getDownloadString(project, tree) {
        let projectString = JSON.stringify(project, null, 2);
        let treeString = JSON.stringify(tree, null, 2);
        return JSON.stringify({
            project: projectString,
            tree: treeString
        }, null, 2);
    }

    static getProjectAndTreeFromDownloadString(downloadString) {
        let downloadObject = JSON.parse(downloadString);
        let project = JSON.parse(downloadObject.project);
        let tree = JSON.parse(downloadObject.tree);
        return {
            project: project,
            tree: tree
        };
    }

}
