import {MyFile} from '../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('Fields.java', `
public class SmellyFields {
    int x = 10;
    int y;
    String s;
}`);

const FileB = new MyFile('SmellyFieldsAndMethods.java',`
public class SmellyFieldsAndMethods {
    int x = 10;
    int y;
    String s;
    
    public void methodWithModifiers(int foo, boolean bar, String baz){
    
    }
}
`);

const FileC = new MyFile('SmellyMethods.java',`
public class SmellyMethods {
    int l = 10;
    int m;
    String n;
    
    public void smellyMethod(int foo, boolean bar, String baz){
    
    }
}
`);

export const SimpleFieldsAndMethods = new TestCaseBaseClassForDataClumps(
    'SimpleFieldsAndMethods',
    [FileA, FileB, FileC],
    [FileA.getFileExtension()],
    []
);
