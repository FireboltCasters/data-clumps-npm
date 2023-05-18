import {Parser, ParserOptions} from "./Parser";
import {
  ClassOrInterfaceTypeContext,
  MemberFieldParameterTypeContext,
  MethodParameterTypeContext,
  MethodTypeContext,
  MyFile
} from "./ParsedAstTypes";
import {Detector} from "./detector/Detector";
import {DataClumpsTypeContext} from "./DataClumpTypes";
import {Dictionary} from "./UtilTypes";

export class MyAbortController {
  public aborted: boolean;
  public constructor() {
    this.aborted = false;
  }
  public abort() {
    this.aborted = true;
    //console.log("MyAbortController.abort called");
  }
  public isAbort() {
    //console.log("MyAbortController.getStatus called");
    return this.aborted;
  }
  public reset() {
    this.aborted = false;
  }

}

export class SoftwareProjectClassOrInterfaceDicts {
  public dictClassOrInterface: Dictionary<ClassOrInterfaceTypeContext>

  public constructor(dictClassOrInterface: Dictionary<ClassOrInterfaceTypeContext>) {
    this.dictClassOrInterface = dictClassOrInterface;
  }

  public static fromSoftwareProject(softwareProject: SoftwareProject){
    let softwareProjectClassOrInterfaceDicts = new SoftwareProjectClassOrInterfaceDicts({});

    let fileKeys = softwareProject.getFilePaths();
    for (let fileKey of fileKeys) {
      let file = softwareProject.getFile(fileKey);
      let fileAst = file.ast;
      let classOrInterfaceKeys = Object.keys(fileAst);
      for (let classOrInterfaceKey of classOrInterfaceKeys) {
        let classOrInterface = fileAst[classOrInterfaceKey];
        softwareProjectClassOrInterfaceDicts.dictClassOrInterface[classOrInterface.key] = classOrInterface;
      }
    }

    return softwareProjectClassOrInterfaceDicts;
  }
}

export class SoftwareProjectDicts {
  public dictClassOrInterface: Dictionary<ClassOrInterfaceTypeContext> = {};
  public dictMemberFieldParameters: Dictionary<MemberFieldParameterTypeContext> = {};
  public dictMethod: Dictionary<MethodTypeContext> = {};
  public dictMethodParameters: Dictionary<MethodParameterTypeContext> = {};

  public constructor(dictClassOrInterface: Dictionary<ClassOrInterfaceTypeContext>) {
    this.dictClassOrInterface = {};
    this.dictMemberFieldParameters = {};
    this.dictMethod = {};
    this.dictMethodParameters = {};

    let classOrInterfacesDictForFile = dictClassOrInterface;
    let classOrInterfaceKeys = Object.keys(classOrInterfacesDictForFile);
    for (let classOrInterfaceKey of classOrInterfaceKeys) {
      let classOrInterface = classOrInterfacesDictForFile[classOrInterfaceKey];
      // we need to make sure, that we make a correct deserialization here
      classOrInterface = ClassOrInterfaceTypeContext.fromObject(classOrInterface);

      this.handleClassOrInterface(classOrInterface);
    }
   }

  private fillMethodsForClassOrInterface(classOrInterface: ClassOrInterfaceTypeContext) {
    // Fill methods
    let methodsDictForClassOrInterface = classOrInterface.methods;
    let methodKeys = Object.keys(methodsDictForClassOrInterface);
    for (let methodKey of methodKeys) {
      let method = methodsDictForClassOrInterface[methodKey];

      // Fill dictMethod
      this.dictMethod[method.key] = method;

      // Fill methodParameters
      let methodParametersDictForMethod = method.parameters;
      let methodParameterKeys = Object.keys(methodParametersDictForMethod);
      for (let methodParameterKey of methodParameterKeys) {
        let methodParameter = methodParametersDictForMethod[methodParameterKey];
        this.dictMethodParameters[methodParameter.key] = methodParameter;
      }
    }
  }

  private fillMemberFieldsForClassOrInterface(classOrInterface: ClassOrInterfaceTypeContext) {
    // Fill memberFieldParameters
    let memberFieldParametersDictForClassOrInterface = classOrInterface.fields;

    let memberFieldParameterKeys = Object.keys(memberFieldParametersDictForClassOrInterface);
    for (let memberFieldParameterKey of memberFieldParameterKeys) {
      let memberFieldParameter = memberFieldParametersDictForClassOrInterface[memberFieldParameterKey];
      this.dictMemberFieldParameters[memberFieldParameter.key] = memberFieldParameter;
    }
  }

