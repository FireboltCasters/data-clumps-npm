import {Dictionary} from "./UtilTypes";
import {SoftwareProjectDicts} from "./SoftwareProject";

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
    public modifiers: string[] | undefined;

    public constructor(key, name, type, modifiers){
        super(key, name, type);
        this.modifiers = modifiers;
    }

    public isSimilarTo(otherParameter: ParameterTypeContext){
        //TODO: we need to check the similarity of the name
        // https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=5328371 page 164
        // not only the data fields with same
        // signatures (same name, same data type, same access
        // modifier), but also data fields with similar signatures (similar
        // name, same data type, same access modifier)
        let sameModifiers = this.haveSameModifiers(otherParameter);
        let sameType = this.type === otherParameter.type;
        let sameName = this.name === otherParameter.name;
        return sameModifiers && sameType && sameName;
    }

    public haveSameModifiers(otherParameter: ParameterTypeContext){
        let sameModifiers = true;
        let bothHaveModifiers = this.modifiers !== undefined && otherParameter.modifiers !== undefined;
        if(bothHaveModifiers){
            // check if both have all modifiers but the order can be different
            // @ts-ignore
            let weHaveAllModifiersOtherHas = this.allKeysInArray(this.modifiers, otherParameter.modifiers);
            // @ts-ignore
            let otherHasAllModifiersWeHave = this.allKeysInArray(otherParameter.modifiers, this.modifiers);
            sameModifiers = weHaveAllModifiersOtherHas && otherHasAllModifiersWeHave;
        } else {
            let bothHaveNoModifiers = this.modifiers === undefined && otherParameter.modifiers === undefined;
            if(bothHaveNoModifiers){
                sameModifiers = true;
            } else {
                sameModifiers = false;
            }
        }
        return sameModifiers;
    }

    private allKeysInArray(array1: string[], array2: string[]){
        for(let i = 0; i < array1.length; i++){
            let key = array1[i];
            if(array2.indexOf(key) === -1){
                return false;
            }
        }
        return true;
    }
}

export class ParameterTypeContextUtils{
    public static parameterToString(parameterTypeContext: ParameterTypeContext){
        return `{${parameterTypeContext.type} ${parameterTypeContext.name}}`;
    }

