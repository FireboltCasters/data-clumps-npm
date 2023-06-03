#!/usr/bin/env node

import {MyAbortController, SoftwareProject} from "./SoftwareProject";

import fs from 'fs';
import path from 'path';
import {ParserOptions} from "./Parser";
import {Detector} from "./detector/Detector";
import {Dictionary} from "./UtilTypes";
import {ClassOrInterfaceTypeContext} from "./ParsedAstTypes";

import { Command } from 'commander'; // import commander

const program = new Command();

program
    .option('-l, --language <type>', 'Language', "java")
    .option('-v, --verbose', 'Verbose output', false)
    .option('-p, --progress', 'Show progress', true)  // Default value is true
    .option('-o, --output <path>', 'Output path', './data-clumps.json') // Default value is './data-clumps.json'
    .option('-s, --source <path_to_folder>', 'Folder path to analyse', './'); // Default value is './'

program.parse(process.argv);

//const arg1 = process.argv[1];
//console.log("arg1: "+arg1); // Current script location

// Get the options
const options = program.opts();

let language = options.language;
let verbose = options.verbose;
let showProgress = options.progress;
let path_to_output = options.output;
let path_to_folder = options.args[0] || './'; // Use the first positional argument or default to './'

function verboseLog(...content: any){
    if(verbose){
        console.log(content);
    }
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

function saveJSONFile(jsonObject, file_name){
    const jsonData = JSON.stringify(jsonObject, null, 2); // Convert the JSON object to a string with indentation

    try {
        fs.writeFileSync(file_name, jsonData, 'utf8');
        verboseLog('JSON data has been successfully saved to file.');
    } catch (err) {
        verboseLog('An error occurred while writing to file:', err);
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
        if(showProgress){
            console.log(content);
        }
    }
}

async function getDictClassOrInterfaceFromProjectPath(path_project_root_directory, fileExtensions, abortController){
    let project: SoftwareProject = new SoftwareProject(fileExtensions);
    verboseLog("Reading files and adding to project");

    readFiles(path_project_root_directory, path_project_root_directory, project);

    verboseLog("Found files: "+project.getFilePaths().length);
    verboseLog("Parsing files to AST")
    let parserOptions = getParserOptions();
    await project.parseSoftwareProject(parserOptions, generateAstCallback, abortController);
    verboseLog("Finished parsing files to AST")


    let dictClassOrInterface = project.dictClassOrInterface;
    return dictClassOrInterface;
}

async function main() {
    console.log("Data-Clumps Detection");

    let dictClassOrInterface: Dictionary<ClassOrInterfaceTypeContext> = {};
    let abortController = new MyAbortController();

    let project_root_directory = path_to_folder;
    let fileExtensions = [language];
    dictClassOrInterface = await getDictClassOrInterfaceFromProjectPath(project_root_directory, fileExtensions, abortController);

    let detectorOptions = {};
    let progressCallback = null;
    let detector = new Detector(dictClassOrInterface, detectorOptions, progressCallback, abortController);
    let dataClumpsContext = await detector.detect();

    await saveJSONFile(dataClumpsContext, path_to_output);
    console.log("Output saved to: "+path_to_output);
    console.log("Amount Data-Clumps: "+Object.keys(dataClumpsContext.data_clumps).length);
}

main();

