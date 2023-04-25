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

    public getTestCasesDataClumps(): TestCaseBaseClassForDataClumps[] {
        let testCases: TestCaseBaseClassForDataClumps[] = [];
        testCases.push(JavaDataClumpsTestCases.Negative.simpleMethodsWithoutDataClumps);
        return testCases;
    }

    public getTestCasesParser(): any {
        return TestCasesParserJava;
    }
}
