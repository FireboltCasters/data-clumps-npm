import {JavaParserHelper} from "./JavaParserHelper";
import {
    ClassOrInterfaceTypeContext,
    MemberFieldParameterTypeContext,
    MemberFieldTypeContext
} from "./../../ParsedAstTypes";
import {JavaAntlr4CstPrinter} from "./../util/JavaAntlr4CstPrinter";

export class JavaParserFieldAndParameterTypeExtractor {

    public static custom_getFieldType(ctx, variableDeclaratorCtx, currentVisibleClassOrInterface){
        let rawTypeText = ctx.getText();
        //console.log("custom_getFieldType called with rawTypeText: " + rawTypeText);

        //let ctx = JavaParserFieldAndParameterTypeExtractor.getExampleFieldOrParameterTypeCtx();

        let firstPartOfType = JavaParserFieldAndParameterTypeExtractor.getTypeOfFirstPartOfTypeArgumentChild(ctx, currentVisibleClassOrInterface);

        let finalType = "";


        let secondPartOfType = "";
        // since we got the first part of the type, we can now check if it is an array type in the variableDeclaratorId
        // E.g. "String[] myStringArray" or "String myStringArray[]"
        let variableDeclaratorIdCtx = JavaParserHelper.getChildByType(variableDeclaratorCtx, "variableDeclaratorId");
        for(let variableDeclaratorChild of variableDeclaratorIdCtx.children){
            let typeOfVariableDeclaratorChild = JavaParserHelper.getCtxType(variableDeclaratorChild);
            if(typeOfVariableDeclaratorChild==="identifier"){

            } else {
                let secondPartText = variableDeclaratorChild?.getText?.() || "";
                secondPartOfType += secondPartText;
            }
        }

        let thirdPartOfType = "";
        // maybe it is an arbitrary number of parameters like "String... myStringArray" or "String myStringArray..."
        // Only the last parameter in a method can be a vararg
        let variableDeclaratorCtxChildren = variableDeclaratorCtx?.children || [];
        for(let variableDeclaratorCtxChild of variableDeclaratorCtxChildren){
            let textOfVariableDeclaratorCtxChild = variableDeclaratorCtxChild?.getText?.() || "";
            if(textOfVariableDeclaratorCtxChild==="..."){
                // IntelliJ handles varargs "String... args" as "String... args" and "String ...args" and "String... args"
                // So in IntelliJ vargarg is a unique type, and therefore we also handle it as a unique type
                // Since it would make us problems when refactoring or handling them as arrays.
                thirdPartOfType = "...";
            }
        }


        finalType += firstPartOfType;
        finalType += secondPartOfType;
        finalType += thirdPartOfType;

        //console.log("custom_getFieldType returning finalType: " + finalType)
        return finalType;
    }

    private static getTypeOfFirstPartOfTypeArgumentChild(ctx, currentVisibleClassOrInterface){
        let finalType = "";

        for(let ctxChild of ctx.children){
            let ctxChildType = JavaParserHelper.getCtxType(ctxChild);
            //console.log("- ctxChildType: " + ctxChildType);
            if(!!ctxChildType){
                if(ctxChildType==="classOrInterfaceType"){
                    let classOrInterfaceType = ctxChild;

                    if(!!classOrInterfaceType) {
                        let children = classOrInterfaceType?.children || [];
                        for (let child of children) {
                            let childType = JavaParserHelper.getCtxType(child);
                            let isTypeIdentifier = childType === "typeIdentifier";
                            let isChildTypeArguments = childType === "typeArguments";

                            if (!!childType) {
                                //console.log("- child is type: " + childType);
                                if (isTypeIdentifier) {
                                    //console.log("- child is isTypeIdentifier: " + childType)
                                    let simpleOrQualifiedChildType = child?.children?.[0];
                                    // TODO: i believe i did in inner class extraction something similar. Maybe refactor this and merge it with that
                                    let qualifiedChildType = currentVisibleClassOrInterface[simpleOrQualifiedChildType];
                                    if (qualifiedChildType) { // then it is a qualified type like "java.util.List"
                                        //console.log("- child is qualified type: " + qualifiedChildType)
                                        finalType += qualifiedChildType;
                                    } else { // then it is a simple type like "List" or "String"
                                        //console.log("- child is simple type: " + simpleOrQualifiedChildType)
                                        finalType += simpleOrQualifiedChildType
                                    }
                                }
                                if (isChildTypeArguments) { // then it is a generic type argument like "String" in "List<String>"
                                    //console.log("- child is type arguments: " + childType)
                                    let typeArgumentChildren = child?.children || []; // maybe it is a List<List<List>>...
                                    let typeArgumentsFinalType = "";
                                    for (let typeArgumentChild of typeArgumentChildren) {
                                        let rawText = typeArgumentChild?.getText?.() || "";
                                        //console.log("- typeArgumentChild: rawText: " + rawText)
                                        let typeArgumentChildType = JavaParserHelper.getCtxType(typeArgumentChild);
                                        //console.log("- typeArgumentChild: typeArgumentChildType: " + typeArgumentChildType)
                                        if (!!typeArgumentChildType) { // then its like "[", "]", "<" or ">"
                                            if (typeArgumentChildType === "typeArgument") {
                                                //console.log("- typeArgumentChild is a typeArgument")
                                                let childrenOfTypeArgumentChild = typeArgumentChild?.children || [];
                                                let amountChildrenOfTypeArgumentChild = childrenOfTypeArgumentChild.length;
                                                for (let i = 0; i < amountChildrenOfTypeArgumentChild; i++) {
                                                    let childOfTypeArgumentChild = childrenOfTypeArgumentChild[i];
                                                    let typeOfChildOfTypeArgumentChild = JavaParserFieldAndParameterTypeExtractor.getTypeOfChildArgumentChild(childOfTypeArgumentChild, currentVisibleClassOrInterface);
                                                    // typeOfChildOfTypeArgumentChild might be: "String", "?", "&", "super" or "extends"

                                                    typeArgumentsFinalType += typeOfChildOfTypeArgumentChild;

                                                    let nextChildOfTypeArgumentChild = childrenOfTypeArgumentChild[i + 1];
                                                    if(!!nextChildOfTypeArgumentChild){
                                                        let typeOfNextChildOfTypeArgumentChild = JavaParserFieldAndParameterTypeExtractor.getTypeOfChildArgumentChild(nextChildOfTypeArgumentChild, currentVisibleClassOrInterface);
                                                        if(!!typeOfNextChildOfTypeArgumentChild){ // so we can check if we need to add a space
                                                            if(typeOfChildOfTypeArgumentChild==="?" && typeOfNextChildOfTypeArgumentChild==="extends"){
                                                                typeArgumentsFinalType += " ";
                                                            }
                                                            if(typeOfChildOfTypeArgumentChild==="?" && typeOfNextChildOfTypeArgumentChild==="super"){
                                                                typeArgumentsFinalType += " ";
                                                            }
                                                            if(typeOfChildOfTypeArgumentChild==="extends"){
                                                                typeArgumentsFinalType += " ";
                                                            }
                                                            if(typeOfChildOfTypeArgumentChild==="super"){
                                                                typeArgumentsFinalType += " ";
                                                            }
                                                            if(typeOfChildOfTypeArgumentChild==="&"){
                                                                typeArgumentsFinalType += " ";
                                                            }
                                                        }
                                                    }

                                                }
                                            } else { // then it might be some text like "[", "]", "<" or ">"
                                                //console.log("- typeArgumentChild is a symbol: " + typeArgumentChild)
                                                typeArgumentsFinalType += typeArgumentChild;
                                            }
                                        }
                                    }
                                    finalType += typeArgumentsFinalType;
                                }
                            } else { // then it might be some text like "[", "]", "<" or ">"
                                if (!!child) {
                                    //console.log("- child: " + child)
                                    finalType += child
                                }
                            }
                        }
                    }
                } else {
                    //console.log("- ctxChildType is not classOrInterfaceType: " + ctxChildType)
                    let simpleType = ctxChild?.getText?.() || "";
                    finalType += simpleType;
                }
            }
        }

        return finalType;
    }

