import {MyFile} from '../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('Fields1.java', `
public class Fields1 {
    public void methodWithModifiers(int foo, boolean bar, final String baz){}
}`);

const FileB = new MyFile('Fields2.java',`
public class Fields2 {
    public void otherMethodWithModifiers(int foo, boolean bar, final String baz){}
}
`);

export const ParametersWithModifiers = new TestCaseBaseClassForDataClumps(
    'ParametersWithModifiers',
    [FileA, FileB],
    [FileA.getFileExtension()],
    []
);
