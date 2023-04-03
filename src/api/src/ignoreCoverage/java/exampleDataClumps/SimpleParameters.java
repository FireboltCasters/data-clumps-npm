public class Parameters1 {
    public void smellyMethod1(int paraX, int paraY, String paraNormal, String paraString) {
        String tempString = paraString;
        paraX = paraY + 10;
    }

    public void normalMethod() {
        smellyMethod1(10, 5, "dummy string1", "dummy string2");
    }
}

public class Parameters2 {
    public void smellyMethod2(int paraX, int paraY, String paraString) {
        paraString = Integer.toString(paraY);
        paraX = 1;
    }

    public void normalMethod(){
        smellyMethod2(10, 5, "text");
    }
}