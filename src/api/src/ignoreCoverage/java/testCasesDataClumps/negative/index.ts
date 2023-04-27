import {SimpleFields} from "./simpleFields/SimpleFields";
import {MultipleClassesInOneFile} from "./simpleFields/MultipleClassesInOneFile";
import {InnerInterfaceNegative} from "./innerInterfaceNegative/InnerInterfaceNegative";
import {SimpleMethodsWithoutDataClumps} from "./simpleMethods/SimpleMethodsWithoutDataClumps";
import {FieldAndMethodMix} from "./fieldAndMethodMix/FieldAndMethodMix";
import {TestCaseBaseClassForDataClumps} from "../../../TestCaseBaseClassForDataClumps";
import {ParametersWithModifiers} from "./parametersWithModifiers/ParametersWithModifiers";

export {SimpleFields};
export {MultipleClassesInOneFile};
export {InnerInterfaceNegative};
//export {SimpleMethodsWithoutDataClumps};

export class Negative {
    public static simpleMethodsWithoutDataClumps: TestCaseBaseClassForDataClumps = SimpleMethodsWithoutDataClumps;
    public static ParametersWithModifiers: TestCaseBaseClassForDataClumps = ParametersWithModifiers;
}
