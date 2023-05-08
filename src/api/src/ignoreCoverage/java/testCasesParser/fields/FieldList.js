import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

import java.util.List;

public class Main {
  private List<List<String>> listOfLists = Lists.newArrayList();
}
`);

export const FieldList = new TestCaseBaseClassForParser(
    'FieldList',
    [FileA],
    [FileA.getFileExtension()],
    []
);
