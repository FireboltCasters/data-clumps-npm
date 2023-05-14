import {JavaParserHelper} from "./JavaParserHelper";
import {
    ClassOrInterfaceTypeContext,
    MemberFieldParameterTypeContext,
    MemberFieldTypeContext
} from "./../../../ParsedAstTypes";
import {JavaParserFieldAndParameterTypeExtractor} from "./JavaParserFieldAndParameterTypeExtractor";

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
        //console.log("------------------")
        //JavaAntlr4CstPrinter.print(ctx, "FieldDeclarationContext")

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

        let position: any = undefined;
        if(this.includePosition){
            position = JavaParserHelper.custom_getPosition(ctx);
        }

        let variableDeclarators = ctx.children[1]; // for example: int a, b, c;

        //JavaAntlr4CstPrinter.print(variableDeclarators, "VariableDeclaratorsContext")

        let parameters: MemberFieldParameterTypeContext[] = [];
        for(let i = 0; i < variableDeclarators.children.length; i++){ // loop through a, b, c
            let variableDeclarator = variableDeclarators.children[i];
            if(variableDeclarator.getText()===","){
                // skip the comma
            } else {
                let variableDeclaratorId = JavaParserHelper.getChildByType(variableDeclarator, "variableDeclaratorId");
                if(!!variableDeclaratorId){
                    let type = JavaParserFieldAndParameterTypeExtractor.custom_getFieldType(typeType, variableDeclarator, this.currentVisibleClassOrInterface);
                    let variableIdentifier = JavaParserHelper.getChildByType(variableDeclaratorId, "identifier");
                    if(!!variableIdentifier){
                        let variableName = variableIdentifier.getText(); // get the name of the variable

                        let parameterPosition: any = JavaParserHelper.custom_getPosition(variableDeclarator);

                        // TODO: Check why position is not correct
                        // Workaround: we use the length of the name of the variable
                        parameterPosition.endColumn = parameterPosition.startColumn + variableName.length;
                        parameterPosition.endLine = parameterPosition.startLine; // since the end of the declaration might be on the next line, we set it to the same line but we want the end of the variable name

                        let ignore = this.shouldIgnore(variableName);

                        let parameter = new MemberFieldParameterTypeContext(variableName, variableName, type, modifiers, ignore, this.classOrInterface);
                        parameter.position = parameterPosition
                        parameters.push(parameter);
                    }
                }
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

        let field = new MemberFieldTypeContext(key, name, "field", this.classOrInterface);
        field.modifiers = modifiers;
        field.position = position;
        field.parameters = parameters;

        for(let i = 0; i < parameters.length; i++){
            let parameter = parameters[i];
            parameter.memberFieldKey = key;
        }

        return field;
    }

    private shouldIgnore(variableName){
        // DONE: we should exclude special fields

        // like serialVersionUID, serialPersistentFields
        if(variableName==="serialVersionUID"){
            return true;
        }
        if(variableName==="serialPersistentFields"){
            return true;
        }

        // TODO: what about loggers?

        return false;
    }

}
