import React, {FunctionComponent, useState} from 'react';
import Editor, {loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";


loader.config({ monaco });

// @ts-ignore
export interface WebIdeCodeEditorProps {
    defaultValue?: string;
    options?: monaco.editor.IStandaloneEditorConstructionOptions;
    language?: string;
    onChange?: (newCode: string) => Promise<boolean>;
    onDebounce?: (newCode: string) => void; // Debouce: if the user stops typing for 1 second, then the code is sent to the server
    debounceTime?: number;
}

export const WebIdeCodeEditor : FunctionComponent<WebIdeCodeEditorProps> = (props: WebIdeCodeEditorProps) => {

    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(); // declare the timer variable
    // @ts-ignore

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
        let newTimerId = setTimeout(() => {
            // do something
            console.log("timeout");
            let onDebounce = props?.onDebounce;
            if (onDebounce) {
                onDebounce(newCode || "");
            }
        }, debounceTime);
        setTimerId(newTimerId);
    }

    return(
        <Editor
            height="90vh"
            width={"auto"}
            defaultLanguage={props?.language}
            defaultValue={code}
            options={props?.options}
            onChange={handleCodeChange}
        />
    )


}
