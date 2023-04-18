import {JavaParserHelper} from "./JavaParserHelper";
import {
    ClassOrInterfaceTypeContext,
    MemberFieldParameterTypeContext,
    MemberFieldTypeContext,
    ParameterTypeContext
} from "./../../ParsedAstTypes";

export class JavaParserFieldExtractor {
    public field: MemberFieldTypeContext;
    public classOrInterface: ClassOrInterfaceTypeContext;
    public includePosition: boolean;
    constructor(classOrInterface: ClassOrInterfaceTypeContext, ctx, includePosition: boolean) {
        this.includePosition = includePosition;
        this.classOrInterface = classOrInterface;
        let field = this.enterFieldDeclaration(ctx);
        this.field = field;
    }

    private custom_getFieldType(ctx){
        return ctx.getText();
    }

    private enterFieldDeclaration(ctx) {

        /**
         "type": "modifier",
         "node": "ModifierContext",
         "children": [
         {
                          "type": "classOrInterfaceModifier",
                          "node": "ClassOrInterfaceModifierContext",
                          "children": [
                            "static"
                          ]
                        }
         ]
         },
         {
                      "type": "memberDeclaration",
                      "node": "MemberDeclarationContext",
                      "children": [
                        {
                          "type": "fieldDeclaration",
                          "node": "FieldDeclarationContext",
                          "children": [
                            {
                              "type": "typeType",
                              "node": "TypeTypeContext",
         */
        let modifiers = JavaParserHelper.getModifiers(ctx.parentCtx.parentCtx);
        let type = this.custom_getFieldType(ctx.children[0]);
        let position: any = undefined;
        if(this.includePosition){
            position = JavaParserHelper.custom_getPosition(ctx);
        }

        let variableDeclarators = ctx.children[1]; // for example: int a, b, c;

        let parameters: MemberFieldParameterTypeContext[] = [];
        for(let i = 0; i < variableDeclarators.children.length; i++){ // loop through a, b, c
            let variableDeclarator = variableDeclarators.children[i];
            if(variableDeclarator.getText()===","){
                // skip the comma
            } else {
                let variableName = variableDeclarator.children[0].getText(); // get the name of the variable
                let parameter = new MemberFieldParameterTypeContext(variableName, variableName, type, modifiers, this.classOrInterface);
                parameters.push(parameter);
            }
        }

        // names as a string
        let namesAsString = "";
        for(let i = 0; i < parameters.length; i++){
            let parameter = parameters[i];
            namesAsString += parameter.name;
            if(i<parameters.length-1){
                namesAsString += ",";
            }
        }
        let key = namesAsString;
        let name = key;

        let field = new MemberFieldTypeContext(key, name, type, this.classOrInterface);
        field.modifiers = modifiers;
        field.position = position;
        field.parameters = parameters;

        for(let i = 0; i < parameters.length; i++){
            let parameter = parameters[i];
            parameter.memberFieldKey = key;
        }

        return field;
    }

}
