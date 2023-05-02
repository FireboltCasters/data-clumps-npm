import {ClassOrInterfaceTypeContext, MyFile} from "./ParsedAstTypes";
import {Dictionary} from "./UtilTypes";
import {SoftwareProject} from "./SoftwareProject";

export interface LanguageParserInterface {
    preParse(file: MyFile, includePosition: boolean): Dictionary<ClassOrInterfaceTypeContext>
    postParse(softwareProject: SoftwareProject, file: MyFile, includePosition: boolean): Dictionary<ClassOrInterfaceTypeContext>
}


