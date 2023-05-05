import {MyFile} from "./../../ParsedAstTypes";
import {ParserOptions} from "../../Parser";
import {JavaParserAntlr4} from "./JavaParserAntlr4";
import {JavaAntlr4CstPrinter} from "../util/JavaAntlr4CstPrinter";

//TODO add support for generics

export class BaseParser {
    public currentVisibleClassAndInterfaces: any;
    public file: MyFile;
    public packageName: string | null;
    public ownCtx: any;
    public options: ParserOptions;

    constructor(file: MyFile, packageName: string | null, ctx, type, currentVisibleClassAndInterfaces: any, options: ParserOptions, innerClassOrInterface = false) {
        this.file = file;
        this.packageName = packageName;
        this.options = options;
        // copy the current visible classes and interfaces
        this.currentVisibleClassAndInterfaces = {...currentVisibleClassAndInterfaces};
        this.ownCtx = ctx;
    }

    public parse(){
        // 5. Get the class or interface name
        let ownQualifiedName = JavaParserAntlr4.getQualifiedNameOfClassOrInterface(this.ownCtx, this.packageName);
        let classOrInterfaceName = JavaParserAntlr4.getNameOfClassOrInterface(this.ownCtx) as string; // we can assume that our file has a class or interface
        // Since java does not allow to import classes and interfaces with the same name, we can assume that the class or interface name is unique
        // Therefore we can set our own to the current visible classes and interfaces
        this.currentVisibleClassAndInterfaces[classOrInterfaceName] = ownQualifiedName;

        console.log("Parsing class or interface: "+ownQualifiedName);
        JavaAntlr4CstPrinter.print(this.ownCtx, "ownCst");

        // 6. Get the inner classes and interfaces
            // They will override the classes and interfaces in the same package and the import declarations
        // 7. Get the methods with their parameters
        // 8. Get the fields
        // create visibility dictionary for fields since they might be overridden by inner classes or interfaces or methods
        // 9. Call recursively to this function from step 4 for each inner class or interface
    }

}


class ClassParser extends BaseParser{
    constructor(file: MyFile, packageName: string | null, ctx: any, currentVisibleClassAndInterfaces: any, options: ParserOptions, innerClass = false) {
        super(file, packageName, ctx, "class", currentVisibleClassAndInterfaces, options, innerClass);
    }


}


class InterfaceParser extends BaseParser{
    constructor(file: MyFile, packageName: string | null, ctx, currentVisibleClassAndInterfaces: any, options: ParserOptions, innerInterface = false) {
        super(file, packageName, ctx, "interface", currentVisibleClassAndInterfaces,  options, innerInterface);
    }

}


export {ClassParser, InterfaceParser}
