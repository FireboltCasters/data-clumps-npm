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
    public ignore: boolean;

    public constructor(key, name, type, modifiers, ignore){
        super(key, name, type);
        this.modifiers = modifiers;
        this.ignore = ignore;
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

    public implements: string[]
    public extends: string[] // Languages that support multiple inheritance include: C++, Common Lisp

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
        this.implements = [];
        this.extends = [];
    }

    public getSuperClassesAndInterfacesKeys(softwareProjectDicts: SoftwareProjectDicts, recursive: boolean): any[] {
   //     console.log("getSuperClassesAndInterfacesKeys for: "+this.key);
     //   console.log(this);
        let foundKeys: Dictionary<string | null> = {};

        let extendingClassesOrInterfacesKeys: string[] = []
        let extendingKeys = this.extends;
        for(let extendingKey of extendingKeys){
            extendingClassesOrInterfacesKeys.push(extendingKey)
        }
        let implementsKeys = this.implements;
        for(let implementsKey of implementsKeys){
            extendingClassesOrInterfacesKeys.push(implementsKey)
        }

      //  console.log("implements and extends");
    //    console.log(JSON.parse(JSON.stringify(extendingClassesOrInterfacesKeys)))
        for(let extendingClassesOrInterfacesKey of extendingClassesOrInterfacesKeys){
            let newFinding = !foundKeys[extendingClassesOrInterfacesKey];
            if(newFinding){
                foundKeys[extendingClassesOrInterfacesKey] = extendingClassesOrInterfacesKey;
                if(recursive){
                    let foundClassOrInterface = softwareProjectDicts.dictClassOrInterface[extendingClassesOrInterfacesKey];
                    if(!!foundClassOrInterface){
  //                      console.log("--> Recursive call for: "+foundClassOrInterface.key)
                        let recursiveFindings = foundClassOrInterface.getSuperClassesAndInterfacesKeys(softwareProjectDicts, recursive);
//                        console.log("<-- Recursive call endet");
                        for(let recursiveFindingKey of recursiveFindings){
                            let newRecursiveFinding = !foundKeys[recursiveFindingKey];
                            if(newRecursiveFinding){
                                foundKeys[recursiveFindingKey] = recursiveFindingKey;
                            }
                        }
                    }
                }
            }
        }

        let superClassesAndInterfacesKeys = Object.keys(foundKeys);
        //console.log("Returning: ")
        //console.log(superClassesAndInterfacesKeys)
        return superClassesAndInterfacesKeys;
    }
}

export class MemberFieldParameterTypeContext extends ParameterTypeContext{
    public memberFieldKey: string | undefined;
    public classOrInterfaceKey: string;

    public constructor(key, name, type, modifiers, ignore, classOrInterface: ClassOrInterfaceTypeContext){
        super(classOrInterface.key+"/"+"memberParameter"+"/"+key, name, type, modifiers, ignore);
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

    public constructor(key, name, type, modifiers, ignore, method: MethodTypeContext){
        super(method.key+"/"+key, name, type, modifiers, ignore);
        this.methodKey = method.key;
    }
}

export class MethodTypeContext extends AstElementTypeContext{
    public modifiers: string[];
    public overrideAnnotation: boolean
    public returnType: string | undefined;
    public parameters: MethodParameterTypeContext[];
    public classOrInterfaceKey: string;

    public constructor(key, name, type, overrideAnnotation: boolean, classOrInterface: ClassOrInterfaceTypeContext){
        super(classOrInterface.key+"/method/"+key, name, type);
        this.modifiers = [];
        this.parameters = [];
        this.classOrInterfaceKey = classOrInterface.key;
        this.overrideAnnotation = overrideAnnotation;
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

    public isWholeHierarchyKnown(softwareProjectDicts: SoftwareProjectDicts){
        // TODO: check if we can find all parents
        //console.log("isWholeHierarchyKnown?")
        //console.log("softwareProjectDicts.dictClassOrInterface")
        //console.log(softwareProjectDicts.dictClassOrInterface);

        let currentClassOrInterfaceKey = this.classOrInterfaceKey;
        let currentClassOrInterface = softwareProjectDicts.dictClassOrInterface[currentClassOrInterfaceKey];
        let superClassesOrInterfacesKeys = currentClassOrInterface.getSuperClassesAndInterfacesKeys(softwareProjectDicts, true);
        //console.log(superClassesOrInterfacesKeys);
        for(let superClassesOrInterfaceKey of superClassesOrInterfacesKeys){
            let superClassesOrInterface = softwareProjectDicts.dictClassOrInterface[superClassesOrInterfaceKey];
            if(!superClassesOrInterface){
                //console.log("Found no superClassesOrInterface for: "+superClassesOrInterfaceKey);
                //console.log("The hierarchy is therefore not complete");
                return false;
            }
        }

        return true;
    }

    public isInheritedFromParentClassOrInterface(softwareProjectDicts: SoftwareProjectDicts){
        // In Java we can't rely on @Override annotation because it is not mandatory: https://stackoverflow.com/questions/4822954/do-we-really-need-override-and-so-on-when-code-java
        if(this.overrideAnnotation){
            return true;
        }
        // Since the @Override is not mandatory, we need to dig down deeper by ourself

        let isInherited = false;
        let currentClassOrInterface = softwareProjectDicts.dictClassOrInterface[this.classOrInterfaceKey];
        if(currentClassOrInterface){
            // DONE: we should check if all superClassesAndInterfaces are found
            // We will check this in DetectorDataClumpsMethods.ts with method: isWholeHierarchyNotKnown(

            let superClassesOrInterfacesKeys = currentClassOrInterface.getSuperClassesAndInterfacesKeys(softwareProjectDicts, true);
            for(let superClassOrInterfaceKey of superClassesOrInterfacesKeys){
                //console.log("superClassOrInterfaceKey: "+superClassOrInterfaceKey)
                let superClassOrInterface = softwareProjectDicts.dictClassOrInterface[superClassOrInterfaceKey];
                if(!!superClassOrInterface){
                    let superClassOrInterfaceMethodsDict = superClassOrInterface.methods;
                    let superClassOrInterfaceMethodsKeys = Object.keys(superClassOrInterfaceMethodsDict);
                    for(let superClassOrInterfaceMethodsKey of superClassOrInterfaceMethodsKeys){
                        //console.log("-- superClassOrInterfaceMethodsKey: "+superClassOrInterfaceMethodsKey)
                        let superClassOrInterfaceMethod = superClassOrInterfaceMethodsDict[superClassOrInterfaceMethodsKey];
                        if(this.hasSameSignatureAs(superClassOrInterfaceMethod)){
                            isInherited = true;
                            return isInherited;
                        }
                    }
                } else {
                    //console.log("A superClassOrInterface could not be found: "+superClassOrInterfaceKey)
                    //console.log("It might be, that this is a library import")
                }
            }
        }
        //console.log("++++++++++++++")
        return isInherited;
    }
}
