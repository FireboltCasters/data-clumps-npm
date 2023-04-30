import {JavaLanguageSupport} from "./java";
import {SoftwareProject, MyAbortController} from "./SoftwareProject";
import {ClassOrInterfaceTypeContext, MyFile} from "./ParsedAstTypes";
import {Dictionary} from "./UtilTypes";
import {Timer} from "./Timer";

export class ParserOptions {
    public includePositions: boolean = false;

    public constructor(options: any){
        let keys = Object.keys(options || {});
        for (let key of keys) {
            // check if this key exists in this class
            if (this.hasOwnProperty(key)) {
                this[key] = options[key]; // set the value
            }
        }
    }
}

export class Parser {

    public static async sleep(ms: number) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

  public static async parseSoftwareProject(softwareProject: SoftwareProject, options?: ParserOptions, abortController?: MyAbortController, progressCallback?: any) {
      //console.log("Parser.parseSoftwareProject")
      let timer = new Timer();
        timer.start();

    let parserOptions = options || new ParserOptions(false);
    let filePaths = softwareProject.getFilePaths();
    //console.log("Parser.parseSoftwareProject filePaths")
    //console.log(filePaths)
    let index = 0;
    let amountOfFiles = filePaths.length;

    for (let filePath of filePaths) {
        //console.log("Parser.parseSoftwareProject filePath")
        //console.log(filePath)
        if(abortController){
            //console.log(abortController);
            //console.log("--- abortController.getStatus()? "+abortController.isAbort());
            if(abortController.isAbort()){
                //console.log("+++++++ stop parsing because of abortController");
                break;
            }
        }
        let file = softwareProject.getFile(filePath);
        await Parser.parseFile(file, parserOptions, index, amountOfFiles, progressCallback);
        index++;
    }

    timer.stop();
    timer.printElapsedTime("Parser.parseSoftwareProject");
  }

  public static async parseFile(file: MyFile, options: ParserOptions, index, amountOfFiles, progressCallback?: any): Promise<Dictionary<ClassOrInterfaceTypeContext> | null> {
        //console.log("Parser.parseFile")
        //console.log(JSON.stringify(file.ast))
        file.ast = {}; // reset ast
        let filePath = file.path;
        let fileExtension = Parser.getFileExtension(filePath);
        if(progressCallback){
           await progressCallback("Parsing file: "+filePath, index, amountOfFiles);
        }
        switch (fileExtension) {
            // TODO own parser for each language as plugin
            case 'java':
              try{
                  let parser = new JavaLanguageSupport().getParser();
                  let result = parser.parse(file, options.includePositions);
                  if(result){
                      file.ast = result;
                  }
                  return result;
              } catch (e) {
                console.log(e);
              }
              break;
            default:
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
