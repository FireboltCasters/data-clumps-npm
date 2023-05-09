import React, {FunctionComponent, useEffect, useState} from 'react';
import Editor, {loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import {isDarkModeEnabled} from "../storage/SynchedStateHelper";


loader.config({ monaco });

// @ts-ignore
export interface WebIdeCodeEditorProps {
    defaultValue?: string;
    options?: monaco.editor.IStandaloneEditorConstructionOptions;
    language?: string;
    onChange?: (newCode: string) => Promise<boolean>;
    onDebounce?: (newCode: string) => Promise<void>; // Debouce: if the user stops typing for 1 second, then the code is sent to the server
    debounceTime?: number;
    decorations?: any[];
}

export type DecorationRange = {
    startLineNumber: number,
    startColumn: number,
    endLineNumber: number,
    endColumn: number
}

export const WebIdeCodeEditor : FunctionComponent<WebIdeCodeEditorProps> = (props: WebIdeCodeEditorProps) => {

    const isDarkMode = isDarkModeEnabled();

    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(); // declare the timer variable
    // @ts-ignore

    const css = `
    .myLineDecoration {
      background: lightblue;
      width: 5px !important;
      margin-left: 3px;
    }
    .myGlyphMarginClass {
    \tbackground: red;
    }
    .myContentClass {
    \tbackground: lightblue;
    }
  `;

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [css]);

    const [code, setCode] = useState<string>(props?.defaultValue || "");
    const [debounceTime, setDebounceTime] = useState<number>(props?.debounceTime || 1000);

    //TODO viszualize Graph?: react-graph-vis

    async function handleCodeChange(newCode: string | undefined) {
        let onChange = props?.onChange;
        if (onChange) {
            let canChange = await onChange(newCode || "");
            if (!canChange) {
                return;
            }
        }

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
        let newTimerId = setTimeout(async () => {
            // do something
            //console.log("timeout");
            let onDebounce = props?.onDebounce;
            if (onDebounce) {
                await onDebounce(newCode || "");
            }
        }, debounceTime);
        setTimerId(newTimerId);
    }

    return(
        <Editor
            theme={isDarkMode ? "vs-dark" : "light"}
            onMount={(editor, monaco) => {
                //console.log("onMount");
                if(props?.decorations){
                    let decorationCopy = JSON.parse(JSON.stringify(props?.decorations));
                    for(let decoration of decorationCopy){
                        decoration.range = new monaco.Range(decoration.range.startLineNumber, decoration.range.startColumn, decoration.range.endLineNumber, decoration.range.endColumn);
                    }
                    let decorations = editor.createDecorationsCollection(decorationCopy);
                }
            }}
            height="90vh"
            width={"auto"}
            defaultLanguage={props?.language}
            defaultValue={code}
            options={{glyphMargin: true, ...props?.options}}
            onChange={handleCodeChange}
        />
    )


}
