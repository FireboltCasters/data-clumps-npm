import {JavaParserHelper} from "./JavaParserHelper";
import {ClassOrInterfaceTypeContext, MyFile} from "./../../ParsedAstTypes";
import {JavaParserFieldExtractor} from "./JavaParserFieldExtractor";
import {JavaParserMethodExtractor} from "./JavaParserMethodExtractor";
import {JavaAntlr4CstPrinter} from "../util/JavaAntlr4CstPrinter";

//TODO add support for generics

export class BaseExtractor{
    public classOrInterface: ClassOrInterfaceTypeContext;
    public includePosition: boolean;
    public file: MyFile;
    public qualifiedName: string;

    constructor(file: MyFile, packageName: string, ctx, type, includePosition= false, innerClassOrInterface = false) {
        this.includePosition = includePosition;
        this.file = file;
    }

}


class ClassExtractor extends BaseExtractor{
    constructor(file: MyFile, packageName: string, ctx: any, includePosition= false, innerClass = false) {
        super(file, packageName, ctx, "class", includePosition, innerClass);
    }


}


class InterfaceExtractor extends BaseExtractor{
    constructor(file: MyFile, packageName: string, ctx, includePosition= false, innerInterface = false) {
        super(file, packageName, ctx, "interface", includePosition, innerInterface);
    }

}


export {ClassExtractor, InterfaceExtractor}
