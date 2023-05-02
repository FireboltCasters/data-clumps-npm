import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('Batman.java', `
public interface Batman extends Hero {
}`);

const FileB = new MyFile('Hero.java',`
public interface Hero {
}`);

// Theoreticly FileB and FileD should be same, since they share the same member fields: a, b, c, d
// Therefore, there should be a data clump between FileB and FileD
// What would be the best way to solve this?


export const InterfaceExtendsInterfaces = new TestCaseBaseClassForParser(
    'InterfaceExtendsInterfaces',
    [FileA, FileB],
    [FileA.getFileExtension()],
    []
);
