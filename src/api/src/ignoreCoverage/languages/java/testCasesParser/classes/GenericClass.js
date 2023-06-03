import {TestCaseBaseClassForParser} from "../../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

public class Main<T extends Number> {
  public T myNumber;
}
`);

export const GenericClass = new TestCaseBaseClassForParser(
    'GenericClass',
    [FileA],
    [FileA.getFileExtension()],
    []
);
