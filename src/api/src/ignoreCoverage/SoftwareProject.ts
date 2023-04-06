import {Parser, ParserOptions} from "./Parser";
import {ClassOrInterfaceTypeContext, Dictionary, MyFile} from "./ParsedTypes";
import {Detector} from "./Detector";

export class SoftwareProject {

  public filesToParseDict: {[key: string]: MyFile} = {};

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

  public generateAstForFiles() {
    Parser.parseSoftwareProject(this, new ParserOptions(false));
  }

  public getFilesDict() {
    return this.filesToParseDict;
  }

  public detectDataClumps() {
    let detectorOptions = {

    };
    let detector = new Detector(detectorOptions);
    detector.detect(this);
  }

}
