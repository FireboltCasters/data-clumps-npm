import {MyFile} from '../../../../ParsedAstTypes';

const FileA = new MyFile('Fields1.java', `
public class Fields1 {
    public void normalMethod(int foo, boolean bar, String baz){}
}`);

const FileB = new MyFile('Fields2.java',`
public class Fields2 {
    public void normalOtherMethod(int foo, boolean bar, String baz){}
}
`);


export const SimpleMethodsWithDataClumps = [FileA, FileB]
