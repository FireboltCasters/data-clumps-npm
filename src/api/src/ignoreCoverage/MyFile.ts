export class MyFile{
    public content: string;
    public path: string;
    public constructor(path: string, content: string){
        this.content = content;
        this.path = path;
    }
}
