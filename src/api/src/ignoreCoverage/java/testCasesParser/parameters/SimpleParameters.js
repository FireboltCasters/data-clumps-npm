import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

public class Main {  
  public void method(int a, boolean b, char c, String s) {
  }
}
`);

export const SimpleParameters = new TestCaseBaseClassForParser(
    'SimpleParameters',
    [FileA],
    [FileA.getFileExtension()],
    []
);
