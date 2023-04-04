import {JavaParserAntlr4} from "./java/parser/JavaParserAntlr4";
import {SoftwareProject} from "./SoftwareProject";
import {MyFile} from "./util/MyFile";
import {ClassOrInterfaceTypeContext, Dictionary} from "./ParsedTypes";

export class ParserOptions {
    public includePosition: boolean;
    public constructor(includePosition: boolean) {
        this.includePosition = includePosition;
    }
}

export class Parser {

  public static parseSoftwareProject(softwareProject: SoftwareProject, options?: ParserOptions) {
    let parserOptions = options || new ParserOptions(false);
    let filePaths = softwareProject.getFilePaths();
    for (let filePath of filePaths) {
      let file = softwareProject.getFile(filePath);
      let parsedFile = Parser.parseFile(file, parserOptions);
      file.ast = parsedFile;
    }
  }

  private static parseFile(file: MyFile, options: ParserOptions): Dictionary<ClassOrInterfaceTypeContext> | null {
    let fileContent = file.content;
    let filePath = file.path;
    let fileExtension = Parser.getFileExtension(filePath);
    switch (fileExtension) {
        case 'java':
          try{
            let result = JavaParserAntlr4.parse(fileContent, options.includePosition);
            return result;
          } catch (e) {
            console.log(e);
          }
          break;
        default:
            console.log('File extension not supported: ' + fileExtension);
            break;
    }
    return null;
  }

  private static getFileExtension(filePath: string) {
    if(!filePath) return null;
    if(filePath.indexOf('.') === -1) return null;
    let fileExtension = filePath.split('.').pop();
    return fileExtension;
  }

}
