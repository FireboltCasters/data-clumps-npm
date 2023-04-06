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

    //dict of classes with name as key
    public classes: Dictionary<ClassOrInterfaceTypeContext>;
    public interfaces: Dictionary<ClassOrInterfaceTypeContext>;

    public constructor(key, name, type){
        super(key, name, type);
        this.name = name;
        this.modifiers = [];
        this.fields = {};
        this.methods = {};
        this.classes = {};
        this.interfaces = {};
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

export class MethodParameterTypeContext extends ParameterTypeContext{

}

export class MethodTypeContext extends ParameterTypeContext{
    public modifiers: string[];
    public returnType: string | undefined;
    public parameters: MethodParameterTypeContext[];

    public constructor(key, name, type){
        super(key, name, type);
        this.modifiers = [];
        this.parameters = [];
    }
}


