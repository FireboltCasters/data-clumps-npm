import {MyFile} from '../../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('Underground.java', `
public class Underground<E, G> {
    public E e;
    public G a;
    public int b;
}`);

const FileB = new MyFile('Sky.java',`
public class Sky<E, G> {
    public E e;
    public G a;
    public int b;
}`);

export const SimpleGeneric = new TestCaseBaseClassForDataClumps(
    'SimpleGeneric',
    [FileA, FileB],
    [FileA.getFileExtension()],
    []
);
