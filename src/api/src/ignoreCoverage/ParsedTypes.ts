export interface Dictionary<T> {
    [Key: string]: T;
}

export class ClassOrInterfaceTypeContext{
    public type: string | undefined;
    public name: string;
    public modifiers: string[] | undefined;
    public position: any;
    public fields: any;
    public methods: any;

    //dict of classes with name as key
    public classes: Dictionary<ClassOrInterfaceTypeContext>;
    public interfaces: Dictionary<ClassOrInterfaceTypeContext>;

    public constructor(name){
        this.name = name;
        this.modifiers = [];
        this.fields = {};
        this.methods = {};
        this.classes = {};
        this.interfaces = {};
    }
}

export class FieldTypeContext{
    public names: string[];
    public position: any;
    public type: string | undefined;
    public modifiers: string[];

    public constructor(){
        this.names = [];
        this.modifiers = [];
    }
}

export class MethodParameterTypeContext{
    public type: string | undefined;
    public name: string | undefined;
    public position: any;
}

export class MethodTypeContext{
    public type: string | undefined;
    public name: string | undefined;
    public modifiers: string[];
    public returnType: string | undefined;
    public parameters: MethodParameterTypeContext[];
    public position: any;

    public constructor(){
        this.modifiers = [];
        this.parameters = [];
    }
}


