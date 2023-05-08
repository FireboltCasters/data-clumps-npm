import {JavaParserHelper} from "./JavaParserHelper";
import {
    ClassOrInterfaceTypeContext,
    MemberFieldParameterTypeContext,
    MemberFieldTypeContext
} from "./../../ParsedAstTypes";
import {JavaAntlr4CstPrinter} from "./../util/JavaAntlr4CstPrinter";

export class JavaParserFieldAndParameterTypeExtractor {

    public static custom_getFieldType(ctx, currentVisibleClassOrInterface){
        let rawTypeText = ctx.getText();
        //console.log("custom_getFieldType called with rawTypeText: " + rawTypeText);
        //JavaAntlr4CstPrinter.print(ctx, "custom_getFieldType");

        //let ctx = JavaParserFieldAndParameterTypeExtractor.getExampleFieldOrParameterTypeCtx();

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
                                                let typeTypeOfTypeArgumentChild = JavaParserHelper.getChildByType(typeArgumentChild, "typeType");
                                                let typeTypeFinalType = JavaParserFieldAndParameterTypeExtractor.custom_getFieldType(typeTypeOfTypeArgumentChild, currentVisibleClassOrInterface);
                                                typeArgumentsFinalType += typeTypeFinalType;
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
                    finalType += ctxChild;
                }
            }
        }


        //console.log("custom_getFieldType returning finalType: " + finalType)
        return finalType;
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
