import {SoftwareProject} from "./SoftwareProject";
import {ClassOrInterfaceTypeContext, Dictionary, MethodTypeContext, MyFile, ParameterTypeContext} from "./ParsedTypes";

export class DetectorUtils {

    public static countCommonParametersBetweenMethods(method: MethodTypeContext, otherMethod: MethodTypeContext){
        let parameters = method.parameters;
        let otherParameters = otherMethod.parameters;
        let amountCommonParameters = DetectorUtils.countCommonParameters(parameters, otherParameters);
        return amountCommonParameters;
    }

    public static countCommonParameters(parameters: ParameterTypeContext[], otherParameters: ParameterTypeContext[]){
        let commonParameterKeys = DetectorUtils.getCommonParameterKeys(parameters, otherParameters);
        let amountCommonParameters = commonParameterKeys.length;
        return amountCommonParameters;
    }

    public static getCommonParameterKeys(parameters: ParameterTypeContext[], otherParameters: ParameterTypeContext[]){
        let commonParameterKeys: string[] = [];
        let parametersKeys = Object.keys(parameters);
        let otherParametersKeys = Object.keys(otherParameters);
        for (let parameterKey of parametersKeys) {
            let parameter = parameters[parameterKey];
            for (let otherParameterKey of otherParametersKeys) {
                let otherParameter = otherParameters[otherParameterKey];
                if(DetectorUtils.isCommonParameter(parameter, otherParameter)){
                    commonParameterKeys.push(parameterKey);
                }
            }
        }
        return commonParameterKeys;
    }

    public static isCommonParameter(parameter1: ParameterTypeContext, parameter2: ParameterTypeContext){
        return parameter1.name === parameter2.name && parameter1.type === parameter2.type;
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
        console.log("--- Classes or interfaces dict keys: ---");
        DetectorUtils.printDictKeys(classesOrInterfaces);
        return classesOrInterfaces;
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
