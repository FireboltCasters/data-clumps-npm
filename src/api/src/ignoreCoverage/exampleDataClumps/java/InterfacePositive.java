/**
 * Class1 and Class2 have anInterface in common but they have two methods that were not related to the interface
 * These two methods include dumplicated parameters and should be reported as a dataclump
 */

public interface anInterface {
    public void notSmellyMethod(int interNX, int interNY, String interNString);
}

public class Class1 implements anInterface{
    public void aSmellyMethod1(int interX, int interY, String interString) {
    }
}

public class Class2 implements anInterface{
    public void aSmellyMethod2(int interX, int interY, String interString) {
    }
}