import {SimpleFields} from "./simpleFields/SimpleFields";
import {SimpleMethodsWithDataClumps} from "./simpleMethods/SimpleMethodsWithDataClumps";
import {AnonymousClass} from "./anonymousClass/AnonymousClass";
import {Polymorphism} from "./polymorphism/Polymorphism";
import {SimpleMethodsPositiveSameClass} from "./simpleMethods/SimpleMethodsPositiveSameClass";
import {TestCaseBaseClassForDataClumps} from "../../../../TestCaseBaseClassForDataClumps";
import {ParametersWithModifiers} from "./parametersWithModifiers/ParametersWithModifiers";
import {TestCaseBaseClassGroup} from "../../../../TestCaseBaseClass";
import {SiblingsWithFields} from "./hierarchy/SiblingsWithFields";
import {SiblingsWithMethods} from "./hierarchy/SiblingsWithMethods";
import {InnerSmellyClasses} from "./innerInterfacePositive/InnerSmellyClasses";
import {SimpleGeneric} from "./generic/SimpleGeneric";

export class Positive extends TestCaseBaseClassForDataClumps {

    // TODO Split between Field and Parameter Data Clumps

    static simple : TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Simple",
        [
            SimpleFields,
            SimpleMethodsWithDataClumps,
    ], []);

    static hierarchy : TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Hierarchy",
        [
            SiblingsWithFields,
            SiblingsWithMethods
    ], []);

    static innerClassesAndInterfaces : TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Inner Classes and Interfaces",
        [
            InnerSmellyClasses
    ], []);

    static withModifiers : TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "With Modifiers",
        [
            ParametersWithModifiers,
    ], []);

    static generics: TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Generics",
        [
            SimpleGeneric,
        ], []);

}
