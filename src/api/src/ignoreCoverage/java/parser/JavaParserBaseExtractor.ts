import {ClassOrInterfaceTypeContext, MyFile} from "./../../ParsedAstTypes";
import {ParserOptions} from "../../Parser";
import {JavaParserAntlr4} from "./JavaParserAntlr4";
import {JavaAntlr4CstPrinter} from "../util/JavaAntlr4CstPrinter";
import {JavaParserHelper} from "./JavaParserHelper";

//TODO add support for generics

export class BaseParser {
    public currentVisibleClassAndInterfaces: any;
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

    constructor(file: MyFile, type: string, packageName: string | null, ctx, currentVisibleClassAndInterfaces: any, options: ParserOptions, parentClassOrInterface: any = null) {
        this.file = file;
        this.packageName = packageName;
        this.options = options;
        // copy the current visible classes and interfaces
        this.currentVisibleClassAndInterfaces = {...currentVisibleClassAndInterfaces};
        console.log("currentVisibleClassAndInterfaces")
        console.log(JSON.stringify(currentVisibleClassAndInterfaces, null, 2))

        this.ownCtx = ctx;
        this.type = type;

        // 5. Get the class or interface name
        let ownQualifiedName = JavaParserAntlr4.getQualifiedNameOfClassOrInterface(this.ownCtx, this.packageName);
        let classOrInterfaceName = JavaParserAntlr4.getNameOfClassOrInterface(this.ownCtx) as string; // we can assume that our file has a class or interface
        // Since java does not allow to import classes and interfaces with the same name, we can assume that the class or interface name is unique
        // Therefore we can set our own to the current visible classes and interfaces
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
}


class ClassParser extends BaseParser{
    constructor(file: MyFile, packageName: string | null, ctx: any, currentVisibleClassAndInterfaces: any, options: ParserOptions, innerClass = false) {
        super(file, "class", packageName, ctx, currentVisibleClassAndInterfaces, options, innerClass);
    }

    public parse() {
        super.parse();

        let extendsRawNames = ClassParser.classGetNameForExtendedClassOrImplementedInterfaces(this.ownCtx, "extends");
        console.log("extendsRawNames", extendsRawNames)
        this.saveRawExtendsNames(extendsRawNames);
        let implementsRawNames = ClassParser.classGetNameForExtendedClassOrImplementedInterfaces(this.ownCtx, "implements");
        this.saveRawImplementsNames(implementsRawNames);

        this.saveClassOrInterfaceToFile();
    }

}


class InterfaceParser extends BaseParser{
    constructor(file: MyFile, packageName: string | null, ctx, currentVisibleClassAndInterfaces: any, options: ParserOptions, innerInterface = false) {
        super(file, "interface", packageName, ctx, currentVisibleClassAndInterfaces,  options, innerInterface);
    }

    public parse() {
        super.parse();

        let extendsRawNames = InterfaceParser.interfaceGetNameForExtendedClassOrImplementedInterfaces(this.ownCtx, "extends");
        this.saveRawExtendsNames(extendsRawNames);
        let implementsRawNames = InterfaceParser.interfaceGetNameForExtendedClassOrImplementedInterfaces(this.ownCtx, "implements");
        this.saveRawImplementsNames(implementsRawNames);

        this.saveClassOrInterfaceToFile();
    }

}


export {ClassParser, InterfaceParser}
