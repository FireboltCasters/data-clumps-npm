import {SoftwareProject} from "./SoftwareProject";
import {
    ClassOrInterfaceTypeContext,
    Dictionary,
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
        this.analyzeAllClasses(classesDict);

        return commonFieldParameters;
    }

    private analyzeAllClasses(classesDict: Dictionary<ClassOrInterfaceTypeContext>){
        let classKeys = Object.keys(classesDict);
        for (let classKey of classKeys) {
            let currentClass = classesDict[classKey];// DataclumpsInspection.java line 404
            this.analyzeClass(currentClass, classesDict);
        }
    }

    /**
     * DataclumpsInspection.java line 405
     */
    private analyzeClass(currentClass: ClassOrInterfaceTypeContext, classesDict: Dictionary<ClassOrInterfaceTypeContext>){
        let fields = currentClass.fields;
        let fieldKeys = Object.keys(fields);
        let amountOfFields = fieldKeys.length;
        if(amountOfFields < this.options.sharedFieldParametersMinimum){
            return;
        }
        let otherClassKeys = Object.keys(classesDict);
        for (let otherClassKey of otherClassKeys) {
            let otherClass = classesDict[otherClassKey];
            this.analyzeClassWithOtherClass(currentClass, otherClass);
        }
    }

    private analyzeClassWithOtherClass(currentClass: ClassOrInterfaceTypeContext, otherClass: ClassOrInterfaceTypeContext) {
        // DataclumpsInspection.java line 410
        let currentClassKey = currentClass.key
        let otherClassKey = otherClass.key;
        if(currentClassKey === otherClassKey) {
            return; // skip the same class // DataclumpsInspection.java line 411
        }

        let hasCommonHierarchy = this.hasCommonHierarchy(currentClass, otherClass);
        if(hasCommonHierarchy){ // if the classes have a common hierarchy
            let checkIfHaveCommonHierarchy = this.options.sharedFieldParametersCheckIfHaveCommonHierarchy;
            if(!checkIfHaveCommonHierarchy){ // and we don't want to check them if they have a common hierarchy
                // then skip this class pair
                return; // DataclumpsInspection.java line 412
            }
        }

        let currentClassParameters = this.getParametersFromClass(currentClass);
        let otherClassParameters = this.getParametersFromClass(otherClass);
        let commonFieldParameterKeys = DetectorUtils.getCommonParameterKeys(currentClassParameters, otherClassParameters);

        let amountOfCommonFieldParameters = commonFieldParameterKeys.length;
        if(amountOfCommonFieldParameters < this.options.sharedFieldParametersMinimum){
            return; // DataclumpsInspection.java line 410
        }

        console.log("- Found common field parameters between classes: " + currentClassKey + " and " + otherClassKey)
        console.log(commonFieldParameterKeys)
    }

    private getParametersFromClass(currentClass: ClassOrInterfaceTypeContext): ParameterTypeContext[]{
        //console.log("Getting parameters from class: " + currentClass.key)
        let classParameters: ParameterTypeContext[] = [];
        let fields = currentClass.fields;
        let fieldKeys = Object.keys(fields);
        for (let fieldKey of fieldKeys) {
            //console.log("Getting parameters from field: " + fieldKey)
            let field = fields[fieldKey];
            let parameters = field.parameters;
            classParameters.push(...parameters);
        }
        return classParameters;
    }

    private hasCommonHierarchy(currentClass: ClassOrInterfaceTypeContext, otherClass: ClassOrInterfaceTypeContext){
        //TODO: implement
        return false;
    }
}
