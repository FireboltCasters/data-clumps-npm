import {SoftwareProject} from "./SoftwareProject";
import {
    ClassOrInterfaceTypeContext,
    Dictionary, MemberFieldParameterTypeContext,
    MemberFieldTypeContext,
    MethodTypeContext,
    ParameterTypeContext
} from "./ParsedTypes";
import {DetectorUtils} from "./DetectorUtils";

export class DetectorOptionsDataClumpsFields {
    public sharedFieldParametersMinimum: number = 3;
    public sharedFieldParametersCheckIfHaveCommonHierarchy: boolean = false;

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

    public constructor(options: any){
        this.options = new DetectorOptionsDataClumpsFields(options);
    }

    public detect(project: SoftwareProject){
        console.log("Detecting software project for data clumps in class fields");
        let commonFieldParameters = this.getCommonFieldParametersForSoftwareProject(project);
        //console.log("Common field parameters: ");
        //console.log(JSON.stringify(commonFieldParameters, null, 2));
    }


    /**
     * DataclumpsInspection.java line 399
     */
    private getCommonFieldParametersForSoftwareProject(project: SoftwareProject){
        let commonFieldParameters: any[] = [];
        let classesDict = DetectorUtils.getClassesDict(project);
        this.generateMemberFieldParametersRelatedToForAllClasses(classesDict);

        return commonFieldParameters;
    }

    private generateMemberFieldParametersRelatedToForAllClasses(classesDict: Dictionary<ClassOrInterfaceTypeContext>){
        let classKeys = Object.keys(classesDict);
        for (let classKey of classKeys) {
            console.log("Generating member field parameters related to for class: " + classKey)
            let currentClass = classesDict[classKey];// DataclumpsInspection.java line 404
            this.generateMemberFieldParametersRelatedToForClass(currentClass, classesDict);
        }
    }

    /**
     * DataclumpsInspection.java line 405
     */
    private generateMemberFieldParametersRelatedToForClass(currentClass: ClassOrInterfaceTypeContext, classesDict: Dictionary<ClassOrInterfaceTypeContext>){
        let memberFieldParameters = this.getMemberParametersFromClass(currentClass);
        let amountOfMemberFields = memberFieldParameters.length;
        if(amountOfMemberFields < this.options.sharedFieldParametersMinimum){
            return;
        }
        let otherClassKeys = Object.keys(classesDict);
        for (let otherClassKey of otherClassKeys) {
            let otherClass = classesDict[otherClassKey];
            this.generateMemberFieldParametersRelatedToForClassToOtherClass(currentClass, otherClass);
        }
    }

    private generateMemberFieldParametersRelatedToForClassToOtherClass(currentClass: ClassOrInterfaceTypeContext, otherClass: ClassOrInterfaceTypeContext) {
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
        let commonFieldParameterKeys = DetectorUtils.getCommonParameterKeys(currentClassParameters, otherClassParameters);
        //TODO get linked parameters: currentClassParameter --> otherClassParameter

        let amountOfCommonFieldParameters = commonFieldParameterKeys.length;
        if(amountOfCommonFieldParameters < this.options.sharedFieldParametersMinimum){
            return; // DataclumpsInspection.java line 410
        }

        console.log("- Found common field parameters between classes: " + currentClassKey + " and " + otherClassKey)
        for(let commonFieldParameterKey of commonFieldParameterKeys){
            console.log("  - " + commonFieldParameterKey)
        }
    }

    private getMemberParametersFromClass(currentClass: ClassOrInterfaceTypeContext): MemberFieldParameterTypeContext[]{
        let classParameters: MemberFieldParameterTypeContext[] = [];
        let fieldParameters = currentClass.fields;
        let fieldParameterKeys = Object.keys(fieldParameters);
        for (let fieldKey of fieldParameterKeys) {
            let fieldParameter = fieldParameters[fieldKey];
            classParameters.push(fieldParameter);
        }
        return classParameters;
    }
}
