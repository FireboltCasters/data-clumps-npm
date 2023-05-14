import {TestCaseBaseClassForParser} from "../../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../../ParsedAstTypes";

const FileA = new MyFile('testCasesParser/enums/MyEnum.java', `
package testCasesParser.enums;

public enum MyEnum {
    A, B, C
}`);

export const SimpleEnum = new TestCaseBaseClassForParser(
    'SimpleEnum',
    [FileA],
    [FileA.getFileExtension()],
    []
);
