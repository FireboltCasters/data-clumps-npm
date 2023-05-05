import {ClassOrInterfaceTypeContext, MyFile} from "./../../ParsedAstTypes";
import {ParserOptions} from "../../Parser";
import {JavaParserAntlr4} from "./JavaParserAntlr4";
import {JavaAntlr4CstPrinter} from "../util/JavaAntlr4CstPrinter";
import {JavaParserHelper} from "./JavaParserHelper";
import {JavaParserFieldExtractor} from "./JavaParserFieldExtractor";

//TODO add support for generics

export class BaseParser {
    public currentVisibleClassAndInterfaces: any;
    public currentVisibleVariables: any;
    public file: MyFile;
    public packageName: string | null;
    public ownCtx: any;
    public type: string;
    public options: ParserOptions;
    public classOrInterface: ClassOrInterfaceTypeContext;
    public parentClassOrInterface: ClassOrInterfaceTypeContext | null;

    static classGetNameForExtendedClassOrImplementedInterfaces(ctx, extendsOrImplementsKeyword) {
        let extendsOrImplementsRawNames: any[] = [];
        let extendsOrImplementsIndexes = JavaParserHelper.getChildIndexesByName(ctx, extendsOrImplementsKeyword);
        if (extendsOrImplementsKeyword === "extends") {
            let extendsIndexes = extendsOrImplementsIndexes;
            for (let extendsIndex of extendsIndexes) { // will be only one since extends is unique in Java
                let extendsTypeType = ctx.children[extendsIndex + 1];
                if (!!extendsTypeType) {
                    let extendsClassOrInterfaceType = JavaParserHelper.getChildByType(extendsTypeType, "classOrInterfaceType");
                    let extendsTypeIdentifier = JavaParserHelper.getChildByType(extendsClassOrInterfaceType, "typeIdentifier");
                    // @ts-ignore
                    let extendsTypeIdentifierOnlyChild = extendsTypeIdentifier.children[0];
                    let extendsName = extendsTypeIdentifierOnlyChild.getText();
                    extendsOrImplementsRawNames.push(extendsName);
                }
            }
        } else if (extendsOrImplementsKeyword === "implements") {
            let implementsIndexes = extendsOrImplementsIndexes;
            for (let implementsIndex of implementsIndexes) {
                let implementsTypeType = ctx.children[implementsIndex + 1];
                if (!!implementsTypeType) {
                    let implementsInterfaceTypeTypes = JavaParserHelper.getChildrenByType(implementsTypeType, "typeType");
                    for (let implementsInterfaceTypeType of implementsInterfaceTypeTypes) {
                        let implementsInterfaceType = JavaParserHelper.getChildByType(implementsInterfaceTypeType, "classOrInterfaceType");
                        let implementsTypeIdentifier = JavaParserHelper.getChildByType(implementsInterfaceType, "typeIdentifier");
                        // @ts-ignore
                        let implementsTypeIdentifierOnlyChild = implementsTypeIdentifier.children[0];
                        let implementsName = implementsTypeIdentifierOnlyChild.getText();
                        extendsOrImplementsRawNames.push(implementsName);
                    }
                }
            }
        }
        return extendsOrImplementsRawNames;
    }

    static interfaceGetNameForExtendedClassOrImplementedInterfaces(ctx, extendsOrImplementsKeyword) {
        let extendsOrImplementsRawNames: any[] = [];
        let extendsOrImplementsIndexes = JavaParserHelper.getChildIndexesByName(ctx, extendsOrImplementsKeyword);
        if (extendsOrImplementsKeyword === "extends") {
            let extendsIndexes = extendsOrImplementsIndexes;
            for (let extendsIndex of extendsIndexes) {
                let extendsTypeType = ctx.children[extendsIndex + 1];
                if (!!extendsTypeType) {
                    let extendsInterfaceTypeTypes = JavaParserHelper.getChildrenByType(extendsTypeType, "typeType");
                    for (let extendsInterfaceTypeType of extendsInterfaceTypeTypes) {
                        let extendsInterfaceType = JavaParserHelper.getChildByType(extendsInterfaceTypeType, "classOrInterfaceType");
                        let extendsTypeIdentifier = JavaParserHelper.getChildByType(extendsInterfaceType, "typeIdentifier");
                        // @ts-ignore
                        let extendsTypeIdentifierOnlyChild = extendsTypeIdentifier.children[0];
                        let extendsName = extendsTypeIdentifierOnlyChild.getText();
                        extendsOrImplementsRawNames.push(extendsName);
                    }
                }
            }
        } else if (extendsOrImplementsKeyword === "implements") {
            // An interface cannot implement another interface
        }
        return extendsOrImplementsRawNames;
    }

