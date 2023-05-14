import {JavaLanguageSupport} from "./languages/java";
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
      let timer = new Timer();
        timer.start();


    await Parser.preParseSoftwareProject(softwareProject, options, abortController, progressCallback);
    await Parser.postParseSoftwareProject(softwareProject, options, abortController, progressCallback);

    timer.stop();
    timer.printElapsedTime("Parser.parseSoftwareProject");
  }

  private static async preParseSoftwareProject(softwareProject: SoftwareProject, options?: ParserOptions, abortController?: MyAbortController, progressCallback?: any) {
      let timer = new Timer();
      timer.start();

      let parserOptions = options || new ParserOptions(false);
      let filePaths = softwareProject.getFilePaths();
      let index = 0;
      let amountOfFiles = filePaths.length;

      // STEP 1: we need to pre parse all files before we can parse the files that reference other files
      if(abortController && !abortController.isAbort()){
          for (let filePath of filePaths) {
              if(abortController && abortController.isAbort()){
                  break;
              }
              let file = softwareProject.getFile(filePath);
              await Parser.preParseFile(softwareProject, file, parserOptions, index, amountOfFiles, progressCallback);
              index++;
          }
      }

      timer.stop();
      timer.printElapsedTime("Parser.parseSoftwareProject");
  }


    private static async postParseSoftwareProject(softwareProject: SoftwareProject, options?: ParserOptions, abortController?: MyAbortController, progressCallback?: any) {
        let timer = new Timer();
        timer.start();

        let parserOptions = options || new ParserOptions(false);
        let filePaths = softwareProject.getFilePaths();
        let index = 0;
        let amountOfFiles = filePaths.length;

        // STEP 2: we need to parse all files that reference other files
        if(abortController && !abortController.isAbort()){
            for (let filePath of filePaths) {
                if(abortController && abortController.isAbort()){
                        break;
                }
                let file = softwareProject.getFile(filePath);
                await Parser.postParseFile(softwareProject, file, parserOptions, index, amountOfFiles, progressCallback);
                index++;
            }
        }

        timer.stop();
        timer.printElapsedTime("Parser.parseSoftwareProject");
    }

    /**
     * We parse a single file with only the information we can find in this file.
     * After that we parse the file again with the information we have from all other files.
     * @param file
     * @param options
     * @param index
     * @param amountOfFiles
     * @param progressCallback
     * @private
     */
  private static async preParseFile(softwareProject: SoftwareProject, file: MyFile, options: ParserOptions, index, amountOfFiles, progressCallback?: any): Promise<any> {
        //console.log("Parser.parseFile")
        //console.log(JSON.stringify(file.ast))
        let filePath = file.path;
        file.ast = {};
        if(progressCallback){
           await progressCallback("Pre Parsing file: "+filePath, index, amountOfFiles);
        }

        let parser = Parser.getFileSpecificParser(softwareProject, file, options);
        if(parser){
            await parser.preParse(softwareProject, file, options);
        }
        return null;
  }

  private static getFileSpecificParser(softwareProject: SoftwareProject, file: MyFile, options: ParserOptions){
      let fileExtension = file.getFileExtension()
      let extensionToBeChecked = softwareProject.fileExtensionsToBeChecked;
      if(fileExtension){
          if(extensionToBeChecked && extensionToBeChecked[fileExtension]){
              switch (fileExtension) {
                  // TODO own parser for each language as plugin
                  case 'java':
                      try{
                          return new JavaLanguageSupport().getParser();
                      } catch (e) {
                          console.log(e);
                      }
                      break;
                  default:
                      break;
              }
              return null;
          }
      }

  }

    /**
     * After a file is pre parsed we can parse the file again with the information we have from all other files.
     * @param softwareProject
     * @param softwareProjectDicts
     * @param file
     * @param options
     * @param index
     * @param amountOfFiles
     * @param progressCallback
     */
  public static async postParseFile(softwareProject: SoftwareProject, file: MyFile, options: ParserOptions, index, amountOfFiles, progressCallback?: any): Promise<any> {
        let filePath = file.path;
        if(progressCallback){
            await progressCallback("Post Parsing file: "+filePath, index, amountOfFiles);
        }

        let parser = Parser.getFileSpecificParser(softwareProject, file, options);
        if(parser){
            await parser.postParse(softwareProject, file, options);
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
