import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

import javax.swing.Icon;

public class Main {
    private static String foo    ,   bar   , baz   ;
    
    private static Icon[] icons = 
    {inherit,
     inherit,
     null,
     null,
     null,
    };
}
`);

export const FieldsMultipleInRowWithSpacesAndLinebreaks = new TestCaseBaseClassForParser(
    'FieldsMultipleInRowWithSpacesAndLinebreaks',
    [FileA],
    [FileA.getFileExtension()],
    []
);
