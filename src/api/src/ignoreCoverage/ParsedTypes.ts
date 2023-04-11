export interface Dictionary<T> {
    [Key: string]: T;
}

export class AstElementTypeContext {
    public name: string;
    public key: string;
    public type: string;
    public position: any;
    public constructor(key, name, type){
        this.key = key;
        this.name = name;
        this.type = type;
    }
}

export class ParameterTypeContext extends AstElementTypeContext{
    public constructor(key, name, type){
        super(key, name, type);
    }
}

export class ParameterTypeContextUtils{
    public static parameterToString(parameterTypeContext: ParameterTypeContext){
        return `{${parameterTypeContext.type} ${parameterTypeContext.name}}`;
    }

    public static parametersToString(parameters: ParameterTypeContext[]){
        //TODO: sort parameters by name
        let orderedParameters = parameters.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        let parametersString = "[";
        for(let i = 0; i < orderedParameters.length; i++){
            parametersString += ParameterTypeContextUtils.parameterToString(orderedParameters[i]);
            if(i < orderedParameters.length - 1){
                parametersString += ", ";
            }
        }
        parametersString += "]";
        return parametersString;
    }
}

export class MyFile{
    public content: string;
    public path: string;
    public ast: Dictionary<ClassOrInterfaceTypeContext>;
    public constructor(path: string, content: string){
        this.content = content;
        this.path = path;
        this.ast = {};
    }
}

export class ClassOrInterfaceTypeContext extends AstElementTypeContext{
    public modifiers: string[] | undefined;
    public fields: Dictionary<MemberFieldParameterTypeContext>;
    public methods: Dictionary<MethodTypeContext>;
    public fileKey: string;

    public implements: Dictionary<ClassOrInterfaceTypeContext>;
    public extends: Dictionary<ClassOrInterfaceTypeContext>; // Languages that support multiple inheritance include: C++, Common Lisp

    //dict of classes with name as key
    public innerDefinedClasses: Dictionary<ClassOrInterfaceTypeContext>;
    public innerDefinedInterfaces: Dictionary<ClassOrInterfaceTypeContext>;

    public constructor(key, name, type, file: MyFile){
        super(file.path+"/"+type+"/"+key, name, type);
        this.fileKey = file.path;
        this.name = name;
        this.modifiers = [];
        this.fields = {};
        this.methods = {};
        this.innerDefinedClasses = {};
        this.innerDefinedInterfaces = {};
        this.implements = {}; //TODO parse what interface we implement
        this.extends = {}; //TODO parse what class we extend
    }

    /**
     * TODO: implement this
     * PsiUtils.java line 362
     */
    public hasCommonHierarchyWith(otherClass: ClassOrInterfaceTypeContext){
        return false;
    }
}

export class MemberFieldParameterTypeContext extends ParameterTypeContext{
    public memberFieldKey: string | undefined;
    public relatedToMemberFieldParameterKeysDict: Dictionary<string> = {};

    public constructor(key, name, type, classOrInterface: ClassOrInterfaceTypeContext){
        super(classOrInterface.key+"/"+"memberParameter"+"/"+key, name, type);
    }
}

export class MemberFieldTypeContext extends AstElementTypeContext{
    public parameters: MemberFieldParameterTypeContext[];
    public classOrInterfaceKey: string;
    public modifiers: string[];

    public constructor(key, name, type, classOrInterface: ClassOrInterfaceTypeContext){
        super(classOrInterface.key+"/memberField/"+key, name, type);
        this.parameters = [];
        this.modifiers = [];
        this.classOrInterfaceKey = classOrInterface.key;
    }
}

export class MethodParameterTypeContext extends ParameterTypeContext{
    public methodKey: string;

    public constructor(key, name, type, method: MethodTypeContext){
        super(method.key+"/"+key, name, type);
        this.methodKey = method.key;
    }
}

export class MethodTypeContext extends AstElementTypeContext{
    public modifiers: string[];
    public returnType: string | undefined;
    public parameters: MethodParameterTypeContext[];
    public classOrInterfaceKey: string;

    public constructor(key, name, type, classOrInterface: ClassOrInterfaceTypeContext){
        super(classOrInterface.key+"/method/"+key, name, type);
        this.modifiers = [];
        this.parameters = [];
        this.classOrInterfaceKey = classOrInterface.key;
    }
}

export class DataClumpsParameterTypeContext {
    // Data clumps parameter pairs may not have the same name or type (e.g. int a, Integer a) (e.g. int x, int xPos)
    // Therefore a detected data clump should tell us, which parameter of which method is the data clump
    // example: Data Clumps 1: (int x, in method1 matches int xPos, in method2)
    public sourceParameter: ParameterTypeContext;
    public targetParameter: ParameterTypeContext;

    constructor(sourceParameter: ParameterTypeContext, targetParameter: ParameterTypeContext){
        this.sourceParameter = sourceParameter;
        this.targetParameter = targetParameter;
    }
}

export class DataClumpsTypeContext {
    //TODO: implement this return type which gives information about all the data clumps in the project
    // For all method data clumps
    // For all field data clumps


}

