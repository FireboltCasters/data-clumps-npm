export const SimpleFields = `
public class Fields1 {
    int fieldsX = 10;
    int fieldsY;
    String fieldsString;

    public void normalMethod(){
        int temp = fieldsX + 20 ;
        fieldsY = 10 * fieldsX;
        fieldsString = "new string";
    }
}

public class Fields2 {
    String fieldsString = "name";
    int fieldsX = 10;
    int fieldsY;


    public void normalMethod(){
        fieldsX  =  100 ;
        fieldsY = 50;
        fieldsString = Integer.toString(fieldsX);
    }
}
`;
