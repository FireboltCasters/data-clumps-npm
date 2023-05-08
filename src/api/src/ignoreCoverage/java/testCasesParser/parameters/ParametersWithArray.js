import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

import javax.swing.Icon;

public class Main {  
  public void method(Icon icon, Icon[] iconArray, Icon[][] iconMatrix) {
  }
}
`);

export const ParametersWithArray = new TestCaseBaseClassForParser(
    'ParametersWithArray',
    [FileA],
    [FileA.getFileExtension()],
    []
);
