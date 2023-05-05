import {Languages, SoftwareProject} from "../index";
import {TestCaseBaseClassGroup} from "../ignoreCoverage/TestCaseBaseClass";

function testAllLanguages() {
    let languages = Languages.getLanguages();
    for (let language of languages) {
      let identifier = language.getIdentifier();
      let testCasesGroupsDataClumps: TestCaseBaseClassGroup[] = language.getPositiveTestCasesGroupsDataClumps();
      for(let testCaseGroup of testCasesGroupsDataClumps) {
          let testCases = testCaseGroup.testCases
          for(let testCase of testCases) {
              let softwareProject = testCase.getSoftwareProject()
              // TODO: perform test
          }
      }
    }
    test('Example test', async () => {
      expect("a").toBe("a");
    });
}

testAllLanguages();

export {} // In order to allow our outer react app to compile, we need to add an empty export statement to this file.
