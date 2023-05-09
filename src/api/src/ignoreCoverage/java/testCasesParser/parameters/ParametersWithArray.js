import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('javaParserTest/Main.java', `
package javaParserTest;

import javax.swing.Icon;

public class Main {  
    public void methodWithArrayBefore(Icon[] arrayBefore){}
    public void methodWithArrayAfter(Icon arrayBefore[]){}
    public void methodWithArbitraryNumberOfArgumentsBefore(Icon... arrayWithArbitraryBefore){}
    public void methodWithArbitraryNumberOfArgumentsAfter(Icon ...arrayWithArbitraryAfter){}
    
    public void methodWithMatrix(Icon[][] arrayMatrix){}
    public void methodWithMatrixButAsArrayBeforeAndAfter(Icon[] arrayMatrixBefore[]){}  
}
`);

export const ParametersWithArray = new TestCaseBaseClassForParser(
    'ParametersWithArray',
    [FileA],
    [FileA.getFileExtension()],
    []
);
