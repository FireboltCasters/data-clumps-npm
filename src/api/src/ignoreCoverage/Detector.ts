import {SoftwareProject} from "./SoftwareProject";
import {DetectorDataClumpsMethods, DetectorOptionsDataClumpsMethods} from "./DetectorDataClumpsMethods";
import {DetectorDataClumpsFields, DetectorOptionsDataClumpsFields} from "./DetectorDataClumpsFields";

export class DetectorOptions {
    public optionsDataClumpsMethod: DetectorOptionsDataClumpsMethods
    public optionsDataClumpsField: DetectorOptionsDataClumpsFields;

    public constructor(options: any | DetectorOptionsDataClumpsMethods | DetectorOptionsDataClumpsFields){
        this.optionsDataClumpsMethod = new DetectorOptionsDataClumpsMethods(options);
        this.optionsDataClumpsField = new DetectorOptionsDataClumpsFields(options);
    }
}

export class Detector {

    public options: DetectorOptions;

    public constructor(options: any){
        this.options = new DetectorOptions(options);

    }

    public detect(project: SoftwareProject){
        console.log("Detecting software project for data clumps");
        let detectorDataClumpsMethods = new DetectorDataClumpsMethods(this.options.optionsDataClumpsMethod);
        let commonMethodParameters = detectorDataClumpsMethods.detect(project);
        //console.log("Common method parameters: ");
        //console.log(JSON.stringify(commonMethodParameters, null, 2));
        let detectorDataClumpsFields = new DetectorDataClumpsFields(this.options.optionsDataClumpsField);
        let commonFields = detectorDataClumpsFields.detect(project);
        //console.log("Common fields: ");
        //console.log(JSON.stringify(commonFields, null, 2));
    }

}
