import {TestCaseBaseClassForParser} from "../../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

public class Main {
    private int i;
    public String s;
    public char c;
    public boolean b;
    public byte by;
    public short sh;
    public long l;
    public float f;
    public double d;
}
`);

export const SimpleFields = new TestCaseBaseClassForParser(
    'SimpleFields',
    [FileA],
    [FileA.getFileExtension()],
    []
);
