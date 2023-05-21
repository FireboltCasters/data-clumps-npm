import {Dictionary} from "./UtilTypes";

export type DataClumpsParameterFromContext = {
    key: string;
    name: string;
    type: string;
    modifiers: string[] | undefined;
    related_to_context: DataClumpsParameterTypeRelatedToContext;
}

export type DataClumpsParameterToContext = {
    key: string;
    name: string;
    type: string;
    modifiers: string[] | undefined;
}

export type DataClumpsParameterTypeRelatedToContext = {
    key: string; // typically the file path + class name + method name + parameter names
    file_path: string;
    class_or_interface_name: string;
    class_or_interface_key: string;

    method_name: string | null;
    method_key: string | null;

    parameter: DataClumpsParameterToContext
}

export type DataClumpTypeContext = {
    // Data clumps parameter pairs may not have the same name or type (e.g. int a, Integer a) (e.g. int x, int xPos)
    // Therefore a detected data clump should tell us, which parameter of which method is the data clump
    // example: Data Clumps 1: (int x, in method1 matches int xPos, in method2)

    type: string; // "data_clump"
    key: string; // typically the file path + class name + method name + parameter names
    file_path: string;
    class_or_interface_name: string;
    class_or_interface_key: string;

    method_name: string | null;
    method_key: string | null;

    data_clump_type: string; // "parameter_data_clump" or "field_data_clump"
    data_clump_data: Dictionary<DataClumpsParameterFromContext>
}

export type DataClumpsTypeContext = {
    version: string;
    data_clumps: Dictionary<DataClumpTypeContext>;
}

