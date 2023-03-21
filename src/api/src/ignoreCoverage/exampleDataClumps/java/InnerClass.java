public class Outer {
    public void outMethod(int xInner, int yInner, String name){
        int temp = xInner - yInner;
        xInner = 0;
        name = "new name";
    }

    public class Inner {
        public void inMethod(String name, String age, int xInner, int yInner){
            xInner = 8 * yInner;
            name = Integer.toString(xInner);
        }
    }
}
