import React, {FunctionComponent, useRef, useState} from 'react';

import {Splitter, SplitterPanel} from 'primereact/splitter';
import {Skeleton} from 'primereact/skeleton';
// default style

// define WebIDEProps
export interface WebIDEProps extends React.HTMLAttributes<HTMLDivElement> {
    menuBarItems?: any[] | any;
    panelInitialSizes?: number[];
}

export const WebIdeLayout : FunctionComponent<WebIDEProps> = (props: WebIDEProps) => {

    const [reloadForResize, setReloadForResize] = useState<boolean>(false);

    const splitterHandleRef = useRef();

    function handleMouseDown(event) {
        event.preventDefault(); // Prevent text selection

        if(!reloadForResize){
            let target = event?.target;
            console.log(target.classList);
            for(let i = 0; i < target.classList.length; i++) {
                let className = target.classList[i];
                console.log("- "+className);
                if (className === "p-splitter-gutter" || className === "p-splitter-gutter-handle") {
                    console.log("oh yes im inside")
                    setReloadForResize(true);
                    break;
                }
            }
        }
    }

    function renderResizingContent(){
        return(
            <div style={{flex: 1, width: "100%", height: "100vh", backgroundColor: "transparent"}}>
                <Skeleton width={"100%"} height={"100%"}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
                        <div style={{display: "inline-block", backgroundColor: "white", alignItems: "center", justifyContent: "center"}}>
                            {"Wait to end resizing"}
                        </div>
                    </div>
                </Skeleton>
            </div>
        )
    }

    function renderPanel(content, index){
        let usedContent = content;
        if(reloadForResize){
            usedContent = renderResizingContent();
        }

        let size = props?.panelInitialSizes?.[index] || 100;

        return(
            <SplitterPanel size={size}>
                <div style={{backgroundColor: "transparent"}}>
                    {usedContent}
                </div>
            </SplitterPanel>
        )
    }

    function renderPanels(){
        let renderedPanels: any[] = [];
        let children = props.children;
        if(children){
            if(Array.isArray(children)){
                for(let i = 0; i < children.length; i++){
                    let child = children[i];
                    renderedPanels.push(renderPanel(child, i));
                }
            }else{
                renderedPanels.push(renderPanel(children, 0));
            }
        }
        return renderedPanels;
    }

    function renderWebIDE(){
        return(
            <div style={{width: "100%", display: "flex", flexDirection: "row", backgroundColor: "transparent"}}>
                {/* Render Action bar */}
                <div style={{width: "100%", display: "flex", flexDirection: "column", backgroundColor: "transparent"}}>
                    {props?.menuBarItems}
                    {/*  */}

                    <Splitter style={{height: "100%"}} layout="horizontal" gutterSize={3}
                        onResizeEnd={() => {
                            console.log("onResizeEnd");
                            setReloadForResize(false);
                        }}
                        // @ts-ignore
                        ref={splitterHandleRef} className="p-splitter-handle" onMouseDown={handleMouseDown}
                    >
                        {renderPanels()}
                    </Splitter>
                </div>
            </div>
        )
    }

    return (
            <div style={{width: "100%", height: "100vh", display: "flex", flexDirection: "row"}}>
                {renderWebIDE()}
            </div>
        );
}
