import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/sub/Main.java', `
package javaParserTest.sub;

public class Main {
  InnerHero h; // InnerHero is on top level

  class InnerHero { // this one

  }

  class Hero {
    class InnerHero {

    }
  }
}
`);

export const ClassInPackage = new TestCaseBaseClassForParser(
    'ClassInPackage',
    [FileA],
    [FileA.getFileExtension()],
    []
);
