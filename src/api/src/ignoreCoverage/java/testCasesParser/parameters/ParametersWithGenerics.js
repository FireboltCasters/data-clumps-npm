import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

import java.util.HashMap;
import javax.swing.Icon;

public class Main {  
  public void method(T<?> normalGeneric) {}
  public void method(T<? extends Number> extendsGeneric) {}
  public void method(T<? super Number> superGeneric) {}
  // no correct java syntax: public void method(T<? extends Number & Icon> extendsAndGeneric) {}
}
`);

export const ParametersWithGenerics = new TestCaseBaseClassForParser(
    'ParametersWithGenerics',
    [FileA],
    [FileA.getFileExtension()],
    []
);
