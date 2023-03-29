import {JavaLexer, JavaParser} from "./../index";
import antlr4 from 'antlr4';

export class ParserAntlr4{
    static parse(code: string){
        const input = "public class MyClass { public static void main(String[] args) { System.out.println(\"Hello, world!\"); } }";
        const chars = new antlr4.InputStream(input);
        const lexer = new JavaLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new JavaParser(tokens);
        parser.buildParseTrees = true;
        const cst = parser.compilationUnit();
        console.log(cst);
        return cst.toStringTree(JavaParser.ruleNames, parser);
    }

}
