import {ClassOrInterfaceTypeContext, Dictionary, MyFile} from "./ParsedTypes";

export interface LanguageParserInterface {
    parse(file: MyFile, includePosition: boolean): Dictionary<ClassOrInterfaceTypeContext>
}


