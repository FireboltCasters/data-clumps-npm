import {JavaParserHelper} from "./JavaParserHelper";
import {ClassOrInterfaceTypeContext, MyFile} from "./../../ParsedAstTypes";
import {JavaParserFieldExtractor} from "./JavaParserFieldExtractor";
import {JavaParserMethodExtractor} from "./JavaParserMethodExtractor";
import {JavaAntlr4CstPrinter} from "../util/JavaAntlr4CstPrinter";

//TODO add support for generics

export class BaseExtractor{
    public classOrInterface: ClassOrInterfaceTypeContext;
    public includePosition: boolean;
    public file: MyFile;

    static searchExtendsKey = "searchExtends";
    static searchImplementsKey = "searchImplements";

    static classGetNameForExtendedClassOrImplementedInterfaces(ctx, extendsOrImplementsKeyword){
        let extendsOrImplementsRawNames: any[] = [];
        let extendsOrImplementsIndexes = JavaParserHelper.getChildIndexesByName(ctx, extendsOrImplementsKeyword);
        if(extendsOrImplementsKeyword === "extends"){
            let extendsIndexes = extendsOrImplementsIndexes;
            for(let extendsIndex of extendsIndexes){ // will be only one since extends is unique in Java
                let extendsTypeType = ctx.children[extendsIndex+1];
                if(!!extendsTypeType){
                    let extendsClassOrInterfaceType = JavaParserHelper.getChildByType(extendsTypeType, "classOrInterfaceType");
                    let extendsTypeIdentifier = JavaParserHelper.getChildByType(extendsClassOrInterfaceType, "typeIdentifier");
                    // @ts-ignore
                    let extendsTypeIdentifierOnlyChild = extendsTypeIdentifier.children[0];
                    let extendsName = extendsTypeIdentifierOnlyChild.getText();
                    extendsOrImplementsRawNames.push(extendsName);
                }
            }
        } else if(extendsOrImplementsKeyword === "implements"){
            let implementsIndexes = extendsOrImplementsIndexes;
            for(let implementsIndex of implementsIndexes){
                let implementsTypeType = ctx.children[implementsIndex+1];
                if(!!implementsTypeType){
                    let implementsInterfaceTypeTypes = JavaParserHelper.getChildrenByType(implementsTypeType, "typeType");
                    for(let implementsInterfaceTypeType of implementsInterfaceTypeTypes){
                        let implementsInterfaceType = JavaParserHelper.getChildByType(implementsInterfaceTypeType, "classOrInterfaceType");
                        let implementsTypeIdentifier = JavaParserHelper.getChildByType(implementsInterfaceType, "typeIdentifier");
                        // @ts-ignore
                        let implementsTypeIdentifierOnlyChild = implementsTypeIdentifier.children[0];
                        let implementsName = implementsTypeIdentifierOnlyChild.getText();
                        extendsOrImplementsRawNames.push(implementsName);
                    }
                }
            }
        }
        return extendsOrImplementsRawNames;
    }

    static interfaceGetNameForExtendedClassOrImplementedInterfaces(ctx, extendsOrImplementsKeyword){
        let extendsOrImplementsRawNames: any[] = [];
        let extendsOrImplementsIndexes = JavaParserHelper.getChildIndexesByName(ctx, extendsOrImplementsKeyword);
        if(extendsOrImplementsKeyword === "extends"){
            let extendsIndexes = extendsOrImplementsIndexes;
            for(let extendsIndex of extendsIndexes){
                let extendsTypeType = ctx.children[extendsIndex+1];
                if(!!extendsTypeType){
                    let extendsInterfaceTypeTypes = JavaParserHelper.getChildrenByType(extendsTypeType, "typeType");
                    for(let extendsInterfaceTypeType of extendsInterfaceTypeTypes){
                        let extendsInterfaceType = JavaParserHelper.getChildByType(extendsInterfaceTypeType, "classOrInterfaceType");
                        let extendsTypeIdentifier = JavaParserHelper.getChildByType(extendsInterfaceType, "typeIdentifier");
                        // @ts-ignore
                        let extendsTypeIdentifierOnlyChild = extendsTypeIdentifier.children[0];
                        let extendsName = extendsTypeIdentifierOnlyChild.getText();
                        extendsOrImplementsRawNames.push(extendsName);
                    }
                }
            }
        } else if(extendsOrImplementsKeyword === "implements"){
            // An interface cannot implement another interface
        }
        return extendsOrImplementsRawNames;
    }

