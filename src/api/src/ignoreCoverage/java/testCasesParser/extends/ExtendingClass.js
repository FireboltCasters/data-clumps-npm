import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('Batman.java', `
// this is a class without package

public class Batman {
   public int a;
   public int b;
   public int c;
}`);

const FileB = new MyFile('Robin.java',`
// this is a class without package and extends Batman in the same folder

public class Robin extends Batman {
   public int d;
}`);

// Theoreticly FileB and FileD should be same, since they share the same member fields: a, b, c, d
// Therefore, there should be a data clump between FileB and FileD
// What would be the best way to solve this?


export const ExtendingClass = new TestCaseBaseClassForParser(
    'ExtendingClass',
    [FileA, FileB],
    [FileA.getFileExtension()],
    []
);
