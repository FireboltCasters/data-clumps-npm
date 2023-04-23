import {Parser, ParserOptions} from "./Parser";
import {MyFile} from "./ParsedAstTypes";
import {Detector, SoftwareProjectDicts} from "./Detector";
import {DataClumpsTypeContext} from "./DataClumpTypes";
import {Dictionary} from "./UtilTypes";

export class SoftwareProject {

  public filesToParseDict: Dictionary<MyFile> = {};

  constructor() {
    this.filesToParseDict = {};
  }

  public static fromJson(json: any) {
    let softwareProject = new SoftwareProject();
    softwareProject.filesToParseDict = json.filesToParseDict;
    return softwareProject;
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

  public generateAstForFiles() {
    Parser.parseSoftwareProject(this, new ParserOptions(false));
  }

  public getFilesDict() {
    return this.filesToParseDict;
  }

  public getSoftwareProjectDicts(){
    let softwareProjectDicts: SoftwareProjectDicts = new SoftwareProjectDicts(this);
    return softwareProjectDicts;
  }

  public async detectDataClumps(): Promise<DataClumpsTypeContext> {
    let detectorOptions = {

    };
    let detector = new Detector(detectorOptions, this);
    let dataClumps = await detector.detect();
    return dataClumps;
  }

}