    constructor(file: MyFile, ctx, type, includePosition= false, innerClassOrInterface = false, parent?: ClassOrInterfaceTypeContext) {
        this.includePosition = includePosition;
        this.file = file;

        //JavaAntlr4CstPrinter.print(ctx, file.path);


        let identifier = JavaParserHelper.getChildByType(ctx, "identifier");
        // @ts-ignore
        let className = identifier.getText();
        let key = className;
        if(parent){
            key = parent.name + "." + className;
        }

        this.classOrInterface = new ClassOrInterfaceTypeContext(key, className, type, file);
        this.classOrInterface.definedInClassOrInterfaceTypeKey = parent?.key; // save the key of the class or interface that defined this class or interface

        let extendsRawNames = [];
        let implementsRawNames = [];
        if(type==="class"){
            // @ts-ignore
            extendsRawNames = BaseExtractor.classGetNameForExtendedClassOrImplementedInterfaces(ctx, "extends");
            // @ts-ignore
            this.classOrInterface[BaseExtractor.searchExtendsKey] = extendsRawNames;
            // TODO handle wildcard imports

            // @ts-ignore
            implementsRawNames = BaseExtractor.classGetNameForExtendedClassOrImplementedInterfaces(ctx, "implements");
            // @ts-ignore
            this.classOrInterface[BaseExtractor.searchImplementsKey] = implementsRawNames;
            // TODO handle wildcard imports
        } else if(type==="interface"){
            // @ts-ignore
            extendsRawNames = BaseExtractor.interfaceGetNameForExtendedClassOrImplementedInterfaces(ctx, "extends");
            // @ts-ignore
            this.classOrInterface[BaseExtractor.searchExtendsKey] = extendsRawNames;
            // TODO handle wildcard imports

            // @ts-ignore
            implementsRawNames = BaseExtractor.interfaceGetNameForExtendedClassOrImplementedInterfaces(ctx, "implements");
            // @ts-ignore
            this.classOrInterface[BaseExtractor.searchImplementsKey] = implementsRawNames;
        }



        let modifiers = [];
        if(!innerClassOrInterface){
            modifiers = JavaParserHelper.getModifiers(ctx.parentCtx);
        }
        if(innerClassOrInterface){
            modifiers = JavaParserHelper.getModifiers(ctx.parentCtx.parentCtx);
        }
        this.classOrInterface.modifiers = modifiers;

        if(this.includePosition){
            this.classOrInterface.position = JavaParserHelper.custom_getPosition(ctx.parentCtx);
        }
    }

    extractClassOrInterfaceFromMember(memberDeclarationCtx){
        let interfaceDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "interfaceDeclaration");
        if(interfaceDeclaration!==null){
            let interfaceExtractor = new InterfaceExtractor(this.file, interfaceDeclaration, this.includePosition, true, this.classOrInterface);
            let innerInterfaceOutput = interfaceExtractor.classOrInterface;
            let key = innerInterfaceOutput.key;
            this.classOrInterface.innerDefinedInterfaces[key] = innerInterfaceOutput;
        }
        let classDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "classDeclaration");
        if(classDeclaration!==null){
            let classListener = new ClassExtractor(this.file, classDeclaration, this.includePosition, true, this.classOrInterface);
            let innerClassOutput = classListener.classOrInterface;
            let key = innerClassOutput.key;
            this.classOrInterface.innerDefinedClasses[key] = innerClassOutput;
        }
    }
}


class ClassExtractor extends BaseExtractor{
    constructor(file: MyFile, ctx, includePosition= false, innerClass = false, parent?: ClassOrInterfaceTypeContext) {
        super(file, ctx, "class", includePosition, innerClass, parent);

        let classBody = JavaParserHelper.getChildByType(ctx, "classBody");
        this.extractFromClassBody(classBody);
    }

