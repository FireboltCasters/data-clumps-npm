import {ClassOrInterfaceTypeContext, Dictionary, MyFile} from "./ParsedAstTypes";

export interface LanguageParserInterface {
    parse(file: MyFile, includePosition: boolean): Dictionary<ClassOrInterfaceTypeContext>
}


