import JavaLexer from "./../../java/util/JavaLexer";
import JavaParser from "./../../java/util/JavaParser";
import {antlr4} from "./../../util/MyAntlr4";
import {JavaParserHelper} from "./JavaParserHelper";
import {JavaParserFieldExtractor} from "./JavaParserFieldExtractor";
import {JavaParserMethodExtractor} from "./JavaParserMethodExtractor";
import {ClassOrInterfaceTypeContext, MyFile} from "./../../ParsedAstTypes";
import {LanguageParserInterface} from "../../LanguageParserInterface";
import {Dictionary} from "../../UtilTypes";

//TODO add support for generics

class BaseExtractor{
    public classOrInterface: ClassOrInterfaceTypeContext;
    public includePosition: boolean;
    public file: MyFile;

    constructor(file: MyFile, ctx, type, includePosition= false, innerClassOrInterface = false) {
        this.includePosition = includePosition;
        this.file = file;

//        let type = ctx.children[0]; // "class" or "interface"
  //      this.output["type"] = type;

        let identifier = JavaParserHelper.getChildByType(ctx, "identifier");
        // @ts-ignore
        let className = identifier.getText();
        let key = className;

        this.classOrInterface = new ClassOrInterfaceTypeContext(key, className, type, file);

        let modifiers = [];
        if(!innerClassOrInterface){
            modifiers = JavaParserHelper.getModifiers(ctx.parentCtx);
        }
        if(innerClassOrInterface){
            modifiers = JavaParserHelper.getModifiers(ctx.parentCtx.parentCtx);
        }
        this.classOrInterface.modifiers = modifiers;

        if(this.includePosition){
            this.classOrInterface.position = JavaParserHelper.custom_getPosition(ctx.parentCtx);
        }
    }

    extractClassOrInterfaceFromMember(memberDeclarationCtx){
        let interfaceDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "interfaceDeclaration");
        if(interfaceDeclaration!==null){
            let interfaceExtractor = new InterfaceExtractor(this.file, interfaceDeclaration, this.includePosition, true);
            let innerInterfaceOutput = interfaceExtractor.classOrInterface;
            let key = innerInterfaceOutput.key;
            this.classOrInterface.innerDefinedInterfaces[key] = innerInterfaceOutput;
        }
        // TODO: Maybe go further down the rabbit hole and check for more inner classes/interfaces
        let classDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "classDeclaration");
        if(classDeclaration!==null){
            let classListener = new ClassExtractor(this.file, classDeclaration, this.includePosition, true);
            let innerClassOutput = classListener.classOrInterface;
            let key = innerClassOutput.key;
            this.classOrInterface.innerDefinedClasses[key] = innerClassOutput;
        }
    }
}

class ClassExtractor extends BaseExtractor{
    constructor(file: MyFile, ctx, includePosition= false, innerClass = false) {
        super(file, ctx, "class", includePosition, innerClass);

        let classBody = JavaParserHelper.getChildByType(ctx, "classBody");
        this.extractFromClassBody(classBody);
    }

    extractFromClassBody(ctx){
        let classBodyDeclarations = JavaParserHelper.getChildrenByType(ctx, "classBodyDeclaration");
        for(let i = 0; i < classBodyDeclarations.length; i++){
            let classBodyDeclaration = classBodyDeclarations[i];
            let memberDeclaration = JavaParserHelper.getChildByType(classBodyDeclaration, "memberDeclaration");
            if(memberDeclaration!==null){
                this.extractFieldsFromMember(memberDeclaration);
                this.extractMethodsFromMember(memberDeclaration);
                super.extractClassOrInterfaceFromMember(memberDeclaration);
            }
        }
    }

    extractFieldsFromMember(memberDeclarationCtx){
        let fieldDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "fieldDeclaration");
        if(fieldDeclaration!==null){
            let fieldListener = new JavaParserFieldExtractor(this.classOrInterface, fieldDeclaration, this.includePosition);
            let memberFieldTypeContext = fieldListener.field;
            let memberParameterTypes = memberFieldTypeContext.parameters;
            for(let i=0; i< memberParameterTypes.length; i++){
                let memberParameterType = memberParameterTypes[i];
                this.classOrInterface.fields[memberParameterType.key] = memberParameterType;
            }
        }
    }

    extractMethodsFromMember(memberDeclarationCtx){
        let methodDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "methodDeclaration");
        if(methodDeclaration!==null){
            // @ts-ignore
            let methodListener = new JavaParserMethodExtractor(this.classOrInterface, methodDeclaration, methodDeclaration.parentCtx.parentCtx, this.includePosition);
            let method = methodListener.output;
            let key = method.key;
            this.classOrInterface.methods[key] = method;
        }
    }
}



