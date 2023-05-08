import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

import java.util.HashMap;
import javax.swing.Icon;

public class Main {  
  public void method(HashMap<String, HashMap<String, String>> map) {
  }
}
`);

export const ParametersWithHash = new TestCaseBaseClassForParser(
    'ParametersWithHash',
    [FileA],
    [FileA.getFileExtension()],
    []
);
