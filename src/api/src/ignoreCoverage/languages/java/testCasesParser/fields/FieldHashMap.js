import {TestCaseBaseClassForParser} from "../../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;
import java.util.HashMap;
import java.util.List;

public class Main {
  private static HashMap<String, String> mapNormal;
  private static HashMap<List, List> mapWithADTs;
  private static HashMap<String, HashMap<String, String>> mapNested;
}
`);

export const FieldHashMap = new TestCaseBaseClassForParser(
    'FieldHashMap',
    [FileA],
    [FileA.getFileExtension()],
    []
);
