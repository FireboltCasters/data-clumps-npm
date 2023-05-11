import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

public class Main {
  InnerHero h; // InnerHero is on top level

  interface InnerHero { // this one
        public void test(String h);
  }

  interface Hero {
    public void test(String h);
  
    interface InnerHero {
        public void test(String h);
    }
  }
}
`);

export const NestedInnerInterfaces = new TestCaseBaseClassForParser(
    'NestedInnerInterfaces',
    [FileA],
    [FileA.getFileExtension()],
    []
);
