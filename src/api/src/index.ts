/* istanbul ignore file */
import {antlr4} from "./ignoreCoverage/util/MyAntlr4";
import {SoftwareProject, MyAbortController, SoftwareProjectDicts} from "./ignoreCoverage/SoftwareProject";
import * as ParsedAstTypes from "./ignoreCoverage/ParsedAstTypes";
import {JavaLanguageSupport} from "./ignoreCoverage/languages/java/"
import {LanguageSupportInterface} from "./ignoreCoverage/LanguageSupportInterface";
import {TestCaseBaseClassForDataClumps} from "./ignoreCoverage/TestCaseBaseClassForDataClumps";
import {ParserOptions} from "./ignoreCoverage/Parser";
import {DetectorOptionInformationParameter, DetectorOptionsInformation, Detector, DetectorOptions} from "./ignoreCoverage/detector/Detector";
export {SoftwareProject, MyAbortController, SoftwareProjectDicts};
export {DetectorOptionsInformation, DetectorOptionInformationParameter, Detector, DetectorOptions}
export {TestCaseBaseClassForDataClumps};
export {antlr4};
export {ParsedAstTypes};
export {JavaLanguageSupport};
export {ParserOptions};

export class Languages {
    static java = JavaLanguageSupport;

    static getLanguages(): LanguageSupportInterface[] {
        let languages: LanguageSupportInterface[] = [];
        languages.push(new JavaLanguageSupport());
        return languages;
    }
}
