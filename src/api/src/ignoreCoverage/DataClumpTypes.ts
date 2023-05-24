import {Dictionary} from "./UtilTypes";

/**
 * This type represents a parameter from the context in which a data clump exists.
 */
export type DataClumpsParameterFromContext = {
    // A unique identifier for this parameter.
    key: string;

    // The name of the parameter in the source code.
    name: string;

    // The data type of the parameter.
    type: string;

    // Modifiers applied to the parameter, e.g., 'public', 'private', 'readonly', etc.
    modifiers: string[] | undefined;

    // Representation of the matching parameter in the destination context.
    to_variable: DataClumpsParameterToContext;
}

/**
 * This type represents a parameter in the destination context matching a data clump.
 */
export type DataClumpsParameterToContext = {
    // A unique identifier for this parameter.
    key: string;

    // The name of the parameter in the source code.
    name: string;

    // The data type of the parameter.
    type: string;

    // Modifiers applied to the parameter, e.g., 'public', 'private', 'readonly', etc.
    modifiers: string[] | undefined;
}

/**
 * This type represents the context in which a data clump exists.
 */
export type DataClumpTypeContext = {
    // The type of the context, in this case always 'data_clump'.
    type: string;

    // A unique identifier typically composed of the file path, class name, method name, and parameter names.
    key: string;

    // The file path from where the data clump originates.
    from_file_path: string;

    // The name of the class or interface where the data clump originates.
    from_class_or_interface_name: string;

    // A unique key of the class or interface where the data clump originates.
    from_class_or_interface_key: string;

    // The name of the method where the data clump originates, if applicable.
    from_method_name: string | null;

    // A unique key of the method where the data clump originates, if applicable.
    from_method_key: string | null;

    // The file path to where the data clump points.
    to_file_path: string;

    // The name of the class or interface to where the data clump points.
    to_class_or_interface_name: string;

    // A unique key of the class or interface to where the data clump points.
    to_class_or_interface_key: string;

    // The name of the method to where the data clump points, if applicable.
    to_method_name: string | null;

    // A unique key of the method to where the data clump points, if applicable.
    to_method_key: string | null;

    // The specific type of data clump: 'parameter_data_clump' or 'field_data_clump'.
    data_clump_type: string;

    // A dictionary mapping keys to data clumps parameter from context.
    data_clump_data: Dictionary<DataClumpsParameterFromContext>
}

/**
 * This type encapsulates the context of multiple data clumps.
 */
export type DataClumpsTypeContext = {
    // The version of the context format or the tooling.
    version: string;

    // The options used during the data clump analysis.
    options: any;

    // A dictionary mapping keys to data clump contexts.
    data_clumps: Dictionary<DataClumpTypeContext>;
}
