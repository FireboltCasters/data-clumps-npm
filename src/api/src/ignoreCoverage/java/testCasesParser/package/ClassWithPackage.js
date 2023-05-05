import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/sub/Main.java', `
package javaParserTest.sub;

public class Main {

}
`);

export const ClassWithPackage = new TestCaseBaseClassForParser(
    'ClassWithPackage',
    [FileA],
    [FileA.getFileExtension()],
    []
);
