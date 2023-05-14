import {TestCaseBaseClassForDataClumps} from "../../../../TestCaseBaseClassForDataClumps";
import {TestCaseBaseClassGroup} from "../../../../TestCaseBaseClass";
import {ExtendsToSameFields} from "./extends/ExtendsToSameFields";

export class Unknown extends TestCaseBaseClassForDataClumps {

    static simple : TestCaseBaseClassGroup = new TestCaseBaseClassGroup(
        "Extends",
        [
            ExtendsToSameFields
    ], []);

}
