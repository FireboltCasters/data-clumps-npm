import {LanguageParserInterface} from "./LanguageParserInterface";
import {TestCaseBaseClassForDataClumps} from "./TestCaseBaseClassForDataClumps";

export interface LanguageSupportInterface {
    getIdentifier(): string;
    getFileExtensions(): string[];
    getParser(): LanguageParserInterface;
    getPositiveTestCasesDataClumps(): TestCaseBaseClassForDataClumps[];
    getNegativeTestCasesDataClumps(): TestCaseBaseClassForDataClumps[];
    getTestCasesParser(): any;
}
