import {ClassOrInterfaceTypeContext, MyFile} from "./ParsedAstTypes";
import {Dictionary} from "./UtilTypes";
import {SoftwareProject} from "./SoftwareProject";
import {SoftwareProjectDicts} from "./Detector";

export interface LanguageParserInterface {
    preParse(file: MyFile, includePosition: boolean): Dictionary<ClassOrInterfaceTypeContext>
    postParse(softwareProject: SoftwareProject, softwareProjectDicts: SoftwareProjectDicts, file: MyFile, includePosition: boolean): Dictionary<ClassOrInterfaceTypeContext>
}


