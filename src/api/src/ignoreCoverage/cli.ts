#!/usr/bin/env node

import {MyAbortController, SoftwareProject} from "./SoftwareProject";

import fs from 'fs';
import path from 'path';
import {ParserOptions} from "./Parser";
import {Detector} from "./detector/Detector";
import {Dictionary} from "./UtilTypes";
import {ClassOrInterfaceTypeContext} from "./ParsedAstTypes";

const arg1 = process.argv[1];
console.log("arg1: "+arg1); // Current script location

console.log("Hello World 2");
let path_to_folder = process.argv[2];
console.log("path_to_folder: "+path_to_folder);

if(!path_to_folder){
    path_to_folder = "./";
}

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
            console.log(relativePath);
            project.addFileContent(relativePath, fileContent);
        }
    }
}

function saveJSONFile(softwareProjectDicts, file_name){
    const jsonData = JSON.stringify(softwareProjectDicts, null, 2); // Convert the JSON object to a string with indentation

    try {
        fs.writeFileSync(file_name, jsonData, 'utf8');
        console.log('JSON data has been successfully saved to file.');
    } catch (err) {
        console.error('An error occurred while writing to file:', err);
    }
}

function loadJSONFile(file_name): Dictionary<ClassOrInterfaceTypeContext> | null{
    try {
        const loadedData = fs.readFileSync(file_name, 'utf8');
        const loadedJsonData: Dictionary<ClassOrInterfaceTypeContext> = JSON.parse(loadedData); // Parse the JSON data
        console.log('JSON data loaded from file');
        return loadedJsonData;
    } catch (err) {
        console.error('An error occurred while reading the file:', err);
        return null;
    }
}

function getParserOptions(){
    let parserOptions = new ParserOptions({});
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

async function getDictClassOrInterfaceFromProjectPath(path_project_root_directory, fileExtensions, abortController){
    let project: SoftwareProject = new SoftwareProject(fileExtensions);
    console.log("Reading files and adding to project");
    readFiles(path_project_root_directory, path_project_root_directory, project);

    console.log("Found files: "+project.getFilePaths().length);
    console.log("Parsing files to AST")
    let parserOptions = getParserOptions();
    await project.parseSoftwareProject(parserOptions, generateAstCallback, abortController);
    console.log("Finished parsing files to AST")


    let dictClassOrInterface = project.dictClassOrInterface;
    return dictClassOrInterface;
}

async function main() {
    console.log("Development started");

    let dictClassOrInterface: Dictionary<ClassOrInterfaceTypeContext> = {};


    let abortController = new MyAbortController();

    const path_to_dictClassOrInterface = "/Users/nbaumgartner/Desktop/dictClassOrInterface.json";
    let save_and_load_dictClassOrInterface = true;
    let read_from_project = true;


    if(read_from_project){
        let project_root_directory = path_to_folder;
        dictClassOrInterface = await getDictClassOrInterfaceFromProjectPath(project_root_directory, ["java"], abortController);
        if(save_and_load_dictClassOrInterface){
            saveJSONFile(dictClassOrInterface,path_to_dictClassOrInterface)
        }
    }

    if(save_and_load_dictClassOrInterface){
        let loadedContent = loadJSONFile(path_to_dictClassOrInterface);
        if(!!loadedContent){
            dictClassOrInterface = loadedContent;
        }
    }

    let detectorOptions = {};
    let progressCallback = null;
    let detector = new Detector(dictClassOrInterface, detectorOptions, progressCallback, abortController);
    let dataClumpsContext = await detector.detect();

    console.log("Amount dataclumps: "+Object.keys(dataClumpsContext.data_clumps).length);
}

main();

