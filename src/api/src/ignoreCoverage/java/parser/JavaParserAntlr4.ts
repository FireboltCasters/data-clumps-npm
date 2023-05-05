import JavaLexer from "./../../java/util/JavaLexer";
import JavaParser from "./../../java/util/JavaParser";
import {JavaParserHelper} from "./JavaParserHelper";
import {MyFile} from "./../../ParsedAstTypes";
import {LanguageParserInterface} from "../../LanguageParserInterface";
import {SoftwareProject} from "../../SoftwareProject";
import {JavaAntlr4CstPrinter} from "../util/JavaAntlr4CstPrinter";
import {antlr4} from "../../util/MyAntlr4";
import {ParserOptions} from "../../Parser";
import {BaseParser, ClassParser, InterfaceParser} from "./JavaParserBaseExtractor";

//TODO add support for generics




export class JavaParserAntlr4 implements LanguageParserInterface {

    static getCst(file: MyFile): any {
        let code = file.content;
        const chars = new antlr4.InputStream(code)
        const lexer = new JavaLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new JavaParser(tokens);
        parser.buildParseTrees = true;
        const cst = parser.compilationUnit();
        return cst;
    }

    static getPackageDeclaration(cst): string | null{
//    console.log("Getting package declaration")
        // cst = getDemoCstForPackageDeclaration();
        let packageDeclaration = JavaParserHelper.getChildByType(cst, "packageDeclaration");
        if (!!packageDeclaration) {
            let qualifiedName = JavaParserHelper.getChildByType(packageDeclaration, "qualifiedName");
            if(!!qualifiedName){
                return qualifiedName.getText();
            }
        }
        return null;
    }

    static getTopFileClassCst(cst: any): any {
        let typeDeclaration = JavaParserHelper.getChildByType(cst, "typeDeclaration");
        if(!!typeDeclaration) {
            let classOrInterfaceCst = JavaParserHelper.getChildByType(typeDeclaration, "classDeclaration");
            if (!!classOrInterfaceCst) {
                return classOrInterfaceCst;
            }
        }
    }

    static getTopFileInterfaceCst(cst: any): any {
        let typeDeclaration = JavaParserHelper.getChildByType(cst, "typeDeclaration");
        if(!!typeDeclaration) {
            let classOrInterfaceCst = JavaParserHelper.getChildByType(typeDeclaration, "interfaceDeclaration");
            if (!!classOrInterfaceCst) {
                return classOrInterfaceCst;
            }
        }
    }

    static getTopFileClassOrInterfaceCst(file: MyFile): any {
        let cst = JavaParserAntlr4.getCst(file);
        let classCst = JavaParserAntlr4.getTopFileClassCst(cst);
        if (!!classCst) {
            return classCst;
        }
        let interfaceCst = JavaParserAntlr4.getTopFileInterfaceCst(cst);
        if (!!interfaceCst) {
            return interfaceCst;
        }
    }

    static getQualifiedNameOfClassOrInterface(cst: any, packageName: string | null): string | null {
        let classOrInterfaceName = JavaParserAntlr4.getNameOfClassOrInterface(cst);
        if (!!classOrInterfaceName) {
            if (!packageName) {
                // if there is no package name, then the qualified name is just the class or interface name
                return classOrInterfaceName;
            } else{
                // if there is a package name, then the qualified name is the package name + class or interface name
                return packageName + "." + classOrInterfaceName;
            }
        }
        return null;
    }

    static getNameOfClassOrInterface(cst: any): string | null {
  //      console.log("- Getting name of class or interface")
        let classOrInterfaceName = JavaParserHelper.getChildByType(cst, "identifier");
//        JavaAntlr4CstPrinter.print(classOrInterfaceName, "class or interface name")
        if (!!classOrInterfaceName) {
            return classOrInterfaceName.getText();
        }
        return null;
    }

    static getPackageClassesAndInterfacesInFolderPathWithPackageName(softwareProject: SoftwareProject, folderPath: string, packageName: string | null): any {
        let samePackageClassesAndInterfaces = {};

        let filesInSamePackage = softwareProject.getFilesInFolder(folderPath);
        console.log("Files in same package: " + filesInSamePackage.length)

        for (let fileInSamePackage of filesInSamePackage) {
            let classOrInterfaceCst = JavaParserAntlr4.getTopFileClassOrInterfaceCst(fileInSamePackage);
            if(!!classOrInterfaceCst){
                let qualifiedName = JavaParserAntlr4.getQualifiedNameOfClassOrInterface(classOrInterfaceCst, packageName);
                let classOrInterfaceName = JavaParserAntlr4.getNameOfClassOrInterface(classOrInterfaceCst);
                if (!!qualifiedName && classOrInterfaceName) {
                    samePackageClassesAndInterfaces[classOrInterfaceName] = qualifiedName;
                }
            }
        }
        return samePackageClassesAndInterfaces;
    }

