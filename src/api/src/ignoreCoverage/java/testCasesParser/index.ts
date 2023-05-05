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
import {TestCaseBaseClassGroup} from "../../TestCaseBaseClass";

export class JavaTestCasesParser extends TestCaseBaseClassGroup {

    static extendTestCaseGroup: TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Extends",
        [
            ExtendingClass,
            ExtendingClassWithExplicitImport,
            ExtendingClassWithWildcardImport,
            InterfaceExtendsInterfaces
        ],
    []
    );

    static importTestCaseGroup: TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Imports",
        [
            ImportTest,
            ImportTestInnerClass,
            ImportWithWildcardTest
        ],
        []
    );

    static nestedClassesTestCaseGroup: TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Nested Classes",
        [
            NestedInnerClasses,
            NestedInnerClassesExplicitType
        ],
        []
    );

    static implementsTestCaseGroup: TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Implements",
        [
            ClassImplementsInterface
        ],
        []
    );

    static classInPackageTestCaseGroup: TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Package",
        [
            ClassInPackage,
            ClassWithPackage
        ],
        []
    );

}
