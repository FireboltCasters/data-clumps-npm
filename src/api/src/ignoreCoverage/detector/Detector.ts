import {MyAbortController, SoftwareProject, SoftwareProjectDicts} from "../SoftwareProject";
import {DetectorDataClumpsMethods} from "./DetectorDataClumpsMethods";
import {DetectorDataClumpsFields} from "./DetectorDataClumpsFields";
import {DataClumpsTypeContext} from "data-clumps-type-context";
import {Timer} from "../Timer";
import {Dictionary} from "../UtilTypes";
import {ClassOrInterfaceTypeContext} from "../ParsedAstTypes";

const defaultValueField = "defaultValue";

type DetectorOptionInformationParameter = {
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
        label: "Minimum Number of Shared Fields",
        description: "The minimum number of fields that two or more classes must share to be considered related. Default value is 3.",
        defaultValue: 3,
        group: "field",
        type: "number"
    }
    public static sharedFieldParametersCheckIfAreSubtypes: DetectorOptionInformationParameter = {
        label: "Check Subtyping of Shared Fields",
        description: "If set to true, the detector will check if shared fields in related classes are subtypes of each other. Default value is false.",
        defaultValue: false,
        group: "field",
        type: "boolean"
    }
    public static subclassInheritsAllMembersFromSuperclass: DetectorOptionInformationParameter = {
        label: "Subclass Inherits All Members",
        description: "If set to true, the detector will consider a subclass related to its superclass only if it inherits all members fields from it. Default value is false.",
        defaultValue: false,
        group: "field",
        type: "boolean"
    }

    /**
     * Methods
     */
    public static sharedMethodParametersMinimum: DetectorOptionInformationParameter = {
        label: "Minimum Number of Shared Method Parameters",
        description: "The minimum number of method parameters that two or more classes must share to be considered related. Default value is 3.",
        defaultValue: 3,
        group: "method",
        type: "number"
    }
    public static sharedMethodParametersHierarchyConsidered: DetectorOptionInformationParameter = {
        label: "Consider Hierarchy for Shared Method Parameters",
        description: "If set to true, the detector will consider the hierarchy of classes when checking for shared method parameters. Default value is false.",
        defaultValue: false,
        group: "method",
        type: "boolean"
    }
    public static analyseMethodsWithUnknownHierarchy: DetectorOptionInformationParameter = {
        label: "Analyze Methods with Unknown Hierarchy",
        description: "If set to true, the detector will analyze methods that are not part of a known hierarchy of related classes. Default value is false.",
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
    //console.log(DetectorOptionsKeys)

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
    public softwareProjectDicts: SoftwareProjectDicts;
    public timer: Timer;
    public progressCallback: any;
    public abortController: MyAbortController | undefined;

    static getDefaultOptions(options?: Partial<DetectorOptions>){
        return getDefaultValuesFromPartialOptions(options || {});
    }

    public constructor(dictClassOrInterface: Dictionary<ClassOrInterfaceTypeContext>, options?: Partial<DetectorOptions>, progressCallback?: any, abortController?: MyAbortController){
        let softwareProjectDicts = new SoftwareProjectDicts(dictClassOrInterface);
        this.options = Detector.getDefaultOptions(options || {});
        this.softwareProjectDicts = softwareProjectDicts;
        this.timer = new Timer();
        this.progressCallback = progressCallback;
        this.abortController = abortController;
    }

    public async detect(): Promise<DataClumpsTypeContext>{
        this.timer.start();
        let dataClumpsTypeContext: DataClumpsTypeContext = {
            version: "0.0.2",
            options: {},
            data_clumps: {}
        };

        console.log("Detecting software project for data clumps");
        //console.log(softwareProjectDicts);
        let detectorDataClumpsMethods = new DetectorDataClumpsMethods(this.options, this.progressCallback, this.abortController);
        let commonMethodParameters = await detectorDataClumpsMethods.detect(this.softwareProjectDicts);
        if(!!commonMethodParameters){
            let commonMethodParametersKeys = Object.keys(commonMethodParameters);
            for (let commonMethodParametersKey of commonMethodParametersKeys) {
                let commonMethodParameter = commonMethodParameters[commonMethodParametersKey];
                dataClumpsTypeContext.data_clumps[commonMethodParameter.key] = commonMethodParameter;
            }
        }

        let detectorDataClumpsFields = new DetectorDataClumpsFields(this.options, this.progressCallback, this.abortController);
        let commonFields = await detectorDataClumpsFields.detect(this.softwareProjectDicts);
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


        return dataClumpsTypeContext;
    }

}
