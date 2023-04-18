import {MyFile} from '../../ParsedAstTypes';

const FileA = new MyFile('SimpleClassWithFieldsAndMethods.java', `
public class SimpleClassWithFieldsAndMethods {
    public int a;
    int b;
    String c;
    
    public SimpleClassWithFieldsAndMethods() {
        a = 1;
        b = 2;
        c = "3";
    }
    
    public void method1() {
        a = 1;
        b = 2;
        c = "3";
    }
    
    public boolean method2() {
        return true;
    }
}`);


export const SimpleClassWithFieldsAndMethods = [FileA]
