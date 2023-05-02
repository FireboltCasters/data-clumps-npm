import {TestCaseBaseClass} from "./TestCaseBaseClass";
import {MyFile, ParameterTypeContext, ParameterTypeContextUtils} from "./ParsedAstTypes";

export class TestCaseBaseClassForDataClumps extends TestCaseBaseClass{
    public dataClumps: ParameterTypeContext[];

    public constructor(name, files: MyFile[], extensionsToBeChecked: string[], dataClumps){
        super(name, files, extensionsToBeChecked, ParameterTypeContextUtils.parametersToString(dataClumps));
        this.dataClumps = dataClumps;
    }

    public getExpectedDataClumps(){
        return this.dataClumps;
    }
}
