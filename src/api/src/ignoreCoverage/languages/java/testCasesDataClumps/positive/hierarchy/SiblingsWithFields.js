import {MyFile} from '../../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('Ground.java', `
public class Ground {

}`);

const FileB = new MyFile('GroundWithGrass.java', `
public class GroundWithGrass extends Ground {
    int x = 10;
    int y;
    String s;
}`);

const FileC = new MyFile('GroundWithTrees.java',`
public class GroundWithTrees extends Ground {
    int x = 10;
    int y;
    String s;
}
`);

export const SiblingsWithFields = new TestCaseBaseClassForDataClumps(
    'SiblingsWithFields',
    [FileA, FileB, FileC],
    [FileA.getFileExtension()],
    []
);
