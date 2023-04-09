/* istanbul ignore file */
import {antlr4} from "./ignoreCoverage/util/MyAntlr4";
import {SoftwareProject} from "./ignoreCoverage/SoftwareProject";
import * as ParsedTypes from "./ignoreCoverage/ParsedTypes";
import {JavaLanguageSupport} from "./ignoreCoverage/java/"
import {LanguageSupportInterface} from "./ignoreCoverage/LanguageSupportInterface";

export {antlr4};
export {SoftwareProject};
export {ParsedTypes};
export {JavaLanguageSupport};

export class Languages {
    static java = JavaLanguageSupport;

    static getLanguages(): LanguageSupportInterface[] {
        let languages: LanguageSupportInterface[] = [];
        languages.push(new JavaLanguageSupport());
        return languages;
    }
}
