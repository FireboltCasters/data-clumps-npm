import {SoftwareProject} from "./SoftwareProject";
import {ClassOrInterfaceTypeContext, DataClumpTypeContext, Dictionary, MethodTypeContext} from "./ParsedAstTypes";
import {DetectorUtils} from "./DetectorUtils";
import {SoftwareProjectDicts} from "./Detector";

export class DetectorOptionsDataClumpsMethods {
    public sharedMethodParametersMinimum: number = 3;
    public sharedMethodParametersHierarchyConsidered: boolean = false;

    public constructor(options: any | DetectorOptionsDataClumpsMethods){
        let keys = Object.keys(options || {});
        for (let key of keys) {
            // check if this key exists in this class
            if (this.hasOwnProperty(key)) {
                this[key] = options[key]; // set the value
            }
        }
    }
}

export class DetectorDataClumpsMethods {

    public options: DetectorOptionsDataClumpsMethods;

    public constructor(options: any){
        this.options = new DetectorOptionsDataClumpsMethods(options);
    }

    public detect(softwareProjectDicts: SoftwareProjectDicts){
        console.log("Detecting software project for data clumps in methods");
        let methodsDict = softwareProjectDicts.dictMethod;
        let methodKeys = Object.keys(methodsDict);
        for (let methodKey of methodKeys) {
            let method = methodsDict[methodKey];
            this.analyzeMethod(method, softwareProjectDicts);
        }
    }

    /**
     * DataclumpsInspection.java line 370
     * @param method
     * @param methodToClassOrInterfaceDict
     * @private
     */
    private analyzeMethod(method: MethodTypeContext, softwareProjectDicts: SoftwareProjectDicts){

        let methodParameters = method.parameters;
        let classOrInterface = softwareProjectDicts.dictClassOrInterface[method.classOrInterfaceKey];

        /**
         * TODO: DataclumpsInspection.java line 376
         * exclude methods inherited from parent class
         if (method.hasAnnotation("java.lang.Override")) {
                    return;
         }
         */

        let methodParametersKeys = Object.keys(methodParameters);
        let amountOfMethodParameters = methodParametersKeys.length;
        if(amountOfMethodParameters < this.options.sharedMethodParametersMinimum){
            //console.log("Method " + method.key + " has less than " + this.options.sharedMethodParametersMinimum + " parameters. Skipping this method.")
            return;
        }
        // we assume that all methods are not constructors

        this.checkParameterDataClumps(method, softwareProjectDicts);
    }


    /**
     * DataclumpsInspection.java line 487
     * @param method
     * @param methodToClassOrInterfaceDict
     * @private
     */
    private checkParameterDataClumps(method: MethodTypeContext, softwareProjectDicts: SoftwareProjectDicts){
        //console.log("Checking parameter data clumps for method " + method.key);
        let currentClassOrInterface = softwareProjectDicts.dictClassOrInterface[method.classOrInterfaceKey];

        /**
         * TODO: DataclumpsInspection.java line 493
             // avoid checking inherited methods
             if (!checkHierarchyInParametersInstances && currentMethod.findSuperMethods().length != 0) {
                return dataclumpParametherLists;
            }
         */

        let classesOrInterfacesDict = softwareProjectDicts.dictClassOrInterface;
        let classesOrInterfacesKeys = Object.keys(classesOrInterfacesDict);
        for (let classOrInterfaceKey of classesOrInterfacesKeys) {
            let classOrInterface = classesOrInterfacesDict[classOrInterfaceKey];
            let isSameClassOrInterface = classOrInterface.key === currentClassOrInterface.key;

            let methods = classOrInterface.methods;
            let methodsKeys = Object.keys(methods);
            for (let methodKey of methodsKeys) {
                let otherMethod = methods[methodKey];
                // DataclumpsInspection.java line 511
                let foundDataClumps = this.checkMethodParametersForDataClumps(method, otherMethod, currentClassOrInterface, classesOrInterfacesDict, isSameClassOrInterface);
                // TODO: DataclumpsInspection.java line 512
            }
        }
    }


    /**
     * DataclumpsInspection.java line 547
     * @param method
     * @param methodParametersDict
     * @param currentClassOrInterface
     * @param classesOrInterfacesDict
     * @param isSameClassOrInterface
     * @private
     */
    private checkMethodParametersForDataClumps(method: MethodTypeContext,otherMethod: MethodTypeContext, currentClassOrInterface: ClassOrInterfaceTypeContext, classesOrInterfacesDict: Dictionary<ClassOrInterfaceTypeContext>, isSameClassOrInterface: boolean) {
        /**
         * TODO: DataclumpsInspection.java line 548
         * // avoid inherited methods if checkHierarchyInParametersInstances is off
         * // avoid overloaded methods
         * // avoid overrided methods
         * // avoid constructors
         */
        let isSameMethod = method.key === otherMethod.key;
        if(isSameMethod){ // avoid checking the same method
//            console.log("Method " + method.key + " is the same as method " + otherMethod.key + ". Skipping this method.")
            return;
        }
        let otherMethodParameters = otherMethod.parameters;
        let otherMethodParametersKeys = Object.keys(otherMethodParameters);
        let otherMethodParametersAmount = otherMethodParametersKeys.length;
        if(otherMethodParametersAmount < this.options.sharedMethodParametersMinimum){ // avoid checking methods with less than 3 parameters
  //          console.log("Method " + otherMethod.key + " has less than " + this.options.sharedMethodParametersMinimum + " parameters. Skipping this method.")
            return;
        }
        let amountCommonParameters = this.countCommonParametersBetweenMethods(method, otherMethod);
        if(amountCommonParameters < this.options.sharedMethodParametersMinimum) { // is not a data clump
            //console.log("- No Data Clumps betweeen Method " + method.key + " and " + otherMethod.key)
            return;
        } else {
            console.log("- Found data clumps between method " + method.key + " and method " + otherMethod.key);
            let commonParameterKeys = DetectorUtils.getCommonParameterPairKeys(method.parameters, otherMethod.parameters);
            console.log(commonParameterKeys)
        }
    }

    private countCommonParametersBetweenMethods(method: MethodTypeContext, otherMethod: MethodTypeContext){
        //console.log("Counting common parameters between method " + method.key + " and method " + otherMethod.key)
        let parameters = method.parameters;
        let otherParameters = otherMethod.parameters;
        let amountCommonParameters = DetectorUtils.countCommonParameters(parameters, otherParameters);
        return amountCommonParameters;
    }

}
