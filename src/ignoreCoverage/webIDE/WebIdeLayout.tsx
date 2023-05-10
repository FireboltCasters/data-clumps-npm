import React, {FunctionComponent, useEffect, useRef, useState} from 'react';

import {Splitter, SplitterPanel} from 'primereact/splitter';
import {Skeleton} from 'primereact/skeleton';
// default style

// define WebIDEProps
export interface WebIDEProps extends React.HTMLAttributes<HTMLDivElement> {
    menuBarItems?: any[] | any;
    panelInitialSizes?: number[];
}

export const WebIdeLayout : FunctionComponent<WebIDEProps> = (props: WebIDEProps) => {

    const css = `
    .p-splitter-gutter{
          width: 5px !important;    
    }
        .p-splitter-gutter-handle {
          background-color: blue !important;
          /* other styles */
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

    const [reloadForResize, setReloadForResize] = useState<boolean>(false);

    const splitterHandleRef = useRef();

    function handleMouseDown(event) {
        event.preventDefault(); // Prevent text selection

        if(!reloadForResize){
            let target = event?.target;
            //console.log(target.classList);
            for(let i = 0; i < target.classList.length; i++) {
                let className = target.classList[i];
                //console.log("- "+className);
                if (className === "p-splitter-gutter" || className === "p-splitter-gutter-handle") {
                    //console.log("oh yes im inside")
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
                        <div style={{padding: "10px", display: "inline-block", flexDirection: "row", backgroundColor: "transparent", alignItems: "center", justifyContent: "center"}}>
                            <div style={{alignItems: 'center',
                                justifyContent: 'center', display: 'flex'}}>
                                <div style={{display: "inline-block"}}>
                                    <i className="pi pi-spin pi-spinner" style={{fontSize: "5em"}}/>
                                </div>
                            </div>
                            <div style={{display: "inline-block"}}>
                                {"Wait to end resizing"}
                            </div>
                        </div>
                    </div>
                </Skeleton>
            </div>
        )
    }

    function renderPanel(content, index){
        let usedContent = content;
        if(!content){
            return null;
        }

        if(reloadForResize){
            usedContent = renderResizingContent();
        }

        let size = props?.panelInitialSizes?.[index] || 100;

        return(
            <SplitterPanel size={size}>
                <div style={{backgroundColor: "transparent", height: "100%"}}>
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
                    let renderedPanel = renderPanel(child, i);
                    if(renderedPanel){
                        renderedPanels.push(renderedPanel);
                    }
                }
            }else{
                let renderedPanel = renderPanel(children, 0);
                if(renderedPanel){
                    renderedPanels.push(renderPanel(children, 0));
                }
            }
        }

        return renderedPanels;
    }

    function renderHolder(){
        return(
            <div style={{width: "100%", display: "flex", flexDirection: "row", backgroundColor: "transparent"}}>
                {/* Render Action bar */}
                <div style={{width: "100%", display: "flex", flexDirection: "column", backgroundColor: "transparent"}}>
                    {props?.menuBarItems}
                    {/*  */}

                    <Splitter style={{height: "100%"}} layout="horizontal" gutterSize={3}
                        onResizeEnd={() => {
                            //console.log("onResizeEnd");
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
                {renderHolder()}
            </div>
        );
}
