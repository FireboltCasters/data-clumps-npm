/* istanbul ignore file */
import {antlr4} from "./ignoreCoverage/util/MyAntlr4";
import {SoftwareProject, MyAbortController, SoftwareProjectDicts} from "./ignoreCoverage/SoftwareProject";
import * as ParsedAstTypes from "./ignoreCoverage/ParsedAstTypes";
import {JavaLanguageSupport} from "./ignoreCoverage/languages/java/"
import {LanguageSupportInterface} from "./ignoreCoverage/LanguageSupportInterface";
import {TestCaseBaseClassForDataClumps} from "./ignoreCoverage/TestCaseBaseClassForDataClumps";
import {ParserOptions} from "./ignoreCoverage/Parser";
import {Detector, DetectorOptionsInformation, DetectorOptions as DetectorOptions_} from "./ignoreCoverage/detector/Detector";
export {SoftwareProject, MyAbortController, SoftwareProjectDicts};
export type DetectorOptions = DetectorOptions_; // https://stackoverflow.com/questions/53728230/cannot-re-export-a-type-when-using-the-isolatedmodules-with-ts-3-2-2
export {Detector, DetectorOptionsInformation}
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
