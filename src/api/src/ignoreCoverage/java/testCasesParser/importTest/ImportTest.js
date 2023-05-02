import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;
import javaParserTest.sub.Hero;

public class Main {
  Hero h; // Hero is imported from javaParserTest.sub.Hero
}
`);

const FileB = new MyFile('javaParserTest/Hero.java',`
package javaParserTest;

public class Hero {
}
`);

const FileC = new MyFile('javaParserTest/sub/Hero.java',`
package javaParserTest.sub;

public class Hero {
}
`);


export const ImportTest = new TestCaseBaseClassForParser(
    'ImportTest',
    [FileA, FileB, FileC],
    [FileA.getFileExtension()],
    []
);
