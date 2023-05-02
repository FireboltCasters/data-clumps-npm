import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
public class Main {
  Main.Hero.InnerHero h; // InnerHero is explicitly defined as from Hero.InnerHero

  class InnerHero { 

  }

  class Hero {
    class InnerHero { // this one

    }
  }
}
`);

export const NestedInnerClassesExplicitType = new TestCaseBaseClassForParser(
    'NestedInnerClassesExplicitType',
    [FileA],
    [FileA.getFileExtension()],
    []
);
