#!/usr/bin/env node

import {MyAbortController, SoftwareProject} from "./SoftwareProject";
import simpleGit, {SimpleGit, LogResult, DefaultLogFields, TagResult} from 'simple-git';

import fs from 'fs';
import path from 'path';
import {ParserOptions} from "./Parser";
import {Detector} from "./detector/Detector";
import {Dictionary} from "./UtilTypes";
import {ClassOrInterfaceTypeContext} from "./ParsedAstTypes";

import { Command } from 'commander'; // import commander

const packageJsonPath = path.join(__dirname, '..','..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

const program = new Command();

const project_name_variable_placeholder = "{project_name}";
const project_commit_variable_placeholder = "{project_commit}";

program
    .description('Data-Clumps Detection\n\n' +
        'This script performs data clumps detection in a given directory.\n\n' +
        'npx data-clumps [options] <path_to_folder>')
    .version(version)
    .argument('<path_to_project>', 'Absolute path to project (a git project in best case)')
    .option('--source <path_to_source_files>', 'Absolute path to source files (default is the path to project)')
    .option('--language <type>', 'Language (default: java)', "java")
    .option('--verbose', 'Verbose output', false)
    .option('--progress', 'Show progress', true)  // Default value is true
    .option('--output <path>', 'Output path', './data-clumps/'+project_name_variable_placeholder+'/'+project_commit_variable_placeholder+'.json') // Default value is './data-clumps.json'
    .option('--project_name <project_name>', 'Project Name (default: Git-Name)')
    .option('--project_version <project_version>', 'Project Version')
    .option('--project_commit <project_commit>', 'Project Commit (default: Git-Commit)')
    .option('--commit_selection <mode>', 'Commit selections (default: current, options: history, tags, <path_tp_commits_csv>)')
// TODO: --detector_options <path_to_detector_options_json>

program.parse(process.argv);

// Get the options and arguments
const options = program.opts();
const path_to_project = program.args[0] || './';
console.log("path_to_project: "+path_to_project);
console.log(JSON.stringify(program.args));
const path_to_source_files = options.source || path_to_project;

let language = options.language;
let verbose = options.verbose;
let showProgress = options.progress;


let target_language = language;

let project_version = options.project_version;

const commitSelectionMode = options.commit_selection;

function verboseLog(...content: any){
    if(verbose){
        console.log(content);
    }
}

// New function to get all commits
async function getAllCommitsFromGitProject(path_to_folder: string): Promise<string[] | null> {
    return new Promise((resolve, reject) => {
        const git: SimpleGit = simpleGit(path_to_folder);
        git.log(undefined, (err: Error | null, log: LogResult<string>) => {
            if (err) {
                resolve(null);
            } else {

                git.log(undefined, (err: Error | null, log: LogResult<DefaultLogFields>) => {
                    if (err) {
                        resolve(null);
                    } else {
                        const commits: string[] = [];
                        log.all.forEach(entry => {
                            if(entry.hash) {
                                commits.push(entry.hash);
                            }
                        });
                        resolve(commits);
                    }
                });
            }
        });
    });
}

async function getAllTagsFromGitProject(path_to_folder: string): Promise<string[] | null> {
        console.log("getAllTagsFromGitProject");
    return new Promise((resolve, reject) => {
        const git: SimpleGit = simpleGit(path_to_folder);
        git.tags(async (err: Error | null, tags: TagResult) => {
            if (err) {
                resolve(null);
            } else {
                const commitHashes: string[] = [];
                for (const tag of tags.all) {
                    try {
                        const details = await git.show([tag]);
                        const hash = details.split('\n')[0].split(' ')[1];
                        commitHashes.push(hash);
                    } catch (error) {
                        console.error(`Error retrieving commit hash for tag ${tag}:`, error);
                    }
                }
                console.log("commitHashes")
                console.log(commitHashes);
                resolve(commitHashes);
            }
        });
    });
}

async function getCommitSelectionModeCurrent(){
    let commits_to_analyse: any[] = [];
    let commit = await getProjectCommit(path_to_project);
    if(!!options.project_commit){
        commit = options.project_commit;
    }
    if(!commit){
        commit = null;
    }
    commits_to_analyse.push(commit);
    return commits_to_analyse;
}

async function getNotAnalysedGitTagCommits(project_name){
    console.log("Perform a full check of the whole project");
    const allCommits = await getAllTagsFromGitProject(path_to_project);
    let missing_commit_results: string[] = [];

    if(!!allCommits){
        console.log("ammount tag commits: "+allCommits.length)

        for (const commit of allCommits) {
            console.log("check commit: " + commit);
            let path_to_output_with_variables = options.output;
            let path_to_output = replaceOutputVariables(path_to_output_with_variables, project_name, commit);

            // Check if output file already exists for the commit
            if (!fs.existsSync(path_to_output)) {
                missing_commit_results.push(commit);
            }
        }
    } else {
        console.log("No tag commits found");
    }
    return missing_commit_results;
}

async function getAllCommitsFromPassedCommitOption(path_to_commits_to_analyse){
    let commit_hashes: string[] = [];
    if (path_to_commits_to_analyse) {
        const data = fs.readFileSync(path_to_commits_to_analyse, 'utf-8');
        commit_hashes = data.split(',').map(hash => hash.trim());
    }
    return commit_hashes;
}

function replaceOutputVariables(path_to_output_with_variables, project_name="project_name", project_commit="project_commit"){
    // path_to_output_with_variables: ./data-clumps-<project_name>-<project_version>.json
    //TODO replace <project_name> with content of: project_name
    //TODO replace <project_version> with content of: project_version
    let copy = path_to_output_with_variables+"";
    copy = copy.replace(project_name_variable_placeholder, project_name);
    copy = copy.replace(project_commit_variable_placeholder, project_commit);
    return copy;
}

async function getProjectName(path_to_folder: string): Promise<string | null> {
    if(!!options.project_name){
        return options.project_name;
    }

        return new Promise((resolve, reject) => {
            const git: SimpleGit = simpleGit(path_to_folder);
            git.listRemote(['--get-url'], (err: Error | null, data?: string) => {
                if (err) {
                    //reject(err);
                    resolve(null);
                } else {
                    let url = data?.trim();
                    let splitData = url?.split('/');
                    let projectName = splitData?.[splitData.length - 1]?.replace('.git', '') || '';
                    resolve(projectName);
                }
            });
        });
}

async function getProjectCommit(path_to_folder: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const git: SimpleGit = simpleGit(path_to_folder);
        git.revparse(['HEAD'], (err: Error | null, data?: string) => {
            if (err) {
                //reject(err);
                resolve(null);
            } else {
                let commit = data?.trim();
                if(!!commit){
                    resolve(commit);
                } else {
                    resolve(null);
                }

            }
        });
    });
}