    static getPackageClassesAndInterfacesWithPackage(softwareProject: SoftwareProject, packageName: string | null): any {
        // TODO technically we need to check every folder in the project to see if it has the package name
        // but we can assume that the package name is the same as the folder name
        // so we can just check the folder with the same name as the package name
        let folderPath = ""
        if(!!packageName){
            folderPath = packageName.replace(/\./g, "/"); // replace all dots with slashes
            folderPath += "/"; // add a slash at the end
        }
        return JavaParserAntlr4.getPackageClassesAndInterfacesInFolderPathWithPackageName(softwareProject, folderPath, packageName);
    }

    static getPackageClassesAndInterfacesWithPackageFromImportDeclaration(softwareProject: SoftwareProject, importDeclaration: any): any {
        let importDeclarationClassesAndInterfaces = {};
        //JavaAntlr4CstPrinter.print(importDeclaration, "import declaration");
        // @ts-ignore
        let importDeclarationText = ""+importDeclaration.getText();
        // remove the "import" keyword at the beginning and the semicolon at the end
        let importKeyword = "import";
        importDeclarationText = importDeclarationText.substring(importKeyword.length, importDeclarationText.length);
        // importDeclarationText = "java.util.*;" or "java.util.ArrayList;" or ...

        // check if it is a wildcard import
        let isWildcardImport = false;
        let textToDetermineIfWildcardImport = ".*;";
        if(importDeclarationText.endsWith(textToDetermineIfWildcardImport)){ // if it ends with a dot and an asterisk
            isWildcardImport = true;
        }
        if(isWildcardImport){
            let importPackageNameWithWildcard = importDeclarationText;
            // if it is a wildcard import, then we need to get all the classes and interfaces in that package
            // therefore we will remove the wildcard (the asterisk) and the dot to get the package name
            // then we will get all the classes and interfaces in that package
            let lengthOfTextToDetermineIfWildcardImport = textToDetermineIfWildcardImport.length;
            let importPackageName = importDeclarationText.substring(0, importPackageNameWithWildcard.length-lengthOfTextToDetermineIfWildcardImport);
            let specificImportPackageClassesAndInterfaces = JavaParserAntlr4.getPackageClassesAndInterfacesWithPackage(softwareProject, importPackageName);
            // add or overwrite the classes and interfaces in the import declaration to importDeclarationClassesAndInterfaces
            importDeclarationClassesAndInterfaces = {...importDeclarationClassesAndInterfaces, ...specificImportPackageClassesAndInterfaces};
        } else {
            // Since it is not a wildcard import, we need can assume that it is an explicit import
            // for an explicit import we can get the qualified name from the import declaration
            let importPackageNameWithClassName = importDeclarationText;
            // importPackageNameWithClassName= "java.util.ArrayList;"
            // we need to get the class name from the import declaration
            // therefore we will remove the package name and the dot to get the class name
            // then we will get the qualified name of the class
            let lastIndexOfDot = importPackageNameWithClassName.lastIndexOf(".");
            let importPackageName = importPackageNameWithClassName.substring(0, lastIndexOfDot);
            // importPackageName = "java.util"
            let semiColonIndex = importPackageNameWithClassName.indexOf(";");
            let importClassName = importPackageNameWithClassName.substring(lastIndexOfDot+1, semiColonIndex);
            // importClassName = "ArrayList"
            // get the qualified name of the class
            let importClassQualifiedName = importPackageName + "." + importClassName;
            // importClassQualifiedName = "java.util.ArrayList"
            // add or overwrite the class or interface in the import declaration to importDeclarationClassesAndInterfaces
            importDeclarationClassesAndInterfaces[importClassName] = importClassQualifiedName;
        }
        return importDeclarationClassesAndInterfaces;
    }

    static getPackageClassesAndInterfacesWithPackageFromImportDeclarations(softwareProject: SoftwareProject, importDeclarations: any): any {
        let importDeclarationClassesAndInterfaces = {};
        if(importDeclarations.length>0){
            for(let importDeclaration of importDeclarations){
                let specificImportDeclarationClassesAndInterfaces = JavaParserAntlr4.getPackageClassesAndInterfacesWithPackageFromImportDeclaration(softwareProject, importDeclaration);
                // add or overwrite the classes and interfaces in the import declaration to importDeclarationClassesAndInterfaces
                importDeclarationClassesAndInterfaces = {...importDeclarationClassesAndInterfaces, ...specificImportDeclarationClassesAndInterfaces};
            }
        }
        return importDeclarationClassesAndInterfaces;
    }

    private saveClassOrInterfaceToFile(parser: BaseParser, file: MyFile) {
        let classOrInterface = parser.classOrInterface;
        let key = classOrInterface.key;
        file.ast[key] = classOrInterface;
    }

