import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

import javax.swing.Icon;

public class Main {
  private static Icon[] iconArray;
  private static Icon[][] iconMatrix;
  
  private static Icon iconsArrayAfter[] = 
    {inherit,
     realiz,
     null,
     null,
     null,
    };
    
   private static Icon[] iconsArrayBefore = 
    {inherit,
     inherit,
     null,
     null,
     null,
    };
}
`);

export const FieldArray = new TestCaseBaseClassForParser(
    'FieldArray',
    [FileA],
    [FileA.getFileExtension()],
    []
);
