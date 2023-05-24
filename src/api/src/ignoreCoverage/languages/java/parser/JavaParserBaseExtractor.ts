import {ClassOrInterfaceTypeContext, MyFile} from "./../../../ParsedAstTypes";
import {ParserOptions} from "../../../Parser";
import {JavaParserAntlr4} from "./JavaParserAntlr4";
import {JavaAntlr4CstPrinter} from "../util/JavaAntlr4CstPrinter";
import {JavaParserHelper} from "./JavaParserHelper";
import {JavaParserFieldExtractor} from "./JavaParserFieldExtractor";
import {JavaParserMethodExtractor} from "./JavaParserMethodExtractor";

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
            //JavaAntlr4CstPrinter.print(ctx, "ctx");
            let extendsIndexes = extendsOrImplementsIndexes;
            for (let extendsIndex of extendsIndexes) { // will be only one since extends is unique in Java
                let extendsTypeType = ctx.children[extendsIndex + 1];
                //JavaAntlr4CstPrinter.print(extendsTypeType, "extendsTypeIdentifierOnlyChild");
                if (!!extendsTypeType) {
                    let extendsClassOrInterfaceType = JavaParserHelper.getChildByType(extendsTypeType, "classOrInterfaceType");
                    // We dont check further because we want to support qualified imports like: org.apache.commons.lang3.StringUtils
                    //let extendsTypeIdentifier = JavaParserHelper.getChildByType(extendsClassOrInterfaceType, "typeIdentifier");
                    let extendsName = extendsClassOrInterfaceType.getText();
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
                        // We dont check further because we want to support qualified imports like: org.apache.commons.lang3.StringUtils
                        //let implementsTypeIdentifier = JavaParserHelper.getChildByType(implementsInterfaceType, "typeIdentifier");
                        // @ts-ignore
                        //let implementsTypeIdentifierOnlyChild = implementsTypeIdentifier.children[0];
                        let implementsName = implementsInterfaceType.getText();
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

    constructor(file: MyFile, type: string, packageName: string | null, ctx, currentVisibleClassAndInterfaces: any, currentVisibleVariables: any, options: ParserOptions, parentClassOrInterface: ClassOrInterfaceTypeContext | null) {
        this.file = file;
        this.packageName = packageName;
        this.options = options;
        // copy the current visible classes and interfaces
        this.currentVisibleClassAndInterfaces = {...currentVisibleClassAndInterfaces};
        this.currentVisibleVariables = {...currentVisibleVariables};
        //console.log("currentVisibleClassAndInterfaces")
        //console.log(JSON.stringify(currentVisibleClassAndInterfaces, null, 2))

        this.ownCtx = ctx;
        this.type = type;

        // 5. Get the class or interface name
        let ownQualifiedName = JavaParserAntlr4.getQualifiedNameOfClassOrInterface(this.ownCtx, this.packageName);
        let classOrInterfaceName = JavaParserAntlr4.getNameOfClassOrInterface(this.ownCtx) as string; // we can assume that our file has a class or interface

        // There are maybe already defined classes or interfaces with the same name in the same package or imported
        // Therefore we set our own to the current visible classes and interfaces
        this.currentVisibleClassAndInterfaces[classOrInterfaceName] = ownQualifiedName;

        this.classOrInterface = new ClassOrInterfaceTypeContext(ownQualifiedName, classOrInterfaceName, this.type, this.file.path);
        this.parentClassOrInterface = parentClassOrInterface;
        this.classOrInterface.definedInClassOrInterfaceTypeKey = this.parentClassOrInterface?.key; // save the key of the class or interface that defined this class or interface
    }

    public parse() {


        // 6. Get the inner classes and interfaces into the current visible classes and interfaces
        // They will override the classes and interfaces in the same package and the import declarations
        // 7. Get the methods with their parameters
            // parse the method body with variables and method calls and so on with the specific qualified name of the class or interface
        // 8. Get the fields
            // 8.1 parse the field initializers with variables and method calls and so on with the specific qualified name of the class or interface
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

    protected parseInnerDefinedClassedAndInterfacesInMemberDeclarations(memberDeclarationsCtx: any[]) {
        for(let memberDeclarationCtx of memberDeclarationsCtx){
            this.parseInnerDefinedClassedAndInterfacesInMemberDeclaration(memberDeclarationCtx);
        }
    }

    private parseInnerDefinedClassedAndInterfacesInMemberDeclaration(memberDeclarationCtx: any) {
        //console.log("parseInnerDefinedClassedAndInterfacesInMemberDeclaration");

        let innerPackageName = this.classOrInterface.name;
        if(!!this.packageName){
            innerPackageName = this.packageName + "." + innerPackageName;
        }

        let copyOfCurrentVisibleClassAndInterfaces = {...this.currentVisibleClassAndInterfaces};
        let copyOfCurrentVisibleVariables = {...this.currentVisibleVariables};

        let interfaceDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "interfaceDeclaration");
        if(interfaceDeclaration!==null){
            let interfaceParser = new InterfaceParser(
                this.file,
                innerPackageName,
                interfaceDeclaration,
                copyOfCurrentVisibleClassAndInterfaces,
                copyOfCurrentVisibleVariables,
                this.options, this.classOrInterface
            );
            interfaceParser.parse();
            let innerInterfaceOutput = interfaceParser.classOrInterface;
            let key = innerInterfaceOutput.key;
            this.classOrInterface.innerDefinedInterfaces[key] = innerInterfaceOutput;
        }
        let classDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "classDeclaration");
        if(classDeclaration!==null){
            let classParser = new ClassParser(
                this.file,
                innerPackageName,
                classDeclaration,
                copyOfCurrentVisibleClassAndInterfaces,
                copyOfCurrentVisibleVariables,
                this.options, this.classOrInterface
            );
            classParser.parse();
            let innerClassOutput = classParser.classOrInterface;
            let key = innerClassOutput.key;
            this.classOrInterface.innerDefinedClasses[key] = innerClassOutput;
        }
    }

    protected saveRawNamesToQualifiedExtendedClassOrImplementedInterfacesNames(extendsOrImplementedRawNames: string[], extendsOrImplementsKeyword: string){
        let dictOfQualifiedNames = {};

        for(let implementsRawName of extendsOrImplementedRawNames){
            // implementsRawName could be a fully qualified name or a simple name
            // for example: extendsRawName = "java.util.ArrayList" or extendsRawName = "ArrayList" or "Treasure.Gold"
            // we should look into our currentVisibleClassAndInterfaces to find the name
            // let get the simple names of currentVisibleClassAndInterfaces
            let simpleNames = Object.keys(this.currentVisibleClassAndInterfaces);

            let foundInCurrentVisibleClassAndInterfaces = false;
            for(let simpleName of simpleNames){
                // TODO: Maybe we have something like: Treasure.Gold --> We take the first and see the qualified name and then add the second
                if(simpleName === implementsRawName){
                    let fullyQualifiedName = this.currentVisibleClassAndInterfaces[simpleName];
                    dictOfQualifiedNames[fullyQualifiedName] = fullyQualifiedName;
                    foundInCurrentVisibleClassAndInterfaces = true;
                    break; // we found the name, no need to continue
                }
            }
            if(!foundInCurrentVisibleClassAndInterfaces){
                // the implementsRawName is not a simple name in the currentVisibleClassAndInterfaces
                // therefore it is a fully qualified name
                dictOfQualifiedNames[implementsRawName] = implementsRawName;
            }
        }

        let qualifiedNameKeys = Object.keys(dictOfQualifiedNames);
        this.classOrInterface[extendsOrImplementsKeyword] = qualifiedNameKeys;
    }

    protected setCurrentVisibleClassAndInterfacesForInnerClassesAndInterfaces(memberDeclarationsCtx: any[]){
        let innerPackageName = this.classOrInterface.name;
        if(!!this.packageName){
            innerPackageName = this.packageName + "." + innerPackageName;
        }

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

    protected getMemberDeclarations(ctx, ...childTypes){
        return JavaParserHelper.getChildrenByTypeInnerList(ctx, ...childTypes);
    }


}


class ClassParser extends BaseParser{
    constructor(file: MyFile, packageName: string | null, ctx: any, currentVisibleClassAndInterfaces: any, currentVisibleVariables: any, options: ParserOptions, parentClassOrInterface: ClassOrInterfaceTypeContext | null) {
        super(file, "class", packageName, ctx, currentVisibleClassAndInterfaces, currentVisibleVariables, options, parentClassOrInterface);
    }

    public parse() {
        super.parse();

        //JavaAntlr4CstPrinter.print(this.ownCtx, "classDeclaration");

        let extendsRawNames = ClassParser.classGetNameForExtendedClassOrImplementedInterfaces(this.ownCtx, "extends");
        //console.log("extendsRawNames:"+extendsRawNames);
        this.saveRawNamesToQualifiedExtendedClassOrImplementedInterfacesNames(extendsRawNames, "extends");
        let implementsRawNames = ClassParser.classGetNameForExtendedClassOrImplementedInterfaces(this.ownCtx, "implements");
        this.saveRawNamesToQualifiedExtendedClassOrImplementedInterfacesNames(implementsRawNames, "implements");

        //let memberDeclarations = this.getMemberDeclarations(classBodyCtx);
        let memberDeclarations = super.getMemberDeclarations(this.ownCtx, "classBody", "classBodyDeclaration", "memberDeclaration");

        // since inner classes may extend sibling classes, we need to update currentVisibleClassAndInterfaces
        super.setCurrentVisibleClassAndInterfacesForInnerClassesAndInterfaces(memberDeclarations);

        super.parseInnerDefinedClassedAndInterfacesInMemberDeclarations(memberDeclarations);

        this.extractFieldsAndMethodsFromClassMemeberDeclarations(memberDeclarations);

        //console.log("currentVisibleClassAndInterfaces");
        //console.log(this.currentVisibleClassAndInterfaces);
    }


    extractFieldsAndMethodsFromClassMemeberDeclarations(classMemberDeclarationsCtx: any[]){
        for(let memberDeclaration of classMemberDeclarationsCtx){
            this.extractFieldsFromMember(memberDeclaration);
            this.extractMethodsFromMember(memberDeclaration);
        }
    }

    extractFieldsFromMember(memberDeclarationCtx){
        let copyOfCurrentVisibleClassAndInterfaces = Object.assign({}, this.currentVisibleClassAndInterfaces);

        let fieldDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "fieldDeclaration");
        if(fieldDeclaration!==null){
            let fieldListener = new JavaParserFieldExtractor(this.classOrInterface, copyOfCurrentVisibleClassAndInterfaces, fieldDeclaration, this.options.includePositions);
            let memberFieldTypeContext = fieldListener.field;
            let memberParameterTypes = memberFieldTypeContext.parameters;
            for(let i=0; i< memberParameterTypes.length; i++){
                let memberParameterType = memberParameterTypes[i];
                this.classOrInterface.fields[memberParameterType.key] = memberParameterType;
            }
        }
    }

    extractMethodsFromMember(memberDeclarationCtx){
        let copyOfCurrentVisibleClassAndInterfaces = Object.assign({}, this.currentVisibleClassAndInterfaces);

        let methodDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "methodDeclaration");
        if(methodDeclaration!==null){
            // @ts-ignore
            let methodListener = new JavaParserMethodExtractor(this.classOrInterface, copyOfCurrentVisibleClassAndInterfaces, methodDeclaration, methodDeclaration.parentCtx.parentCtx, this.options.includePositions);
            let method = methodListener.output;
            let key = method.key;
            this.classOrInterface.methods[key] = method;
        }
    }

}


