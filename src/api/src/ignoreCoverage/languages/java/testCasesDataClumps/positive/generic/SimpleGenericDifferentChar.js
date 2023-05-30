import {MyFile} from '../../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('Underground.java', `
public class Underground<E, G> {
    public E e;
    public G a;
    public int b;
}`);

const FileB = new MyFile('Sky.java',`
public class Sky<E, H> {
    public E e;
    public H a; //i think since generics in java are converted to Object, H and G should be same
    // and therefore a data clump
    public int b;
}`);

export const SimpleGenericDifferentChar = new TestCaseBaseClassForDataClumps(
    'SimpleGenericDifferentChar',
    [FileA, FileB],
    [FileA.getFileExtension()],
    []
);
