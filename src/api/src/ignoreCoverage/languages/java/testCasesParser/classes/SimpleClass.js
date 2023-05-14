import {TestCaseBaseClassForParser} from "../../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

public class Main {
  
}
`);

export const SimpleClass = new TestCaseBaseClassForParser(
    'SimpleClass',
    [FileA],
    [FileA.getFileExtension()],
    []
);
