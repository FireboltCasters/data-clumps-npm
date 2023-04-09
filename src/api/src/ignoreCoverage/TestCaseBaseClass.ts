import {MyFile} from "./ParsedTypes";


export class TestCaseBaseClass {
    public name: string;
    public files: MyFile[];
    public expectedResult: any;
    public constructor(name, files, expectedResult){
        this.name = name;
        this.files = files || [];
        this.expectedResult = expectedResult;
    }
}
