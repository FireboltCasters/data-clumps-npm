import {JavaExamples} from "./index";
import {JavaLexer, JavaParser} from "./index";
import antlr4, {ParseTree} from 'antlr4';

import {ParseTreeVisitor} from "antlr4";

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
    console.log(Object.keys(cst));
    /**
     [
     'parentCtx',
     'invokingState',
     'children',
     'start',
     'stop',
     'exception',
     'importDeclaration',
     'typeDeclaration',
     'parser',
     'ruleIndex'
     ]
     */

    console.log(cst);

    //    console.log("------------------");
    //    console.log(cst.parentCtx); // null

    console.log("------------------");
    // @ts-ignore
    console.log(cst.children[0]);
    // @ts-ignore
    console.log(cst.children[0].getText());

    console.log(cst.toStringTree(JavaParser.ruleNames, parser));

    class CodePrintingVisitor extends ParseTreeVisitor<string> {
        visit(tree: ParseTree): string {
            if (Array.isArray(tree)) {
                for(let t of tree){
                    this.visit(t);
                }
                return "";
            } else {
                // @ts-ignore
                const hasChildren = tree.children && tree.children.length > 0;

                if(hasChildren){
                    this.visitChildren(tree);
                } else if(!!tree.getText){
                    console.log(tree.getText())
                } else {
                    //console.log("No getText method");
                }
                // @ts-ignore
                if(hasChildren){

                }
                return "";
            }
        }

        // Override other visit methods for each of your grammar rules as needed
    }

    // Generate modified code
    const myVisitor = new CodePrintingVisitor();
    const output = myVisitor.visit(cst);

  /**
  let parser = new Parser();
  console.log('Parser created');
  parser.addFileContentToParse('test.java', JavaExamples.SimpleFields);
  console.log('File added');
  let result = parser.getFieldsAndMethods();
  console.log('File parsed');
  console.log(JSON.stringify(result, null, 2));
  /**
   [
   {
    "className": "Fields1",
    "listOfMemberVariables": [
      {
        "variableName": "normalString",
        "fieldType": "String",
        "key": "String normalString"
      },
      {
        "variableName": "arrayListWithString",
        "fieldType": "ArrayList<String>",
        "key": "ArrayList<String> arrayListWithString"
      },
      {
        "variableName": "arrayListWithIntegerObject",
        "fieldType": "ArrayList<Integer>",
        "key": "ArrayList<Integer> arrayListWithIntegerObject"
      },
      {
        "variableName": "mapWithArrayListOfStringAndInteger",
        "fieldType": "Map<ArrayList<String>, Integer>",
        "key": "Map<ArrayList<String>, Integer> mapWithArrayListOfStringAndInteger"
      }
    ]
  }
   ]
   */
  /**
  let fieldVariables = {}
  for(let classMember of result){
      let className = classMember.className;
    for(let memberVariable of classMember.listOfMemberVariables){
      let key = memberVariable.key;
        // @ts-ignore
        if(fieldVariables[key] === undefined){
            // @ts-ignore
            fieldVariables[key] = {

            };
        }
        // @ts-ignore
        fieldVariables[key][className] = true;
    }
  }

  console.log(JSON.stringify(fieldVariables, null, 2));
*/
  // Ignore categoryMatches

}

main();
