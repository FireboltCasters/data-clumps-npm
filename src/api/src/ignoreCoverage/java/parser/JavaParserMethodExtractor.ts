import {JavaParserHelper} from "./JavaParserHelper";
import {
    ParameterTypeContext,
    MethodTypeContext,
    ClassOrInterfaceTypeContext,
    MethodParameterTypeContext
} from "./../../ParsedAstTypes";

//TODO: check for class/interface declaration inside method declaration --> See anonymous class test case

export class JavaParserMethodExtractor {
    public output: MethodTypeContext;
    public classOrInterface: ClassOrInterfaceTypeContext;
    public includePosition: boolean;
    constructor(classOrInterface: ClassOrInterfaceTypeContext, ctx, modifierCtx, includePosition: boolean) {
        this.includePosition = includePosition;
        this.classOrInterface = classOrInterface;
        this.output = this.enterMethodDeclaration(ctx, modifierCtx);
    }

    custom_getFormalParameterType(ctx){
        return ctx.getText();
    }

    custom_getFormalParameter(ctx, method: MethodTypeContext){
        /**
         "type": "formalParameter",
         "node": "FormalParameterContext",
         "children": [
         {
                  "type": "typeType",
                  "node": "TypeTypeContext",
                  "children": [
                    {
                      "type": "classOrInterfaceType",
                      "node": "ClassOrInterfaceTypeContext",
                      "children": [
                        {
                          "type": "typeIdentifier",
                          "node": "TypeIdentifierContext",
                          "children": [
                            "List"
         */
        let typeType = ctx.children[0];
        let type = this.custom_getFormalParameterType(typeType);
        let variableDeclaratorId = ctx.children[1];
        let name = variableDeclaratorId.getText();
        let parameter: MethodParameterTypeContext = new MethodParameterTypeContext(name, name, type, [], method);

        if(this.includePosition){
            parameter.position = JavaParserHelper.custom_getPosition(ctx);
        }

        return parameter;
    }

    custom_getFormalParameters(ctx, method: MethodTypeContext){
        /**
         "type": "formalParameters",
         "node": "FormalParametersContext",
         "children": [
         "(",
         {
          "type": "formalParameterList",
          "node": "FormalParameterListContext",
         */
        let parameters: MethodParameterTypeContext[] = [];
        if(ctx.children.length>=3){ // has parameters: [ "(", formalParameterList, ")" ]
            let formalParameterList = ctx.children[1];
            for(let i = 0; i < formalParameterList.children.length; i++){
                let formalParameter = formalParameterList.children[i];
                if(formalParameter.getText()===","){
                    // skip
                } else {
                    let parameter = this.custom_getFormalParameter(formalParameter, method);
                    // @ts-ignore
                    parameters.push(parameter);
                }
            }
        }
        return parameters;
    }


    enterMethodDeclaration(ctx, modifierCtx) {
        // get visibility from parent
        let modifiers = JavaParserHelper.getModifiers(modifierCtx);
        //method["position"] = custom_getPosition(ctx.parentCtx.parentCtx);

        // get method name
        let methodName = ctx.children[1].getText();

        let formalParameters = ctx.children[2];

        // create an empty method, so that we can use it to get parameters
        let methodPlaceholder: MethodTypeContext = new MethodTypeContext("", methodName, modifiers, this.classOrInterface);
        // lets get the parameters but with incorrect methodplaceholder
        let parametersPlaceholder = this.custom_getFormalParameters(formalParameters, methodPlaceholder);

        // lets get the correct method signature from the names of the parameters
        let methodSignature = methodName + "("+parametersPlaceholder.map(p=>p.name).join(",")+")";
        // create the correct method
        let method: MethodTypeContext = new MethodTypeContext(methodSignature, methodName, modifiers, this.classOrInterface);
        // create the correct parameters
        let parameters = this.custom_getFormalParameters(formalParameters, method);
        // get return type
        let returnType = ctx.children[0].getText();
        method.returnType = returnType;
        // get visibility

        method.parameters = parameters;

        if(this.includePosition){
            method.position = JavaParserHelper.custom_getPosition(ctx);
        }

        // @ts-ignore

        return method;
    }
}
