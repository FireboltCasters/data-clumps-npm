import {MyFile} from '../../../../../ParsedAstTypes';

const FileA = new MyFile('SomeInterface.java', `
public interface SomeInterface {
    public void notSmellyMethod(int interX, int interY, String interString);
}`);

const FileB = new MyFile('Class1.java',`
public class Class1 implements SomeInterface{

    public void notSmellyMethod(int interX, int interY, String interString) {

    }
}`);

const FileC = new MyFile('Class2.java',`
public class Class2 implements SomeInterface{

    public void notSmellyMethod(int interX, int interY, String interString) {

    }
}`);


export const InnerInterfaceNegative = [FileA, FileB, FileC]
