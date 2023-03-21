// @ts-nocheck - may need to be at the start of file
import React, { useEffect, useRef } from 'react';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';

export function CodeHighlight(props) {

    return (
        <SyntaxHighlighter language="javascript" style={docco}>
            {props.children}
        </SyntaxHighlighter>
    );
}