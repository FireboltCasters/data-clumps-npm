import {MyFile} from '../../../../util/MyFile';

const FileB = new MyFile('MultipleClassesInOneFile.java',`
public class Fields2 {
    String foo = "name";
}

public class OtherFields2 {
    String foo = "name";
}
`);


export const MultipleClassesInOneFile = [FileB]
