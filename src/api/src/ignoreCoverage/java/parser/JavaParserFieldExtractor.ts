import {JavaParserHelper} from "./JavaParserHelper";
import {
    ClassOrInterfaceTypeContext,
    MemberFieldParameterTypeContext,
    MemberFieldTypeContext
} from "./../../ParsedAstTypes";
import {JavaParserFieldAndParameterTypeExtractor} from "./JavaParserFieldAndParameterTypeExtractor";
import {JavaAntlr4CstPrinter} from "../util/JavaAntlr4CstPrinter";

export class JavaParserFieldExtractor {
    public field: MemberFieldTypeContext;
    public classOrInterface: ClassOrInterfaceTypeContext;
    public currentVisibleClassOrInterface: any;
    public includePosition: boolean;
    constructor(classOrInterface: ClassOrInterfaceTypeContext, currentVisibleClassOrInterface: any, ctx, includePosition: boolean) {
        this.includePosition = includePosition;
        this.currentVisibleClassOrInterface = currentVisibleClassOrInterface;
        this.classOrInterface = classOrInterface;
        let field = this.enterFieldDeclaration(ctx);
        this.field = field;
    }

    private enterFieldDeclaration(ctx) {
        console.log("------------------")
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

        let typeType = JavaParserHelper.getChildByType(ctx, "typeType");
        let type = JavaParserFieldAndParameterTypeExtractor.custom_getFieldType(typeType, this.currentVisibleClassOrInterface);

        let position: any = undefined;
        if(this.includePosition){
            position = JavaParserHelper.custom_getPosition(ctx);
            console.log("position: ");
            console.log(position)
        }

        let variableDeclarators = ctx.children[1]; // for example: int a, b, c;
        console.log("variableDeclarators. ", JavaParserHelper.custom_getPosition(variableDeclarators));

        let positionOfTypeWithParameters: any = JavaParserHelper.custom_getPosition(ctx);

        let parameters: MemberFieldParameterTypeContext[] = [];
        for(let i = 0; i < variableDeclarators.children.length; i++){ // loop through a, b, c
            let variableDeclarator = variableDeclarators.children[i];
            let nextVariableDeclarator = variableDeclarators.children[i+2] || null // we skip the comma
            if(variableDeclarator.getText()===","){
                // skip the comma
            } else {
                console.log("1. ", JavaParserHelper.custom_getPosition(variableDeclarator));
                let variableName = variableDeclarator.children[0].getText(); // get the name of the variable

                let parameterPosition: any = JavaParserHelper.custom_getPosition(variableDeclarator);
                // TODO: Check why position is not correct
                // Workaround: we use the length of the name of the variable
                parameterPosition.endColumn = parameterPosition.startColumn + variableName.length;


                let parameter = new MemberFieldParameterTypeContext(variableName, variableName, type, modifiers, this.classOrInterface);
                console.log("parameterPosition: ");
                console.log(parameterPosition)
                parameter.position = parameterPosition
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
