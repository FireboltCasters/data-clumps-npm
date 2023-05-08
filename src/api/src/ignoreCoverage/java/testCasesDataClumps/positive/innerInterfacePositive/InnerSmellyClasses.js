import {MyFile} from '../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('Ground.java', `
public class Ground {
    public class MySmellyInnerClass {
        // except it's not smelly because it's in a different class
        int a, b, c;
    }
    
    public class OtherInnerClass {
        public class MySmellyInnerClass {
            int x = 10;
            int y;
            String s;
        }
    }   
}`);

const FileB = new MyFile('House.java', `
public class House {
    public class MySmellyInnerClass {
        // except it's not smelly because it's in a different class
        int a, b, c;
    }
    
    public class OtherInnerClass {
        public class MySmellyInnerClass {
            int x = 10;
            int y;
            String s;
        }
    }   
}`);

export const InnerSmellyClasses = new TestCaseBaseClassForDataClumps(
    'InnerSmellyClasses',
    [FileA, FileB],
    [FileA.getFileExtension()],
    []
);
