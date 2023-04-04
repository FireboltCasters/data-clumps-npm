import JavaParser from "./../../java/util/JavaParser";
import {antlr4} from "./../../util/MyAntlr4";

export class JavaParserHelper {

    static getCtxType(ctx){
        return antlr4.tree.Trees.getNodeText(ctx, JavaParser.ruleNames);
    }

    static getChildrenByType(ctx, type){
        let children = [];
        for(let i = 0; i < ctx.children.length; i++){
            let child = ctx.children[i];
            let childType = JavaParserHelper.getCtxType(child);
            if(childType===type){
                // @ts-ignore
                children.push(child);
            }
        }
        return children
    }

    static getChildByType(ctx, type){
        let children = JavaParserHelper.getChildrenByType(ctx, type);
        if(children.length===0){
            return null;
        } else {
            return children[0];
        }
    }

    static custom_getPosition(ctx){
        let start = ctx.start;
        let stop = ctx.stop;
        let startLine = start.line;
        let startColumn = start.column;
        let stopLine = stop.line;
        let stopColumn = stop.column;
        return {
            startLine: startLine,
            startColumn: startColumn,
            stopLine: stopLine,
            stopColumn: stopColumn+1 // +1 because the stop column is the last character of the token
        }
    }

    static getModifiers(ctx){
        let modifiers = [];
        for(let i = 0; i < ctx.getChildCount(); i++){
            let child = ctx.getChild(i);
            let name = antlr4.tree.Trees.getNodeText(child, JavaParser.ruleNames);
            if(name==="classOrInterfaceModifier"){
                // get visibility
                let modifier = child.children[0].getText();
                // @ts-ignore
                modifiers.push(modifier);
            }
            if(name==="modifier"){
                // get visibility
                let childModifiers = JavaParserHelper.getModifiers(child);
                // @ts-ignore
                modifiers = modifiers.concat(childModifiers);
            }
        }
        return modifiers;
    }

}
