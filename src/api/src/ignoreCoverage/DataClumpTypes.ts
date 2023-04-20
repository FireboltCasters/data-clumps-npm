import {Dictionary} from "./UtilTypes";

export type DataClumpsParametersContext = {
    key: string;
    name: string;
    type: string;
    modifiers: string[] | undefined;
}

export type DataClumpsParameterTypeRelatedToContext = {
    key: string; // typically the file path + class name + method name + parameter names
    file_path: string;
    class_name: string;
    method_name: string | null;
    parameters: Dictionary<DataClumpsParametersContext>
}

export type DataClumpTypeContext = {
    // Data clumps parameter pairs may not have the same name or type (e.g. int a, Integer a) (e.g. int x, int xPos)
    // Therefore a detected data clump should tell us, which parameter of which method is the data clump
    // example: Data Clumps 1: (int x, in method1 matches int xPos, in method2)

    type: string; // "data_clump"
    key: string; // typically the file path + class name + method name + parameter names
    file_path: string;
    class_or_interface_name: string;
    method_name: string | null;

    data_clump_type: string; // "parameter_data_clump" or "field_data_clump"
    data_clump_related_to: DataClumpsParameterTypeRelatedToContext; // to which our parameters are related to
    data_clump_data: Dictionary<DataClumpsParametersContext>
}

export type DataClumpsTypeContext = {
    //TODO: implement this return type which gives information about all the data clumps in the project
    // For all method data clumps
    // For all field data clumps

    version: string;
    data_clumps: Dictionary<DataClumpTypeContext>;
}

