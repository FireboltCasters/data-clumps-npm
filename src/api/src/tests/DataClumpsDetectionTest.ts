import {Languages, SoftwareProject} from "../index";

function testAllLanguages() {
    let languages = Languages.getLanguages();
    for (let language of languages) {
      let identifier = language.getIdentifier();
      let testCasesDataClumps = language.getTestCasesDataClumps();
      for(let testCase of testCasesDataClumps) {
        let softwareProject = new SoftwareProject();
        softwareProject.addFiles(testCase.getFiles());
        softwareProject.generateAstForFiles();
        let detectedDataClumps = softwareProject.detectDataClumps();
        let expectedDataClumps = testCase.getExpectedDataClumps();
      }
    }
    test('Example test', async () => {
      expect("a").toBe("a");
    });
}

testAllLanguages();

export {} // In order to allow our outer react app to compile, we need to add an empty export statement to this file.