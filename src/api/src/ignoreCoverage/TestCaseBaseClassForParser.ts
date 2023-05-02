import {TestCaseBaseClass} from "./TestCaseBaseClass";
import {MyFile, ParameterTypeContext, ParameterTypeContextUtils} from "./ParsedAstTypes";

export class TestCaseBaseClassForParser extends TestCaseBaseClass{
    //public dataClumps: ParameterTypeContext[];

    public constructor(name, files: MyFile[], extensionsToBeChecked: string[], parsedResults){
        super(name, files, extensionsToBeChecked, JSON.stringify(parsedResults));
        //this.dataClumps = dataClumps;
    }

    /**
    public getExpectedDataClumps(){
        return this.dataClumps;
    }
     */
}
