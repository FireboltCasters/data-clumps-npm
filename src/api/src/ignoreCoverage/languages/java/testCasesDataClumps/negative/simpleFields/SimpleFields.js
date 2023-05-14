import {MyFile} from '../../../../../ParsedAstTypes';

const FileA = new MyFile('Fields1.java', `
public class Fields1 {
    int foo = 10;
    int bar;
    String baz;

    public void normalMethod(){
        int temp = fieldsX + 20 ;
        fieldsY = 10 * fieldsX;
        fieldsString = "new string";
    }
}`);

const FileB = new MyFile('Fields2.java',`
public class Fields2 {
    String foo = "name";
    int bar = 10;
    int notBaz;

    public void normalMethod(){
        fieldsX  =  100 ;
        fieldsY = 50;
        fieldsString = Integer.toString(fieldsX);
    }
}
`);


export const SimpleFields = [FileA, FileB]
