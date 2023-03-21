export const FieldsInClassInClass = `
public class NormalClass {}

public class OuterClass {
    int fieldsX = 10;

    public void normalMethod(){
        NormalClass n = new NormalClass(){
            int fieldsY = 10;
        };
    }
}
`;
