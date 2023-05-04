import {MyFile} from "./ParsedAstTypes";
import {SoftwareProject} from "./SoftwareProject";

export interface LanguageParserInterface {
    preParse(softwareProject: SoftwareProject, file: MyFile, includePosition: boolean)

    /**
     * If post parsing is needed, this method is called after all
     * @param softwareProject
     * @param softwareProjectDicts
     * @param file
     * @param includePosition
     */
    postParse(softwareProject: SoftwareProject, file: MyFile, includePosition: boolean)
}


