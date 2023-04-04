import { Parser } from "./Parser";
import {MyFile} from "./util/MyFile";
import {ClassOrInterfaceTypeContext, Dictionary} from "./ParsedTypes";

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
    Parser.parseSoftwareProject(this);
  }

  public getFilesDict() {
    return this.filesToParseDict;
  }

}
