public class Parameters1 {
    public void smellyMethod1(int paraZ, int paraY, String paraNormal, String paraTest) {
    }
}

public class Parameters2 {
    public void smellyMethod2(int paraX, int paraY, String paraString) {
    }

}


public class Fields1 {
    int fieldsG = 10;
    boolean fieldsY;
    String fieldsString;
}

public class Fields2 {
    String fieldsString = "name";
    int fieldsX = 10;
    int fieldsY;
}

public class Animal {
    int age2;
    float wieght;
    String name;
}

public class Cat extends Animal {
    int age;
    int wieght;
    String name;
}

public class Dog extends Animal {
    int age1;
    int wieght2;
    String name;
}

public class Outer {
    public void outMethod(int xIn, float yInner, String name) {
    }

    public class Inner {
        public void inMethod(String name, String age, int xInner, int yInner) {
        }
    }
}
