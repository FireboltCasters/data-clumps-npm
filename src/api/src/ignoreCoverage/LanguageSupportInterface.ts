import {LanguageParserInterface} from "./LanguageParserInterface";

export interface LanguageSupportInterface {
    identifier: string;
    fileExtensions: string[];
    parser: LanguageParserInterface;
    testCasesDataClumps: any;
    testCasesParser: any;
}


