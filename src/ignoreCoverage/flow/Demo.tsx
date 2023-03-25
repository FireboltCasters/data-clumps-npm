import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {Panel} from "primereact/panel";
import {Divider} from "primereact/divider";
import {SpecialFields} from "../../api/src/ignoreCoverage/exampleDataClumps/java"; // this import alone was ok
import {Parser as DCParser} from "../../api/src/"; // newly added
import Editor  from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

loader.config({ monaco });

export const Demo : FunctionComponent = (props) => {

    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(); // declare the timer variable
    const [code, setCode] = useState<string>(SpecialFields);
//    const [code, setCode] = useState<string>("");
    const [result, setResult] = useState<string>("");


    useEffect(() => {
        document.title = "data-clumps api Demo"
    }, [])


    /**
     <Divider />
     <div style={{display: "flex", width: "100%", flexDirection: "row"}}>
     <Panel header={"Test"} style={{display: "flex", flexDirection: "column", flex: 3}}>
     <div style={{display: "flex", flex: 1, flexDirection: "column"}}>
     {"Domain"}
     <Button disabled={false} label="Save & Use" icon="pi pi-save" className="p-button-success" style={{margin: 5}} onClick={() => {

                                            }} />
     </div>
     </Panel>
     </div>
     */

    function handleCodeChange(newCode: string | undefined) {
        if (newCode) {
            setCode(newCode);
        } else {
            setCode("");
        }
        // check if timeout is already set and clear it
        if (timerId) {
            clearTimeout(timerId);
        }
        // set a new timeout
        let newTimerId = setTimeout(() => {
            // do something
            console.log("timeout");
            handleParser()
        }, 1000);
        setTimerId(newTimerId);
    }

    function handleParser(){
        console.log("handleParser");

        // newly added
        let parser = new DCParser();
        parser.addFileContentToParse("test.java", code);
        let result = parser.parse();
        console.log(result);
        setResult(JSON.stringify(result, null, 2));

    }

    return (
                <div style={{width: "100%", height: "100vh"}}>
                        <div style={{display: "flex", flexDirection: "column", margin: "3%"}}>
                            <h3>data-clumps api Demo</h3>
                            <Panel header={"Description"} toggleable collapsed={true}>
                                <div style={{whiteSpace: "pre-line", display: "flex", width: "100%", flexDirection: "column"}}>
                                    {"More information about data-clumps."}
                                </div>
                            </Panel>

                            <Divider />
                        </div>
                    <div style={{width: "100%", display: "flex", flexDirection: "row", backgroundColor: "transparent"}}>
                        <div style={{width: "100%", flex: 1, display: "flex", flexDirection: "column", backgroundColor: "transparent"}}>
                            <h3>Java Source code</h3>
                            <Editor
                                height="90vh"
                                width={"100%"}
                                defaultLanguage="java"
                                defaultValue={code}
                                onChange={handleCodeChange}
                            />
                        </div>
                        <div style={{width: "100%", flex: 1, display: "flex", flexDirection: "column", backgroundColor: "transparent"}}>
                            <h3>Extracted Variables with Types</h3>
                            <Editor
                                key={result}
                                height="90vh"
                                width={"100%"}
                                defaultLanguage="javascript"
                                defaultValue={result}
                            />
                        </div>
                    </div>
                </div>
        );
}
