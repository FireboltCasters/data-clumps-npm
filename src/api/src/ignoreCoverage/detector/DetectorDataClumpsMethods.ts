import {DetectorUtils} from "./DetectorUtils";
import {Dictionary} from "./../UtilTypes";
import {DataClumpTypeContext} from "./../DataClumpTypes";
import {MethodTypeContext} from "./../ParsedAstTypes";
import {MyAbortController, SoftwareProjectDicts} from "./../SoftwareProject";
import {DetectorOptions, DetectorOptionsInformation} from "./Detector";

// TODO refactor this method to Detector since there is already the creation, so why not the refactoring
function getParsedValuesFromPartialOptions(rawOptions: DetectorOptions): DetectorOptions{

    function parseBoolean(value: any){
        return ""+value==="true";
    }

    rawOptions.sharedMethodParametersMinimum = parseInt(rawOptions.sharedMethodParametersMinimum)
    rawOptions.sharedMethodParametersHierarchyConsidered = parseBoolean(rawOptions.sharedMethodParametersHierarchyConsidered)
    rawOptions.sharedFieldParametersCheckIfAreSubtypes = parseBoolean(rawOptions.sharedFieldParametersCheckIfAreSubtypes);

    return rawOptions;
}

export class DetectorDataClumpsMethods {

    public options: DetectorOptions;
    public progressCallback: any;
    public abortController: MyAbortController | undefined;

    public constructor(options: DetectorOptions, progressCallback?: any, abortController?: MyAbortController){
        this.options = getParsedValuesFromPartialOptions(JSON.parse(JSON.stringify(options)));
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

        let currentClassOrInterface = MethodTypeContext.getClassOrInterface(method, softwareProjectDicts);
        if(currentClassOrInterface.auxclass){ // ignore auxclasses as are not important for our project
            return;
        }


        //console.log("Analyze method: "+method.key);
        let methodParameters = method.parameters;

        let methodParametersKeys = Object.keys(methodParameters);
        let amountOfMethodParameters = methodParametersKeys.length;
        if(amountOfMethodParameters < this.options.sharedMethodParametersMinimum){
            //console.log("Method " + method.key + " has less than " + this.options.sharedMethodParametersMinimum + " parameters. Skipping this method.")
            return;
        }

        if(!this.options.analyseMethodsWithUnknownHierarchy){
            //console.log("- check if methods hierarchy is complete")
//            let wholeHierarchyKnown = method.isWholeHierarchyKnown(softwareProjectDicts)
            let wholeHierarchyKnown = MethodTypeContext.isWholeHierarchyKnown(method, softwareProjectDicts);
            if(!wholeHierarchyKnown){ // since we dont the complete hierarchy, we can't detect if a method is inherited or not
                //console.log("-- check if methods hierarchy is complete")
                return; // therefore we stop here
            }
        }


        /* "These methods should not in a same inheritance hierarchy" */
        /* "[...] we should exclude methods inherited from parent-classes. " */
        // it is not enough to check if the classes are in the same hierarchy
        // DataclumpsInspection.java line 376
        let thisMethodIsInherited = method.isInheritedFromParentClassOrInterface(softwareProjectDicts);
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

        let classesOrInterfacesDict = softwareProjectDicts.dictClassOrInterface;
        let otherClassesOrInterfacesKeys = Object.keys(classesOrInterfacesDict);
        for (let classOrInterfaceKey of otherClassesOrInterfacesKeys) {
            let otherClassOrInterface = classesOrInterfacesDict[classOrInterfaceKey];

            if(otherClassOrInterface.auxclass){ // ignore auxclasses as are not important for our project
                return;
            }

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
        //console.log("--- otherMethod"+ otherMethod.key)

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


        if(!this.options.analyseMethodsWithUnknownHierarchy){
            //console.log("---- check otherMethod wholeHierarchyKnownOfOtherMethod");
//            let wholeHierarchyKnownOfOtherMethod = otherMethod.isWholeHierarchyKnown(softwareProjectDicts)
            let wholeHierarchyKnownOfOtherMethod = MethodTypeContext.isWholeHierarchyKnown(otherMethod, softwareProjectDicts);
            if(!wholeHierarchyKnownOfOtherMethod){ // since we dont the complete hierarchy, we can't detect if a method is inherited or not
                //console.log("Other hierarchy not full known");
                return; // therefore we stop here
            }
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
                let otherMethodIsInherited = otherMethod.isInheritedFromParentClassOrInterface(softwareProjectDicts);
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

            let fileKey = currentClassOrInterface.file_path;

            let dataClumpContext: DataClumpTypeContext = {
                type: "data_clump",
                key: fileKey+"-"+currentClassOrInterface.key+"-"+otherClassOrInterface.key+"-"+commonFieldParamterKeysAsKey, // typically the file path + class name + method name + parameter names

                from_file_path: fileKey,
                from_class_or_interface_name: currentClassOrInterface.name,
                from_class_or_interface_key: currentClassOrInterface.key,
                from_method_name: method.name,
                from_method_key: method.key,

                to_file_path: otherClassOrInterface.file_path,
                to_class_or_interface_name: otherClassOrInterface.name,
                to_class_or_interface_key: otherClassOrInterface.key,
                to_method_name: otherMethod.name,
                to_method_key: otherMethod.key,

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
