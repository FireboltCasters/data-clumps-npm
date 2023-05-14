import {TestCaseBaseClassForParser} from "../../../../TestCaseBaseClassForParser";
import {MyFile} from "../../../../ParsedAstTypes";

const FileA = new MyFile('hero/main/cool/Batman.java', `
package hero.main.cool;

public interface Batman {
   public void method(int x, int y, int z);
}`);

const FileB = new MyFile('hero/sidekick/Batman.java',`
package hero.sidekick;

// We have a class with the same name as the one in hero.main.cool.Batman
// this is allowed, since they are in different packages
public class Batman implements hero.main.cool.Batman {
   public void method(int x, int y, int z){
   
   }
}`);

// Theoreticly FileB and FileD should be same, since they share the same member fields: a, b, c, d
// Therefore, there should be a data clump between FileB and FileD
// What would be the best way to solve this?


export const ImplementsInterfaceWithQualifiedName = new TestCaseBaseClassForParser(
    'ImplementsInterfaceWithQualifiedName',
    [FileA, FileB],
    [FileA.getFileExtension()],
    []
);
