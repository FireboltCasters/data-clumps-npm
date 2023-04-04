import {MyFile} from '../../../../util/MyFile';

const FileA = new MyFile('Fields1.java', `
public class Fields1 {
    int foo = 10;
    String foo = "hello";
    boolean baz;

    public void normalMethod(){}
}`);

const FileB = new MyFile('Fields2.java',`
public class Fields2 {
    int foo = 10;
    String foo = "hello";
    boolean baz;

    public void normalMethod(){}
}
`);


export const SimpleFields = [FileA, FileB]
