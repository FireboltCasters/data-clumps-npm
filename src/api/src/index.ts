/* istanbul ignore file */
import {antlr4} from "./ignoreCoverage/util/MyAntlr4";
import {SoftwareProject} from "./ignoreCoverage/SoftwareProject";
import * as ParsedAstTypes from "./ignoreCoverage/ParsedAstTypes";
import {JavaLanguageSupport} from "./ignoreCoverage/java/"
import {LanguageSupportInterface} from "./ignoreCoverage/LanguageSupportInterface";
import {TestCaseBaseClassForDataClumps} from "./ignoreCoverage/TestCaseBaseClassForDataClumps";

export {SoftwareProject};
export {TestCaseBaseClassForDataClumps};
export {antlr4};
export {ParsedAstTypes};
export {JavaLanguageSupport};

export class Languages {
    static java = JavaLanguageSupport;

    static getLanguages(): LanguageSupportInterface[] {
        let languages: LanguageSupportInterface[] = [];
        languages.push(new JavaLanguageSupport());
        return languages;
    }
}