    private static getTypeOfChildArgumentChild(childOfTypeArgumentChild, currentVisibleClassOrInterface){
        let typeTypeOfTypeArgumentChild = JavaParserHelper.getCtxType(childOfTypeArgumentChild);
        //console.log("- typeTypeOfTypeArgumentChild: " + typeTypeOfTypeArgumentChild)
        if(!!typeTypeOfTypeArgumentChild && typeTypeOfTypeArgumentChild==="classOrInterfaceType") { // then it is a type like "String"
            let typeTypeFinalType = JavaParserFieldAndParameterTypeExtractor.getTypeOfFirstPartOfTypeArgumentChild(childOfTypeArgumentChild, currentVisibleClassOrInterface);
            return typeTypeFinalType;
        } else { // then it might be something like "super" or "extends" or "?"
            let rawText = childOfTypeArgumentChild?.getText?.() || "";
           return rawText
        }
    }

    private getExampleFieldOrParameterTypeCtx(){
        return (
            {
                "type": "typeType",
                "node": "TypeTypeContext",
                "children": [
                    {
                        "type": "classOrInterfaceType",
                        "node": "ClassOrInterfaceTypeContext",
                        "children": [
                            {
                                "type": "typeIdentifier",
                                "node": "TypeIdentifierContext",
                                "children": [
                                    "List"
                                ]
                            },
                            {
                                "type": "typeArguments",
                                "node": "TypeArgumentsContext",
                                "children": [
                                    "<",
                                    {
                                        "type": "typeArgument",
                                        "node": "TypeArgumentContext",
                                        "children": [
                                            {
                                                "type": "typeType",
                                                "node": "TypeTypeContext",
                                                "children": [
                                                    {
                                                        "type": "classOrInterfaceType",
                                                        "node": "ClassOrInterfaceTypeContext",
                                                        "children": [
                                                            {
                                                                "type": "typeIdentifier",
                                                                "node": "TypeIdentifierContext",
                                                                "children": [
                                                                    "List"
                                                                ]
                                                            },
                                                            {
                                                                "type": "typeArguments",
                                                                "node": "TypeArgumentsContext",
                                                                "children": [
                                                                    "<",
                                                                    {
                                                                        "type": "typeArgument",
                                                                        "node": "TypeArgumentContext",
                                                                        "children": [
                                                                            {
                                                                                "type": "typeType",
                                                                                "node": "TypeTypeContext",
                                                                                "children": [
                                                                                    {
                                                                                        "type": "classOrInterfaceType",
                                                                                        "node": "ClassOrInterfaceTypeContext",
                                                                                        "children": [
                                                                                            {
                                                                                                "type": "typeIdentifier",
                                                                                                "node": "TypeIdentifierContext",
                                                                                                "children": [
                                                                                                    "String"
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    },
                                                                    ">"
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    ">"
                                ]
                            }
                        ]
                    }
                ]
            }
        )
    }

}
