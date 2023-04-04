import {TestCasesJava} from "./java";
import {SoftwareProject} from "./SoftwareProject";

async function main() {
    console.log("Development started");

    console.log("Creating software project");
    let softwareProject = new SoftwareProject();
    console.log("Adding files to software project");
    softwareProject.addFiles(TestCasesJava.Negatives.SimpleFields);
    console.log("Parsing files to AST")
    softwareProject.generateAstForFiles();
    console.log("Getting parsed AST");
    let filePaths = softwareProject.getFilePaths();
    for (let filePath of filePaths) {
        let file = softwareProject.getFile(filePath);
        console.log("File: " + filePath);
        console.log("AST: " + JSON.stringify(file.ast, null, 2));
    }
}

main();
