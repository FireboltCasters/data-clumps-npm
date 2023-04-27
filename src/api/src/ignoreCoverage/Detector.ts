import {MyAbortController, SoftwareProject} from "./SoftwareProject";
import {DetectorDataClumpsMethods, DetectorOptionsDataClumpsMethods} from "./DetectorDataClumpsMethods";
import {DetectorDataClumpsFields, DetectorOptionsDataClumpsFields} from "./DetectorDataClumpsFields";
import {
    ClassOrInterfaceTypeContext,
    MemberFieldParameterTypeContext,
    MethodParameterTypeContext,
    MethodTypeContext,
    MyFile
} from "./ParsedAstTypes";
import {Dictionary} from "./UtilTypes";
import {DataClumpsTypeContext} from "./DataClumpTypes";
import {Timer} from "./Timer";

export class DetectorOptions {
    public optionsDataClumpsMethod: DetectorOptionsDataClumpsMethods
    public optionsDataClumpsField: DetectorOptionsDataClumpsFields;

    public constructor(options: any | DetectorOptionsDataClumpsMethods | DetectorOptionsDataClumpsFields){
        this.optionsDataClumpsMethod = new DetectorOptionsDataClumpsMethods(options);
        this.optionsDataClumpsField = new DetectorOptionsDataClumpsFields(options);
    }
}

export class SoftwareProjectDicts {
    public dictFile: Dictionary<MyFile> = {};
    public dictClassOrInterface: Dictionary<ClassOrInterfaceTypeContext> = {};
    public dictMemberFieldParameters: Dictionary<MemberFieldParameterTypeContext> = {};
    public dictMethod: Dictionary<MethodTypeContext> = {};
    public dictMethodParameters: Dictionary<MethodParameterTypeContext> = {};

    public constructor(project: SoftwareProject) {
        this.dictFile = project.getFilesDict();
        console.log("dictFile: ")
        console.log(this.dictFile);

        this.dictClassOrInterface = {};
        this.dictMemberFieldParameters = {};
        this.dictMethod = {};
        this.dictMethodParameters = {};

        let fileKeys = Object.keys(this.dictFile);
        for (let fileKey of fileKeys) {
            let file = this.dictFile[fileKey];
            let classOrInterfacesDictForFile = file.ast;
            let classOrInterfaceKeys = Object.keys(classOrInterfacesDictForFile);
            for (let classOrInterfaceKey of classOrInterfaceKeys) {
                let classOrInterface = classOrInterfacesDictForFile[classOrInterfaceKey];

                // Fill dictClassOrInterface
                this.dictClassOrInterface[classOrInterface.key] = classOrInterface;

                // Fill memberFieldParameters
                let memberFieldParametersDictForClassOrInterface = classOrInterface.fields;
                let memberFieldParameterKeys = Object.keys(memberFieldParametersDictForClassOrInterface);
                for (let memberFieldParameterKey of memberFieldParameterKeys) {
                    let memberFieldParameter = memberFieldParametersDictForClassOrInterface[memberFieldParameterKey];
                    this.dictMemberFieldParameters[memberFieldParameter.key] = memberFieldParameter;
                }

                // Fill methods
                let methodsDictForClassOrInterface = classOrInterface.methods;
                let methodKeys = Object.keys(methodsDictForClassOrInterface);
                for (let methodKey of methodKeys) {
                    let method = methodsDictForClassOrInterface[methodKey];

                    // Fill dictMethod
                    this.dictMethod[method.key] = method;

                    // Fill methodParameters
                    let methodParametersDictForMethod = method.parameters;
                    let methodParameterKeys = Object.keys(methodParametersDictForMethod);
                    for (let methodParameterKey of methodParameterKeys) {
                        let methodParameter = methodParametersDictForMethod[methodParameterKey];
                        this.dictMethodParameters[methodParameter.key] = methodParameter;
                    }
                }
            }
        }
    }
}

export class Detector {

    public options: DetectorOptions;
    public project: SoftwareProject;
    public timer: Timer;
    public progressCallback: any;
    public abortController: MyAbortController | undefined;

    public constructor(options: any, project: SoftwareProject, progressCallback?: any, abortController?: MyAbortController){
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
