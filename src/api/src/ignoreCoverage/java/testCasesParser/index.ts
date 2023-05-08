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
import {SimpleEnum} from "./enums/SimpleEnum";
import {ExtendingClassWithQualifiedName} from "./extends/ExtendingClassWithQualifiedName";
import {ExtendsInterfaceWithQualifiedName} from "./extends/ExtendsInterfaceWithQualifiedName";
import {ImplementsInterfaceWithQualifiedName} from "./implements/ImplementsInterfaceWithQualifiedName";
import {FieldArray} from "./fields/FieldArray";
import {FieldHashMap} from "./fields/FieldHashMap";
import {FieldList} from "./fields/FieldList";
import {SimpleParameters} from "./parameters/SimpleParameters";
import {ParametersWithHash} from "./parameters/ParametersWithHash";
import {ParametersWithArray} from "./parameters/ParametersWithArray";
import {FieldsMultipleInRow} from "./fields/FieldsMultipleInRow";
import {FieldsMultipleInRowWithSpacesAndLinebreaks} from "./fields/FieldsMultipleInRowWithSpacesAndLinebreaks";
import {FieldWithGeneric} from "./fields/FieldWithGeneric";

export class JavaTestCasesParser extends TestCaseBaseClassGroup {

    static fieldsTestCaseGroup: TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Fields",
        [
            FieldArray,
            FieldHashMap,
            FieldList,
            FieldsMultipleInRow,
            FieldsMultipleInRowWithSpacesAndLinebreaks,
            FieldWithGeneric
        ], []);

    static parameterTestCaseGroup: TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Parameters",
        [
            SimpleParameters,
            ParametersWithArray,
            ParametersWithHash
        ], []);

    static extendTestCaseGroup: TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Extends",
        [
            ExtendingClass,
            ExtendingClassWithExplicitImport,
            ExtendingClassWithWildcardImport,
            InterfaceExtendsInterfaces,
            ExtendingClassWithQualifiedName,
            ExtendsInterfaceWithQualifiedName
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
            ClassImplementsInterface,
            ImplementsInterfaceWithQualifiedName
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

    static enumTestCaseGroup: TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Enums",
        [
            SimpleEnum
        ],
        []
    );

}
