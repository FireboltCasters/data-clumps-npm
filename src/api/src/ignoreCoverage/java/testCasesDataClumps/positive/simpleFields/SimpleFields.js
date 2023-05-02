import {MyFile} from '../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('Fields1.java', `
public class Fields1 {
    int x = 10;
    int y;
    String s;
}`);

const FileB = new MyFile('Fields2.java',`
public class Fields2 {
    int x = 10;
    int y;
    String s;
}
`);

export const SimpleFields = new TestCaseBaseClassForDataClumps(
    'SimpleFields',
    [FileA, FileB],
    [FileA.getFileExtension()],
    []
);
