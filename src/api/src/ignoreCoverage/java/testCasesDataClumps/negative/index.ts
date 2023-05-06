import {SimpleMethodsWithoutDataClumps} from "./simpleMethods/SimpleMethodsWithoutDataClumps";
import {TestCaseBaseClassForDataClumps} from "../../../TestCaseBaseClassForDataClumps";
import {ParametersWithModifiers} from "./parametersWithModifiers/ParametersWithModifiers";
import {TestCaseBaseClassGroup} from "../../../TestCaseBaseClass";
import {SerialVersionUID} from "./specialFields/SerialVersionUID";
import {ChildrenWithMethods} from "./hierarchy/ChildrenWithMethods";

export class Negative extends TestCaseBaseClassForDataClumps{

    static simpleMethods : TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Simple Methods",
        [
            SimpleMethodsWithoutDataClumps,
    ], []);

    static parametersWithModifiers : TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Parameters With Modifiers",
        [
            ParametersWithModifiers,
    ], []);

    static hierarchy : TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Hierarchy",
        [
            ChildrenWithMethods,
    ], []);

    static specialFields : TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Special Fields",
        [
            SerialVersionUID,
    ], []);
}
