import {MyFile} from '../../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('Fields1.java', `
public class Fields1 {
    int foo;
    int bar;
    long serialVersionUID = 1L;
}`);

const FileB = new MyFile('Fields2.java',`
public class Fields2 {
    int foo;
    int bar;
    long serialVersionUID = 1L;
}
`);


export const SerialVersionUID = new TestCaseBaseClassForDataClumps(
    'SerialVersionUID',
    [FileA, FileB],
    [FileA.getFileExtension()],
    []
);
