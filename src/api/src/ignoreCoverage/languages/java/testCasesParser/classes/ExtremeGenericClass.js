import {TestCaseBaseClassForParser} from "../../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

import java.util.List;
import javaParserTest.B;
import javaParserTest.C;

public class Treasure<E extends B & C, T extends List<E>> {
    E e;
    T t;
}
`);

const FileB = new MyFile('javaParserTest/B.java', `
package javaParserTest;
interface B{}
`);

const FileC = new MyFile('javaParserTest/C.java', `
package javaParserTest;
interface C{}
`);

export const ExtremeGenericClass = new TestCaseBaseClassForParser(
    'ExtremeGenericClass',
    [FileA, FileB, FileC],
    [FileA.getFileExtension()],
    []
);
