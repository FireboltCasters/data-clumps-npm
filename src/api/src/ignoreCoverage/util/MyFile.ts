import {ClassOrInterfaceTypeContext, Dictionary} from "../ParsedTypes";

export class MyFile{
    public content: string;
    public path: string;
    public ast: Dictionary<ClassOrInterfaceTypeContext>;
    public constructor(path: string, content: string){
        this.content = content;
        this.path = path;
        this.ast = {};
    }
}
