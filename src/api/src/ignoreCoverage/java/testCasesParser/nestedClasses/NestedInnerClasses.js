import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
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

export const NestedInnerClasses = new TestCaseBaseClassForParser(
    'NestedInnerClasses',
    [FileA],
    [FileA.getFileExtension()],
    []
);
