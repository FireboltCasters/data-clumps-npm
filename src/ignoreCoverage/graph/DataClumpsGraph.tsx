import React, {FunctionComponent} from 'react';
import {Menubar} from 'primereact/menubar';
import Graph from "react-graph-vis";

// @ts-ignore
export interface DataClumpsGraphProps {
    dataClumpsDict: any
}

export const DataClumpsGraph : FunctionComponent<DataClumpsGraphProps> = (props: DataClumpsGraphProps) => {

    function renderGraph(){
        const graph = {
            nodes: [
                { id: 1, label: "Node 1", title: "node 1 tootip text" },
                { id: 2, label: "Node 2", title: "node 2 tootip text" },
                { id: 3, label: "Node 3", title: "node 3 tootip text" },
                { id: 4, label: "Node 4", title: "node 4 tootip text" },
                { id: 5, label: "Node 5", title: "node 5 tootip text" }
            ],
            edges: [
                { from: 1, to: 2 },
                { from: 1, to: 3 },
                { from: 2, to: 4 },
                { from: 2, to: 5 }
            ]
        };

        const physics = {
            barnesHut: {
                gravitationalConstant: -2000,
                springLength: 250,
                springConstant: 0.04,
                damping: 0.09,
                avoidOverlap: 0
            },
            maxVelocity: 50,
            minVelocity: 0.1,
            solver: 'barnesHut',
            stabilization: {
                enabled: true,
                iterations: 1000,
                updateInterval: 50,
                onlyDynamicEdges: false,
                fit: true
            },
            wobbly: {
                enabled: true,
                stiffness: 100,
                damping: 10,
                range: {
                    x: 10,
                    y: 10
                }
            }
        };


        const options = {
            layout: {
                hierarchical: true
            },
            edges: {
                color: "#000000"
            },
            autoResize: true,
            physics: physics,
            height: "500px",
            width: "500px"
        };

        const events = {
            select: function(event) {
                var { nodes, edges } = event;
            }
        };
        return (
            <Graph
                graph={graph}
                options={options}
                events={events}
                getNetwork={network => {
                    //  if you want access to vis.js network api you can set the state in a parent component using this property
                }}
            />
        );
    }

    return(
        <div style={{height: "100%", width: "100%", backgroundColor: "orange"}}>
            <div style={{height: "100%", width: "100%"}} >
                {renderGraph()}
            </div>
        </div>
    )

}
