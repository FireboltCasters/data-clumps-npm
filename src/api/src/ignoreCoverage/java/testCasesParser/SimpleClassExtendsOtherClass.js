import {MyFile} from '../../ParsedAstTypes';

const FileA = new MyFile('SimpleClassExtendsOtherClass.java', `
public class ParentClass {
    public int a;
    
    public ParentClass() {
    }
    
    public void method1() {
    }
}

public class ChildClass extends ParentClass {

    public ChildClass() {
    
    }

}`);


export const SimpleClassExtendsOtherClass = [FileA]
