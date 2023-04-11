import {MyFile} from '../../../../ParsedTypes';

const FileA = new MyFile('ClassWithFields.java', `
public class ClassWithFields {
    int x = 10;
    int y;
    String s;
}`);

const FileB = new MyFile('ClassWithMethod.java',`
public class ClassWithMethod {
    public void methodWithParameters(int x, int y, String s) {}
}
`);


export const SimpleFields = [FileA, FileB]