    public static parametersToString(parameters: ParameterTypeContext[]){
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

//TODO add MyDirectory class

export class MyFile{
    public content: string;
    public path: string;
    public key: string;
    public ast: Dictionary<ClassOrInterfaceTypeContext>;
    public constructor(path: string, content: string){
        this.content = content;
        this.path = path;
        this.key = path;
        this.ast = {};
    }

    public getFileExtension(){
        return MyFile.getFileExtension(this.path);
    }

    public getPathToFolder(){
        let pathToFile = this.path.split("/").slice(0, -1).join("/");
        if(pathToFile !== ""){
            pathToFile += "/";
        }
        return pathToFile;
    }

    public static getFileExtension(filePath: string) {
        if(!filePath) return null;
        if(filePath.indexOf('.') === -1) return null;
        let fileExtension = filePath.split('.').pop();
        return fileExtension;
    }
}

export class ClassOrInterfaceTypeContext extends AstElementTypeContext{
    public modifiers: string[] | undefined;
    public fields: Dictionary<MemberFieldParameterTypeContext>;
    public methods: Dictionary<MethodTypeContext>;
    public fileKey: string;

    public implements: Dictionary<string>;
    public extends: Dictionary<string>; // Languages that support multiple inheritance include: C++, Common Lisp

    public definedInClassOrInterfaceTypeKey: string | undefined; // key of the class or interface where this class or interface is defined

    //dict of classes with name as key
    public innerDefinedClasses: Dictionary<ClassOrInterfaceTypeContext>;
    public innerDefinedInterfaces: Dictionary<ClassOrInterfaceTypeContext>;

    public constructor(key, name, type, file: MyFile){
        super(key, name, type);
        this.fileKey = file.key;
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
     * This means, that our or the other class is a subclass of the other
     * It does not mean that they have a common hierarchy
     * The function is called isSubclassOf if they are classes and isSubinterfaceOf if they are interfaces
     * Together they are called isSubtypeOf
     * PsiUtils.java line 362
     */
    public isSubtypeOf(otherClass: ClassOrInterfaceTypeContext, softwareProjectDicts: SoftwareProjectDicts){
        // TODO: do we need PsiUtils.java line 360

        console.log("isSubtypeOf")
        console.log("this.key: "+this.key)
        console.log("otherClass.key: "+otherClass.key)

        // PsiUtils.java line 363
        let thisHierarchy = this.getHierarchyForSuperClassesAndImplementedInterfaces(softwareProjectDicts);
        let otherHierarchy = otherClass.getHierarchyForSuperClassesAndImplementedInterfaces(softwareProjectDicts);

        console.log("thisHierarchy: ");
        console.log(thisHierarchy);
        console.log("otherHierarchy: ");
        console.log(otherHierarchy);

        // PsiUtils.java line 371 is not correct, because it checks if they have a common hierarchy

        let areWeInOtherHierarchy = false;
        for(let otherOrParents of otherHierarchy){
            if(otherOrParents.key === this.key){
                areWeInOtherHierarchy = true;
                break;
            }
        }

        let areTheyInOurHierarchy = false;
        for(let thisOrParents of thisHierarchy){
            if(thisOrParents.key === otherClass.key){
                areTheyInOurHierarchy = true;
                break;
            }
        }

        let isSubtypeOf = areWeInOtherHierarchy || areTheyInOurHierarchy;

        return isSubtypeOf;
    }



    public getHierarchyForSuperClassesAndImplementedInterfaces(softwareProjectDicts: SoftwareProjectDicts){
        let superClassesAndInterfacesDict = this.getSuperClassesAndInterfacesDict(softwareProjectDicts);
        let thisHierarchy: ClassOrInterfaceTypeContext[] = [this];
        let superClassesAndInterfacesKeys = Object.keys(superClassesAndInterfacesDict);
        for(let i = 0; i < superClassesAndInterfacesKeys.length; i++){
            let superClassOrInterfaceKey = superClassesAndInterfacesKeys[i];
            let superClassOrInterface = superClassesAndInterfacesDict[superClassOrInterfaceKey];
            thisHierarchy = thisHierarchy.concat(superClassOrInterface.getHierarchyForSuperClassesAndImplementedInterfaces(softwareProjectDicts));
        }

        return thisHierarchy;
    }

    public getSuperClassesAndInterfacesDict(softwareProjectDicts: SoftwareProjectDicts){
        let superClassesAndInterfaces: Dictionary<ClassOrInterfaceTypeContext> = {};

        let thisSuperClassesDict = this.getSuperClassesOrInterfacesDict(softwareProjectDicts, "extends", {})
        let thisSuperClassesKeys = Object.keys(thisSuperClassesDict)
        for(let i = 0; i < thisSuperClassesKeys.length; i++){
            let superClassKey = thisSuperClassesKeys[i];
            let superClass = thisSuperClassesDict[superClassKey];
            superClassesAndInterfaces[superClassKey] = superClass;
        }

        let thisImplementedInterfacesDict = this.getSuperClassesOrInterfacesDict(softwareProjectDicts, "implements", {})
        let thisImplementedInterfacesKeys = Object.keys(thisImplementedInterfacesDict)
        for(let i = 0; i < thisImplementedInterfacesKeys.length; i++){
            let implementedInterfaceKey = thisImplementedInterfacesKeys[i];
            let implementedInterface = thisImplementedInterfacesDict[implementedInterfaceKey];
            superClassesAndInterfaces[implementedInterfaceKey] = implementedInterface;
        }

        return superClassesAndInterfaces;
    }

    public getSuperClassesOrInterfacesDict(softwareProjectDicts: SoftwareProjectDicts, extendsOrInterfacesFieldKey: string, passedSuperClasses: Dictionary<ClassOrInterfaceTypeContext>){
        let currentClass = this;
        let extendsDict = currentClass[extendsOrInterfacesFieldKey];
        let extendsKeys = Object.keys(extendsDict);

        for(let i = 0; i < extendsKeys.length; i++){
            let extendsKey = extendsKeys[i];
            let extendsClassOrInterfaceKey = extendsDict[extendsKey];
            let superClassOrInterface = softwareProjectDicts.dictClassOrInterface[extendsClassOrInterfaceKey]
            if(!superClassOrInterface){
                //console.log("ERROR: superClass not found for key: "+extendsClassOrInterfaceKey)
                // javax.swing.JPanel // so standard bibs cant be found
                // org.tigris.gef.undo.UndoableAction // and custom bibs cant be found
                // TODO we should mark them as superclasses and interfaces so we can still use them for the hierarchy
                let name = extendsClassOrInterfaceKey.split(".").pop();
                passedSuperClasses[extendsClassOrInterfaceKey] = new ClassOrInterfaceTypeContext(extendsClassOrInterfaceKey, name, "unkown", new MyFile("", ""));
            } else {
                if(!!passedSuperClasses){
                    if(!passedSuperClasses[superClassOrInterface.key]){
                        // save the class or interface in the dict
                        passedSuperClasses[superClassOrInterface.key] = superClassOrInterface;

                        // get the superclasses of the superclass
                        superClassOrInterface.getSuperClassesOrInterfacesDict(softwareProjectDicts, extendsOrInterfacesFieldKey, passedSuperClasses);
                    } else {
//                        console.log("ERROR: superClass already in passedSuperClasses: "+superClass.key);
                    }
                }
            }
        }
        return passedSuperClasses;
    }
}

export class MemberFieldParameterTypeContext extends ParameterTypeContext{
    public memberFieldKey: string | undefined;
    public classOrInterfaceKey: string;

    public constructor(key, name, type, modifiers, classOrInterface: ClassOrInterfaceTypeContext){
        super(classOrInterface.key+"/"+"memberParameter"+"/"+key, name, type, modifiers);
        this.classOrInterfaceKey = classOrInterface.key;
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

    public constructor(key, name, type, modifiers, method: MethodTypeContext){
        super(method.key+"/"+key, name, type, modifiers);
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

    public getMethodSignature(){
        let methodSignature = this.name+"(";
        for(let i = 0; i < this.parameters.length; i++){
            let parameter = this.parameters[i];
            methodSignature += parameter.type;
            if(i < this.parameters.length - 1){
                methodSignature += ", ";
            }
        }
        methodSignature += ")";
        return methodSignature;
    }

    public hasSameSignatureAs(otherMethod: MethodTypeContext){
        let hasSameSignature = true;

        if(this.parameters.length !== otherMethod.parameters.length){
            hasSameSignature = false;
        } else {
            let thisMethodSignature = this.getMethodSignature();
            let otherMethodSignature = otherMethod.getMethodSignature();
            if(thisMethodSignature !== otherMethodSignature){
                hasSameSignature = false;
            }
        }
        return hasSameSignature;
    }

    public isInheriatedFromParentClassOrInterface(softwareProjectDicts: SoftwareProjectDicts){
        let isInheriated = false;
        let classOrInterface = softwareProjectDicts.dictClassOrInterface[this.classOrInterfaceKey];
        if(classOrInterface){
            let superClassesOrInterfacesDict = classOrInterface.getSuperClassesAndInterfacesDict(softwareProjectDicts);
            let superClassesOrInterfacesKeys = Object.keys(superClassesOrInterfacesDict);
            for(let superClassOrInterfaceKey of superClassesOrInterfacesKeys){
                let superClassOrInterface = superClassesOrInterfacesDict[superClassOrInterfaceKey];
                if(!!superClassOrInterface){
                    let superClassOrInterfaceMethodsDict = superClassOrInterface.methods;
                    let superClassOrInterfaceMethodsKeys = Object.keys(superClassOrInterfaceMethodsDict);
                    for(let superClassOrInterfaceMethodsKey of superClassOrInterfaceMethodsKeys){
                        let superClassOrInterfaceMethod = superClassOrInterfaceMethodsDict[superClassOrInterfaceMethodsKey];
                        if(superClassOrInterfaceMethod.hasSameSignatureAs(this)){
                            isInheriated = true;
                            return isInheriated;
                        }
                    }
                }
            }
        }
        return isInheriated;
    }
}
