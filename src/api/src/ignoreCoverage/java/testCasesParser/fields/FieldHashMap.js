import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;
import java.util.HashMap;

public class Main {
  private static HashMap<String, String> map;
  private static HashMap<String, HashMap<String, String>> map;
}
`);

export const FieldHashMap = new TestCaseBaseClassForParser(
    'FieldHashMap',
    [FileA],
    [FileA.getFileExtension()],
    []
);
