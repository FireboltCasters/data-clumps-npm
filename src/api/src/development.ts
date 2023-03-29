import {JavaExamples} from "./index";
import {JavaLexer, JavaParser} from "./index";
import antlr4, {ParseTree} from 'antlr4';

import {ParseTreeVisitor} from "antlr4";
/**
class PrintVisitor extends ParseTreeVisitor<void> {
    private indentation: number;
    constructor() {
        super();
        this.indentation = 0;
    }

    visit(tree) {
        if (tree == null) {
            return;
        }

        if (tree.constructor.name.endsWith("Context")) {
            const ruleName = tree.constructor.name.replace("Context", "");
            const visitMethod = `visit${ruleName}`;
            if (this[visitMethod]) {
                this[visitMethod](tree);
            } else {
                this.defaultVisit(tree);
            }
        } else {
            this.defaultVisit(tree);
        }
    }

    defaultVisit(tree) {
        //console.log("defaultVisit"+" ".repeat(this.indentation) + tree.getText());
        for (const child of tree.children || []) {
            this.visit(child);
        }
    }

    visitCompilationUnit(tree) {
        for (const child of tree.children || []) {
            this.visit(child);
        }
    }

    visitPackageDeclaration(tree) {
        console.log("visitPackageDeclaration"+" ".repeat(this.indentation) + tree.getText());
    }

    visitImportDeclaration(tree) {
        console.log("visitImportDeclaration"+" ".repeat(this.indentation) + tree.getText());
    }

    visitClassDeclaration(tree) {
        console.log("visitClassDeclaration"+" ".repeat(this.indentation) + tree.getText());
        this.indentation += 2;
        for (const child of tree.children || []) {
            this.visit(child);
        }
        this.indentation -= 2;
    }

    visitMethodDeclaration(tree) {
        console.log("visitMethodDeclaration"+" ".repeat(this.indentation) + tree.getText());
        this.indentation += 2;
        for (const child of tree.children || []) {
            this.visit(child);
        }
        this.indentation -= 2;
    }

    // Add more visit methods for other types of nodes as needed
}
*/

async function main() {
  console.log('Start test 2');
//  const input = JavaExamples.SimpleFields
    const input = "public class MyClass { public static void main(String[] args) { System.out.println(\"Hello, world!\"); } }";
  const chars = new antlr4.InputStream(input);
    const lexer = new JavaLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new JavaParser(tokens);
    parser.buildParseTrees = true;
    const cst = parser.compilationUnit();



}

main();
