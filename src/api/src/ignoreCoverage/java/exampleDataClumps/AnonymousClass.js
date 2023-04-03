export const AnonymousClass = `
public class NormalClass {
    public void method1() {
    }
}

public class AnotherNormalClass {
    public void method2(int an1, int an2, int an3) {
    }
}


public class Anonymous {
    public void normalMethod(){
        NormalClass n = new NormalClass(){
            public void smellyMethod( int an2, int an1, int an3) {

            }
        };
    }
}
`;
