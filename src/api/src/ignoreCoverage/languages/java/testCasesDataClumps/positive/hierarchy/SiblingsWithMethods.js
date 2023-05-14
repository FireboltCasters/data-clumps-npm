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
public class GroundWithTrees extends Ground {
    public void grow(int x, int y, int z) {}
}
`);

export const SiblingsWithMethods = new TestCaseBaseClassForDataClumps(
    'SiblingsWithMethods',
    [FileA, FileB, FileC],
    [FileA.getFileExtension()],
    []
);
