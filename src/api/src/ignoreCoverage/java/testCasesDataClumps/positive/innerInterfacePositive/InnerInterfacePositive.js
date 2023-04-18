import {MyFile} from '../../../../ParsedAstTypes';

const FileA = new MyFile('AnInterface.java', `
public interface AnInterface {
    public void notSmellyMethod(int interNX, int interNY, String interNString);
}`);

const FileB = new MyFile('Class1.java',`
public class Class1 implements AnInterface{
    public void aSmellyMethod1(int interX, int interY, String interString) {
    }
}`);

const FileC = new MyFile('Class2.java',`
public class Class2 implements AnInterface{
    public void aSmellyMethod2(int interX, int interY, String interString) {
    }
}`);


export const InnerInterfacePositive = [FileA, FileB, FileC]
