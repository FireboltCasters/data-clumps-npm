import {MyFile} from "./MyFile";
import {JavaParserAntlr4} from "./java/JavaParserAntlr4";

export class Parser {

  public filesToParseDict: {[key: string]: MyFile} = {};
  public result: any;

  constructor() {
    this.filesToParseDict = {};
  }

  public addFileContentToParse(path: string, fileContent: string) {
    let newFileToAdd = new MyFile(path, fileContent);
    return this.addFileToParse(newFileToAdd);
  }

  public addFileToParse(file: MyFile) {
    this.filesToParseDict[file.path] = file;
  }

  public getFieldsAndMethods() {
    console.log('Parser created');
    let firstFile = this.filesToParseDict[Object.keys(this.filesToParseDict)[0]];
    let javaText = firstFile.content;

    let result = "";
    console.log('File parsing');
    try{
      let resultObj = JavaParserAntlr4.parse(javaText);
      result = JSON.stringify(resultObj, null, 2);
    } catch (e) {
        console.log(e);
    }

    return result;
  }

  public getTest(){
    return "test";
  }

}
