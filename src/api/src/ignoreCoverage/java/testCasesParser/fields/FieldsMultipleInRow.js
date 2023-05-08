import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

import javax.swing.Icon;

public class Main {
  private static String foo, bar, baz;
}
`);

export const FieldsMultipleInRow = new TestCaseBaseClassForParser(
    'FieldsMultipleInRow',
    [FileA],
    [FileA.getFileExtension()],
    []
);
