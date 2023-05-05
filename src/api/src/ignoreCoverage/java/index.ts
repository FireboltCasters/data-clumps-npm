import {JavaParserAntlr4} from "./parser/JavaParserAntlr4";
import * as TestCasesParserJava from "./testCasesParser";
import {JavaTestCasesParser} from "./testCasesParser";
import {LanguageSupportInterface} from "../LanguageSupportInterface";
import {TestCaseBaseClassGroup} from "../TestCaseBaseClass";

import {Positive} from "./testCasesDataClumps/positive"
import {Negative} from "./testCasesDataClumps/negative"

export {TestCasesParserJava};

export class JavaLanguageSupport implements LanguageSupportInterface {

    public getIdentifier(): string {
        return "Java";
    }

    public getFileExtensions(): string[] {
        return ["java"];
    }

    public getParser(): JavaParserAntlr4 {
        return new JavaParserAntlr4();
    }

    public getPositiveTestCasesGroupsDataClumps(): TestCaseBaseClassGroup[] {
        let testCases: TestCaseBaseClassGroup[] = [];
        let keys = Object.keys(Positive);
        for (let key of keys) {
            testCases.push(Positive[key]);
        }
        return testCases;
    }

    public getNegativeTestCasesCasesDataClumps(): TestCaseBaseClassGroup[] {
        let testCases: TestCaseBaseClassGroup[] = [];
        let keys = Object.keys(Negative);
        for (let key of keys) {
            testCases.push(Negative[key]);
        }
        return testCases;
    }

    public getTestCasesGroupsParser(): TestCaseBaseClassGroup[] {
        let testCases: TestCaseBaseClassGroup[] = [];
        let keys = Object.keys(JavaTestCasesParser);
        for (let key of keys) {
            testCases.push(JavaTestCasesParser[key]);
        }
        return testCases;
    }
}
