import JavaParser from "./../../java/util/JavaParser";
import {antlr4} from "./../../util/MyAntlr4";
import {JavaAntlr4CstPrinter} from "../util/JavaAntlr4CstPrinter";

export class JavaParserHelper {

    static getCtxType(ctx){
        return antlr4.tree.Trees.getNodeText(ctx, JavaParser.ruleNames);
    }

    static getChildrenByType(ctx, type){
        let children = [];
        if(!ctx){
            return children;
        }
        if(!ctx?.children){
            return children;
        }
        let amountOfChildren = ctx?.children?.length || 0;
        for(let i = 0; i < amountOfChildren; i++){
            let child = ctx.children[i];
            let childType = JavaParserHelper.getCtxType(child);
            if(childType===type){
                // @ts-ignore
                children.push(child);
            }
        }
        return children
    }

    static getChildrenByTypeInnerList(ctx, ...childTypes){
            let memberDeclarations: any[] = [];
            let childType = childTypes[0];
            let childDeclarations = JavaParserHelper.getChildrenByType(ctx, childType);
            for(let childDeclaration of childDeclarations){
                let remainingChildTypes = childTypes.slice(1);
                if(remainingChildTypes.length===0){
                    memberDeclarations.push(childDeclaration);
                } else {
                    let childMemberDeclarations = JavaParserHelper.getChildrenByTypeInnerList(childDeclaration, ...remainingChildTypes);
                    memberDeclarations = memberDeclarations.concat(childMemberDeclarations);
                }
            }
            return memberDeclarations;
        }

    static getChildByType(ctx, type): null | any {
        let children = JavaParserHelper.getChildrenByType(ctx, type);
        if(!!children && children.length>0){
            return children[0];
        } else {
            return null;
        }
    }

    static getChildIndexesByName(ctx, name){
        let indexes: number[] = [];
        for(let i = 0; i < ctx.children.length; i++){
            let child = ctx.children[i];
            let childName = antlr4.tree.Trees.getNodeText(child, JavaParser.ruleNames);
            if(childName===name){
                indexes.push(i);
            }
        }
        return indexes;
    }

    static custom_getPosition(ctx){
        let start = ctx.start;
        let stop = ctx.stop;
        let startLine = start.line;
        let startColumn = start.column;
        let endLine = stop.line;
        let endColumn = stop.column;
        return {
            startLine: startLine,
            startColumn: startColumn,
            endLine: endLine,
            endColumn: endColumn+1 // +1 because the stop column is the last character of the token
        }
    }

    static hasMethodOverrideAnnotationFromModifierCtx(ctx){
        let annotations = JavaParserHelper.getChildrenByTypeInnerList(ctx, "modifier", "classOrInterfaceModifier", "annotation");
        for(let annotation of annotations){
            let annotationText = annotation.getText() || "";
            //console.log("annotationText: "+annotationText);
            if(annotationText.includes("@Override")){
                return true;
            }
        }
        return false;
    }

    static getModifiers(ctx){
        let modifiers = [];
        let amountOfChildren = !!ctx?.children ? ctx.children.length : 0;
        for(let i = 0; i < amountOfChildren; i++){
            let child = ctx.children[i];
            let name = antlr4.tree.Trees.getNodeText(child, JavaParser.ruleNames);

            if(name==="synchronized"){
                // then we should allow this child
                // @ts-ignore
                modifiers.push(name);
                continue; // get the next child
            }

            let annotationChild = JavaParserHelper.getChildByType(child, "annotation");
            if(annotationChild!==null){
                // then we should ignore this child
                continue;
            }

            if(!annotationChild){ // if it is not an annotation
                if(name==="classOrInterfaceModifier"){

                    // get visibility
                    let modifier = child.children[0].getText();
                    // @ts-ignore
                    modifiers.push(modifier);
                }
                if(name==="modifier"){ // for class fields
                    // get visibility
                    let childModifiers = JavaParserHelper.getModifiers(child);
                    // @ts-ignore
                    modifiers = modifiers.concat(childModifiers);
                }
                if(name==="variableModifier"){ // for method parameters
                    // get visibility
                    let modifier = child.children[0].getText();
                    // @ts-ignore
                    modifiers.push(modifier);
                }
            }


        }
        return modifiers;
    }

}