function readFiles(project_root_directory, directory, project) {
    let pathToFolderOfRootDir = project_root_directory;
    if(!pathToFolderOfRootDir.endsWith("/")){
        pathToFolderOfRootDir += "/";
    }

    let filesAndFoldersInPath = fs.readdirSync(directory, { withFileTypes: true });
    for (let fileOrFolder of filesAndFoldersInPath) {
        let fullPath = path.join(directory, fileOrFolder.name);
        if (fileOrFolder.isDirectory()) {
            readFiles(project_root_directory, fullPath, project);
        } else {
            let fileContent = fs.readFileSync(fullPath, 'utf-8');
            let relativePath = fullPath.substring(pathToFolderOfRootDir.length, fullPath.length);
            project.addFileContent(relativePath, fileContent);
        }
    }
}

function saveJSONFile(jsonObject, path_to_output){
    const jsonData = JSON.stringify(jsonObject, null, 2); // Convert the JSON object to a string with indentation

    try {
        const directory = path.dirname(path_to_output);
        fs.mkdirSync(directory, { recursive: true });

        fs.writeFileSync(path_to_output, jsonData, 'utf8');
        verboseLog('JSON data has been successfully saved to file.');
    } catch (err) {
        verboseLog('An error occurred while writing to file:', err);
    }
}

function getParserOptions(){
    let parserOptions = new ParserOptions({});
    return parserOptions;
}

async function generateAstCallback(prepend, message, index, total): Promise<void> {
    let content = `File: ${index}/${total}: ${message}`;
    let isEveryHundreds = index % 10 === 0;
    let firstAndSecond = index === 0 || index === 1;
    let lastAndPreLast = index === total - 1 || index === total - 2;
    if(!prepend){
        prepend = "";
    }
    if(firstAndSecond || isEveryHundreds || lastAndPreLast) {
        if(showProgress){
            verboseLog(prepend+content)
        }
    }
}

