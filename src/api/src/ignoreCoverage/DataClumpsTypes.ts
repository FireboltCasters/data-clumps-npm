import {MemberFieldParameterTypeContext, MethodTypeContext, ParameterTypeContext} from "./ParsedAstTypes";

export class RelatedParameters<T> {
    public sourceParameter: T;
    public targetParameter: T;

    public constructor(sourceParameter: T, targetParameter: T){
        this.sourceParameter = sourceParameter;
        this.targetParameter = targetParameter;
    }
}

export class DataFieldDataClumps {
    public relatedParameters: RelatedParameters<MemberFieldParameterTypeContext>[];

    public constructor(relatedParameters: RelatedParameters<MemberFieldParameterTypeContext>[]){
        this.relatedParameters = relatedParameters;
    }
}


