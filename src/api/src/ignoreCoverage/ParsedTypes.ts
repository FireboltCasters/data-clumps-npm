export interface Dictionary<T> {
    [Key: string]: T;
}

export class ParameterTypeContext {
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

export class ClassOrInterfaceTypeContext extends ParameterTypeContext{
    public modifiers: string[] | undefined;
    public fields: Dictionary<MemberFieldTypeContext>;
    public methods: Dictionary<MethodTypeContext>;

    public implements: Dictionary<ClassOrInterfaceTypeContext>;
    public extends: Dictionary<ClassOrInterfaceTypeContext>; // Languages that support multiple inheritance include: C++, Common Lisp

    //dict of classes with name as key
    public innerDefinedClasses: Dictionary<ClassOrInterfaceTypeContext>;
    public innerDefinedInterfaces: Dictionary<ClassOrInterfaceTypeContext>;

    public constructor(key, name, type){
        super(key, name, type);
        this.name = name;
        this.modifiers = [];
        this.fields = {};
        this.methods = {};
        this.innerDefinedClasses = {};
        this.innerDefinedInterfaces = {};
        this.implements = {};
        this.extends = {};
    }
}

export class MemberFieldTypeContext extends ParameterTypeContext{
    public parameters: ParameterTypeContext[];
    public modifiers: string[];

    public constructor(key, name, type){
        super(key, name, type);
        this.parameters = [];
        this.modifiers = [];
    }
}

export class MethodTypeContext extends ParameterTypeContext{
    public modifiers: string[];
    public returnType: string | undefined;
    public parameters: ParameterTypeContext[];

    public constructor(key, name, type){
        super(key, name, type);
        this.modifiers = [];
        this.parameters = [];
    }
}