    constructor(file: MyFile, type: string, packageName: string | null, ctx, currentVisibleClassAndInterfaces: any, currentVisibleVariables: any, options: ParserOptions, parentClassOrInterface: any = null) {
        this.file = file;
        this.packageName = packageName;
        this.options = options;
        // copy the current visible classes and interfaces
        this.currentVisibleClassAndInterfaces = {...currentVisibleClassAndInterfaces};
        this.currentVisibleVariables = {...currentVisibleVariables};
        console.log("currentVisibleClassAndInterfaces")
        console.log(JSON.stringify(currentVisibleClassAndInterfaces, null, 2))

        this.ownCtx = ctx;
        this.type = type;

        // 5. Get the class or interface name
        let ownQualifiedName = JavaParserAntlr4.getQualifiedNameOfClassOrInterface(this.ownCtx, this.packageName);
        let classOrInterfaceName = JavaParserAntlr4.getNameOfClassOrInterface(this.ownCtx) as string; // we can assume that our file has a class or interface

        // There are maybe already defined classes or interfaces with the same name in the same package or imported
        // Therefore we set our own to the current visible classes and interfaces
        this.currentVisibleClassAndInterfaces[classOrInterfaceName] = ownQualifiedName;

        this.classOrInterface = new ClassOrInterfaceTypeContext(ownQualifiedName, classOrInterfaceName, this.type, this.file);
        this.parentClassOrInterface = parentClassOrInterface;
        this.classOrInterface.definedInClassOrInterfaceTypeKey = this.parentClassOrInterface?.key; // save the key of the class or interface that defined this class or interface
    }

    public parse() {


        // 6. Get the inner classes and interfaces
        // They will override the classes and interfaces in the same package and the import declarations
        // 7. Get the methods with their parameters
        // 8. Get the fields
        // create visibility dictionary for fields since they might be overridden by inner classes or interfaces or methods
        // 9. Call recursively to this function from step 4 for each inner class or interface

        let innerClassOrInterface = !!this.parentClassOrInterface

        let modifiers = [];
        if (!innerClassOrInterface) {
            modifiers = JavaParserHelper.getModifiers(this.ownCtx.parentCtx);
        }
        if (innerClassOrInterface) {
            modifiers = JavaParserHelper.getModifiers(this.ownCtx.parentCtx.parentCtx);
        }
        this.classOrInterface.modifiers = modifiers;

        if (this.options.includePositions) {
            this.classOrInterface.position = JavaParserHelper.custom_getPosition(this.ownCtx.parentCtx);
        }
    }

    protected saveClassOrInterfaceToFile() {
        let classOrInterface = this.classOrInterface;
        let key = classOrInterface.key;
        this.file.ast[key] = classOrInterface;
    }

    protected saveRawExtendsNames(extendsRawNames: string[]){
        for(let extendsRawName of extendsRawNames){
            // extendsRawName could be a fully qualified name or a simple name
            // for example: extendsRawName = "java.util.ArrayList" or extendsRawName = "ArrayList"
            // we should look into our currentVisibleClassAndInterfaces to find the name
            // let get the simple names of currentVisibleClassAndInterfaces
            let simpleNames = Object.keys(this.currentVisibleClassAndInterfaces);
            for(let simpleName of simpleNames){
                if(simpleName === extendsRawName){
                    let fullyQualifiedName = this.currentVisibleClassAndInterfaces[simpleName];
                    this.classOrInterface.extends[fullyQualifiedName] = fullyQualifiedName;
                    break; // we found the name, no need to continue
                } else { // maybe the extendsRawName is a fully qualified name
                    let fullyQualifiedName = this.currentVisibleClassAndInterfaces[simpleName];
                    if(fullyQualifiedName === extendsRawName){ // the extendsRawName is a fully qualified name
                        this.classOrInterface.extends[fullyQualifiedName] = fullyQualifiedName;
                        break; // we found the name, no need to continue
                    }
                }
            }
        }
    }

