import {MyFile} from '../../../../ParsedTypes';

const FileA = new MyFile('Fields1.java', `
public class Fields1 {
    int fieldsX = 10;
    int fieldsY;
    String fieldsString;
}`);

const FileB = new MyFile('Fields2.java',`
public class Fields2 {
    String fieldsString = "name";
    int fieldsX = 10;
    int fieldsY;
}
`);


export const SimpleFields = [FileA, FileB]
