import {MyFile} from '../../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('A.java', `
public class A{
    public int x;
    public int y;
}`);

const FileB = new MyFile('AExtender.java', `
public class AExtender extends A {
    public int z;
}`);

const FileC = new MyFile('SameFieldsAsAExtender.java', `
public class SameFieldsAsAExtender {
    public int x;
    public int y;
    public int z;
}`);

export const ExtendsToSameFields = new TestCaseBaseClassForDataClumps(
    'ExtendsToSameFields',
    [FileA, FileB, FileC],
    [FileA.getFileExtension()],
    []
);
