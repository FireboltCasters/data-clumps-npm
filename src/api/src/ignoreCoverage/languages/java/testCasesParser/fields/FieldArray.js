import {TestCaseBaseClassForParser} from "../../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

import javax.swing.Icon;

public class Main {
  private static Icon[] iconArray;
  private static Icon [] iconArrayWithSpace;
  private static Icon [ ] iconArrayWithSpaceInside;  
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
    
    private static Icon[][] iconMatrix;
    private static Icon [][] iconMatrixWithSpace;
    private static Icon [ ] [ ] iconMatrixWithSpaceInside;
    private static Icon iconMatrixAfter[][];
    private static Icon[] iconMatrixBefore[];
    private static Icon[] iconMatrixBefore2 [];
    private static Icon iconMatrixAfter2 [] [];
    
}
`);

export const FieldArray = new TestCaseBaseClassForParser(
    'FieldArray',
    [FileA],
    [FileA.getFileExtension()],
    []
);
