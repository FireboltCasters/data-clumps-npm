import {JavaLanguageSupport} from "./java";
import {SoftwareProject} from "./SoftwareProject";

async function main() {
    console.log("Development started");

    console.log("Creating software project");
    let softwareProject = new SoftwareProject();
    console.log("Adding files to software project");
//    softwareProject.addFiles(JavaLanguageSupport.testCasesDataClumps.Positive.SimpleMethodsWithDataClumps);
    softwareProject.addFiles(JavaLanguageSupport.testCasesDataClumps.Positive.SimpleFields);
    console.log("Parsing files to AST")
    softwareProject.generateAstForFiles();
    console.log("Detecting data clumps");
    softwareProject.detectDataClumps();
}

main();
