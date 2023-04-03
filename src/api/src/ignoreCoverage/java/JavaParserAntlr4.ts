import JavaLexer from "../java/util/JavaLexer";
import JavaParser from "../java/util/JavaParser";
import {antlr4} from "../util/MyAntlr4";
import JavaParserListener from "./util/JavaParserListener";

const includePosition = true;

class ASTPrinter extends JavaParserListener{

    // define static method
    static print(ctx, key) {
        console.log("++++++++++++++++")
        console.log("key: " + key)
        let listener = new ASTPrinter();
        let ast = listener.buildAST(ctx, JavaParser.ruleNames);
        console.log(JSON.stringify(ast, null, 2));
        console.log("++++++++++++++++")
    }

    buildAST(tree, ruleNames) {
        ruleNames = ruleNames || null;

        let s = antlr4.tree.Trees.getNodeText(tree, ruleNames);

        //s = antlr4.Utils.escapeWhitespace(s, false); // not found in package?
        // Copied from: http://www.java2s.com/example/java-src/pkg/org/antlr/v4/runtime/misc/utils-2e23f.html#f40721497e78566bc6b5e57f2ddd6558
        function escapeWhitespace(s, escapeSpaces) {
            let buf = '';
            for (let i = 0; i < s.length; i++) {
                let c = s.charAt(i);
                if (c === ' ' && escapeSpaces) {
                    buf += '\u00B7';
                } else if (c === '\t') {
                    buf += '\\t';
                } else if (c === '\n') {
                    buf += '\\n';
                } else if (c === '\r') {
                    buf += '\\r';
                } else {
                    buf += c;
                }
            }
            return buf;
        }
        s = escapeWhitespace(s, false);


        const c = tree.getChildCount();

        if (c === 0) {
            return s;
        }

        const res = {
            type: s, node: tree.constructor.name, children: undefined
        };

        if (c > 0) {
            s = this.buildAST(tree.getChild(0), ruleNames);
            // @ts-ignore
            res.children = [...(res.children || []), s];
        }

        for (let i = 1; i < c; i++) {
            s = this.buildAST(tree.getChild(i), ruleNames);
            // @ts-ignore
            res.children = [...(res.children || []), s];
        }

        return res;
    }
}


function custom_getPosition(ctx){
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

function getModifiers(ctx){
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
            let childModifiers = getModifiers(child);
            // @ts-ignore
            modifiers = modifiers.concat(childModifiers);
        }
    }
    return modifiers;
}

class FieldExtractor {
    public field: Object;
    public key: string;
    constructor() {
        this.field = {};
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
        let modifiers = getModifiers(ctx.parentCtx.parentCtx);
        let type = this.custom_getFieldType(ctx.children[0]);

        let field = {};
        field["type"] = type;
        field["modifiers"] = modifiers;
        if(includePosition){
            field["position"] = custom_getPosition(ctx);
        }

        let variableDeclarators = ctx.children[1]; // for example: int a, b, c;
        field["names"] = [];
        for(let i = 0; i < variableDeclarators.children.length; i++){ // loop through a, b, c
            let variableDeclarator = variableDeclarators.children[i];
            if(variableDeclarator.getText()===","){
                // skip the comma
            } else {
                let variableName = variableDeclarator.children[0].getText(); // get the name of the variable
                field["names"].push(variableName);
            }
        }
        // names as a string
        let namesAsString = field["names"].join(",");
        let key = namesAsString;
        this.key = key;
        this.field = field;
        return this.field;
    }

}

class MethodExtractor {
    public output: Object;
    public key: string;
    constructor() {
        this.key = "";
        this.output = {};
    }

    custom_getFormalParameterType(ctx){
        return ctx.getText();
    }

    custom_getFormalParameter(ctx){
        /**
         "type": "formalParameter",
         "node": "FormalParameterContext",
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
         */
        let parameter = {};
        let typeType = ctx.children[0];
        let type = this.custom_getFormalParameterType(typeType);
        parameter["type"] = type;
        let variableDeclaratorId = ctx.children[1];
        let name = variableDeclaratorId.getText();
        parameter["name"] = name;

        if(includePosition){
            parameter["position"] = custom_getPosition(ctx);
        }

        return parameter;
    }

    custom_getFormalParameters(ctx){
        /**
         "type": "formalParameters",
         "node": "FormalParametersContext",
         "children": [
         "(",
         {
          "type": "formalParameterList",
          "node": "FormalParameterListContext",
         */
        let parameters = [];
        if(ctx.children.length>=3){ // has parameters: [ "(", formalParameterList, ")" ]
            let formalParameterList = ctx.children[1];
            for(let i = 0; i < formalParameterList.children.length; i++){
                let formalParameter = formalParameterList.children[i];
                if(formalParameter.getText()===","){
                    // skip
                } else {
                    let parameter = this.custom_getFormalParameter(formalParameter);
                    // @ts-ignore
                    parameters.push(parameter);
                }
            }
        }
        return parameters;
    }


