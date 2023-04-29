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
    console.log("MyAbortController.abort called");
  }
  public isAbort() {
    console.log("MyAbortController.getStatus called");
    return this.aborted;
  }
  public reset() {
    this.aborted = false;
  }

}

export class SoftwareProject {

  public filesToParseDict: Dictionary<MyFile> = {};

  constructor() {
    this.filesToParseDict = {};
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

  public async generateAstForFiles(progressCallback?: any, abortController?: MyAbortController) {
    let parserOptions = new ParserOptions(false);
    await Parser.parseSoftwareProject(this, parserOptions, abortController, progressCallback);
  }

  public async generateAstForFile(file: MyFile, progressCallback?: any) {
    let parserOptions = new ParserOptions(false);
    await Parser.parseFile(file, parserOptions, 0, 1, progressCallback)
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

  public async detectDataClumps(progressCallback?: any, abortController?: MyAbortController): Promise<DataClumpsTypeContext> {
    let detectorOptions = {

    };
    let detector = new Detector(detectorOptions, this, progressCallback, abortController);
    let dataClumps = await detector.detect();
    return dataClumps;
  }

}
