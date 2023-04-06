import {MyFile} from '../../../../ParsedTypes';

const FileA = new MyFile('NormalClass.java', `
public class NormalClass {
    public void method1() {
    }
}`);

const FileB = new MyFile('AnotherNormalClass.java',`
public class AnotherNormalClass {
    public void method2(int an1, int an2, int an3) {
    }
}`);

const FileC = new MyFile('Anonymous.java',`
public class Anonymous {
    public void normalMethod(){
        NormalClass n = new NormalClass(){
            public void smellyMethod( int an2, int an1, int an3) {

            }
        }
    }
}`);

export const AnonymousClass = [FileA, FileB, FileC]
