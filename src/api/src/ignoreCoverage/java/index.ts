import {JavaParserAntlr4} from "./parser/JavaParserAntlr4";
import * as TestCasesDataClumpsJava from "./testCasesDataClumps";
import * as TestCasesParserJava from "./testCasesParser";
import {LanguageSupportInterface} from "./../LanguageSupportInterface";

export {TestCasesDataClumpsJava};
export {TestCasesParserJava};

// Define the language support for Java which implements the LanguageSupport interface.
export const JavaLanguageSupport: LanguageSupportInterface = {
    identifier: "java",
    fileExtensions: [".java"],
    parser: new JavaParserAntlr4(),
    testCasesDataClumps: TestCasesDataClumpsJava,
    testCasesParser: TestCasesParserJava
}
