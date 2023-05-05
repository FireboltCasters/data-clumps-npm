import {Parser, ParserOptions} from "./Parser";
import {
  ClassOrInterfaceTypeContext,
  MemberFieldParameterTypeContext,
  MethodParameterTypeContext,
  MethodTypeContext,
  MyFile
} from "./ParsedAstTypes";
import {Detector} from "./Detector";
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


export class SoftwareProjectDicts {
  public dictFile: Dictionary<MyFile> = {};
  public dictClassOrInterface: Dictionary<ClassOrInterfaceTypeContext> = {};
  public dictMemberFieldParameters: Dictionary<MemberFieldParameterTypeContext> = {};
  public dictMethod: Dictionary<MethodTypeContext> = {};
  public dictMethodParameters: Dictionary<MethodParameterTypeContext> = {};

  public constructor() {
    this.dictFile = {};
    this.dictClassOrInterface = {};
    this.dictMemberFieldParameters = {};
    this.dictMethod = {};
    this.dictMethodParameters = {};
  }
}

export class SoftwareProject {

  public filesToParseDict: Dictionary<MyFile> = {};
  public fileExtensionsToBeChecked: Dictionary<string> = {};
  public softwareProjectDicts: SoftwareProjectDicts;

  constructor(fileExtensionsToBeChecked: string[]) {
    this.filesToParseDict = {};
    this.fileExtensionsToBeChecked = {};
    this.softwareProjectDicts = new SoftwareProjectDicts();
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
    parserOptions = this.getDefaultParserOptionsIfUndefined(parserOptions);
    this.softwareProjectDicts = new SoftwareProjectDicts();
    await Parser.parseSoftwareProject(this, parserOptions, abortController, progressCallback);
  }

  public getAstAsString(): string {
    let astAsString = "";
    let fileKeys = this.getFilePaths();
    for (let fileKey of fileKeys) {
      astAsString += fileKey+"\":\n";
      let file = this.getFile(fileKey);
      let fileAst = file.ast;
      let fileAstAsString = JSON.stringify(fileAst, null, 2);
      astAsString += fileAstAsString;
      astAsString += "\n";
    }
    return astAsString;
  }

  public getFilesDict() {
    return this.filesToParseDict;
  }

  public getSoftwareProjectDicts(){
    return this.softwareProjectDicts;
  }

  public async detectDataClumps(detectorOptions?, progressCallback?: any, abortController?: MyAbortController): Promise<DataClumpsTypeContext> {
    let detector = new Detector(this, detectorOptions, progressCallback, abortController);
    let dataClumps = await detector.detect();
    return dataClumps;
  }

}
