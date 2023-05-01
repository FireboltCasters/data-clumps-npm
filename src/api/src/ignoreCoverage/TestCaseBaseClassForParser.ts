import {TestCaseBaseClass} from "./TestCaseBaseClass";
import {MyFile, ParameterTypeContext, ParameterTypeContextUtils} from "./ParsedAstTypes";

export class TestCaseBaseClassForParser extends TestCaseBaseClass{
    //public dataClumps: ParameterTypeContext[];

    public constructor(name, files: MyFile[], parsedResults){
        super(name, files, JSON.stringify(parsedResults));
        //this.dataClumps = dataClumps;
    }

    /**
    public getExpectedDataClumps(){
        return this.dataClumps;
    }
     */
}
