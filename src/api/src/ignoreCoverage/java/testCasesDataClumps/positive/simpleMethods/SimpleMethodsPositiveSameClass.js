import {MyFile} from '../../../../util/MyFile';

const FileA = new MyFile('SameClass.java', `
public class SameClass {
    public void someSmellyMethod1(int paX, int paY, String paString) {
    }

    public void anotherSmelly(int paX, int paY, String paString) {
    }
}`);

export const SimpleMethodsPositiveSameClass = [FileA]
