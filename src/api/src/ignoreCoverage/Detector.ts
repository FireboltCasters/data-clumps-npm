import {SoftwareProject} from "./SoftwareProject";
import {DetectorDataClumpsMethods, DetectorOptionsDataClumpsMethods} from "./DetectorDataClumpsMethods";
import {DetectorDataClumpsFields, DetectorOptionsDataClumpsFields} from "./DetectorDataClumpsFields";
import {
    ClassOrInterfaceTypeContext,
    DataClumpsTypeContext,
    Dictionary, MemberFieldParameterTypeContext, MethodParameterTypeContext,
    MethodTypeContext,
    MyFile
} from "./ParsedAstTypes";

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

    public constructor(options: any, project: SoftwareProject){
        this.options = new DetectorOptions(options);
        this.project = project;
    }

    public detect(): DataClumpsTypeContext{
        let dataClumpsTypeContext: DataClumpsTypeContext = {
            version: "0.0.1",
            data_clumps: {}
        };

        let softwareProjectDicts: SoftwareProjectDicts = new SoftwareProjectDicts(this.project);
        console.log("Detecting software project for data clumps");
        let detectorDataClumpsMethods = new DetectorDataClumpsMethods(this.options.optionsDataClumpsMethod);
        let commonMethodParameters = detectorDataClumpsMethods.detect(softwareProjectDicts);
        //console.log("Common method parameters: ");
        //console.log(JSON.stringify(commonMethodParameters, null, 2));
        let detectorDataClumpsFields = new DetectorDataClumpsFields(this.options.optionsDataClumpsField);
        let commonFields = detectorDataClumpsFields.detect(softwareProjectDicts);
        console.log("Common fields: ");
        console.log(JSON.stringify(commonFields, null, 2));
        return dataClumpsTypeContext;
    }

}
