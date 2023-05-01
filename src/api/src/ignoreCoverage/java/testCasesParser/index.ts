import {TestCaseBaseClassForParser} from "../../TestCaseBaseClassForParser";
import {ExtendingClass} from "./extendingClass/ExtendingClass";
import {ExtendingClassWithExplicitImport} from "./extendingClass/ExtendingClassWithExplicitImport";
import {ExtendingClassWithWildcardImport} from "./extendingClass/ExtendingClassWithWildcardImport";

export class JavaTestCasesParser {
    static ExtendingClass: TestCaseBaseClassForParser = ExtendingClass;
    static ExtendingClassWithExplicitImport: TestCaseBaseClassForParser = ExtendingClassWithExplicitImport;
    static ExtendingClassWithWildcardImport: TestCaseBaseClassForParser = ExtendingClassWithWildcardImport;
}
