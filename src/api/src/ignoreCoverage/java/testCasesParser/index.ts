import {ExtendingClass} from "./extends/ExtendingClass";
import {ExtendingClassWithExplicitImport} from "./extends/ExtendingClassWithExplicitImport";
import {ExtendingClassWithWildcardImport} from "./extends/ExtendingClassWithWildcardImport";
import {ImportTest} from "./importTest/ImportTest";
import {ImportTestInnerClass} from "./importTest/ImportTestInnerClass";
import {NestedInnerClasses} from "./classes/NestedInnerClasses";
import {NestedInnerClassesExplicitType} from "./classes/NestedInnerClassesExplicitType";
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
import {SimpleClass} from "./classes/SimpleClass";
import {GenericClass} from "./classes/GenericClass";
import {AnonymousClass} from "./classes/AnonymousClass";
import {ExtremeGenericClass} from "./classes/ExtremeGenericClass";
import {SimpleFields} from "./fields/SimpleFields";
import {MultipleClassInOneFile} from "./classes/MultipleClassInOneFile";
import {ExtendingClassFromJava} from "./extends/ExtendingClassFromJava";
import {ExtendingClassFromUnknownPackage} from "./extends/ExtendingClassFromUnknownPackage";

export class JavaTestCasesParser extends TestCaseBaseClassGroup {

    static fieldsTestCaseGroup: TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Fields",
        [
            SimpleFields,
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
            ExtendsInterfaceWithQualifiedName,
            ExtendingClassFromJava,
            ExtendingClassFromUnknownPackage
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
        "Classes",
        [
            SimpleClass,
            AnonymousClass,
            NestedInnerClasses,
            NestedInnerClassesExplicitType,
            GenericClass,
            ExtremeGenericClass,
            MultipleClassInOneFile
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
