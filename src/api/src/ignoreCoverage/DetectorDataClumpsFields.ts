
import {DetectorUtils} from "./DetectorUtils";
import {Dictionary} from "./UtilTypes";

import {DataClumpsParameterTypeRelatedToContext, DataClumpTypeContext} from "./DataClumpTypes";
import {ClassOrInterfaceTypeContext, MemberFieldParameterTypeContext} from "./ParsedAstTypes";
import {MyAbortController, SoftwareProjectDicts} from "./SoftwareProject";

export class DetectorOptionsDataClumpsFields {
    public sharedFieldParametersMinimum: number = 3;
    public sharedFieldParametersCheckIfHaveCommonHierarchy: boolean = false;
    public subclassInheritsAllMembersFromSuperclass: boolean = false;

    public constructor(options: any | DetectorOptionsDataClumpsFields){
        let keys = Object.keys(options || {});
        for (let key of keys) {
            // check if this key exists in this class
            if (this.hasOwnProperty(key)) {
                this[key] = options[key]; // set the value
            }
        }
    }
}

export class DetectorDataClumpsFields {

    public options: DetectorOptionsDataClumpsFields;
    public progressCallback: any;
    public abortController: MyAbortController | undefined;

    public constructor(options: any, progressCallback?: any, abortController?: MyAbortController){
        this.options = new DetectorOptionsDataClumpsFields(options);
        this.progressCallback = progressCallback;
        this.abortController = abortController;
    }

    public async detect(softwareProjectDicts: SoftwareProjectDicts): Promise<Dictionary<DataClumpTypeContext> | null>{
        let classesDict = DetectorUtils.getClassesDict(softwareProjectDicts);

        let dataClumpsFieldParameters: Dictionary<DataClumpTypeContext> = {};
        let classKeys = Object.keys(classesDict);
        let amountOfClasses = classKeys.length;
        let index = 0;
        for (let classKey of classKeys) {
            if(this.progressCallback){
                await this.progressCallback("Field Detector: "+classKey, index, amountOfClasses);
            }
            let currentClass = classesDict[classKey];// DataclumpsInspection.java line 404
            this.generateMemberFieldParametersRelatedToForClass(currentClass, classesDict, dataClumpsFieldParameters, softwareProjectDicts);
            if(this.abortController && this.abortController.isAbort()){
                return null;
            }
            index++;
        }
        return dataClumpsFieldParameters;
    }

    /**
     * DataclumpsInspection.java line 405
     */
    private generateMemberFieldParametersRelatedToForClass(currentClass: ClassOrInterfaceTypeContext, classesDict: Dictionary<ClassOrInterfaceTypeContext>, dataClumpsFieldParameters: Dictionary<DataClumpTypeContext>, softwareProjectDicts: SoftwareProjectDicts){
        let memberFieldParameters = this.getMemberParametersFromClass(currentClass, softwareProjectDicts);
        let amountOfMemberFields = memberFieldParameters.length;
        if(amountOfMemberFields < this.options.sharedFieldParametersMinimum){
            return;
        }
        let otherClassKeys = Object.keys(classesDict);
        for (let otherClassKey of otherClassKeys) {
            let otherClass = classesDict[otherClassKey];
            this.generateMemberFieldParametersRelatedToForClassToOtherClass(currentClass, otherClass, dataClumpsFieldParameters, softwareProjectDicts);
        }
    }

    private generateMemberFieldParametersRelatedToForClassToOtherClass(currentClass: ClassOrInterfaceTypeContext, otherClass: ClassOrInterfaceTypeContext, dataClumpsFieldParameters: Dictionary<DataClumpTypeContext>, softwareProjectDicts: SoftwareProjectDicts){
        // DataclumpsInspection.java line 410
        let currentClassKey = currentClass.key
        let otherClassKey = otherClass.key;
        if(currentClassKey === otherClassKey) {
            return; // skip the same class // DataclumpsInspection.java line 411
        }

        let hasCommonHierarchy = currentClass.hasCommonHierarchyWith(otherClass, softwareProjectDicts);
        if(hasCommonHierarchy){ // if the classes have a common hierarchy
            let checkIfHaveCommonHierarchy = this.options.sharedFieldParametersCheckIfHaveCommonHierarchy;
            if(!checkIfHaveCommonHierarchy){ // and we don't want to check them if they have a common hierarchy
                // then skip this class pair
                return; // DataclumpsInspection.java line 412
            }
        }

        let currentClassParameters = this.getMemberParametersFromClass(currentClass, softwareProjectDicts);
        let otherClassParameters = this.getMemberParametersFromClass(otherClass, softwareProjectDicts);
        let commonFieldParameterPairKeys = DetectorUtils.getCommonParameterPairKeys(currentClassParameters, otherClassParameters);
        //TODO get linked parameters: currentClassParameter --> otherClassParameter

        let amountOfCommonFieldParameters = commonFieldParameterPairKeys.length;
        if(amountOfCommonFieldParameters < this.options.sharedFieldParametersMinimum){
            return; // DataclumpsInspection.java line 410
        }

        let [currentParameters, commonFieldParamterKeysAsKey] = DetectorUtils.getCurrentAndOtherParametersFromCommonParameterPairKeys(commonFieldParameterPairKeys, currentClassParameters, otherClassParameters, softwareProjectDicts, otherClass, null);

        let fileKey = currentClass.fileKey;
        let currentFile = softwareProjectDicts.dictFile[fileKey]
        let dataClumpContext: DataClumpTypeContext = {
            type: "data_clump",
            key: currentFile.key+"-"+currentClass.key+"-"+otherClass.key+"-"+commonFieldParamterKeysAsKey, // typically the file path + class name + method name + parameter names
            file_path: currentFile.path,
            class_or_interface_name: currentClass.name,
            method_name: null,

            data_clump_type: "field_data_clump", // "parameter_data_clump" or "field_data_clump"
            data_clump_data: currentParameters
        }
        dataClumpsFieldParameters[dataClumpContext.key] = dataClumpContext;
    }

    private getMemberParametersFromClass(currentClass: ClassOrInterfaceTypeContext, softwareProjectDicts: SoftwareProjectDicts): MemberFieldParameterTypeContext[]{
        let classParameters: MemberFieldParameterTypeContext[] = [];

        let fieldParameters = currentClass.fields;
        let fieldParameterKeys = Object.keys(fieldParameters);
        for (let fieldKey of fieldParameterKeys) {
            let fieldParameter = fieldParameters[fieldKey];
            classParameters.push(fieldParameter);
        }

        // A class can inherit all members from its superclass
        // An interface can inherit all members from its superinterfaces
        if(this.options.subclassInheritsAllMembersFromSuperclass){
            let superclassesDict = currentClass.extends // {Batman: 'Batman.java/class/Batman'}
            let superclassNames = Object.keys(superclassesDict);
            for (let superclassName of superclassNames) {
                // superclassName = 'Batman'
                let superClassKey = superclassesDict[superclassName];
                // superClassKey = 'Batman.java/class/Batman'
                let superclass = softwareProjectDicts.dictClassOrInterface[superClassKey];
                let superclassParameters = this.getMemberParametersFromClass(superclass, softwareProjectDicts);
                classParameters = classParameters.concat(superclassParameters);
            }
        }

        return classParameters;
    }
}
