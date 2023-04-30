import React, {Component} from "react";
import {ClassOrInterfaceTypeContext} from "../../api/src/ignoreCoverage/ParsedAstTypes";
import {Dictionary} from "../../api/src/ignoreCoverage/UtilTypes";

export default class DecorationHelper extends Component {

    static getDecorationForFields(ast: Dictionary<ClassOrInterfaceTypeContext>){
        //console.log("getDecorationForFields")
        //console.log(ast)
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
        }
        return decoration;
    }


    static getDecorationForParameters(ast: Dictionary<ClassOrInterfaceTypeContext>){
        console.log("getDecorationForParameters")
        //console.log(ast)
        let decoration: any[] = [];

        if(!ast){
            return decoration;
        }

        let classesOrInterfacesKeys = Object.keys(ast);
        for(let classOrInterfaceKey of classesOrInterfacesKeys){
            //console.log("classOrInterfaceKey")
            //console.log(classOrInterfaceKey)
            let classOrInterface = ast[classOrInterfaceKey];

            let methods = classOrInterface.methods || {};
            let methodKeys = Object.keys(methods);
            for(let methodKey of methodKeys){
                console.log("methodKey")
                console.log(methodKey)
                let method = methods[methodKey];

                let parameters = method.parameters || {};
                let parameterKeys = Object.keys(parameters);
                for(let paremterKey of parameterKeys){
                    let parameter = parameters[paremterKey];
                    let position = parameter.position;
                    let hoverMessage = parameter.modifiers?.join(" ")+" "+parameter.type+" "+parameter.name;

                    let decorationForParameter = {
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
                    decoration.push(decorationForParameter);
                }
            }
        }


        console.log("final decoration")
        console.log(decoration)

        return decoration;
    }

    static getDecorationForFieldsAndParameters(ast: Dictionary<ClassOrInterfaceTypeContext>){
        console.log("getDecorationForFieldsAndParameters")
        console.log(ast)
        let decoration: any[] = [];
        decoration.push(...DecorationHelper.getDecorationForFields(ast));
        decoration.push(...DecorationHelper.getDecorationForParameters(ast));

        return decoration;
    }

}