    protected saveRawImplementsNames(implementsRawNames: string[]){
        for(let implementsRawName of implementsRawNames){
            // implementsRawName could be a fully qualified name or a simple name
            // for example: implementsRawName = "java.util.ArrayList" or implementsRawName = "ArrayList"
            // we should look into our currentVisibleClassAndInterfaces to find the name
            // let get the simple names of currentVisibleClassAndInterfaces
            let simpleNames = Object.keys(this.currentVisibleClassAndInterfaces);
            for(let simpleName of simpleNames){
                if(simpleName === implementsRawName){
                    let fullyQualifiedName = this.currentVisibleClassAndInterfaces[simpleName];
                    this.classOrInterface.implements[fullyQualifiedName] = fullyQualifiedName;
                    break; // we found the name, no need to continue
                } else { // maybe the implementsRawName is a fully qualified name
                    let fullyQualifiedName = this.currentVisibleClassAndInterfaces[simpleName];
                    if(fullyQualifiedName === implementsRawName){ // the implementsRawName is a fully qualified name
                        this.classOrInterface.implements[fullyQualifiedName] = fullyQualifiedName;
                        break; // we found the name, no need to continue
                    }
                }
            }
        }
    }

    protected setCurrentVisibleClassAndInterfacesForInnerClassesAndInterfaces(memberDeclarationsCtx: any[]){
        let innerPackageName = this.packageName + "." + this.classOrInterface.name;
        for(let memberDeclarationCtx of memberDeclarationsCtx){
            let interfaceDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "interfaceDeclaration");
            if(interfaceDeclaration!==null){
                let interfaceName = JavaParserAntlr4.getNameOfClassOrInterface(interfaceDeclaration) as string; // we can assume that our file has a class or interface
                let interfaceQualifiedName = JavaParserAntlr4.getQualifiedNameOfClassOrInterface(interfaceDeclaration, innerPackageName);
                this.currentVisibleClassAndInterfaces[interfaceName] = interfaceQualifiedName;
            }
            let classDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "classDeclaration");
            if(classDeclaration!==null){
                let className = JavaParserAntlr4.getNameOfClassOrInterface(classDeclaration) as string; // we can assume that our file has a class or interface
                let classQualifiedName = JavaParserAntlr4.getQualifiedNameOfClassOrInterface(classDeclaration, innerPackageName);
                this.currentVisibleClassAndInterfaces[className] = classQualifiedName;
            }
        }
    }


    extractClassOrInterfaceFromMember(memberDeclarationCtx){
        /**
        let innerPackageName = this.packageName + "." + this.classOrInterface.name;

        let interfaceDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "interfaceDeclaration");
        if(interfaceDeclaration!==null){
            let interfaceExtractor = new InterfaceParser(this.file, innerPackageName, interfaceDeclaration, this.includePosition, true, this.classOrInterface);
            let innerInterfaceOutput = interfaceExtractor.classOrInterface;
            let key = innerInterfaceOutput.key;
            this.classOrInterface.innerDefinedInterfaces[key] = innerInterfaceOutput;
        }
        let classDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "classDeclaration");
        if(classDeclaration!==null){
            let classListener = new ClassExtractor(this.file, innerPackageName, classDeclaration, this.includePosition, true, this.classOrInterface);
            let innerClassOutput = classListener.classOrInterface;
            let key = innerClassOutput.key;
            this.classOrInterface.innerDefinedClasses[key] = innerClassOutput;
        }
         */
    }
}


class ClassParser extends BaseParser{
    constructor(file: MyFile, packageName: string | null, ctx: any, currentVisibleClassAndInterfaces: any, currentVisibleVariables: any, options: ParserOptions, innerClass = false) {
        super(file, "class", packageName, ctx, currentVisibleClassAndInterfaces, currentVisibleVariables, options, innerClass);
    }

