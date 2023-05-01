import {LanguageParserInterface} from "./LanguageParserInterface";
import {TestCaseBaseClassForDataClumps} from "./TestCaseBaseClassForDataClumps";
import {TestCaseBaseClass} from "./TestCaseBaseClass";

export interface LanguageSupportInterface {
    getIdentifier(): string;
    getFileExtensions(): string[];
    getParser(): LanguageParserInterface;
    getPositiveTestCasesDataClumps(): TestCaseBaseClassForDataClumps[];
    getNegativeTestCasesDataClumps(): TestCaseBaseClassForDataClumps[];
    getTestCasesParser(): TestCaseBaseClass[];
}
