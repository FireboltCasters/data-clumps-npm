import {TestCaseBaseClassForParser} from "../../TestCaseBaseClassForParser";
import {ExtendingClass} from "./extendingClass/ExtendingClass";
import {ExtendingClassWithExplicitImport} from "./extendingClass/ExtendingClassWithExplicitImport";
import {ExtendingClassWithWildcardImport} from "./extendingClass/ExtendingClassWithWildcardImport";
import {ImportTest} from "./importTest/ImportTest";
import {ImportTestInnerClass} from "./importTest/ImportTestInnerClass";
import {NestedInnerClasses} from "./nestedClasses/NestedInnerClasses";
import {NestedInnerClassesExplicitType} from "./nestedClasses/NestedInnerClassesExplicitType";

export class JavaTestCasesParser {
    static ExtendingClass: TestCaseBaseClassForParser = ExtendingClass;
    static ExtendingClassWithExplicitImport: TestCaseBaseClassForParser = ExtendingClassWithExplicitImport;
    static ExtendingClassWithWildcardImport: TestCaseBaseClassForParser = ExtendingClassWithWildcardImport;
    static ImportTest: TestCaseBaseClassForParser = ImportTest;
    static ImportTestInnerClass: TestCaseBaseClassForParser = ImportTestInnerClass;
    static NestedInnerClasses: TestCaseBaseClassForParser = NestedInnerClasses;
    static NestedInnerClassesExplicitType: TestCaseBaseClassForParser = NestedInnerClassesExplicitType;
}
