
import {DetectorUtils} from "./DetectorUtils";
import {SoftwareProjectDicts} from "./Detector";
import {Dictionary} from "./UtilTypes";

import {DataClumpsParameterTypeRelatedToContext, DataClumpTypeContext} from "./DataClumpTypes";
import {ClassOrInterfaceTypeContext, MemberFieldParameterTypeContext} from "./ParsedAstTypes";
import {MyAbortController} from "./SoftwareProject";

export class DetectorOptionsDataClumpsFields {
    public sharedFieldParametersMinimum: number = 3;
    public sharedFieldParametersCheckIfHaveCommonHierarchy: boolean = false;
    public subclassInheritsAllMembersFromSuperclass: boolean = true;

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
        //console.log("detecting data clumps fields")
        //console.log(classesDict);

        let dataClumpsFieldParameters: Dictionary<DataClumpTypeContext> = {};
        let classKeys = Object.keys(classesDict);
        //console.log("Generating member field parameters related to for all classes")
        //console.log("Amount of classes: " + classKeys.length)
        let amountOfClasses = classKeys.length;
        //console.log(classKeys)
        let index = 0;
        for (let classKey of classKeys) {
            if(this.progressCallback){
                await this.progressCallback("Field Detector: "+classKey, index, amountOfClasses);
            }
            //console.log("Generating member field parameters related to for class: " + classKey)
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
        let memberFieldParameters = this.getMemberParametersFromClass(currentClass);
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

        let hasCommonHierarchy = currentClass.hasCommonHierarchyWith(otherClass);
        if(hasCommonHierarchy){ // if the classes have a common hierarchy
            let checkIfHaveCommonHierarchy = this.options.sharedFieldParametersCheckIfHaveCommonHierarchy;
            if(!checkIfHaveCommonHierarchy){ // and we don't want to check them if they have a common hierarchy
                // then skip this class pair
                return; // DataclumpsInspection.java line 412
            }
        }

        let currentClassParameters = this.getMemberParametersFromClass(currentClass);
        let otherClassParameters = this.getMemberParametersFromClass(otherClass);
        let commonFieldParameterPairKeys = DetectorUtils.getCommonParameterPairKeys(currentClassParameters, otherClassParameters);
        //TODO get linked parameters: currentClassParameter --> otherClassParameter

        let amountOfCommonFieldParameters = commonFieldParameterPairKeys.length;
        if(amountOfCommonFieldParameters < this.options.sharedFieldParametersMinimum){
            return; // DataclumpsInspection.java line 410
        }

        //console.log("- Found common field parameters between classes: " + currentClassKey + " and " + otherClassKey)
        for(let commonFieldParameterKey of commonFieldParameterPairKeys){
            //console.log("  - " + commonFieldParameterKey)
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

    private getMemberParametersFromClass(currentClass: ClassOrInterfaceTypeContext): MemberFieldParameterTypeContext[]{
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
            let superclassesDict = currentClass.extends
            let superclassKeys = Object.keys(superclassesDict);
            for (let superclassKey of superclassKeys) {
                let superclass = superclassesDict[superclassKey];
                let superclassParameters = this.getMemberParametersFromClass(superclass);
                classParameters = classParameters.concat(superclassParameters);
            }
        }

        return classParameters;
    }
}
