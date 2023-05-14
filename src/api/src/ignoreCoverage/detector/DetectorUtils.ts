import {SoftwareProject, SoftwareProjectDicts} from "../SoftwareProject";
import {Dictionary} from "../UtilTypes";
import {
    DataClumpsParameterFromContext,
    DataClumpsParameterToContext,
    DataClumpsParameterTypeRelatedToContext
} from "../DataClumpTypes";
import {ClassOrInterfaceTypeContext, MethodTypeContext, MyFile, ParameterTypeContext} from "../ParsedAstTypes";

type ParameterPair = {
    parameterKey: string;
    otherParameterKey: string;
}

export class DetectorUtils {

    public static countCommonParametersBetweenMethods(method: MethodTypeContext, otherMethod: MethodTypeContext){
        let parameters = method.parameters;
        let otherParameters = otherMethod.parameters;
        let amountCommonParameters = DetectorUtils.countCommonParameters(parameters, otherParameters);
        return amountCommonParameters;
    }

    public static countCommonParameters(parameters: ParameterTypeContext[], otherParameters: ParameterTypeContext[]){
        let commonParameterKeys = DetectorUtils.getCommonParameterPairKeys(parameters, otherParameters);
        let amountCommonParameters = commonParameterKeys.length;
        return amountCommonParameters;
    }


    public static getCommonParameterPairKeys(parameters: ParameterTypeContext[], otherParameters: ParameterTypeContext[]){


        let commonParameterPairKeys: ParameterPair[] = [];
        for(let parameter of parameters){
            for(let otherParameter of otherParameters){
                if(parameter.isSimilarTo(otherParameter)){
                    let commonParameterPairKey = {
                        parameterKey: parameter.key,
                        otherParameterKey: otherParameter.key
                    }
                    commonParameterPairKeys.push(commonParameterPairKey);
                }
            }
        }
        return commonParameterPairKeys;
    }

    public static getCurrentAndOtherParametersFromCommonParameterPairKeys(commonFieldParameterPairKeys: ParameterPair[], currentClassParameters: ParameterTypeContext[], otherClassParameters: ParameterTypeContext[], softwareProjectDicts, otherClass, otherMethod)
        :[Dictionary<DataClumpsParameterFromContext>, string]
    {
        let currentParameters: Dictionary<DataClumpsParameterFromContext> = {};

        let commonFieldParameterKeysAsKey = "";

        for(let commonFieldParameterPairKey of commonFieldParameterPairKeys){

            let currentFieldParameterKey = commonFieldParameterPairKey.parameterKey;
            for(let currentClassParameter of currentClassParameters){
                if(currentClassParameter.key === currentFieldParameterKey){
                    commonFieldParameterKeysAsKey += currentClassParameter.name;

                    let related_to_context: any | DataClumpsParameterTypeRelatedToContext = null;

                    let otherFieldParameterKey = commonFieldParameterPairKey.otherParameterKey;
                    for(let otherClassParameter of otherClassParameters){
                        if(otherClassParameter.key === otherFieldParameterKey){

                            let related_to_parameter: DataClumpsParameterToContext = {
                                key: otherClassParameter.key,
                                name: otherClassParameter.name,
                                type: otherClassParameter.type,
                                modifiers: otherClassParameter.modifiers
                            }

                            let otherClassFileKey = otherClass.fileKey;
                            let otherClassFile = softwareProjectDicts.dictFile[otherClassFileKey]

                            let related_to_context_found: DataClumpsParameterTypeRelatedToContext = {
                                key: otherClassFile.key+"-"+otherClass.key+"-"+commonFieldParameterKeysAsKey, // typically the file path + class name + method name + parameter names
                                file_path: otherClassFile.path,
                                class_name: otherClass.name,
                                method_name: otherMethod?.name,
                                parameter: related_to_parameter
                            }
                            related_to_context = related_to_context_found;
                        }
                    }

                    currentParameters[currentClassParameter.key] = {
                        key: currentClassParameter.key,
                        name: currentClassParameter.name,
                        type: currentClassParameter.type,
                        modifiers: currentClassParameter.modifiers,
                        related_to_context: related_to_context
                    }
                }
            }


        }
        return [currentParameters, commonFieldParameterKeysAsKey];
    }

    public static printDictKeys(dict: Dictionary<any>){
        let keys = Object.keys(dict);
        for (let key of keys) {
            console.log("- " + key)
        }
    }

    public static getClassesOrInterfacesDict(project: SoftwareProject){
        let classesOrInterfaces: Dictionary<ClassOrInterfaceTypeContext> = {};
        let filePaths = project.getFilePaths();
        for (let filePath of filePaths) {
            let file = project.getFile(filePath);
            let classesOrInterfacesFromFile = DetectorUtils.getClassesOrInterfacesFromFile(file);
            for (let classOrInterface of classesOrInterfacesFromFile) {
                classesOrInterfaces[classOrInterface.key] = classOrInterface;
            }
        }
        //console.log("--- Classes or interfaces dict keys: ---");
        //DetectorUtils.printDictKeys(classesOrInterfaces);
        return classesOrInterfaces;
    }

    public static getClassesDict(softwareProjectDicts: SoftwareProjectDicts){
        let classesOrInterfacesDict: Dictionary<ClassOrInterfaceTypeContext> = softwareProjectDicts.dictClassOrInterface;
        let classesDict: Dictionary<ClassOrInterfaceTypeContext> = {};
        let classOrInterfaceKeys = Object.keys(classesOrInterfacesDict);
        for (let classOrInterfaceKey of classOrInterfaceKeys) {
            let classOrInterface = classesOrInterfacesDict[classOrInterfaceKey];
            let type = classOrInterface.type; // ClassOrInterfaceTypeContext type is either "class" or "interface"
            if(type === "class"){ // DataclumpsInspection.java line 407
                classesDict[classOrInterfaceKey] = classOrInterface;
            }
        }
        return classesDict;
    }

    public static getClassesOrInterfacesFromFile(file: MyFile){
        let classesOrInterfaces: ClassOrInterfaceTypeContext[] = [];
        let ast = file.ast;
        let keys = Object.keys(ast);
        for (let key of keys) {
            let classOrInterface = ast[key];
            classesOrInterfaces.push(classOrInterface);
        }
        return classesOrInterfaces;
    }
}
