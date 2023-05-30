import {MyFile} from '../../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('Underground.java', `
class MyADT { }

public class Underground<E extends MyADT> {
    public E e; // altough in both files E is given, E here extends MyADT and is therefore a different type
    public int a;
    public int b;
}`);

const FileB = new MyFile('Sky.java',`
public class Sky<E> {
    public E e; // so this is no dataclump
    public int a;
    public int b;
}`);

export const GenericDifferentExtending = new TestCaseBaseClassForDataClumps(
    'GenericDifferentExtending',
    [FileA, FileB],
    [FileA.getFileExtension()],
    []
);
