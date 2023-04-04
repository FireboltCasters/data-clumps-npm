import {JavaParserHelper} from "./JavaParserHelper";
import {FieldTypeContext} from "./../../ParsedTypes";

export class JavaParserFieldExtractor {
    public field: FieldTypeContext;
    public key: string;
    public includePosition: boolean;
    constructor(includePosition: boolean) {
        this.includePosition = includePosition;
        this.field = new FieldTypeContext();
        this.key = "";
    }

    custom_getFieldType(ctx){
        return ctx.getText();
    }

    enterFieldDeclaration(ctx) {
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

        this.field.type = type;
        this.field.modifiers = modifiers;
        if(this.includePosition){
            this.field.position = JavaParserHelper.custom_getPosition(ctx);
        }

        let variableDeclarators = ctx.children[1]; // for example: int a, b, c;

        for(let i = 0; i < variableDeclarators.children.length; i++){ // loop through a, b, c
            let variableDeclarator = variableDeclarators.children[i];
            if(variableDeclarator.getText()===","){
                // skip the comma
            } else {
                let variableName = variableDeclarator.children[0].getText(); // get the name of the variable
                this.field.names.push(variableName);
            }
        }
        // names as a string
        let namesAsString = this.field.names.join(",");
        let key = namesAsString;
        this.key = key;
        return this.field;
    }

}
