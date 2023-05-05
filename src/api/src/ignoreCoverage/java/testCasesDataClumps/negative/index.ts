import {SimpleMethodsWithoutDataClumps} from "./simpleMethods/SimpleMethodsWithoutDataClumps";
import {TestCaseBaseClassForDataClumps} from "../../../TestCaseBaseClassForDataClumps";
import {ParametersWithModifiers} from "./parametersWithModifiers/ParametersWithModifiers";
import {TestCaseBaseClassGroup} from "../../../TestCaseBaseClass";

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
}
