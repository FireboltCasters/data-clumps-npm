import {LanguageParserInterface} from "./LanguageParserInterface";
import {TestCaseBaseClassForDataClumps} from "./TestCaseBaseClassForDataClumps";
import {TestCaseBaseClass, TestCaseBaseClassGroup} from "./TestCaseBaseClass";

export interface LanguageSupportInterface {
    getIdentifier(): string;
    getFileExtensions(): string[];
    getParser(): LanguageParserInterface;
    getPositiveTestCasesGroupsDataClumps(): TestCaseBaseClassGroup[];
    getNegativeTestCasesCasesDataClumps(): TestCaseBaseClassGroup[];
    getUnknownTestCasesCasesDataClumps(): TestCaseBaseClassGroup[];
    getTestCasesGroupsParser(): TestCaseBaseClassGroup[];
}
