import {JavaParserAntlr4} from "./parser/JavaParserAntlr4";
import {JavaDataClumpsTestCases} from "./testCasesDataClumps";
import * as TestCasesParserJava from "./testCasesParser";
import {LanguageSupportInterface} from "../LanguageSupportInterface";
import {TestCaseBaseClassForDataClumps} from "../TestCaseBaseClassForDataClumps";

export {JavaDataClumpsTestCases};
export {TestCasesParserJava};

export class JavaLanguageSupport implements LanguageSupportInterface {
    static testCasesDataClumps = JavaDataClumpsTestCases;

    public getIdentifier(): string {
        return "Java";
    }

    public getFileExtensions(): string[] {
        return ["java"];
    }

    public getParser(): JavaParserAntlr4 {
        return new JavaParserAntlr4();
    }

    public getPositiveTestCasesDataClumps(): TestCaseBaseClassForDataClumps[] {
        let testCases: TestCaseBaseClassForDataClumps[] = [];
        let keys = Object.keys(JavaDataClumpsTestCases.Positive);
        for (let key of keys) {
            testCases.push(JavaDataClumpsTestCases.Positive[key]);
        }
        return testCases;
    }

    public getNegativeTestCasesDataClumps(): TestCaseBaseClassForDataClumps[] {
        let testCases: TestCaseBaseClassForDataClumps[] = [];
        let keys = Object.keys(JavaDataClumpsTestCases.Negative);
        for (let key of keys) {
            testCases.push(JavaDataClumpsTestCases.Negative[key]);
        }
        return testCases;
    }

    public getTestCasesParser(): any {
        return TestCasesParserJava;
    }
}
