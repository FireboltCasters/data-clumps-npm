import {MyAbortController, SoftwareProject, SoftwareProjectDicts} from "../SoftwareProject";
import {DetectorDataClumpsMethods} from "./DetectorDataClumpsMethods";
import {DetectorDataClumpsFields} from "./DetectorDataClumpsFields";
import {DataClumpsTypeContext} from "../DataClumpTypes";
import {Timer} from "../Timer";

const defaultValueField = "defaultValue";
export type DetectorOptionInformationParameter = {
    label: string;
    description: string;
    [defaultValueField]: any
    group: any;
    type: any;
}

export class DetectorOptionsInformation {
    /**
     * Fields
     */
    public static sharedFieldParametersMinimum: DetectorOptionInformationParameter = {
        label: "Minimum shared fields",
        description: "hi",
        defaultValue: 3,
        group: "field",
        type: "number"
    }
    public static sharedFieldParametersCheckIfAreSubtypes: DetectorOptionInformationParameter = {
        label: "Check if fields in classes are subtypes",
        description: "Check if fields in classes are subtypes",
        defaultValue: false,
        group: "field",
        type: "boolean"
    }
    public static subclassInheritsAllMembersFromSuperclass: DetectorOptionInformationParameter = {
        label: "Subclass inherits all members from superclass",
        description: "Subclass inherits all members from superclass",
        defaultValue: false,
        group: "field",
        type: "boolean"
    }

    /**
     * Methods
     */
    public static sharedMethodParametersMinimum: DetectorOptionInformationParameter = {
        label: "shared Method Parameters Minimum",
        description: "shared Method Parameters Minimum",
        defaultValue: 3,
        group: "method",
        type: "number"
    }
    public static sharedMethodParametersHierarchyConsidered: DetectorOptionInformationParameter = {
        label: "shared Method Parameters Hierarchy Considered",
        description: "shared Method Parameters Hierarchy Considered",
        defaultValue: false,
        group: "method",
        type: "boolean"
    }
    public static analyseMethodsWithUnknownHierarchy: DetectorOptionInformationParameter = {
        label: "analyse Methods WithUnknown Hierarchy",
        description: "analyse Methods With Unknown Hierarchy",
        defaultValue: false,
        group: "method",
        type: "boolean"
    }
}

export type DetectorOptions = {
    [K in keyof typeof DetectorOptionsInformation]: any;
};



function getDefaultValuesFromPartialOptions(partialOptions: Partial<DetectorOptions>): DetectorOptions{
    // @ts-ignore
    let result: DetectorOptions = {}

    let DetectorOptionsKeys = Object.keys(DetectorOptionsInformation);
    console.log(DetectorOptionsKeys)

    for (const key of DetectorOptionsKeys) {
        const attributeKey = key;

        if (DetectorOptionsInformation.hasOwnProperty(attributeKey)) {
            const parameter: DetectorOptionInformationParameter = DetectorOptionsInformation[attributeKey];

            if (partialOptions.hasOwnProperty(attributeKey)) {
                result[attributeKey] = partialOptions[attributeKey]!;
            } else if (parameter.hasOwnProperty(defaultValueField)) {
                result[attributeKey] = parameter[defaultValueField];
            }
        } else {
            result[attributeKey] = "";
        }
    }

    return result;
}

export class Detector {

    public options: DetectorOptions;
    public project: SoftwareProject;
    public timer: Timer;
    public progressCallback: any;
    public abortController: MyAbortController | undefined;

    static getDefaultOptions(options?: Partial<DetectorOptions>){
        return getDefaultValuesFromPartialOptions(options || {});
    }

    public constructor(project: SoftwareProject, options?: Partial<DetectorOptions>, progressCallback?: any, abortController?: MyAbortController){
        this.options = Detector.getDefaultOptions(options || {});
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
        let detectorDataClumpsMethods = new DetectorDataClumpsMethods(this.options, this.progressCallback, this.abortController);
        let commonMethodParameters = await detectorDataClumpsMethods.detect(softwareProjectDicts);
        if(!!commonMethodParameters){
            let commonMethodParametersKeys = Object.keys(commonMethodParameters);
            for (let commonMethodParametersKey of commonMethodParametersKeys) {
                let commonMethodParameter = commonMethodParameters[commonMethodParametersKey];
                dataClumpsTypeContext.data_clumps[commonMethodParameter.key] = commonMethodParameter;
            }
        }

        let detectorDataClumpsFields = new DetectorDataClumpsFields(this.options, this.progressCallback, this.abortController);
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
