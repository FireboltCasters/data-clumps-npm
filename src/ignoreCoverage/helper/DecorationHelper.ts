import React, {Component} from "react";
import {ClassOrInterfaceTypeContext, Dictionary} from "../../api/src/ignoreCoverage/ParsedAstTypes";

export default class DecorationHelper extends Component {

    static getDecorationForFieldsAndParameters(ast: Dictionary<ClassOrInterfaceTypeContext>){
        console.log("getDecorationForFieldsAndParameters")
        console.log(ast)
        let decoration: any[] = [];
        if(!ast){
            return decoration;
        }

        let classesOrInterfacesKeys = Object.keys(ast);
        for(let i = 0; i < classesOrInterfacesKeys.length; i++){
            let classOrInterfaceKey = classesOrInterfacesKeys[i];
            let classOrInterface = ast[classOrInterfaceKey];

            let fields = classOrInterface.fields || {};
            let fieldKeys = Object.keys(fields);
            for(let i = 0; i < fieldKeys.length; i++){
                let fieldKey = fieldKeys[i];
                let field = fields[fieldKey];
                let position = field.position;
                let hoverMessage = field.modifiers?.join(" ")+" "+field.type+" "+field.name;

                let decorationForField = {
                    range: {
                        startLineNumber: position.startLine,
                        startColumn: position.startColumn+1,
                        endLineNumber: position.endLine,
                        endColumn: position.endColumn+1
                    },
                    options: {
                        isWholeLine: false,
                        inlineClassName: "myLineDecoration",
//                        className: "myContentClass",
                        glyphMarginClassName: "myGlyphMarginClass",
                        hoverMessage: {
                            value: hoverMessage
                        }
                    }
                }
                decoration.push(decorationForField);
            }

            let methods = ast.methods;
        }



        console.log("final decoration")
        console.log(decoration)

        return decoration;
    }

}
