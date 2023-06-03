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
    .description('Data-Clumps Detection\n\n' +
        'This script performs data clumps detection in a given directory.\n\n' +
        'npx data-clumps [options] <path_to_folder>')
    .version('0.1.0')
    .argument('<path_to_folder>', 'Specify folder path', './')
    .option('-l, --language <type>', 'Language', "java")
    .option('-v, --verbose', 'Verbose output', false)
    .option('-p, --progress', 'Show progress', true)  // Default value is true
    .option('-o, --output <path>', 'Output path', './data-clumps.json') // Default value is './data-clumps.json'
    .option('-s, --source <path_to_folder>', 'Folder path to analyse', './')


program.parse(process.argv);

// Get the options
const options = program.opts();

let language = options.language;
let verbose = options.verbose;
let showProgress = options.progress;
let path_to_output = options.output;
let path_to_folder = options.path_to_folder;

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

function printLogo(){
    console.log("                                                                                                    \n" +
        "                                                                                                    \n" +
        "                                                                                                    \n" +
        "                        :~!777?77!~:..        ..::::..        ..:~!77?777!~:                        \n" +
        "                       .?JJJJJ???JJJ7:  ..^!?Y55PPPP55Y?!^..  :7JJJ???JJJJJ?.                       \n" +
        "                       ~JJJJ7.....:. .^?5PGGPPPPPPPPPPPPGGP5?^. .:.....7JJJJ~                       \n" +
        "                       ~JJJ?.      :?Y?!~~75PPPPPPPPPPPP57~~!?Y?:      .?JJJ~                       \n" +
        "                  .^?. :JJJ7     :?7:.^~77.^PPPPPPPPPPPP^.77~^.:7?:     7JJJ: .?^.                  \n" +
        "                 ~Y5P?  !JJ?.   ~J::?5PPY?..5PPPPPPPPPP5..?YPP5?::J~   .?JJ!  ?P5Y~                 \n" +
        "               .JGJ..^^ .7JJ^  !Y:7PPPY777JYPPPPPPPPPPPPY?777YPPP7:Y!  ^JJ7. ^^..JGJ.               \n" +
        "              .YPPP5J:~^ .~: .7G~?GPP55PGPPPPPPPPPPPPPPPPPPGP55PPG?~G7. :~. ^~:J5PPPY.              \n" +
        "              ?GP!:^J5!P!   ~5PP5P5^...:7PPPPPPPPPPPPPPPPPP7:...^5P5PP5~   !P!5J^:!PG?              \n" +
        "             :PP~   .5P5: .JPPPPPP^      7GPY7!~^^^^~!7YPG7      ^PPPPPPJ. :5P5.   ~PP:             \n" +
        "          !^ ~PP~   ~P5: :5PPPPPPP?.    :J!:.          .:!J:    .?PPPPPPP5: :5P~   ~PP~ ^!          \n" +
        "      ::.~J! .5PP?!JPP~ .YPPPPPPPPP5J77YJ..7?~::. ..::~?7..JY77J5PPPPPPPPPY. ~PPJ!?PP5. !J~.::      \n" +
        "      .J?JJ?: ^5GGGPPP. ^PPPPPPPPPPPGGP?. 7J?JJJJ.:JJJJ?J7 .?PGGPPPPPPPPPPP^ .PPPGGG5^ :?JJ?J.      \n" +
        "     .!JJJJJ?: .~J5PPP. ^PPPPPPPPPPPJ~. .!JJ7~~!^..~!~~7JJ!. .~JPPPPPPPPPPP^ .PPP5J~. :?JJJJJ!.     \n" +
        "     .?JJJJJJJ7^. .::^. .5PPPPPPPPY^ .^7JJJJJ?7!!??!!7?JJJJJ7^. ^YPPPPPPPP5. .^::. .^7JJJJJJJ?.     \n" +
        "      .7JJJJJJJJJ7!~^^^. ^PPPPPPPY. ^JJJJJJJJJJJJJJJJJJJJJJJJJJ^ .YPPPPPPP^ .^^^~!7JJJJJJJJJ7.      \n" +
        "       :~!7???JJJJJJJJJ7. ^5PPPPP! .?JJJJJJJJJJJJJJJJJJJJJJJJJJ?. !PPPPP5^ .7JJJJJJJJJ???7!~:       \n" +
        "       .7??7??JJJJJJJJJJ7: .75PPP?  !JJJJJJJJJJJJJJJJJJJJJJJJJJ!  ?PPP57. :7JJJJJJJJJJ??7??7.       \n" +
        "        .~?JJJJJJJJJJJJJJJ~. .!YPP~ .!JJJJJJJJJJJJJJJJJJJJJJJJ!. ~PPY!. .~JJJJJJJJJJJJJJJ?~.        \n" +
        "          .^!?JJJJJJJJJJJJJJ!:. :!J!. :7JJJJJJJJJJJJJJJJJJJJ7: .!J!: .:!JJJJJJJJJJJJJJ?!^.          \n" +
        "             .:^~77??JJJJJJJJ?7^.  ..   :!?JJJJJJJJJJJJJJ?!:   ..  .^7?JJJJJJJJ??77~^:.             \n" +
        "                   ............ ..:~^.     .^^~~!!!!~~^^.     .^~:. .............                   \n" +
        "                                .:!?: :~ !?~^::......::^~??.:: :?~.                                 \n" +
        "                                   . :J^.B#####BBBBBB######:.J:                                     \n" +
        "                                    .?J! Y################P.^J?.                                    \n")
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

