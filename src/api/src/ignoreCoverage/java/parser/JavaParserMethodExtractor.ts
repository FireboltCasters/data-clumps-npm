import {JavaParserHelper} from "./JavaParserHelper";
import {MethodParameterTypeContext, MethodTypeContext} from "./../../ParsedTypes";

export class JavaParserMethodExtractor {
    public output: MethodTypeContext;
    public key: string;
    public includePosition: boolean;
    constructor(includePosition: boolean) {
        this.includePosition = includePosition;
        this.key = "";
        this.output = new MethodTypeContext();
    }

    custom_getFormalParameterType(ctx){
        return ctx.getText();
    }

    custom_getFormalParameter(ctx){
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
        let parameter: MethodParameterTypeContext = new MethodParameterTypeContext();
        let typeType = ctx.children[0];
        let type = this.custom_getFormalParameterType(typeType);
        parameter.type = type;
        let variableDeclaratorId = ctx.children[1];
        let name = variableDeclaratorId.getText();
        parameter.name = name;

        if(this.includePosition){
            parameter.position = JavaParserHelper.custom_getPosition(ctx);
        }

        return parameter;
    }

    custom_getFormalParameters(ctx){
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
                    let parameter = this.custom_getFormalParameter(formalParameter);
                    // @ts-ignore
                    parameters.push(parameter);
                }
            }
        }
        return parameters;
    }


    enterMethodDeclaration(ctx, modifierCtx) {
        // get visibility from parent
        this.output.modifiers = JavaParserHelper.getModifiers(modifierCtx);
        //method["position"] = custom_getPosition(ctx.parentCtx.parentCtx);

        // get method name
        let methodName = ctx.children[1].getText();
        this.output.name = methodName;

        // get return type
        let returnType = ctx.children[0].getText();
        this.output.returnType = returnType;
        // get visibility
        let formalParameters = ctx.children[2];
        let parameters = this.custom_getFormalParameters(formalParameters);
        this.output.parameters = parameters;

        if(this.includePosition){
            this.output.position = JavaParserHelper.custom_getPosition(ctx);
        }

        // @ts-ignore
        let methodSignature = methodName + "("+parameters.map(p=>p.type).join(",")+")";
        this.key = methodSignature;
        return this.output;
    }
}
