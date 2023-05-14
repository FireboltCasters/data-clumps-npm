import {TestCaseBaseClassForParser} from "../../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

public class Main {
    public int x;  
}

public class SecondClass { // this technically allowed in Java, but not well seen in practice
    public int x;  
}
`);

export const MultipleClassInOneFile = new TestCaseBaseClassForParser(
    'MultipleClassInOneFile',
    [FileA],
    [FileA.getFileExtension()],
    []
);