    preParse(softwareProject: SoftwareProject, file: MyFile, options: ParserOptions) {
        console.log("Parsing file: " + file.path)

        file.ast = {};

        const cst = JavaParserAntlr4.getCst(file);

        // To parse a java file we need to:

        // 1. Get the package name and the class or interface name of the file
        let ownPackageName = JavaParserAntlr4.getPackageDeclaration(cst);

        let classCst = JavaParserAntlr4.getTopFileClassCst(cst);
        let interfaceCst = JavaParserAntlr4.getTopFileInterfaceCst(cst);


        if(!!classCst || !!interfaceCst){ // if our file has a class or interface
            // create a dictionary with the classes and interfaces with their qualified names
            // key = class or interface name, value = qualified name of the class or interface
            // qualified name = package name + class or interface name
            // We store the currently visible classes and interfaces in the same package
            let currentVisibleClassesAndInterfaces = {};

            let currentVisibleVariables = {};

            // 2. By default all classes and interfaces in the same package are public
            // So we should check all the classes and interfaces in the same package
            // 2.1 get all the files in the same package
            // 2.2 get all the classes and interfaces in the same package

            let samePackageClassesAndInterfaces = JavaParserAntlr4.getPackageClassesAndInterfacesWithPackage(softwareProject, ownPackageName);

            // copy the same package classes and interfaces to the current visible classes and interfaces
            currentVisibleClassesAndInterfaces = {...samePackageClassesAndInterfaces};

            // 3. Get the imports (explicit and wildcard)
            let importDeclarations = JavaParserHelper.getChildrenByType(cst, "importDeclaration");
            let importDeclarationClassesAndInterfaces = JavaParserAntlr4.getPackageClassesAndInterfacesWithPackageFromImportDeclarations(softwareProject, importDeclarations);

            // add or overwrite the classes and interfaces in the import declarations to currentVisibleClassesAndInterfacesInSamePackage
            currentVisibleClassesAndInterfaces = {...currentVisibleClassesAndInterfaces, ...importDeclarationClassesAndInterfaces};


            // 4. Get the class or interface body
            if(!!classCst){
                console.log("Found class at the top of the file: "+file.path)
                let classExtractor = new ClassParser(file, ownPackageName, classCst, currentVisibleClassesAndInterfaces, currentVisibleVariables, options, null);
                classExtractor.parse();
                this.saveClassOrInterfaceToFile(classExtractor, file);
            }

            if(!!interfaceCst){
                console.log("Found interface at the top of the file: "+file.path)
                let interfaceExtractor = new InterfaceParser(file, ownPackageName, interfaceCst, currentVisibleClassesAndInterfaces, currentVisibleVariables, options, null);
                interfaceExtractor.parse();
                this.saveClassOrInterfaceToFile(interfaceExtractor, file);
            }

        }



/**
        let output: Dictionary<ClassOrInterfaceTypeContext> = {};



        // @ts-ignore
        let typeDeclarations = JavaParserHelper.getChildrenByType(cst, "typeDeclaration");

        for (let typeDeclaration of typeDeclarations) {
            // @ts-ignore
            for (let i = 0; i < typeDeclaration.children.length; i++) {
                // @ts-ignore
                let child = typeDeclaration.children[i];
                let type = JavaParserHelper.getCtxType(child);
                if (type === "classDeclaration") {
                    let classDeclaration = child;
                    let classExtractor = new ClassExtractor(file, ownPackageName, classDeclaration, includePosition);
                    let extractorOutput = classExtractor.classOrInterface;
                    let key = extractorOutput.key
                    output[key] = extractorOutput;
                }
                if (type === "interfaceDeclaration") {
                    let interfaceDeclaration = child;
                    let interfaceExtractor = new InterfaceExtractor(file, ownPackageName, interfaceDeclaration, includePosition);
                    let extractorOutput = interfaceExtractor.classOrInterface;
                    let key = extractorOutput.key
                    output[key] = extractorOutput;
                }
            }
        }

 */
        console.log("++++++++++++++++++++++");

    }

    /**
     * In Java we don't need to do anything after parsing
     * @param softwareProject
     * @param softwareProjectDicts
     * @param file
     * @param includePosition
     */
    postParse(softwareProject: SoftwareProject, file: MyFile, options: ParserOptions) {

    }


}





function getDemoCstForPackageDeclaration(){
    return(
        {
            "type": "packageDeclaration",
            "node": "PackageDeclarationContext",
            "children": [
                "package",
                {
                    "type": "qualifiedName",
                    "node": "QualifiedNameContext",
                    "children": [
                        {
                            "type": "identifier",
                            "node": "IdentifierContext",
                            "children": [
                                "javaParserTest"
                            ]
                        },
                        ".",
                        {
                            "type": "identifier",
                            "node": "IdentifierContext",
                            "children": [
                                "sub"
                            ]
                        }
                    ]
                },
                ";"
            ]
        }
    )
}
