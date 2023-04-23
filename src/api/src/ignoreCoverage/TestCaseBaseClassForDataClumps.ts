import {TestCaseBaseClass} from "./TestCaseBaseClass";
import {MyFile, ParameterTypeContext, ParameterTypeContextUtils} from "./ParsedAstTypes";

export class TestCaseBaseClassForDataClumps extends TestCaseBaseClass{
    public dataClumps: ParameterTypeContext[];

    public constructor(name, files: MyFile[], dataClumps){
        super(name, files, ParameterTypeContextUtils.parametersToString(dataClumps));
        this.dataClumps = dataClumps;
    }

    public getExpectedDataClumps(){
        return this.dataClumps;
    }
}