class InterfaceExtractor extends BaseExtractor{
    constructor(file: MyFile, ctx, includePosition= false, innerInterface = false) {
        super(file, ctx, "interface", includePosition, innerInterface);

        let interfaceBody = JavaParserHelper.getChildByType(ctx, "interfaceBody");
        this.extractFromInterfaceBody(interfaceBody);

    }

    extractFromInterfaceBody(ctx){
        let interfaceBodyDeclarations = JavaParserHelper.getChildrenByType(ctx, "interfaceBodyDeclaration");
        for(let i = 0; i < interfaceBodyDeclarations.length; i++){
            let interfaceBodyDeclaration = interfaceBodyDeclarations[i];
            let interfaceMemberDeclaration = JavaParserHelper.getChildByType(interfaceBodyDeclaration, "interfaceMemberDeclaration");
            if(interfaceMemberDeclaration!==null){

                // there are no fields in interfaces
                //let fieldDeclaration = JavaParserHelper.getChildByType(interfaceMemberDeclaration, "fieldDeclaration");

                this.extractInterfaceMethodsFromMember(interfaceMemberDeclaration);
                super.extractClassOrInterfaceFromMember(interfaceMemberDeclaration);
            }
        }
    }

    extractInterfaceMethodsFromMember(interfaceMemberDeclarationCtx){
        let interfaceMethodDeclaration = JavaParserHelper.getChildByType(interfaceMemberDeclarationCtx, "interfaceMethodDeclaration");
        if(interfaceMethodDeclaration!==null){
            /**
             "children": [
             {
                                  "type": "interfaceMethodDeclaration",
                                  "node": "InterfaceMethodDeclarationContext",
                                  "children": [
                                    {
                                      "type": "interfaceCommonBodyDeclaration",
                                      "node": "InterfaceCommonBodyDeclarationContext",
                                      "children": [
                                        {
                                          "type": "typeTypeOrVoid",
                                          "node": "TypeTypeOrVoidContext",
                                          "children": [
             */
            let interfaceCommonBodyDeclaration = JavaParserHelper.getChildByType(interfaceMethodDeclaration, "interfaceCommonBodyDeclaration");
            if(interfaceCommonBodyDeclaration!==null){
                // @ts-ignore
                let methodListener = new JavaParserMethodExtractor(this.classOrInterface, interfaceCommonBodyDeclaration, interfaceCommonBodyDeclaration.parentCtx.parentCtx.parentCtx, this.includePosition);
                let method = methodListener.output;
                let key = method.key
                this.classOrInterface.methods[key] = method;
            }
        }
    }
}

// class which implements LanguageParserInterface

export class JavaParserAntlr4 implements LanguageParserInterface {
    parse(file: MyFile, includePosition: boolean): Dictionary<ClassOrInterfaceTypeContext> {
        let code = file.content;
        const chars = new antlr4.InputStream(code)
        const lexer = new JavaLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new JavaParser(tokens);
        parser.buildParseTrees = true;
        const cst = parser.compilationUnit();

        //JavaAntlr4CstPrinter.print(cst, "Whole cst")

        let output: Dictionary<ClassOrInterfaceTypeContext> = {};
        // @ts-ignore
        let typeDeclarations = JavaParserHelper.getChildrenByType(cst, "typeDeclaration");

        for(let typeDeclaration of typeDeclarations){
            // @ts-ignore
            for(let i = 0; i < typeDeclaration.children.length; i++){
                // @ts-ignore
                let child = typeDeclaration.children[i];
                let type = JavaParserHelper.getCtxType(child);
                if(type==="classDeclaration"){
                    let classDeclaration = child;
                    let classExtractor = new ClassExtractor(file, classDeclaration, includePosition);
                    let extractorOutput = classExtractor.classOrInterface;
                    let key = extractorOutput.key
                    output[key] = extractorOutput;
                }
                if(type==="interfaceDeclaration"){
                    let interfaceDeclaration = child;
                    let interfaceExtractor = new InterfaceExtractor(file, interfaceDeclaration, includePosition);
                    let extractorOutput = interfaceExtractor.classOrInterface;
                    let key = extractorOutput.key
                    output[key] = extractorOutput;
                }
            }
        }

        return output;
    }



}
