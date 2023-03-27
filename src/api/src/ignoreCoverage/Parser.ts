import {
  BaseJavaCstVisitorWithDefaults,
  parse,
} from "./java-parser/src/index";

import {
  ClassTypeCtx,
  TypeArgumentCstNode,
  UnannClassTypeCtx,
  UnannPrimitiveTypeCtx
} from "./java-parser/api";

class MyFile{
    public content: string;
    public path: string;
    public constructor(path: string, content: string){
        this.content = content;
        this.path = path;
    }
}

export default class Parser {

  public filesToParseDict: {[key: string]: MyFile} = {};
  public result: any;

  constructor() {
    this.filesToParseDict = {};
  }

  public addFileContentToParse(path: string, fileContent: string) {
    let newFileToAdd = new MyFile(path, fileContent);
    return this.addFileToParse(newFileToAdd);
  }

  public addFileToParse(file: MyFile) {
    this.filesToParseDict[file.path] = file;
  }

  public getFieldsAndMethods() {
    console.log('Parser created');
    let firstFile = this.filesToParseDict[Object.keys(this.filesToParseDict)[0]];
    let javaText = firstFile.content;

    console.log('File parsing');
    const cst = parse(javaText);
    console.log('File parsed');

    const myClassCollector = new MyClassCollector();
// The CST result from the previous code snippet
    myClassCollector.visit(cst);
    console.log("######### RESULTS #########")
    myClassCollector.customResult.forEach(collectedClassMemberVariables => {
      console.log(collectedClassMemberVariables);
    });

    let result = myClassCollector.customResult;
    this.result = result;
    return result;
  }

}


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

    let myFieldTypeDeclarationCollector = new MyFieldTypeDeclarationCollector();
    myFieldTypeDeclarationCollector.visit(ctx?.fieldDeclaration);
    let fieldType = myFieldTypeDeclarationCollector.customResult;

    let myVariableDeclarationCollector = new MyVariableDeclarationCollector();
    myVariableDeclarationCollector.visit(ctx?.fieldDeclaration);
    let varaibleObj = myVariableDeclarationCollector.customResult;
    if(!!varaibleObj){
      varaibleObj.fieldType = fieldType;
      varaibleObj.key = fieldType + " " + varaibleObj.variableName;
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
    if(ctx?.unannPrimitiveTypeWithOptionalDimsSuffix){ // primitive type
      /**
       {
        unannPrimitiveTypeWithOptionalDimsSuffix: [
          {
            name: 'unannPrimitiveTypeWithOptionalDimsSuffix',
            children: [Object],
            location: [Object]
          }
        ]
      }
       */
      let myPrimitiveTypeCollector = new MyFieldTypeDeclarationCollectorPrimitiveType();
      myPrimitiveTypeCollector.visit(ctx?.unannPrimitiveTypeWithOptionalDimsSuffix);
      this.customResult = myPrimitiveTypeCollector.customResult;
    } else if(ctx?.unannReferenceType){ // reference type (class, interface, array)
      let myReferenceTypeCollector = new MyFieldTypeDeclarationCollectorReferenceType();
      myReferenceTypeCollector.visit(ctx?.unannReferenceType);
      this.customResult = myReferenceTypeCollector.customResult;
    }

  }
}

class MyFieldTypeDeclarationCollectorReferenceType extends BaseJavaCstVisitorWithDefaults {
  customResult: any;

  constructor() {
    super();
    this.customResult = null;
    this.validateVisitor();
  }

  unannClassType(ctx: UnannClassTypeCtx, param?: any): any {
    // example Map<Map<ArrayList<String>, String>, String>
    let classTypeCtx: ClassTypeCtx = ctx
    let result = this.customGetClassType(classTypeCtx);
    this.customResult = result;
  }

  customGetClassType(classTypeCtx: ClassTypeCtx): string{
    let type = classTypeCtx.Identifier[0].image; //TODO: what if for example: List is not from java.util.List but from java.awt.List?


    let result = type;
    if(classTypeCtx.typeArguments){
      result += "<";
      let children = classTypeCtx.typeArguments[0].children;
      let typeArgumentListChildrenTypeArgument = children.typeArgumentList[0]?.children.typeArgument;
      // typeArgumentListChildrenTypeArgument can be a list of typeArgument
      let amountOfTypeArguments = typeArgumentListChildrenTypeArgument.length;
      for(let i = 0; i < amountOfTypeArguments; i++){
        if(i > 0){
          result += ", ";
        }
        let typeArgument = typeArgumentListChildrenTypeArgument[i];
        let specificType = this.customGetTypeArgument(typeArgument);
        result += specificType;
      }

      result += ">";
    }
    return result;
  }

  customGetTypeArgument(typeArgument:  TypeArgumentCstNode): string {
    let result = "";
    let referenceTypeNodeList = typeArgument?.children?.referenceType || [];
    if(!!referenceTypeNodeList && referenceTypeNodeList.length > 0){
      // @ts-ignore
      let classTypeCtx: ClassTypeCtx = referenceTypeNodeList[0].children?.classOrInterfaceType[0].children.classType[0].children;
      result = this.customGetClassType(classTypeCtx);
    }
    return result;
  }

}

class MyFieldTypeDeclarationCollectorTypeArgument extends BaseJavaCstVisitorWithDefaults {
  customResult: any;

  constructor() {
    super();
    this.customResult = null;
    this.validateVisitor();
  }

  classType(ctx: ClassTypeCtx, param?: any): any {
    console.log("ClassTypeCtx");
    console.log(ctx);
  }
}

class MyFieldTypeDeclarationCollectorPrimitiveType extends BaseJavaCstVisitorWithDefaults {
  customResult: any;

  constructor() {
    super();
    this.customResult = null;
    this.validateVisitor();
  }

  unannPrimitiveType(ctx: UnannPrimitiveTypeCtx, param?: any): any {
    /**
     {
      numericType: [ { name: 'numericType', children: [Object], location: [Object] } ]
    }
     */
    if(ctx.numericType){ // int, long, char, byte, short, float, double
      let child = ctx.numericType[0].children;
      if(child.integralType || child.floatingPointType){ // int, long, char, byte, short
        let childTypeKeyword = Object.keys(child)[0];
        // @ts-ignore
        let specificTypeObj = child[childTypeKeyword][0].children;
        let specificTypeKeyword = Object.keys(specificTypeObj)[0];
        // @ts-ignore
        let specificImage = specificTypeObj[specificTypeKeyword]?.[0]?.image;
        this.customResult = specificImage;
      }
    } else if(ctx.Boolean){ // boolean
      this.customResult = "boolean"
    }
    // lets get the type name from the field "image"
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
