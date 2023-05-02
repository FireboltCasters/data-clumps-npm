import JavaLexer from "./../../java/util/JavaLexer";
import JavaParser from "./../../java/util/JavaParser";
import {antlr4} from "./../../util/MyAntlr4";
import {JavaParserHelper} from "./JavaParserHelper";
import {ClassOrInterfaceTypeContext, MyFile} from "./../../ParsedAstTypes";
import {LanguageParserInterface} from "../../LanguageParserInterface";
import {Dictionary} from "../../UtilTypes";
import {SoftwareProject} from "../../SoftwareProject";
import {SoftwareProjectDicts} from "../../Detector";
import {ClassExtractor, InterfaceExtractor, BaseExtractor} from "./JavaParserBaseExtractor";

//TODO add support for generics

export class JavaParserAntlr4 implements LanguageParserInterface {

    preParse(file: MyFile, includePosition: boolean): Dictionary<ClassOrInterfaceTypeContext> {
        let code = file.content;
        const chars = new antlr4.InputStream(code)
        const lexer = new JavaLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new JavaParser(tokens);
        parser.buildParseTrees = true;
        const cst = parser.compilationUnit();

//        JavaAntlr4CstPrinter.print(cst, "Whole cst")

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
                    let classExtractor = new ClassExtractor(file, classDeclaration, includePosition);
                    let extractorOutput = classExtractor.classOrInterface;
                    let key = extractorOutput.key
                    output[key] = extractorOutput;
                }
                if (type === "interfaceDeclaration") {
                    let interfaceDeclaration = child;
                    let interfaceExtractor = new InterfaceExtractor(file, interfaceDeclaration, includePosition);
                    let extractorOutput = interfaceExtractor.classOrInterface;
                    let key = extractorOutput.key
                    output[key] = extractorOutput;
                }
            }
        }

        return output;
    }

    postParse(softwareProject: SoftwareProject, softwareProjectDicts: SoftwareProjectDicts, file: MyFile, includePosition: boolean): Dictionary<ClassOrInterfaceTypeContext> {
        this.postParseFindExtending(softwareProject, softwareProjectDicts, file);

        let ast = file.ast;
        return ast;
    }

    private postParseFindExtending(softwareProject: SoftwareProject, softwareProjectDicts: SoftwareProjectDicts, file: MyFile) {
        // We need to find the class which extends the class we are looking for
        let ast = file.ast;

        let classOrInterfaceTypeContexts = ast;
        for (let key in classOrInterfaceTypeContexts) {
            let classOrInterfaceTypeContext = classOrInterfaceTypeContexts[key];
            this.postParseFindExtendingClassOrInterfaceTypeContext(softwareProject, softwareProjectDicts,file, classOrInterfaceTypeContext);
        }
    }

    private postParseFindExtendingClassOrInterfaceTypeContext(softwareProject: SoftwareProject, softwareProjectDicts: SoftwareProjectDicts,file: MyFile, classOrInterfaceTypeContext: ClassOrInterfaceTypeContext) {
        let filePath = file.path;

        console.log("find extending in current package for file: "+classOrInterfaceTypeContext.name+" in file: "+filePath);
        let parentKey = classOrInterfaceTypeContext.definedInClassOrInterfaceTypeKey;

        // @ts-ignore
        let searchExtends = classOrInterfaceTypeContext?.[BaseExtractor.searchExtendsKey] || [];
        for(let searchExtend of searchExtends){
            console.log(" - search extends class: "+searchExtend);
            /**
             In Java, when a class extends another class, the order in which Java looks for a member or method is as follows:

             1. Java will look for classes in the upper hierarchy first.
             2. for every step in the hierarchy, Java looks for the first innerDefined class with the name.
             3. If imports are used with explicit class names, Java will look for the class in the imported packages.
             4. If no such class is found, Java will look for the class in the current package aka folder.
             */

            // Step 4: If no such class is found, Java will look for the class in the current package aka folder.
            let currentFolder = file.getFolderName();
            let keysOfFilesInCurrentFolder = softwareProject.getFileKeysOfFilesInPath(currentFolder);
            for (let keyOfFileInCurrentFolder of keysOfFilesInCurrentFolder) {
                let fileInCurrentFolder = softwareProject.getFile(keyOfFileInCurrentFolder);
                if(file.key !== fileInCurrentFolder.key){
                    console.log(" - other file in current folder: "+fileInCurrentFolder.path);
                    let astOfOtherFileInCurrentFolder = fileInCurrentFolder.ast;
                    let classOrInterfaceTypeContextsOfOtherFileInCurrentFolder = astOfOtherFileInCurrentFolder;
                    for(let otherClassOrInterfaceKey in classOrInterfaceTypeContextsOfOtherFileInCurrentFolder){
                        let otherClassOrInterfaceTypeContext = classOrInterfaceTypeContextsOfOtherFileInCurrentFolder[otherClassOrInterfaceKey];
                        let otherClassOrInterfaceName = otherClassOrInterfaceTypeContext.name;
                        if(otherClassOrInterfaceName === searchExtend){
                            console.log(" - - found class in other folder: "+otherClassOrInterfaceName);
                            classOrInterfaceTypeContext.extends[searchExtend] = otherClassOrInterfaceTypeContext.key;
                            break;
                        }
                    }
                }
            }
        }

        // Delete the searchExtends key, because it is not needed anymore
        delete classOrInterfaceTypeContext[BaseExtractor.searchExtendsKey];


    }


}


