import {
    MyAbortController,
    SoftwareProject,
    SoftwareProjectDicts
} from "./SoftwareProject";
import {DataClumpsTypeContext} from "./DataClumpTypes";

import fs from 'fs';
import path from 'path';
import {ParserOptions} from "./Parser";

function readFiles(project_root_directory, directory, project) {
    let pathToFolderOfRootDir = project_root_directory.split("/").slice(0, -1).join("/");
    if(pathToFolderOfRootDir !== ""){
        pathToFolderOfRootDir += "/";
    }

    let filesAndFoldersInPath = fs.readdirSync(directory, { withFileTypes: true });
    for (let fileOrFolder of filesAndFoldersInPath) {
        let fullPath = path.join(directory, fileOrFolder.name);
        if (fileOrFolder.isDirectory()) {
            readFiles(project_root_directory, fullPath, project);
        } else {
            let fileContent = fs.readFileSync(fullPath, 'utf-8');
            let relativePath = fullPath.substring(pathToFolderOfRootDir.length-1, fullPath.length);
            project.addFileContent(relativePath, fileContent);
        }
    }
}

function saveSoftwareProjectDicts(softwareProjectDicts, file_name){
    const jsonData = JSON.stringify(softwareProjectDicts, null, 2); // Convert the JSON object to a string with indentation

    try {
        fs.writeFileSync(file_name, jsonData, 'utf8');
        console.log('JSON data has been successfully saved to file.');
    } catch (err) {
        console.error('An error occurred while writing to file:', err);
    }
}

function loadSoftwareProjectDicts(file_name): any | null{
    try {
        const loadedData = fs.readFileSync(file_name, 'utf8');
        const loadedJsonData = JSON.parse(loadedData); // Parse the JSON data
        console.log('JSON data loaded from file');
        return loadedJsonData;
    } catch (err) {
        console.error('An error occurred while reading the file:', err);
        return null;
    }
}

function getParserOptions(){
    let parserOptions = new ParserOptions({
        includePositions: true,
    });
    return parserOptions;
}

async function generateAstCallback(message, index, total): Promise<void> {
    let content = `${index}/${total}: ${message}`;
    let isEveryHundreds = index % 10 === 0;
    let firstAndSecond = index === 0 || index === 1;
    let lastAndPreLast = index === total - 1 || index === total - 2;
    if(firstAndSecond || isEveryHundreds || lastAndPreLast) {
        console.log(content);
    }
}

async function main() {
    console.log("Development started");

    console.log("Creating software project");
    let project: SoftwareProject = new SoftwareProject(["java"]);

    let project_root_directory = "/Users/nbaumgartner/Desktop/src";

    console.log("Reading files and adding to project");
    readFiles(project_root_directory, project_root_directory, project);

    console.log("Found files: "+project.getFilePaths().length);
    console.log("Parsing files to AST")
    let parserOptions = getParserOptions();
    let abortController = new MyAbortController();
    await project.parseSoftwareProject(parserOptions, generateAstCallback, abortController);
    console.log("Finished parsing files to AST")
    let options = {};
    let dataClumpsContext: DataClumpsTypeContext = await project.detectDataClumps(options)
    console.log("Detecting data clumps finished");

    console.log("Amount dataclumps: "+Object.keys(dataClumpsContext.data_clumps).length);
}

main();
