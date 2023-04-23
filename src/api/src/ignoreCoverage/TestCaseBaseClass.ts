import {MyFile} from "./ParsedAstTypes";
import {SoftwareProject} from "./SoftwareProject";


export class TestCaseBaseClass {
    public name: string;
    public files: MyFile[];
    public expectedResult: any;

    public constructor(name, files: MyFile[], expectedResult){
        this.name = name;
        this.files = files;
        this.expectedResult = expectedResult;
    }

    public getSoftwareProject(): SoftwareProject {
        let project = new SoftwareProject()
        project.addFiles(this.files)
        return project;
    }

    public getFiles(): MyFile[] {
        let filesDict = this.getSoftwareProject().getFilesDict();
        let files = Object.keys(filesDict).map((key) => filesDict[key]);
        return files;
    }
}