    extractFromClassBody(ctx){
        let classBodyDeclarations = JavaParserHelper.getChildrenByType(ctx, "classBodyDeclaration");
        for(let i = 0; i < classBodyDeclarations.length; i++){
            let classBodyDeclaration = classBodyDeclarations[i];
            let memberDeclaration = JavaParserHelper.getChildByType(classBodyDeclaration, "memberDeclaration");
            if(memberDeclaration!==null){
                this.extractFieldsFromMember(memberDeclaration);
                this.extractMethodsFromMember(memberDeclaration);
                super.extractClassOrInterfaceFromMember(memberDeclaration);
            }
        }
    }

    extractFieldsFromMember(memberDeclarationCtx){
        let fieldDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "fieldDeclaration");
        if(fieldDeclaration!==null){
            let fieldListener = new JavaParserFieldExtractor(this.classOrInterface, fieldDeclaration, this.includePosition);
            let memberFieldTypeContext = fieldListener.field;
            let memberParameterTypes = memberFieldTypeContext.parameters;
            for(let i=0; i< memberParameterTypes.length; i++){
                let memberParameterType = memberParameterTypes[i];
                this.classOrInterface.fields[memberParameterType.key] = memberParameterType;
            }
        }
    }

    extractMethodsFromMember(memberDeclarationCtx){
        let methodDeclaration = JavaParserHelper.getChildByType(memberDeclarationCtx, "methodDeclaration");
        if(methodDeclaration!==null){
            // @ts-ignore
            let methodListener = new JavaParserMethodExtractor(this.classOrInterface, methodDeclaration, methodDeclaration.parentCtx.parentCtx, this.includePosition);
            let method = methodListener.output;
            let key = method.key;
            this.classOrInterface.methods[key] = method;
        }
    }
}


class InterfaceExtractor extends BaseExtractor{
    constructor(file: MyFile, ctx, includePosition= false, innerInterface = false, parent?: ClassOrInterfaceTypeContext) {
        super(file, ctx, "interface", includePosition, innerInterface, parent);

        let interfaceBody = JavaParserHelper.getChildByType(ctx, "interfaceBody");
        this.extractFromInterfaceBody(interfaceBody);

    }

    extractFromInterfaceBody(ctx){
        let interfaceBodyDeclarations = JavaParserHelper.getChildrenByType(ctx, "interfaceBodyDeclaration");
        for(let i = 0; i < interfaceBodyDeclarations.length; i++){
            let interfaceBodyDeclaration = interfaceBodyDeclarations[i];
            let interfaceMemberDeclaration = JavaParserHelper.getChildByType(interfaceBodyDeclaration, "interfaceMemberDeclaration");
            if(interfaceMemberDeclaration!==null){

                // there are no fields in interfaces
                //let fieldDeclaration = JavaParserHelper.getChildByType(interfaceMemberDeclaration, "fieldDeclaration");

                this.extractInterfaceMethodsFromMember(interfaceMemberDeclaration);
                super.extractClassOrInterfaceFromMember(interfaceMemberDeclaration);
            }
        }
    }

    extractInterfaceMethodsFromMember(interfaceMemberDeclarationCtx){
        let interfaceMethodDeclaration = JavaParserHelper.getChildByType(interfaceMemberDeclarationCtx, "interfaceMethodDeclaration");
        if(interfaceMethodDeclaration!==null){
            /**
             "children": [
             {
                                  "type": "interfaceMethodDeclaration",
                                  "node": "InterfaceMethodDeclarationContext",
                                  "children": [
                                    {
                                      "type": "interfaceCommonBodyDeclaration",
                                      "node": "InterfaceCommonBodyDeclarationContext",
                                      "children": [
                                        {
                                          "type": "typeTypeOrVoid",
                                          "node": "TypeTypeOrVoidContext",
                                          "children": [
             */
            let interfaceCommonBodyDeclaration = JavaParserHelper.getChildByType(interfaceMethodDeclaration, "interfaceCommonBodyDeclaration");
            if(interfaceCommonBodyDeclaration!==null){
                // @ts-ignore
                let methodListener = new JavaParserMethodExtractor(this.classOrInterface, interfaceCommonBodyDeclaration, interfaceCommonBodyDeclaration.parentCtx.parentCtx.parentCtx, this.includePosition);
                let method = methodListener.output;
                let key = method.key
                this.classOrInterface.methods[key] = method;
            }
        }
    }
}


export {ClassExtractor, InterfaceExtractor}
