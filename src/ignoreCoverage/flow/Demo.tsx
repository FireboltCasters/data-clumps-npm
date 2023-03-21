// @ts-nocheck - may need to be at the start of file
import React, {FunctionComponent, useEffect} from 'react';
import {Button} from "primereact/button";
import {Panel} from "primereact/panel";
import {Divider} from "primereact/divider";
import {TabPanel, TabView} from "primereact/tabview";

export const Demo : FunctionComponent = (props) => {

    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        document.title = "data-clumps api Demo"
    }, [])

    return (
                <div style={{width: "100%", height: "100vh"}}>
                        <div style={{display: "flex", flexDirection: "column", height: "100%", margin: "3%"}}>
                            <h3>data-clumps api Demo</h3>
                            <Panel header={"Description"} toggleable>
                                <div style={{whiteSpace: "pre-line", display: "flex", width: "100%", flexDirection: "column"}}>
                                    {"More information about data-clumps."}
                                </div>
                            </Panel>
                            <Divider />
                            <div style={{display: "flex", width: "100%", flexDirection: "row"}}>
                                    <Panel header={"Test"} style={{display: "flex", flexDirection: "column", flex: 3}}>
                                        <div style={{display: "flex", flex: 1, flexDirection: "column"}}>
                                            {"Domain"}
                                            <Button disabled={false} label="Save & Use" icon="pi pi-save" className="p-button-success" style={{margin: 5}} onClick={() => {login()}} />
                                        </div>
                                    </Panel>
                            </div>
                            <Divider />
                            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                                <TabPanel header="User">
                                    <div style={{flex: 1 ,display: "flex" ,width: "100%", height: "100%"}}>

                                    </div>
                                </TabPanel>
                                <TabPanel header="Schedule">
                                    <div style={{flex: 1 ,display: "flex" ,width: "100%", height: "100%"}}>

                                    </div>
                                </TabPanel>
                                <TabPanel header="Schedule Raw">
                                    <div style={{flex: 1 ,display: "flex" ,width: "100%", height: "100%"}}>

                                    </div>
                                </TabPanel>
                            </TabView>
                        </div>
                </div>
        );
}
