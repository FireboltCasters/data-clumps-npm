import {TestCaseBaseClassForParser} from "../../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

public class Main {
    public int x;

    // Anonymous class
    public static void main(String[] args) {
        new MyAnonymousClass() {
            public int x;
        };
    }
  
}
`);

export const AnonymousClass = new TestCaseBaseClassForParser(
    'AnonymousClass',
    [FileA],
    [FileA.getFileExtension()],
    []
);
