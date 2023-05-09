import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

import javax.swing.Icon;

public class Main {
  private static Icon[] iconArray;
  private static Icon[][] iconMatrix;
}
`);

export const FieldArray = new TestCaseBaseClassForParser(
    'FieldArray',
    [FileA],
    [FileA.getFileExtension()],
    []
);