class InterfaceParser extends BaseParser{
    constructor(file: MyFile, packageName: string | null, ctx, currentVisibleClassAndInterfaces: any, currentVisibleVariables: any, options: ParserOptions, parentClassOrInterface: ClassOrInterfaceTypeContext | null) {
        super(file, "interface", packageName, ctx, currentVisibleClassAndInterfaces, currentVisibleVariables,  options, parentClassOrInterface);
    }

    public parse() {
        super.parse();

        let extendsRawNames = InterfaceParser.interfaceGetNameForExtendedClassOrImplementedInterfaces(this.ownCtx, "extends");
        this.saveRawNamesToQualifiedExtendedClassOrImplementedInterfacesNames(extendsRawNames, "extends");
        let implementsRawNames = InterfaceParser.interfaceGetNameForExtendedClassOrImplementedInterfaces(this.ownCtx, "implements");
        this.saveRawNamesToQualifiedExtendedClassOrImplementedInterfacesNames(implementsRawNames, "implements");

        let memberDeclarations = super.getMemberDeclarations(this.ownCtx, "interfaceBody", "interfaceBodyDeclaration", "interfaceMemberDeclaration");

        // since inner classes may extend sibling classes, we need to update currentVisibleClassAndInterfaces
        super.setCurrentVisibleClassAndInterfacesForInnerClassesAndInterfaces(memberDeclarations);

        super.parseInnerDefinedClassedAndInterfacesInMemberDeclarations(memberDeclarations);

        this.extractInterfaceMethodsFromInterfaceMemberDeclarations(memberDeclarations);

        //console.log("currentVisibleClassAndInterfaces");
        //console.log(this.currentVisibleClassAndInterfaces);
    }