    enterMethodDeclaration(ctx) {
        let method = {};


        // get visibility from parent
        method["modifiers"] = getModifiers(ctx.parentCtx.parentCtx);
        //method["position"] = custom_getPosition(ctx.parentCtx.parentCtx);

        // get method name
        let methodName = ctx.children[1].getText();
        method["name"] = methodName;

        // get return type
        let returnType = ctx.children[0].getText();
        method["returnType"] = returnType;
        // get visibility
        let formalParameters = ctx.children[2];
        let parameters = this.custom_getFormalParameters(formalParameters);
        method["parameters"] = parameters;

        if(includePosition){
            method["position"] = custom_getPosition(ctx);
        }

        // @ts-ignore
        let methodSignature = methodName + "("+parameters.map(p=>p.type).join(",")+")";
        this.key = methodSignature;
        this.output = method;
    }

}

class ClassExtractor{
    public output: Object;
    constructor(ctx, innerClass = false) {
        this.output = {
            "type": "class",
        };

        console.log("ClassExtractor")

        let identifier = ClassExtractor.getChildByType(ctx, "identifier");
        // @ts-ignore
        let className = identifier.getText();
        this.output["name"] = className;

        let modifiers = [];
        if(!innerClass){
            modifiers = getModifiers(ctx.parentCtx);
        }
        if(innerClass){
            modifiers = getModifiers(ctx.parentCtx.parentCtx);
        }
        this.output["modifiers"] = modifiers;

        if(includePosition){
            this.output["position"] = custom_getPosition(ctx.parentCtx);
        }

        this.output["fields"] = {};
        this.output["methods"] = {};
        this.output["innerClasses"] = {};

        let classBody = ClassExtractor.getChildByType(ctx, "classBody");
        this.extractFromClassBody(classBody);
    }

    extractFromClassBody(ctx){
        let classBodyDeclarations = ClassExtractor.getChildrenByType(ctx, "classBodyDeclaration");
        for(let i = 0; i < classBodyDeclarations.length; i++){
            let classBodyDeclaration = classBodyDeclarations[i];
            let memberDeclaration = ClassExtractor.getChildByType(classBodyDeclaration, "memberDeclaration");
            if(memberDeclaration!==null){
                console.log("--- memberDeclaration ---")
                // @ts-ignore
                // @ts-ignore
                for(let j=0; j<memberDeclaration.children.length; j++){
                    // @ts-ignore
                    let child = memberDeclaration.children[j];
                    console.log("--- "+ClassExtractor.getCtxType(child));
                }
                console.log("-------------------------")
                // @ts-ignore
                let fieldDeclaration = ClassExtractor.getChildByType(memberDeclaration, "fieldDeclaration");
                if(fieldDeclaration!==null){
                    let fieldListener = new FieldExtractor();
                    fieldListener.enterFieldDeclaration(fieldDeclaration);
                    let field = fieldListener.field;
                    let key = fieldListener.key;
                    this.output["fields"][key] = field;
                }
                let methodDeclaration = ClassExtractor.getChildByType(memberDeclaration, "methodDeclaration");
                if(methodDeclaration!==null){
                    let methodListener = new MethodExtractor();
                    methodListener.enterMethodDeclaration(methodDeclaration);
                    let method = methodListener.output;
                    let key = methodListener.key;
                    this.output["methods"][key] = method;
                }
                let classDeclaration = ClassExtractor.getChildByType(memberDeclaration, "classDeclaration");
                if(classDeclaration!==null){
                    let classListener = new ClassExtractor(classDeclaration, true);
                    let innerClassOutput = classListener.output;
                    let key = innerClassOutput["name"];
                    this.output["innerClasses"][key] = innerClassOutput;
                }
            }
        }
    }

    static getCtxType(ctx){
        return antlr4.tree.Trees.getNodeText(ctx, JavaParser.ruleNames);
    }

    static getChildrenByType(ctx, type){
        let children = [];
        for(let i = 0; i < ctx.children.length; i++){
            let child = ctx.children[i];
            let childType = ClassExtractor.getCtxType(child);
            if(childType===type){
                // @ts-ignore
                children.push(child);
            }
        }
        return children
    }

    static getChildByType(ctx, type){
        let children = ClassExtractor.getChildrenByType(ctx, type);
        if(children.length===0){
            return null;
        } else {
            return children[0];
        }
    }
}


export class JavaParserAntlr4 {
    static parse(code: string){
        const chars = new antlr4.InputStream(code)
        const lexer = new JavaLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new JavaParser(tokens);
        parser.buildParseTrees = true;
        const cst = parser.compilationUnit();
//        console.log(cst);

        console.log("Start extraction");

        let output = {};
        // @ts-ignore
        let typeDeclaration = cst.children[0];
        for(let i = 0; i < typeDeclaration.children.length; i++){
            let child = typeDeclaration.children[i];
            let type = antlr4.tree.Trees.getNodeText(child, JavaParser.ruleNames);
            if(type==="classDeclaration"){
                let classDeclaration = child;
                let classExtractor = new ClassExtractor(classDeclaration);
                let classExtractorOutput = classExtractor.output;
                for(let key in classExtractorOutput){
                    output[key] = classExtractorOutput[key];
                }
            }
        }
        console.log(JSON.stringify(output, null, 2));

        return JSON.stringify(output, null, 2);
    }



}
