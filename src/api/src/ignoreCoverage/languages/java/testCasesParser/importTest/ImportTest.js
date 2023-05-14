import {TestCaseBaseClassForParser} from "../../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;
import javaParserTest.sub.Hero;
import javaParserTest.anotherSub.Sidekick;

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

const FileD = new MyFile('javaParserTest/anotherSub/Sidekick.java',`
package javaParserTest.anotherSub;

public class Sidekick {
}
`);


export const ImportTest = new TestCaseBaseClassForParser(
    'ImportTest',
    [FileA, FileB, FileC, FileD],
    [FileA.getFileExtension()],
    []
);
