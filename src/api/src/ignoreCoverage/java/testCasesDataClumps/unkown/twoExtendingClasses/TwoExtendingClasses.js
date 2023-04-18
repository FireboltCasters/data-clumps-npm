import {MyFile} from '../../../../ParsedAstTypes';

const FileA = new MyFile('Batman.java', `
public class Batman {
   public int a;
   public int b;
   public int c;
}`);

const FileB = new MyFile('Robin.java',`
public class Robin extends Batman {
   public int d;
}`);

const FileC = new MyFile('Joker.java', `
public class Joker {
   public int a;
   public int b;
}`);

const FileD = new MyFile('Harley.java',`
public class Harley extends Joker {
   public int c;
   public int d;
}`);

// Theoreticly FileB and FileD should be same, since they share the same member fields: a, b, c, d
// Therefore, there should be a data clump between FileB and FileD
// What would be the best way to solve this?


export const InnerInterfaceNegative = [FileA, FileB, FileC, FileD]