    extractInterfaceMethodsFromInterfaceMemberDeclarations(interfaceMemberDeclarationsCtx: any[]){
        for(let i = 0; i < interfaceMemberDeclarationsCtx.length; i++){
            let interfaceMemberDeclarationCtx = interfaceMemberDeclarationsCtx[i];
            this.extractInterfaceMethodsFromMember(interfaceMemberDeclarationCtx);
        }
    }

    extractInterfaceMethodsFromMember(interfaceMemberDeclarationCtx){
        let copyOfCurrentVisibleClassAndInterfaces = Object.assign({}, this.currentVisibleClassAndInterfaces);

        let interfaceMethodDeclaration = JavaParserHelper.getChildByType(interfaceMemberDeclarationCtx, "interfaceMethodDeclaration");
        if(interfaceMethodDeclaration!==null){
            //JavaAntlr4CstPrinter.print(interfaceMethodDeclaration, "interfaceMethodDeclaration");
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
                let methodListener = new JavaParserMethodExtractor(this.classOrInterface, copyOfCurrentVisibleClassAndInterfaces, interfaceCommonBodyDeclaration, interfaceCommonBodyDeclaration.parentCtx.parentCtx.parentCtx, this.options.includePositions);
                let method = methodListener.output;
                let key = method.key
                this.classOrInterface.methods[key] = method;
            }
        }
    }

}


export {ClassParser, InterfaceParser}
