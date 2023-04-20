import {ClassOrInterfaceTypeContext, MyFile} from "./ParsedAstTypes";
import {Dictionary} from "./UtilTypes";

export interface LanguageParserInterface {
    parse(file: MyFile, includePosition: boolean): Dictionary<ClassOrInterfaceTypeContext>
}


