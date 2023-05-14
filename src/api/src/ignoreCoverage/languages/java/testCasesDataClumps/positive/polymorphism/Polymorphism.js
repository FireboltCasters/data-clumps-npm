import {MyFile} from '../../../../../ParsedAstTypes';

const FileA = new MyFile('Polymorphism.java', `
public class Polymorphism {

    public void smellyParent(int dup1, int dup2, int dup3) {

    }
}`);

const FileB = new MyFile('Child.java',`
public class Child extends Polymorphism {

    public void smellyChild(int dup2, int dup1, int dup3) {

    }
}`);


export const Polymorphism = [FileA, FileB]
