import React, {FunctionComponent, useState} from 'react';
import Graph from "react-graph-vis";
import {
    DataClumpsParameterFromContext,
    DataClumpsTypeContext,
    DataClumpTypeContext
} from "../../api/src/ignoreCoverage/DataClumpTypes";
import {
    ClassOrInterfaceTypeContext,
    MemberFieldParameterTypeContext,
    MethodTypeContext,
    MyFile,
    ParameterTypeContext
} from "../../api/src/ignoreCoverage/ParsedAstTypes";
import {SoftwareProjectDicts} from "../../api/src/";
import {Button} from "primereact/button";

// @ts-ignore
export interface DataClumpsGraphProps {
    dataClumpsDict: DataClumpsTypeContext | null,
    softwareProjectDicts: SoftwareProjectDicts | null
    activeFileKey: string | null,
}

export const DataClumpsGraph : FunctionComponent<DataClumpsGraphProps> = (props: DataClumpsGraphProps) => {

    const [showLargeGraph, setShowLargeGraph] = useState(false);

    function getInitialGraphFromDataClumpsDict(){
        //console.log("getInitialGraphFromDataClumpsDict");

        let softwareProjectDicts: SoftwareProjectDicts | null = props.softwareProjectDicts;
        let activeFileKey: string | null = props.activeFileKey;

        let dataClumpsDict = props.dataClumpsDict;

        let files_dict = {};
        let classes_dict = {};
        let fields_dict = {};
        let methods_dict = {};
        let parameters_dict = {};

        if(dataClumpsDict && softwareProjectDicts){

            let dataClumps = dataClumpsDict?.data_clumps || {};
            let dataClumpsKeys = Object.keys(dataClumps);
            for(let dataClumpKey of dataClumpsKeys){
                let dataClump = dataClumps[dataClumpKey];
                let copyOfDataClump = JSON.parse(JSON.stringify(dataClump));
                //console.log("dataClump", copyOfDataClump);

                let file_path = dataClump.file_path;

                let shouldAnalyzeFile = true;

                if(activeFileKey && file_path !== activeFileKey){
                    shouldAnalyzeFile = false;
                }

                if(shouldAnalyzeFile){
                    let data_clump_data_dict = dataClump.data_clump_data;
                    let dataClumpDataKeys = Object.keys(data_clump_data_dict);
                    for(let dataClumpDataKey of dataClumpDataKeys){
                        let dataClumpData = data_clump_data_dict[dataClumpDataKey];
                        initNodesForDataClumpData(dataClump, dataClumpData, softwareProjectDicts, files_dict, classes_dict, fields_dict, methods_dict, parameters_dict);
                    }
                }
            }
        }

        let graph = {
            nodes: [],
            edges: []
        }

        let files_dict_keys = Object.keys(files_dict);
        for(let file_dict_key of files_dict_keys){
            let file_dict_value = files_dict[file_dict_key];
            // @ts-ignore
            graph.nodes.push(file_dict_value);
            let classes_or_interfaces_ids = file_dict_value.classes_or_interfaces_ids;
            let classes_or_interfaces_ids_keys = Object.keys(classes_or_interfaces_ids);
            for(let classes_or_interfaces_ids_key of classes_or_interfaces_ids_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: file_dict_value.id,
                    // @ts-ignore
                    to: classes_or_interfaces_ids_key,
                });
            }
        }

        let classes_dict_keys = Object.keys(classes_dict);
        for(let class_dict_key of classes_dict_keys){
            let class_dict_value = classes_dict[class_dict_key];
            // @ts-ignore
            graph.nodes.push(class_dict_value);
            let field_ids = class_dict_value.field_ids;
            let field_ids_keys = Object.keys(field_ids);
            for(let field_ids_key of field_ids_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: class_dict_value.id,
                    // @ts-ignore
                    to: field_ids_key,
                });
            }

            let method_ids = class_dict_value.method_ids;
            let method_ids_keys = Object.keys(method_ids);
            for(let method_ids_key of method_ids_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: class_dict_value.id,
                    // @ts-ignore
                    to: method_ids_key,
                });
            }
        }

        let fields_dict_keys = Object.keys(fields_dict);
        for(let field_dict_key of fields_dict_keys){
            let field_dict_value = fields_dict[field_dict_key];
            // @ts-ignore
            graph.nodes.push(field_dict_value);

            let related_to = field_dict_value.related_to;
            let related_to_keys = Object.keys(related_to);
            for(let related_to_key of related_to_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: field_dict_value.id,
                    // @ts-ignore
                    to: related_to_key,
                });
            }
        }

        let method_ids = Object.keys(methods_dict);
        for(let method_id of method_ids){
            let method_dict_value = methods_dict[method_id];
            // @ts-ignore
            graph.nodes.push(method_dict_value);
            let parameter_ids = method_dict_value.parameter_ids;
            let parameter_ids_keys = Object.keys(parameter_ids);
            for(let parameter_ids_key of parameter_ids_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: method_dict_value.id,
                    // @ts-ignore
                    to: parameter_ids_key,
                });
            }
        }

        let parameters_dict_keys = Object.keys(parameters_dict);
        for(let parameter_dict_key of parameters_dict_keys){
            let parameter_dict_value = parameters_dict[parameter_dict_key];
            // @ts-ignore
            graph.nodes.push(parameter_dict_value);

            let related_to = parameter_dict_value.related_to;
            let related_to_keys = Object.keys(related_to);
            for(let related_to_key of related_to_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: parameter_dict_value.id,
                    // @ts-ignore
                    to: related_to_key,
                });
            }
        }

        return graph;
    }

    function getRawFileNode(file_path, softwareProjectDicts: SoftwareProjectDicts, files_dict: any){
        let file_node = files_dict[file_path];
        if(!file_node){
            file_node = {
                id: file_path,
                label: file_path,
                color: "red",
                classes_or_interfaces_ids: {},
            }
            files_dict[file_node.id] = file_node;
        }
        return file_node;
    }

    function getRawClassesOrInterfacesNode(classOrInterface: ClassOrInterfaceTypeContext, softwareProjectDicts: SoftwareProjectDicts, classes_dict: any){
        let class_or_interface_node = classes_dict[classOrInterface.key];
        if(!class_or_interface_node){
            class_or_interface_node = {
                id: classOrInterface.key,
                label: classOrInterface.name,
                color: "lightblue",
                field_ids: {},
                method_ids: {},
            }
            classes_dict[class_or_interface_node.id] = class_or_interface_node;
        }
        return class_or_interface_node;
    }

    function getRawMethodNode(method: MethodTypeContext, softwareProjectDicts: SoftwareProjectDicts, methods_dict: any){
        let method_node = methods_dict[method.key];
        if(!method_node){
            method_node = {
                id: method.key,
                label: method.name,
                color: "green",
                parameter_ids: {},
            }
            methods_dict[method_node.id] = method_node;
        }
        return method_node;
    }

    function getRawParameterNode(parameter: ParameterTypeContext, softwareProjectDicts: SoftwareProjectDicts, parameters_dict: any){
        let parameter_node = parameters_dict[parameter.key];
        if(!parameter_node){
            parameter_node = {
                id: parameter.key,
                label: parameter.name,
                color: "yellow",
                related_to: {},
            }
            parameters_dict[parameter_node.id] = parameter_node;
        }
        return parameter_node;
    }

    function getRawFieldNode(parameter: MemberFieldParameterTypeContext, softwareProjectDicts: SoftwareProjectDicts, fields_dict: any){
        let field_node = fields_dict[parameter.key];
        if(!field_node){
            field_node = {
                id: parameter.key,
                label: parameter.name,
                color: "orange",
                related_to: {},
            }
            fields_dict[field_node.id] = field_node;
        }
        return field_node;
    }

    function createRawLinkBetweenParameterOrFieldNodes(field_node: any, related_to_field_node: any){
        field_node.related_to[related_to_field_node.id] = related_to_field_node.id;
        related_to_field_node.related_to[field_node.id] = field_node.id;
    }

    function initNodesForDataClumpData(dataClumpHolder: DataClumpTypeContext, dataClumpData: DataClumpsParameterFromContext, softwareProjectDicts: SoftwareProjectDicts, files_dict, classes_dict, fields_dict, methods_dict, parameters_dict){
        let file_path = dataClumpHolder.file_path;
        let file_node = getRawFileNode(file_path, softwareProjectDicts, files_dict);

        let data_clump_type = dataClumpHolder.data_clump_type;
        if(data_clump_type==="parameter_data_clump"){
            //console.log("parameter_data_clump")
            //console.log(dataClumpData);

            let parameter_key = dataClumpData.key;
            //console.log("parameter_key")
            //console.log(parameter_key)

            let parameter = softwareProjectDicts.dictMethodParameters[parameter_key];
            //console.log("parameter")
            //console.log(parameter)

            let method_key = parameter.methodKey;
            //console.log("method_key")
            //console.log(method_key)
            let method = softwareProjectDicts.dictMethod[method_key];
            //console.log("method")
            //console.log(method)

            let classOrInterfaceKey = method.classOrInterfaceKey
            let class_or_interface = softwareProjectDicts.dictClassOrInterface[classOrInterfaceKey];
            let class_or_interface_node = getRawClassesOrInterfacesNode(class_or_interface, softwareProjectDicts, classes_dict);
            file_node.classes_or_interfaces_ids[class_or_interface_node.id] = class_or_interface_node.id;

            let method_node = getRawMethodNode(method, softwareProjectDicts, methods_dict);
            class_or_interface_node.method_ids[method_node.id] = method_node.id;

            let parameter_node = getRawParameterNode(parameter, softwareProjectDicts, parameters_dict);
            method_node.parameter_ids[parameter_node.id] = parameter_node.id;

            let related_to_context = dataClumpData.related_to_context;
            let related_to_parameter_context = related_to_context.parameter;
            let related_to_parameter_key = related_to_parameter_context.key;
            let related_to_parameter = softwareProjectDicts.dictMethodParameters[related_to_parameter_key];
            let related_to_parameter_node = getRawParameterNode(related_to_parameter, softwareProjectDicts, parameters_dict);

            createRawLinkBetweenParameterOrFieldNodes(parameter_node, related_to_parameter_node);

            let related_to_method_key = related_to_parameter.methodKey;
            let related_to_method = softwareProjectDicts.dictMethod[related_to_method_key];
            let related_to_method_node = getRawMethodNode(related_to_method, softwareProjectDicts, methods_dict);
            related_to_method_node.parameter_ids[related_to_parameter_node.id] = related_to_parameter_node.id;

            let related_to_class_or_interface_key = related_to_method.classOrInterfaceKey;
            let related_to_class_or_interface = softwareProjectDicts.dictClassOrInterface[related_to_class_or_interface_key];
            let related_to_class_or_interface_node = getRawClassesOrInterfacesNode(related_to_class_or_interface, softwareProjectDicts, classes_dict);
            related_to_class_or_interface_node.method_ids[related_to_method_node.id] = related_to_method_node.id;

            let related_to_file_path = related_to_class_or_interface.fileKey;
            let related_to_file_node = getRawFileNode(related_to_file_path, softwareProjectDicts, files_dict);

            related_to_file_node.classes_or_interfaces_ids[related_to_class_or_interface_node.id] = related_to_class_or_interface_node.id;
        }
        else if(data_clump_type==="field_data_clump"){

            //console.log("field_data_clump")

            let field_key = dataClumpData.key;
            //console.log("field_key")
            //console.log(field_key)
            let field = softwareProjectDicts.dictMemberFieldParameters[field_key];
            //console.log("field")
            let copy_field = JSON.parse(JSON.stringify(field));
            //console.log(copy_field)

            let classOrInterfaceKey = field.classOrInterfaceKey;
            //console.log("classOrInterfaceKey")
            //console.log(classOrInterfaceKey)
            let class_or_interface = softwareProjectDicts.dictClassOrInterface[classOrInterfaceKey];
            let class_or_interface_node = getRawClassesOrInterfacesNode(class_or_interface, softwareProjectDicts, classes_dict);
            file_node.classes_or_interfaces_ids[class_or_interface_node.id] = class_or_interface_node.id;


            let field_node = getRawFieldNode(field, softwareProjectDicts, fields_dict);
            class_or_interface_node.field_ids[field_node.id] = field_node.id;

            let related_to_context = dataClumpData.related_to_context;
            let related_to_field_context = related_to_context.parameter;
            let related_to_field_key = related_to_field_context.key;
            let related_to_field = softwareProjectDicts.dictMemberFieldParameters[related_to_field_key];
            let related_to_field_node = getRawFieldNode(related_to_field, softwareProjectDicts, fields_dict);


            createRawLinkBetweenParameterOrFieldNodes(field_node, related_to_field_node);

            let related_to_class_or_interface_key = related_to_field.classOrInterfaceKey;
            let related_to_class_or_interface = softwareProjectDicts.dictClassOrInterface[related_to_class_or_interface_key];
            let related_to_class_or_interface_node = getRawClassesOrInterfacesNode(related_to_class_or_interface, softwareProjectDicts, classes_dict);
            related_to_class_or_interface_node.field_ids[related_to_field_node.id] = related_to_field_node.id;

            let related_to_file_path = related_to_class_or_interface.fileKey;
            let related_to_file_node = getRawFileNode(related_to_file_path, softwareProjectDicts, files_dict);
            related_to_file_node.classes_or_interfaces_ids[related_to_class_or_interface_node.id] = related_to_class_or_interface_node.id;
        }
    }


    const [state, setState] = useState({
        counter: 5,
        graph: getInitialGraphFromDataClumpsDict(),
/**        graph: {
            nodes: [
                { id: 1, label: "Node 1", color: "#e04141" },
                { id: 2, label: "Node 2", color: "#e09c41" },
                { id: 3, label: "Node 3", color: "#e0df41" },
                { id: 4, label: "Node 4", color: "#7be041" },
                { id: 5, label: "Node 5", color: "#41e0c9" }
            ],
            edges: [
                { from: 1, to: 2 },
                { from: 1, to: 3 },
                { from: 2, to: 4 },
                { from: 2, to: 5 }
            ]
        }, */
        events: {
            select: ({ nodes, edges }) => {
                console.log("Selected nodes:");
                console.log(nodes);
                console.log("Selected edges:");
                console.log(edges);
                alert("Selected node: " + nodes);
            }
        }
    })
    const { graph, events } = state;

    function renderGraph(){

        const options = {
            layout: {
                hierarchical: false
            },
            edges: {
                color: "#000000"
            }
        };


        const events = {
            select: function(event) {
                var { nodes, edges } = event;
            }
        };
        return (
            <Graph graph={graph} options={options} events={events} style={{ height: "100%", width: "100%" }} />
        );
    }

    let amountNodes = graph?.nodes?.length || 0;
    let amountEdges = graph?.edges?.length || 0;

    function renderSecureGraph(){
        let largeGraph = amountNodes > 1000;
        if(largeGraph && !showLargeGraph){
            return(
                <div style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>
                    <div style={{height: "100%", width: "100%", display: "flex", alignItems: "center", flexDirection: "column"}} >
                        <div style={{display: "block"}}>
                            <h1>Graph is very large</h1>
                            <div>Nodes: {amountNodes}</div>
                            <div>Edges: {amountEdges}</div>
                            <h2>{"Select a specific file"}</h2>
                        </div>
                        <div style={{paddingTop: "30px", paddingBottom: "30px"}}>{"or"}</div>
                        <Button
                            className="p-button-danger"
                            icon="pi pi-exclamation-triangle"
                            label={"Show large graph"}
                            onClick={() => {
                                setShowLargeGraph(true);
                            }}/>
                    </div>
                </div>
            )
        } else {
            return renderGraph();
        }
    }

    return(
        <div style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>
            <div style={{height: "100%", width: "100%"}} >
                {renderSecureGraph()}
            </div>
        </div>
    )

}
