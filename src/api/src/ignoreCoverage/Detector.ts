import {SoftwareProject} from "./SoftwareProject";
import {
    ClassOrInterfaceTypeContext,
    MemberFieldTypeContext,
    MethodParameterTypeContext,
    MethodTypeContext, ParameterTypeContext
} from "./ParsedTypes";

export class DetectorOptions {
    public sharedDataFieldsMinimum: number = 3;
    public sharedDataFieldsHierarchyConsidered: boolean = false;
    public sharedMethodParametersMinimum: number = 3;
    public sharedMethodParametersHierarchyConsidered: boolean = false;

    public constructor(options: any){
        let keys = Object.keys(options || {});
        for (let key of keys) {
            // check if this key exists in this class
            if (this.hasOwnProperty(key)) {
                this[key] = options[key]; // set the value
            }
        }
    }
}

export class Detector {

    public options: DetectorOptions;

    public constructor(options: any){
        this.options = new DetectorOptions(options);
    }

    public detect(project: SoftwareProject){
        console.log("Detecting software project for data clumps");
        let commonMethodParameters = this.getCommonMethodParametersForSoftwareProject(project);
        console.log("Common method parameters: ");
        console.log(JSON.stringify(commonMethodParameters, null, 2));
    }

    private getCommonMethodParametersForSoftwareProject(project: SoftwareProject){
        let commonMethodParameters: any[] = [];
        let classesOrInterfaces = this.getClassesOrInterfaces(project);

        return commonMethodParameters;
    }

    private getClassesOrInterfaces(project: SoftwareProject){
        let classesOrInterfaces: ClassOrInterfaceTypeContext[] = [];
        let filePaths = project.getFilePaths();
        for (let filePath of filePaths) {
            let file = project.getFile(filePath);
            let ast = file.ast;
            let keys = Object.keys(ast);
            for (let key of keys) {
                let classOrInterface = ast[key];
                classesOrInterfaces.push(classOrInterface);
            }
        }

        return classesOrInterfaces;
    }




    private isCommonParameter(parameter1: ParameterTypeContext, parameter2: ParameterTypeContext){
        return parameter1.name === parameter2.name && parameter1.type === parameter2.type;
    }

}
