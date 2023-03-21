import {Parser} from "../";
import {SimpleFields, FieldsInClassInClass} from "./exampleDataClumps/java";

import {
  parse,
  BaseJavaCstVisitor,
  BaseJavaCstVisitorWithDefaults,
  CstNode
} from "java-parser";

// Use "BaseJavaCstVisitor" if you need to implement all the visitor methods yourself.
class MyClassCollector extends BaseJavaCstVisitorWithDefaults {
  customResult: any[];

  constructor() {
    super();
    this.customResult = [];
    this.validateVisitor();
  }

  classDeclaration(ctx: any) {
    //console.log("########################");
    //console.log("Found class");
    //console.log(ctx);
    /**
     Found class
           {
        classModifier: [ { name: 'classModifier', children: [Object], location: [Object] } ],
        normalClassDeclaration: [
          {
            name: 'normalClassDeclaration',
            children: [Object],
            location: [Object]
          }
        ]
      }
     */

    let classMemberCollector = new MyClassMemberDeclarationCollector();
    classMemberCollector.visit(ctx?.normalClassDeclaration);
    let listOfVariables = classMemberCollector.customResult;

    let className = ctx?.normalClassDeclaration[0]?.children?.typeIdentifier[0]?.children?.Identifier[0]?.image;
    this.customResult.push({
        className: className,
        listOfMemberVariables: listOfVariables
    });

//    if (ctx.lambdaParameters[0].children.Identifier) {
  //    this.customResult.push(ctx.Arrow[0].startOffset);
    //}
  }
}

class MyClassMemberDeclarationCollector extends BaseJavaCstVisitorWithDefaults {
  customResult: any[];

  constructor() {
    super();
    this.customResult = [];
    this.validateVisitor();
  }

  classMemberDeclaration(ctx: any) {
    //console.log("++++++++++++++++++++++++++++");
    //console.log("Found classMemberDeclaration");
    //console.log(ctx);
    /**
     Found classMemberDeclaration
     {
        fieldDeclaration: [
          {
            name: 'fieldDeclaration',
            children: [Object],
            location: [Object]
          }
        ]
      }
     */

    console.log("++++++++++++++++++++++++++++");
    console.log("classMemberDeclaration")
    let myFieldTypeDeclarationCollector = new MyFieldTypeDeclarationCollector();
    myFieldTypeDeclarationCollector.visit(ctx?.fieldDeclaration);

    let myVariableDeclarationCollector = new MyVariableDeclarationCollector();
    myVariableDeclarationCollector.visit(ctx?.fieldDeclaration);
    let varaibleObj = myVariableDeclarationCollector.customResult;
    if(!!varaibleObj){
      console.log("Objs");
      console.log(varaibleObj);
      this.customResult.push(varaibleObj);
    }
//    if (ctx.lambdaParameters[0].children.Identifier) {
    //    this.customResult.push(ctx.Arrow[0].startOffset);
    //}
  }
}

class MyFieldTypeDeclarationCollector extends BaseJavaCstVisitorWithDefaults {
  customResult: any;

  constructor() {
    super();
    this.customResult = null;
    this.validateVisitor();
  }

  unannType(ctx: any) {
    //console.log("------------------------");
    //console.log("Found variableDeclarator");
    console.log(ctx);

  }
}

class MyVariableDeclarationCollector extends BaseJavaCstVisitorWithDefaults {
  customResult: any;

  constructor() {
    super();
    this.customResult = null;
    this.validateVisitor();
  }

  variableDeclarator(ctx: any) {
    //console.log("------------------------");
    //console.log("Found variableDeclarator");
    /**
     {
      variableDeclaratorId: [
        {
          name: 'variableDeclaratorId',
          children: [Object],
          location: [Object]
        }
      ],
      Equals: [
        {
          image: '=',
          startOffset: 280,
          endOffset: 280,
          startLine: 15,
          endLine: 15,
          startColumn: 25,
          endColumn: 25,
          tokenTypeIdx: 120,
          tokenType: [Object]
        }
      ],
      variableInitializer: [
        {
          name: 'variableInitializer',
          children: [Object],
          location: [Object]
        }
      ]
    }
     */
    //console.log(ctx);
    let variableName = ctx.variableDeclaratorId[0].children.Identifier[0].image
//    console.log(variableName);
    this.customResult = {
        variableName: variableName
    };

//    if (ctx.lambdaParameters[0].children.Identifier) {
    //    this.customResult.push(ctx.Arrow[0].startOffset);
    //}
  }
}


async function main() {
  console.log('Start test');
  let parser = new Parser();
  console.log('Parser created');
  let javaText = SimpleFields;

  console.log('File parsing');
  const cst = parse(javaText);
  console.log('File parsed');

  const myClassCollector = new MyClassCollector();
// The CST result from the previous code snippet
  myClassCollector.visit(cst);
  myClassCollector.customResult.forEach(collectedClassMemberVariables => {
    console.log(collectedClassMemberVariables);
  });

  // Ignore categoryMatches

}

main();
