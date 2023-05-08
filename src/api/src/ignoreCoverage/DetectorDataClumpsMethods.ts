import {DetectorUtils} from "./DetectorUtils";
import {Dictionary} from "./UtilTypes";
import {DataClumpsParameterTypeRelatedToContext, DataClumpTypeContext} from "./DataClumpTypes";
import {MethodTypeContext} from "./ParsedAstTypes";
import {MyAbortController, SoftwareProjectDicts} from "./SoftwareProject";

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
    public progressCallback: any;
    public abortController: MyAbortController | undefined;

    public constructor(options: any, progressCallback?: any, abortController?: MyAbortController){
        this.options = new DetectorOptionsDataClumpsMethods(options);
        this.progressCallback = progressCallback;
        this.abortController = abortController;
    }

    public async detect(softwareProjectDicts: SoftwareProjectDicts): Promise<Dictionary<DataClumpTypeContext> | null>{
        //console.log("Detecting software project for data clumps in methods");
        let methodsDict = softwareProjectDicts.dictMethod;
        let methodKeys = Object.keys(methodsDict);
        let dataClumpsMethodParameterDataClumps: Dictionary<DataClumpTypeContext> = {};

        let amountMethods = methodKeys.length;
        let index = 0;
        for (let methodKey of methodKeys) {
            if(this.progressCallback){
                await this.progressCallback("Parameter Detector: "+methodKey, index, amountMethods);
            }
            let method = methodsDict[methodKey];
            this.analyzeMethod(method, softwareProjectDicts, dataClumpsMethodParameterDataClumps);
            if(this.abortController && this.abortController.isAbort()){
                return null;
            }
            index++;
        }
        return dataClumpsMethodParameterDataClumps;
    }

    /**
     * DataclumpsInspection.java line 370
     * @param method
     * @param methodToClassOrInterfaceDict
     * @private
     */
    private analyzeMethod(method: MethodTypeContext, softwareProjectDicts: SoftwareProjectDicts, dataClumpsMethodParameterDataClumps: Dictionary<DataClumpTypeContext>){

        let methodParameters = method.parameters;

        let methodParametersKeys = Object.keys(methodParameters);
        let amountOfMethodParameters = methodParametersKeys.length;
        if(amountOfMethodParameters < this.options.sharedMethodParametersMinimum){
            //console.log("Method " + method.key + " has less than " + this.options.sharedMethodParametersMinimum + " parameters. Skipping this method.")
            return;
        }

        /* "These methods should not in a same inheritance hierarchy" */
        /* "[...] we should exclude methods inherited from parent-classes. " */
        // it is not enough to check if the classes are in the same hierarchy
        // DataclumpsInspection.java line 376
        // We can't rely on @Override annotation because it is not mandatory: https://stackoverflow.com/questions/4822954/do-we-really-need-override-and-so-on-when-code-java
        let thisMethodIsInherited = method.isInheriatedFromParentClassOrInterface(softwareProjectDicts);
        if(thisMethodIsInherited) { // if the method is inherited
            // then skip this method
            return;
        }


        // we assume that all methods are not constructors

        this.checkParameterDataClumps(method, softwareProjectDicts, dataClumpsMethodParameterDataClumps);
    }


    /**
     * DataclumpsInspection.java line 487
     * @param method
     * @param methodToClassOrInterfaceDict
     * @private
     */
    private checkParameterDataClumps(method: MethodTypeContext, softwareProjectDicts: SoftwareProjectDicts, dataClumpsMethodParameterDataClumps: Dictionary<DataClumpTypeContext>){
        //console.log("Checking parameter data clumps for method " + method.key);

        /**
         * TODO: DataclumpsInspection.java line 493
             // avoid checking inherited methods
             if (!checkHierarchyInParametersInstances && currentMethod.findSuperMethods().length != 0) {
                return dataclumpParametherLists;
            }
         */

        let classesOrInterfacesDict = softwareProjectDicts.dictClassOrInterface;
        let otherClassesOrInterfacesKeys = Object.keys(classesOrInterfacesDict);
        for (let classOrInterfaceKey of otherClassesOrInterfacesKeys) {
            let otherClassOrInterface = classesOrInterfacesDict[classOrInterfaceKey];

            let otherMethods = otherClassOrInterface.methods;
            let otherMethodsKeys = Object.keys(otherMethods);
            for (let otherMethodKey of otherMethodsKeys) {
                let otherMethod = otherMethods[otherMethodKey];
                // DataclumpsInspection.java line 511
                if(this.abortController && this.abortController.isAbort()){
                    return;
                }
                let foundDataClumps = this.checkMethodParametersForDataClumps(method, otherMethod, softwareProjectDicts, dataClumpsMethodParameterDataClumps);
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
    private checkMethodParametersForDataClumps(method: MethodTypeContext,otherMethod: MethodTypeContext, softwareProjectDicts: SoftwareProjectDicts, dataClumpsMethodParameterDataClumps: Dictionary<DataClumpTypeContext>) {
        //console.log("Checking method parameters for data clumps for method " + method.key + " and method " + otherMethod.key)

        /**
         * TODO: DataclumpsInspection.java line 548
         * // avoid inherited methods if checkHierarchyInParametersInstances is off
         * // avoid overloaded methods
         * // avoid overrided methods
         * // avoid constructors
         */
        let isSameMethod = method.key === otherMethod.key;
        if(isSameMethod){ // avoid checking the same method
            //console.log("Method " + method.key + " is the same as method " + otherMethod.key + ". Skipping this method.")
//            console.log("Method " + method.key + " is the same as method " + otherMethod.key + ". Skipping this method.")
            return;
        }

        let currentClassOrInterfaceKey = method.classOrInterfaceKey;
        let currentClassOrInterface = softwareProjectDicts.dictClassOrInterface[currentClassOrInterfaceKey];
        let otherClassOrInterfaceKey = otherMethod.classOrInterfaceKey;
        let otherClassOrInterface = softwareProjectDicts.dictClassOrInterface[otherClassOrInterfaceKey];

        let otherMethodParameters = otherMethod.parameters;
        let otherMethodParametersKeys = Object.keys(otherMethodParameters);
        let otherMethodParametersAmount = otherMethodParametersKeys.length;
        if(otherMethodParametersAmount < this.options.sharedMethodParametersMinimum){ // avoid checking methods with less than 3 parameters
            //console.log("Method " + otherMethod.key + " has less than " + this.options.sharedMethodParametersMinimum + " parameters. Skipping this method.")
            return;
        }

        /**
         * From: "Improving the Precision of Fowler’s Definitions of Bad Smells"
         * "These methods should not in a same inheritance hierarchy and with a same method signature."
         */
        let isDifferentClassOrInterface = otherClassOrInterface.key !== currentClassOrInterface.key;
        //console.log("Method " + method.key + " is in a different class or interface than method " + otherMethod.key + ": " + isDifferentClassOrInterface)
        if(isDifferentClassOrInterface){ // if the classes are not the same
            // now we check if the methods are in the same inheritance hierarchy with the same method signature

            // DataclumpsInspection.java line 376
            // We can't rely on @Override annotation because it is not mandatory: https://stackoverflow.com/questions/4822954/do-we-really-need-override-and-so-on-when-code-java
            /* "[...] with a same method signature." */
            if(method.hasSameSignatureAs(otherMethod)) { // if the methods have the same signature
                //console.log("Method " + method.key + " has the same signature as method " + otherMethod.key + "")
                // we already checked if our method is inherited, now we check if the other method is inherited
                let otherMethodIsInherited = otherMethod.isInheriatedFromParentClassOrInterface(softwareProjectDicts);
                if(otherMethodIsInherited) { // if the method is inherited
                    // then skip this method
                    return;
                }
            }
        }



        let amountCommonParameters = this.countCommonParametersBetweenMethods(method, otherMethod);
        //console.log("Amount of common parameters: "+amountCommonParameters);
        if(amountCommonParameters < this.options.sharedMethodParametersMinimum) { // is not a data clump
            //console.log("Method " + method.key + " and method " + otherMethod.key + " have less than " + this.options.sharedMethodParametersMinimum + " common parameters. Skipping this method.")
            return;
        } else {
            //console.log("- Found data clumps between method " + method.key + " and method " + otherMethod.key);
            let commonMethodParameterPairKeys = DetectorUtils.getCommonParameterPairKeys(method.parameters, otherMethod.parameters);

            let otherClassOrInterface = softwareProjectDicts.dictClassOrInterface[otherMethod.classOrInterfaceKey];

            let [currentParameters, commonFieldParamterKeysAsKey] = DetectorUtils.getCurrentAndOtherParametersFromCommonParameterPairKeys(commonMethodParameterPairKeys, method.parameters, otherMethod.parameters, softwareProjectDicts, otherClassOrInterface, otherMethod)

            let currentClassOrInterface = softwareProjectDicts.dictClassOrInterface[method.classOrInterfaceKey];
            let currentFile = softwareProjectDicts.dictFile[currentClassOrInterface.fileKey];

            let dataClumpContext: DataClumpTypeContext = {
                type: "data_clump",
                key: currentFile.key+"-"+currentClassOrInterface.key+"-"+otherClassOrInterface.key+"-"+commonFieldParamterKeysAsKey, // typically the file path + class name + method name + parameter names
                file_path: currentFile.path,
                class_or_interface_name: currentClassOrInterface.name,
                method_name: method.name,

                data_clump_type: "parameter_data_clump", // "parameter_data_clump" or "field_data_clump"
                data_clump_data: currentParameters
            }
            dataClumpsMethodParameterDataClumps[dataClumpContext.key] = dataClumpContext;

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