async function getDictClassOrInterfaceFromProjectPath(path_to_project, path_to_source_files, fileExtensions, abortController, preprend){
    let project: SoftwareProject = new SoftwareProject(fileExtensions);
    verboseLog("Reading files and adding to project");

    readFiles(path_to_project, path_to_source_files, project);

    verboseLog("Found files: "+project.getFilePaths().length);
    verboseLog("Parsing files to AST")
    let parserOptions = getParserOptions();
    let printCallback = generateAstCallback.bind(null, preprend);
    await project.parseSoftwareProject(parserOptions, printCallback, abortController);
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

async function analyse(project_name, commit, index, amount){
        const commitInformation = "Commit ["+index+"/"+amount+"]";
        console.log("Analyse "+commitInformation);
    if (!fs.existsSync(path_to_source_files)) {
        console.log(`The path to source files ${path_to_source_files} does not exist.`);
        return;
    } else {
        let dictClassOrInterface: Dictionary<ClassOrInterfaceTypeContext> = {};
        let abortController = new MyAbortController();

        let fileExtensions = [language];
        let prepend = commitInformation+": ";
        dictClassOrInterface = await getDictClassOrInterfaceFromProjectPath(path_to_project, path_to_source_files, fileExtensions, abortController, prepend);

        let detectorOptions = {};
        let progressCallback = null;

        let detector = new Detector(dictClassOrInterface, detectorOptions, progressCallback, abortController, target_language,
            project_name,
            project_version,
            commit,
            {});
        let dataClumpsContext = await detector.detect();

        let path_to_output_with_variables = options.output;
        let path_to_output = replaceOutputVariables(path_to_output_with_variables, project_name, commit);

        await saveJSONFile(dataClumpsContext, path_to_output);
        console.log("Output saved to: "+path_to_output);
        console.log("Amount Data-Clumps: "+Object.keys(dataClumpsContext.data_clumps).length);
    }
}

async function getNotAnalysedGitCommits(project_name){
    console.log("Perform a full check of the whole project");
    const allCommits = await getAllCommitsFromGitProject(path_to_project);
    let missing_commit_results: string[] = [];

    if(!!allCommits){
        console.log("amount commits: "+allCommits.length)

        for (const commit of allCommits) {
            console.log("check commit: " + commit);
            let path_to_output_with_variables = options.output;
            let path_to_output = replaceOutputVariables(path_to_output_with_variables, project_name, commit);

            // Check if output file already exists for the commit
            if (!fs.existsSync(path_to_output)) {
                missing_commit_results.push(commit);
            }
        }
    } else {
        console.log("No commits found");
    }
    return missing_commit_results;
}

async function checkoutGitCommit(commit){
        console.log("Start checkoutGitCommit "+commit);
    const git: SimpleGit = simpleGit(path_to_project);
    try {
        await git.checkout(commit);
    } catch (error) {
        console.error(`Error checking out commit ${commit}:`, error);
        throw new Error(`Failed to checkout commit ${commit}`);
    }
}

async function analyseCommits(project_name, missing_commit_results){
    console.log("Analysing amount commits: "+missing_commit_results.length);
    let i=1;
    for (const commit of missing_commit_results) {
        let checkoutWorked = true;
        if(!!commit){
            try{
                await checkoutGitCommit(commit);
            } catch(error){
                checkoutWorked = false;
            }
        }
        if(checkoutWorked){
            // Do analysis for each missing commit and proceed to the next
            await analyse(project_name, commit, i, missing_commit_results.length);
            console.log("Proceed to next");
        } else {
            console.log("Skip since checkout did not worked");
        }
        i++;
    }
}

async function main() {
    console.log("Data-Clumps Detection");

    console.log("path_to_project: "+path_to_project);
    let project_name = await getProjectName(path_to_project);
    console.log("project_name: "+project_name);

    let commits_to_analyse: any[] = [];

    if(commitSelectionMode==="full"){
        commits_to_analyse = await getNotAnalysedGitCommits(project_name);
    } else if(commitSelectionMode==="tags"){
        commits_to_analyse = await getNotAnalysedGitTagCommits(project_name);
    } else if(commitSelectionMode==="current" || !commitSelectionMode){
        commits_to_analyse = await getCommitSelectionModeCurrent();
    } else {
        let path_to_commits_to_analyse = commitSelectionMode;
        if (fs.existsSync(path_to_commits_to_analyse)) {
            commits_to_analyse = await getAllCommitsFromPassedCommitOption(path_to_commits_to_analyse);
        } else {
            console.error("option: commit_selection - no valid path to csv file");
        }
    }

    await analyseCommits(project_name, commits_to_analyse)

}

main();

