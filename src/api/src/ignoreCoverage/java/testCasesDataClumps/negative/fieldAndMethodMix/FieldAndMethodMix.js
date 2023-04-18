import {MyFile} from '../../../../ParsedAstTypes';

const FileA = new MyFile('ClassWithFields.java', `
public class ClassWithFields {
    int x = 10;
    int y;
    String s;
}`);

const FileB = new MyFile('ClassWithMethod.java',`
public class ClassWithMethod {
    public void methodWithParameters(int x, int y, String s) {}
}
`);

// Explanation why this is negative:
// Although is looks like we may could use the "ClassWithFields" in the method "methodWithParameters" we dont suggest this:
/**
 * https://sourcemaking.com/refactoring/smells/data-clumps
 * When to Ignore
 + Passing an entire object in the parameters of a method, instead of passing just its values (primitive types), may create an undesirable dependency between the two classes.
 */


export const FieldAndMethodMix = [FileA, FileB]
