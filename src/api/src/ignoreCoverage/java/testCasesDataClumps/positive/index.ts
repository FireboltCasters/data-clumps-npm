import {SimpleFields} from "./simpleFields/SimpleFields";
import {SimpleMethodsWithDataClumps} from "./simpleMethods/SimpleMethodsWithDataClumps";
import {AnonymousClass} from "./anonymousClass/AnonymousClass";
import {InnerInterfacePositive} from "./innerInterfacePositive/InnerInterfacePositive";
import {Polymorphism} from "./polymorphism/Polymorphism";
import {SimpleMethodsPositiveSameClass} from "./simpleMethods/SimpleMethodsPositiveSameClass";
import {TestCaseBaseClassForDataClumps} from "../../../TestCaseBaseClassForDataClumps";
import {ParametersWithModifiers} from "./parametersWithModifiers/ParametersWithModifiers";
import {SimpleFieldsAndMethods} from "./simpleFieldsAndMethods/SimpleFieldsAndMethods";

export {SimpleFields};
export {SimpleMethodsWithDataClumps};
export {AnonymousClass};
export {InnerInterfacePositive};
export {Polymorphism};
export {SimpleMethodsPositiveSameClass};

export class Positive {
    public static SimpleFields: TestCaseBaseClassForDataClumps = SimpleFields;
    public static ParametersWithModifiers: TestCaseBaseClassForDataClumps = ParametersWithModifiers;
    public static SimpleFieldsAndMethods: TestCaseBaseClassForDataClumps = SimpleFieldsAndMethods;
}
