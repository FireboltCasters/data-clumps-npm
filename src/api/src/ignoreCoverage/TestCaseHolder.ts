
import {TestCaseBaseClass} from "./TestCaseBaseClass";


export interface TestCaseHolder {
    getTestCases(): TestCaseBaseClass[];
}

export class TestCaseHolderForStaticFields implements TestCaseHolder {
    getTestCases(): TestCaseBaseClass[] {
        let testCases: TestCaseBaseClass[] = [];

        //Loop through all static fields in this class but not methods
        for (let field in this) {
            if (this.hasOwnProperty(field)) {
                let value = this[field];
                if (value instanceof TestCaseBaseClass) {
                    testCases.push(value);
                }
            }
        }

        return testCases;
    }
}
