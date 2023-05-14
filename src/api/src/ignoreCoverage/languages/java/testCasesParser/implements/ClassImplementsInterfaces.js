import {TestCaseBaseClassForParser} from "../../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../../ParsedAstTypes";

const FileA = new MyFile('Batman.java', `
public class Batman implements Hero, Person {
   public int a;
   public int b;
   public int c;
}`);

const FileB = new MyFile('Hero.java',`
public interface Hero {

}`);

const FileC = new MyFile('Person.java',`
public interface Person {

}`);

// Theoreticly FileB and FileD should be same, since they share the same member fields: a, b, c, d
// Therefore, there should be a data clump between FileB and FileD
// What would be the best way to solve this?


export const ClassImplementsInterface = new TestCaseBaseClassForParser(
    'ClassImplementsInterface',
    [FileA, FileB, FileC],
    [FileA.getFileExtension()],
    []
);
