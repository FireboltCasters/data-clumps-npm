import {DetectorUtils} from "./DetectorUtils";
import {Dictionary} from "./../UtilTypes";

import {DataClumpTypeContext} from "./../DataClumpTypes";
import {ClassOrInterfaceTypeContext, MemberFieldParameterTypeContext} from "./../ParsedAstTypes";
import {MyAbortController, SoftwareProjectDicts} from "./../SoftwareProject";
import {DetectorOptions} from "./Detector";

// TODO refactor this method to Detector since there is already the creation, so why not the refactoring
function getParsedValuesFromPartialOptions(rawOptions: DetectorOptions): DetectorOptions{

    function parseBoolean(value: any){
        return ""+value==="true";
    }

    rawOptions.sharedFieldParametersMinimum = parseInt(rawOptions.sharedFieldParametersMinimum)
    rawOptions.subclassInheritsAllMembersFromSuperclass = parseBoolean(rawOptions.subclassInheritsAllMembersFromSuperclass)
    rawOptions.sharedFieldParametersCheckIfAreSubtypes = parseBoolean(rawOptions.sharedFieldParametersCheckIfAreSubtypes);

    return rawOptions;
}

export class DetectorDataClumpsFields {

    public options: DetectorOptions;
    public progressCallback: any;
    public abortController: MyAbortController | undefined;

    public constructor(options: DetectorOptions, progressCallback?: any, abortController?: MyAbortController){
        this.options = getParsedValuesFromPartialOptions(options)
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

            if(currentClass.auxclass){ // ignore auxclasses as are not important for our project
                return null;
            }

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

        if(otherClass.auxclass){ // ignore auxclasses as are not important for our project
            return;
        }

        // DataclumpsInspection.java line 410
        let currentClassKey = currentClass.key
        let otherClassKey = otherClass.key;
        if(currentClassKey === otherClassKey) {
            return; // skip the same class // DataclumpsInspection.java line 411
        }

        /**
         * Fields declared in a superclass
         * Are maybe new fields and not inherited fields
         * Or are overridden fields
         * In both cases, we need to check them
         */

        let currentClassParameters = this.getMemberParametersFromClass(currentClass, softwareProjectDicts);
        let otherClassParameters = this.getMemberParametersFromClass(otherClass, softwareProjectDicts);
        let commonFieldParameterPairKeys = DetectorUtils.getCommonParameterPairKeys(currentClassParameters, otherClassParameters);
        //TODO get linked parameters: currentClassParameter --> otherClassParameter

        let amountOfCommonFieldParameters = commonFieldParameterPairKeys.length;
        if(amountOfCommonFieldParameters < this.options.sharedFieldParametersMinimum){
            return; // DataclumpsInspection.java line 410
        }

        let [currentParameters, commonFieldParamterKeysAsKey] = DetectorUtils.getCurrentAndOtherParametersFromCommonParameterPairKeys(commonFieldParameterPairKeys, currentClassParameters, otherClassParameters, softwareProjectDicts, otherClass, null);

        let fileKey = currentClass.file_path;
        let dataClumpContext: DataClumpTypeContext = {
            type: "data_clump",
            key: fileKey+"-"+currentClass.key+"-"+otherClass.key+"-"+commonFieldParamterKeysAsKey, // typically the file path + class name + method name + parameter names

            from_file_path: fileKey,
            from_class_or_interface_name: currentClass.name,
            from_class_or_interface_key: currentClass.key,
            from_method_name: null,
            from_method_key: null,

            to_file_path: otherClass.file_path,
            to_class_or_interface_key: otherClass.key,
            to_class_or_interface_name: currentClass.name,
            to_method_key: null,
            to_method_name: null,

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
            if(!fieldParameter.ignore){
                // DONE: The parser itself should set the Flag if we should ignore this field.
                classParameters.push(fieldParameter);
            }
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
