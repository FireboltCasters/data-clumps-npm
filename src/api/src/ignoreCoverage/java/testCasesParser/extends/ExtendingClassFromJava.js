import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('MyStack.java', `
import java.util.Stack;

public class MyStack extends Stack {

    @Override
    public Object push(Object item, boolean checkDuplicates, boolean logEvent, boolean notifyObservers) {}

}`);

// Theoreticly FileB and FileD should be same, since they share the same member fields: a, b, c, d
// Therefore, there should be a data clump between FileB and FileD
// What would be the best way to solve this?


export const ExtendingClassFromJava = new TestCaseBaseClassForParser(
    'ExtendingClassFromJava',
    [FileA],
    [FileA.getFileExtension()],
    []
);
