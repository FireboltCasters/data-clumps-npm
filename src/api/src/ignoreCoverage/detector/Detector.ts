import {MyAbortController, SoftwareProject, SoftwareProjectDicts} from "../SoftwareProject";
import {DetectorDataClumpsMethods, DetectorOptionsDataClumpsMethods} from "./DetectorDataClumpsMethods";
import {DetectorDataClumpsFields, DetectorOptionsDataClumpsFields} from "./DetectorDataClumpsFields";
import {DataClumpsTypeContext} from "../DataClumpTypes";
import {Timer} from "../Timer";

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
    public project: SoftwareProject;
    public timer: Timer;
    public progressCallback: any;
    public abortController: MyAbortController | undefined;

    public constructor(project: SoftwareProject, options?: DetectorOptions, progressCallback?: any, abortController?: MyAbortController){
        this.options = new DetectorOptions(options);
        this.project = project;
        this.timer = new Timer();
        this.progressCallback = progressCallback;
        this.abortController = abortController;
    }

    public async detect(): Promise<DataClumpsTypeContext>{
        this.timer.start();
        let dataClumpsTypeContext: DataClumpsTypeContext = {
            version: "0.0.1",
            data_clumps: {}
        };

        let softwareProjectDicts: SoftwareProjectDicts = this.project.getSoftwareProjectDicts();
        console.log("Detecting software project for data clumps");
        console.log(softwareProjectDicts);
        let detectorDataClumpsMethods = new DetectorDataClumpsMethods(this.options.optionsDataClumpsMethod, this.progressCallback, this.abortController);
        let commonMethodParameters = await detectorDataClumpsMethods.detect(softwareProjectDicts);
        if(!!commonMethodParameters){
            let commonMethodParametersKeys = Object.keys(commonMethodParameters);
            for (let commonMethodParametersKey of commonMethodParametersKeys) {
                let commonMethodParameter = commonMethodParameters[commonMethodParametersKey];
                dataClumpsTypeContext.data_clumps[commonMethodParameter.key] = commonMethodParameter;
            }
        }

        let detectorDataClumpsFields = new DetectorDataClumpsFields(this.options.optionsDataClumpsField, this.progressCallback, this.abortController);
        let commonFields = await detectorDataClumpsFields.detect(softwareProjectDicts);
        if(!!commonFields){
            let commonFieldsKeys = Object.keys(commonFields);
            for (let commonFieldsKey of commonFieldsKeys) {
                let commonField = commonFields[commonFieldsKey];
                dataClumpsTypeContext.data_clumps[commonField.key] = commonField;
            }
        }

        // timeout for testing

        this.timer.stop();

        console.log("Detecting software project for data clumps (done)")
        this.timer.printElapsedTime("Detector.detect");

        console.log(JSON.stringify(dataClumpsTypeContext, null, 2));


        return dataClumpsTypeContext;
    }

}
