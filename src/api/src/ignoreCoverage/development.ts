import {JavaLanguageSupport} from "./java";
import {SoftwareProject} from "./SoftwareProject";

async function main() {
    console.log("Development started");

    console.log("Creating software project");
    let javaLanguageSupport = new JavaLanguageSupport();
//    let softwareProject:  = javaLanguageSupport.
//    console.log("Adding files to software project");
//    softwareProject.addFiles(JavaLanguageSupport.testCasesDataClumps.Positive.SimpleFields);
    console.log("Parsing files to AST")
//    await softwareProject.parseSoftwareProject();
    console.log("Finished parsing files to AST")
//    console.log(softwareProject.getAstAsString());

    //console.log("Detecting data clumps");
    //await softwareProject.detectDataClumps();
}

main();
