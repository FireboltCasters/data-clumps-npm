import {JavaLanguageSupport} from "./java";
import {SoftwareProject} from "./SoftwareProject";
import {ClassOrInterfaceTypeContext, MyFile} from "./ParsedAstTypes";
import {Dictionary} from "./UtilTypes";
import {Timer} from "./Timer";

export class ParserOptions {
    public includePosition: boolean;
    public constructor(includePosition: boolean) {
        this.includePosition = includePosition;
    }
}

export class Parser {

  public static parseSoftwareProject(softwareProject: SoftwareProject, options?: ParserOptions) {
      console.log("Parser.parseSoftwareProject")
      let timer = new Timer();
        timer.start();

    let parserOptions = options || new ParserOptions(false);
    let filePaths = softwareProject.getFilePaths();
    console.log("Parser.parseSoftwareProject filePaths")
    console.log(filePaths)
    for (let filePath of filePaths) {
      let file = softwareProject.getFile(filePath);
      let parsedFile = Parser.parseFile(file, parserOptions);
      if(parsedFile){
        file.ast = parsedFile;
      }
    }

    timer.stop();
    timer.printElapsedTime("Parser.parseSoftwareProject");
  }

  private static parseFile(file: MyFile, options: ParserOptions): Dictionary<ClassOrInterfaceTypeContext> | null {
    let filePath = file.path;
    console.log("Parser.parseFile filePath")
    console.log(filePath)
    let fileExtension = Parser.getFileExtension(filePath);
    console.log("Parser.parseFile fileExtension")
    console.log(fileExtension)
    switch (fileExtension) {
        // TODO own parser for each language as plugin
        case 'java':
          try{
              let parser = new JavaLanguageSupport().getParser();
              let result = parser.parse(file, options.includePosition);
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
