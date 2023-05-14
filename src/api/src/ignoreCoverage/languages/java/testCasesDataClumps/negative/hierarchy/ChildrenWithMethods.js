import {MyFile} from '../../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('Ground.java', `
public class Ground {
    
}`);

const FileB = new MyFile('GroundWithGrass.java', `
public class GroundWithGrass extends Ground {
    public void grow(int x, int y, int z) {}
}`);

const FileC = new MyFile('GroundWithTrees.java',`
public class GroundWithTrees extends GroundWithGrass {
    // are not enforced to annotate the method is overriden
    public void grow(int x, int y, int z) {} 
}
`);

export const ChildrenWithMethods = new TestCaseBaseClassForDataClumps(
    'ChildrenWithMethods',
    [FileA, FileB, FileC],
    [FileA.getFileExtension()],
    []
);