    public parse() {
        super.parse();

        let extendsRawNames = ClassParser.classGetNameForExtendedClassOrImplementedInterfaces(this.ownCtx, "extends");
        console.log("extendsRawNames", extendsRawNames)
        this.saveRawExtendsNames(extendsRawNames);
        let implementsRawNames = ClassParser.classGetNameForExtendedClassOrImplementedInterfaces(this.ownCtx, "implements");
        this.saveRawImplementsNames(implementsRawNames);

        let classBodyCtx = this.getClassBodyCtx();

        let memberDeclarations = this.getMemberDeclarations(classBodyCtx);
        super.setCurrentVisibleClassAndInterfacesForInnerClassesAndInterfaces(memberDeclarations);

        console.log("currentVisibleClassAndInterfaces");
        console.log(this.currentVisibleClassAndInterfaces);

        this.saveClassOrInterfaceToFile(); // final step
    }

    getClassBodyCtx(){
        return JavaParserHelper.getChildByType(this.ownCtx, "classBody");
    }

    getMemberDeclarations(classBodyCtx: any){
        console.log("ClassParser.getMemberDeclarations")
        let classBodyDeclarations = JavaParserHelper.getChildrenByType(classBodyCtx, "classBodyDeclaration");
        JavaAntlr4CstPrinter.print(classBodyCtx, "this.ownCtx");
        let memberDeclarations: any[] = [];
        for(let i = 0; i < classBodyDeclarations.length; i++){
            let interfaceBodyDeclaration = classBodyDeclarations[i];
            let classMemberDeclaration = JavaParserHelper.getChildByType(interfaceBodyDeclaration, "memberDeclaration");
            if(classMemberDeclaration!==null){
                memberDeclarations.push(classMemberDeclaration);
            }
        }
        return memberDeclarations;
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
        /**
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
         */
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


class InterfaceParser extends BaseParser{
    constructor(file: MyFile, packageName: string | null, ctx, currentVisibleClassAndInterfaces: any, currentVisibleVariables: any, options: ParserOptions, innerInterface = false) {
        super(file, "interface", packageName, ctx, currentVisibleClassAndInterfaces, currentVisibleVariables,  options, innerInterface);
    }

    public parse() {
        super.parse();

        let extendsRawNames = InterfaceParser.interfaceGetNameForExtendedClassOrImplementedInterfaces(this.ownCtx, "extends");
        this.saveRawExtendsNames(extendsRawNames);
        let implementsRawNames = InterfaceParser.interfaceGetNameForExtendedClassOrImplementedInterfaces(this.ownCtx, "implements");
        this.saveRawImplementsNames(implementsRawNames);

        let interfaceBodyCtx = this.getInterfaceBodyCtx();

        let memberDeclarations = this.getMemberDeclarations(interfaceBodyCtx);
        super.setCurrentVisibleClassAndInterfacesForInnerClassesAndInterfaces(memberDeclarations);

        console.log("currentVisibleClassAndInterfaces");
        console.log(this.currentVisibleClassAndInterfaces);

        this.saveClassOrInterfaceToFile(); // final step
    }

    getInterfaceBodyCtx(){
        return JavaParserHelper.getChildByType(this.ownCtx, "interfaceBody");
    }

    getMemberDeclarations(interfaceBodyCtx: any){
        let interfaceBodyDeclarations = JavaParserHelper.getChildrenByType(interfaceBodyCtx, "interfaceBodyDeclaration");
        let memberDeclarations: any[] = [];
        for(let i = 0; i < interfaceBodyDeclarations.length; i++){
            let interfaceBodyDeclaration = interfaceBodyDeclarations[i];
            let interfaceMemberDeclaration = JavaParserHelper.getChildByType(interfaceBodyDeclaration, "interfaceMemberDeclaration");
            if(interfaceMemberDeclaration!==null){
                memberDeclarations.push(interfaceMemberDeclaration);
            }
        }
        return memberDeclarations;
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


export {ClassParser, InterfaceParser}
