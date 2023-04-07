import {SoftwareProject} from "./SoftwareProject";
import {DetectorDataClumpsMethods, DetectorOptionsDataClumpsMethods} from "./DetectorDataClumpsMethods";

export class DetectorOptions {
    public optionsDataClumpsMethod: DetectorOptionsDataClumpsMethods

    public constructor(options: any | DetectorOptionsDataClumpsMethods){
        this.optionsDataClumpsMethod = new DetectorOptionsDataClumpsMethods(options);
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
        console.log("Common method parameters: ");
        console.log(JSON.stringify(commonMethodParameters, null, 2));
    }

}
