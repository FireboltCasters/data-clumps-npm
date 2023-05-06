import {SimpleFields} from "./simpleFields/SimpleFields";
import {SimpleMethodsWithDataClumps} from "./simpleMethods/SimpleMethodsWithDataClumps";
import {AnonymousClass} from "./anonymousClass/AnonymousClass";
import {InnerInterfacePositive} from "./innerInterfacePositive/InnerInterfacePositive";
import {Polymorphism} from "./polymorphism/Polymorphism";
import {SimpleMethodsPositiveSameClass} from "./simpleMethods/SimpleMethodsPositiveSameClass";
import {TestCaseBaseClassForDataClumps} from "../../../TestCaseBaseClassForDataClumps";
import {ParametersWithModifiers} from "./parametersWithModifiers/ParametersWithModifiers";
import {TestCaseBaseClassGroup} from "../../../TestCaseBaseClass";
import {SiblingsWithFields} from "./hierarchy/SiblingsWithFields";
import {SiblingsWithMethods} from "./hierarchy/SiblingsWithMethods";

export {SimpleFields};
export {SimpleMethodsWithDataClumps};
export {AnonymousClass};
export {InnerInterfacePositive};
export {Polymorphism};
export {SimpleMethodsPositiveSameClass};

export class Positive extends TestCaseBaseClassForDataClumps {

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

    static withModifiers : TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "With Modifiers",
        [
            ParametersWithModifiers,
    ], []);
}
