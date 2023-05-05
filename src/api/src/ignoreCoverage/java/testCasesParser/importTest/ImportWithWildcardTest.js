import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;
import anotherPackage.sub.*;
import anotherPackage.otherSub.Sidekick;

public class Main {
  Hero h; // Hero is imported from javaParserTest.sub.Hero
}
`);

const FileB = new MyFile('anotherPackage/sub/Hero.java', `
package javaParserTest.sub;

public class Hero {

}
`);

const FileC = new MyFile('anotherPackage/otherSub/Sidekick.java', `
package anotherPackage.otherSub;

public class Sidekick {

}
`);

export const ImportWithWildcardTest = new TestCaseBaseClassForParser(
    'ImportWithWildcardTest',
    [FileA, FileB, FileC],
    [FileA.getFileExtension()],
    []
);
