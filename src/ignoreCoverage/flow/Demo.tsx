// @ts-nocheck - may need to be at the start of file
import React, {useState, useRef, Component, FunctionComponent, useEffect} from 'react';
import {Connector} from "../../api/src";
import UrlHelper from "../../api/src/UrlHelper";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Password} from "primereact/password";
import {Panel} from "primereact/panel";
import {Dialog} from "primereact/dialog";
import {Divider} from "primereact/divider";
import {TabPanel, TabView} from "primereact/tabview";
import {UserOutput} from "./UserOutput";
import {ScheduleOutput} from "./ScheduleOutput";

export const Demo : FunctionComponent = (props) => {

    const [activeIndex, setActiveIndex] = useState(0)

    const default_domain: string = UrlHelper.STUDIP_DOMAIN_UNI_OSNABRUECK;
    const current_domain: string = window.location.hostname;
    let isDev = current_domain === "localhost" || current_domain === "127.0.0.1";
    isDev = true;

    const [domain, setDomain] = useState(default_domain);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [handleLoad, setHandleLoad] = useState(false);
    const [showpassword, setShowpassword] = useState(false);
    const [useCorsWorkaround, setUseCorsWorkaround] = useState(isDev);
    const [pleaseActivateCorsWorkaround, setPleaseActivateCorsWorkaround] = useState(false);
    const [noInternet, setNoInternet] = useState(false);
    const [error, setError] = useState(undefined);

    const credentialsGiven = !!username && !!password;
    const loginDisabled = !credentialsGiven || isLoading;

    const loginTooltip = credentialsGiven ? "" : "Please enter your username and password";

    useEffect(() => {
        document.title = "Stud.IP-Api Demo"
    }, [])

    let domainToUse = domain;
    const proxyDomain = "https://cors-anywhere.herokuapp.com/";
    if(useCorsWorkaround) {
        domainToUse = proxyDomain + domain;
    }

    async function login(){
        setIsLoading(true);
        setHandleLoad(true);
        try{
            const client = await Connector.getClient(domainToUse, username, password);
            const user = client.getUser();
            setHandleLoad(true);
        } catch(e){
            console.log(e.toString());
            if(e.toString()==="Error: Network Error"){
                setNoInternet(true);
                setHandleLoad(false);
            } else if(useCorsWorkaround && e?.message==="Request failed with status code 403"){
                setPleaseActivateCorsWorkaround(true);
            } else {
                setError(e);
                setHandleLoad(true);
            }
        }
        setIsLoading(false);
    }

    const NODE_HEIGHT = 78;
    const DEFAULT_NODE_WIDTH = 150;
    const labelInputStyle = {textAlign: "center", height: (NODE_HEIGHT/4)+"px", width: (DEFAULT_NODE_WIDTH)+"px"}

    function renderPassword(){
        if(showpassword){
            return <InputText style={{width: "100%", flex: 1}} value={password} onChange={(event) => {setHandleLoad(false); setPassword(event.target.value)}}/>
        }
        return(
            <Password inputStyle={{width: "100%", flex: 1}} style={{width: "100%", flex: 1}} value={password} onChange={(event) => {setHandleLoad(false); setPassword(event.target.value);}}/>
        )
    }



    function onHide(){
        pleaseActivateCorsWorkaround(false)
    }

    const footer = (
        <div>
            <Button label="Activate CORS bypass" icon="pi pi-check" onClick={() => {
                window.open(proxyDomain, '_blank', 'noopener,noreferrer');
                onHide();
            }} />
            <Button label="No" icon="pi pi-times" onClick={onHide} />
        </div>
    );

    return (
                <div style={{width: "100%", height: "100vh"}}>
                    <Dialog header="No Internet" visible={noInternet} style={{width: '50vw'}} modal onHide={() => {setNoInternet(false)}}>
                        Please check your internet connection
                    </Dialog>
                    <Dialog header="Activate CORS workaround" footer={footer} visible={pleaseActivateCorsWorkaround} style={{width: '50vw'}} modal onHide={onHide}>
                        <div>{"In order to allow the API to work, you need to activate the CORS workaround. This will open a new tab in your browser. Please click on the button to activate the workaround."}</div>
                        <a href={proxyDomain} >{proxyDomain}</a>
                    </Dialog>
                        <div style={{display: "flex", flexDirection: "column", height: "100%", margin: "3%"}}>
                            <h3>Stud.IP-Api Demo</h3>
                            <Panel header={"Description"} toggleable>
                                <div style={{whiteSpace: "pre-line", display: "flex", width: "100%", flexDirection: "column"}}>
                                    {"This is a simple demo of the Stud.IP-Api. It allows you to login to your Stud.IP account and see the result of the API calls."}
                                    {useCorsWorkaround ? "Your data will be forwarded to Stud.IP via "+proxyDomain+". The CORS workaround is activated. This means that the API will use a proxy to access the Stud.IP-Api. This is necessary for the API to work. " : "Your data will be send directly to Stud.IP."}
                                    {"\n"}
                                    <a href="https://hilfe.studip.de/develop/Entwickler/RESTAPI" target="_blank" rel="noreferrer">
                                        <Button label={"More about Stud.IP API"} icon={"pi pi-search"} className="p-button-secondary" style={{margin: 5}} />
                                    </a>
                                </div>
                            </Panel>
                            <Divider />
                            <div style={{display: "flex", width: "100%", flexDirection: "row"}}>
                                    <Panel header={"Input"} style={{display: "flex", flexDirection: "column", flex: 3}}>
                                        <div style={{display: "flex", flex: 1, flexDirection: "column"}}>
                                            {"Domain"}
                                            <div style={{display: "flex", width: "100%", flexDirection: "row"}} >
                                                <InputText style={{width: "100%", flex: 1}} value={domain} onChange={(event) => {setHandleLoad(false); setDomain(event.target.value)}}/>
                                                <Button tooltipOptions={{position: 'bottom'}} tooltip={"In the Proxy mode we will use: "+proxyDomain+" to bypass CORS problems and forward the request."} label={useCorsWorkaround ? "Proxy" : "Direct"} icon={useCorsWorkaround ? "pi pi-cloud" : "pi pi-desktop"} className="p-button-success" style={{margin: 5}} onClick={() => {setUseCorsWorkaround(!useCorsWorkaround)}} />
                                            </div>
                                            <div style={{height: "30px"}}></div>
                                            {"Username"}
                                            <InputText value={username} onChange={(event) => {setHandleLoad(false); setUsername(event.target.value);}}/>
                                            <div style={{height: "30px"}}></div>
                                            {"Password"}
                                            <div style={{display: "flex", width: "100%", flexDirection: "row"}} >
                                                {renderPassword()}
                                                <Button label={showpassword ? "Hide" : "Show"} icon={showpassword ? "pi pi-eye-slash" : "pi pi-eye"} className="p-button-success" style={{margin: 5}} onClick={() => {setShowpassword(!showpassword)}} />
                                            </div>
                                            <div style={{height: "30px"}}></div>
                                            <Button disabled={loginDisabled || handleLoad} label="Save & Use" icon="pi pi-save" className="p-button-success" style={{margin: 5}} onClick={() => {login()}} />
                                        </div>
                                    </Panel>
                            </div>
                            <Divider />
                            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                                <TabPanel header="User">
                                    <div style={{flex: 1 ,display: "flex" ,width: "100%", height: "100%"}}>
                                        <UserOutput handleLoad={handleLoad} username={username} password={password} domainToUse={domainToUse} />
                                    </div>
                                </TabPanel>
                                <TabPanel header="Schedule">
                                    <div style={{flex: 1 ,display: "flex" ,width: "100%", height: "100%"}}>
                                        <ScheduleOutput handleLoad={handleLoad} username={username} password={password} domainToUse={domainToUse} />
                                    </div>
                                </TabPanel>
                                <TabPanel header="Schedule Raw">
                                    <div style={{flex: 1 ,display: "flex" ,width: "100%", height: "100%"}}>
                                        <ScheduleOutput raw={true} handleLoad={handleLoad} username={username} password={password} domainToUse={domainToUse} />
                                    </div>
                                </TabPanel>
                            </TabView>
                        </div>
                </div>
        );
}
