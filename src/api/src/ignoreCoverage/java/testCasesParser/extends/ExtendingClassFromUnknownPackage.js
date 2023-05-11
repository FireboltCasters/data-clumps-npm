import {TestCaseBaseClassForParser} from "../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../ParsedAstTypes";

const FileA = new MyFile('MyStack.java', `
import org.example.UnknownClass;

public class MyStack extends UnknownClass {

    @Override
    public Object push(Object item, boolean checkDuplicates, boolean logEvent, boolean notifyObservers) {}

}`);


export const ExtendingClassFromUnknownPackage = new TestCaseBaseClassForParser(
    'ExtendingClassFromUnknownPackage',
    [FileA],
    [FileA.getFileExtension()],
    []
);
