import {TestCaseBaseClassForParser} from "../../TestCaseBaseClassForParser";
import {ExtendingClass} from "./extends/ExtendingClass";
import {ExtendingClassWithExplicitImport} from "./extends/ExtendingClassWithExplicitImport";
import {ExtendingClassWithWildcardImport} from "./extends/ExtendingClassWithWildcardImport";
import {ImportTest} from "./importTest/ImportTest";
import {ImportTestInnerClass} from "./importTest/ImportTestInnerClass";
import {NestedInnerClasses} from "./nestedClasses/NestedInnerClasses";
import {NestedInnerClassesExplicitType} from "./nestedClasses/NestedInnerClassesExplicitType";
import {ClassImplementsInterface} from "./implements/ClassImplementsInterfaces";
import {InterfaceExtendsInterfaces} from "./extends/InterfaceExtendsInterfaces";
import {ClassInPackage} from "./package/ClassInPackage";
import {ClassWithPackage} from "./package/ClassWithPackage";
import {ImportWithWildcardTest} from "./importTest/ImportWithWildcardTest";

export class JavaTestCasesParser {
    static ExtendingClass: TestCaseBaseClassForParser = ExtendingClass;
    static ExtendingClassWithExplicitImport: TestCaseBaseClassForParser = ExtendingClassWithExplicitImport;
    static ExtendingClassWithWildcardImport: TestCaseBaseClassForParser = ExtendingClassWithWildcardImport;
    static ImportTest: TestCaseBaseClassForParser = ImportTest;
    static ImportWithWildcardTest: TestCaseBaseClassForParser = ImportWithWildcardTest;
    static ImportTestInnerClass: TestCaseBaseClassForParser = ImportTestInnerClass;
    static NestedInnerClasses: TestCaseBaseClassForParser = NestedInnerClasses;
    static NestedInnerClassesExplicitType: TestCaseBaseClassForParser = NestedInnerClassesExplicitType;
    static ClassImplementsInterface: TestCaseBaseClassForParser = ClassImplementsInterface;
    static InterfaceExtendsInterfaces: TestCaseBaseClassForParser = InterfaceExtendsInterfaces;
    static ClassInPackage: TestCaseBaseClassForParser = ClassInPackage;
    static ClassWithPackage: TestCaseBaseClassForParser = ClassWithPackage;
}
