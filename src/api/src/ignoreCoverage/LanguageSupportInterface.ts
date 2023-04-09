import {LanguageParserInterface} from "./LanguageParserInterface";
import {TestCaseBaseClassForDataClumps} from "./TestCaseBaseClassForDataClumps";

export interface LanguageSupportInterface {
    getIdentifier(): string;
    getFileExtensions(): string[];
    getParser(): LanguageParserInterface;
    getTestCasesDataClumps(): TestCaseBaseClassForDataClumps[];
    getTestCasesParser(): any;
}