  private handleClassOrInterface(classOrInterface: ClassOrInterfaceTypeContext) {
    this.fillClassOrInterfaceDicts(classOrInterface);
    this.fillMemberFieldsForClassOrInterface(classOrInterface);
    this.fillMethodsForClassOrInterface(classOrInterface);
  }

  private fillClassOrInterfaceDicts(classOrInterface: ClassOrInterfaceTypeContext) {
    // Fill dictClassOrInterface
    this.dictClassOrInterface[classOrInterface.key] = classOrInterface;

    // Fill inner defined classes
    let innerDefinedClassesDict = classOrInterface.innerDefinedClasses;
    let innerDefinedClassKeys = Object.keys(innerDefinedClassesDict);
    for (let innerDefinedClassKey of innerDefinedClassKeys) {
        let innerDefinedClass = innerDefinedClassesDict[innerDefinedClassKey];
        this.handleClassOrInterface(innerDefinedClass);
    }

    // Fill inner defined interfaces
    let innerDefinedInterfacesDict = classOrInterface.innerDefinedInterfaces;
    let innerDefinedInterfaceKeys = Object.keys(innerDefinedInterfacesDict);
    for (let innerDefinedInterfaceKey of innerDefinedInterfaceKeys) {
      let innerDefinedInterface = innerDefinedInterfacesDict[innerDefinedInterfaceKey];
      this.handleClassOrInterface(innerDefinedInterface);
    }
  }

}

export class SoftwareProject {

  public filesToParseDict: Dictionary<MyFile> = {};
  public fileExtensionsToBeChecked: Dictionary<string> = {};
  public dictClassOrInterface: Dictionary<ClassOrInterfaceTypeContext> = {};

  constructor(fileExtensionsToBeChecked: string[]) {
    this.filesToParseDict = {};
    this.dictClassOrInterface = {};
    this.fileExtensionsToBeChecked = {};
    for (let fileExtension of fileExtensionsToBeChecked) {
        this.fileExtensionsToBeChecked[fileExtension] = fileExtension;
    }
  }

  public addFileContent(path: string, fileContent: string) {
    let newFileToAdd = new MyFile(path, fileContent);
    return this.addFile(newFileToAdd);
  }

  public addFile(file: MyFile) {
    this.filesToParseDict[file.path] = file;
  }

  public addFiles(files: MyFile[]) {
    for (let file of files) {
      this.addFile(file);
    }
  }

  public getFilePaths() {
    return Object.keys(this.getFilesDict());
  }

  public getFile(path: string) {
    return this.filesToParseDict[path];
  }

  public getFilesInFolder(folderPath: string) {
    let filesInFolder: MyFile[] = [];
    let fileKeys = this.getFilePaths();
    for (let fileKey of fileKeys) {
      let file = this.getFile(fileKey);
      let pathToFolder = file.getPathToFolder();
      if (pathToFolder === folderPath) {
        filesInFolder.push(file);
      }
    }
    return filesInFolder;
  }

  private getDefaultParserOptionsIfUndefined(parserOptions?: ParserOptions){
    if(parserOptions){
      return parserOptions;
    }
    return new ParserOptions({});
  }

  public async parseSoftwareProject(parserOptions?: ParserOptions, progressCallback?: any, abortController?: MyAbortController) {
    this.dictClassOrInterface = {};
    parserOptions = this.getDefaultParserOptionsIfUndefined(parserOptions);
    await Parser.parseSoftwareProject(this, parserOptions, abortController, progressCallback);

    let fileKeys = this.getFilePaths();
    for (let fileKey of fileKeys) {
      let file = this.getFile(fileKey);
      let fileAst = file.ast;
      let classOrInterfaceKeys = Object.keys(fileAst);
      for (let classOrInterfaceKey of classOrInterfaceKeys) {
        let classOrInterface = fileAst[classOrInterfaceKey];
        this.dictClassOrInterface[classOrInterface.key] = classOrInterface;
      }
    }
  }

  public getFilesDict() {
    return this.filesToParseDict;
  }

  public getSoftwareProjectDicts(){
    return new SoftwareProjectDicts(this.getParsedSoftwareProject());
  }

  public getParsedSoftwareProject(){
    return this.dictClassOrInterface;
  }

  public async detectDataClumps(detectorOptions?, progressCallback?: any, abortController?: MyAbortController): Promise<DataClumpsTypeContext> {
    let detector = new Detector(this.dictClassOrInterface, detectorOptions, progressCallback, abortController);
    let dataClumps = await detector.detect();
    return dataClumps;
  }

}
