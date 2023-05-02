import {Parser, ParserOptions} from "./Parser";
import {MyFile} from "./ParsedAstTypes";
import {Detector, SoftwareProjectDicts} from "./Detector";
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

export class SoftwareProject {

  public filesToParseDict: Dictionary<MyFile> = {};
  public fileExtensionsToBeChecked: Dictionary<string> = {};

  constructor(fileExtensionsToBeChecked: string[]) {
    this.filesToParseDict = {};
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

  private getDefaultParserOptionsIfUndefined(parserOptions?: ParserOptions){
    if(parserOptions){
      return parserOptions;
    }
    return new ParserOptions({});
  }

  public async generateAstForFiles(parserOptions?: ParserOptions, progressCallback?: any, abortController?: MyAbortController) {
    parserOptions = this.getDefaultParserOptionsIfUndefined(parserOptions);
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
    let softwareProjectDicts: SoftwareProjectDicts = new SoftwareProjectDicts(this);
    return softwareProjectDicts;
  }

  public async detectDataClumps(detectorOptions?, progressCallback?: any, abortController?: MyAbortController): Promise<DataClumpsTypeContext> {
    let detector = new Detector(this, detectorOptions, progressCallback, abortController);
    let dataClumps = await detector.detect();
    return dataClumps;
  }

}
