// @ts-nocheck - may need to be at the start of file
import React, {useState, useRef, Component, FunctionComponent, useEffect} from 'react';
import {Connector} from "../../api/src";
import UrlHelper from "../../api/src/UrlHelper";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Password} from "primereact/password";
import {ProgressSpinner} from "primereact/progressspinner";
import {Card} from "primereact/card";
import {Panel} from "primereact/panel";
import {Skeleton} from "primereact/skeleton";
import FakeBackend from "../../api/src/ignoreCoverage/FakeBackend";
import {Dialog} from "primereact/dialog";
import {Divider} from "primereact/divider";
import {TabPanel, TabView} from "primereact/tabview";
import {CodeHighlight} from "./CodeHighlight";

export interface AppState{
    handleLoad,
    domainToUse,
    username,
    password
}
export const UserOutput : FunctionComponent<AppState> = (props) => {

    const [user, setUser] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(undefined);

    function renderUser(){
        if(!!user){
            return(
                <div style={{display: "flex", width: "100%", whiteSpace: "pre-wrap"}}>
                    {JSON.stringify(user, null, 2)}
                </div>
            )
        } else if (isLoading) {
            return <Skeleton />
        }
    }

    function renderError(){
        if(!!error && !user){
            return (
                <div style={{display: "flex", width: "100%", whiteSpace: "pre-wrap"}}>
                    {JSON.stringify(error, null, 4)}
                </div>
            )
        } else {
            return null;
        }
    }

    function clearOutput() {
        setUser(undefined);
        setError(undefined);
    }

    async function load(){
        clearOutput();
        setIsLoading(true);
        try{
            const client = await Connector.getClient(props?.domainToUse, props?.username, props?.password);
            const user = client.getUser();
            setUser(user);
        } catch(e){
            console.log(e);
            setError(e);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if(props?.handleLoad){
            load();
        }
    }, [props])

    function setExampleUser(role){
        setError(null);
        setUser(FakeBackend.getRawExampleUserWithRole(role));
    }

    return (
        <div style={{width: "100%", height: "100%", flexDirection: "column", display: "flex"}}>
            <Panel style={{flex: 2}} header={"Usage"} toggleable>
                <CodeHighlight lang="js">
{`import {Connector} from "data-clumps";
const client = await Connector.getClient(domain, username, password);
const user = client.getUser();`}
                </CodeHighlight>
            </Panel>
            <Divider />
            <div style={{width: "100%",flex: 1, flexDirection: "row", display: "flex"}}>
                <Panel style={{flex: 2}} header={!!error ? "Error" : "Output"} toggleable collapsed={false} onToggle={(e) => {
                    clearOutput()
                }}>
                    {renderUser()}
                    {renderError()}
                </Panel>
                <div style={{width: "30px"}}></div>
                <Panel style={{flex: 1}} header={"Example Roles"}>
                    <div style={{display: "flex", flex: 3, flexDirection: "column"}}>
                        <Button label={"Example Root"} icon={"pi pi-user"} className="p-button-success" style={{margin: 5}} onClick={() => {setExampleUser("root")}} />
                        <Button label={"Example Admin"} icon={"pi pi-user"} className="p-button-success" style={{margin: 5}} onClick={() => {setExampleUser("admin")}} />
                        <Button label={"Example Dozent"} icon={"pi pi-user"} className="p-button-success" style={{margin: 5}} onClick={() => {setExampleUser("dozent")}} />
                        <Button label={"Example Tutor"} icon={"pi pi-user"} className="p-button-success" style={{margin: 5}} onClick={() => {setExampleUser("tutor")}} />
                        <Button label={"Example Autor"} icon={"pi pi-user"} className="p-button-success" style={{margin: 5}} onClick={() => {setExampleUser("autor")}} />
                        <Button label={"Example User"} icon={"pi pi-user"} className="p-button-success" style={{margin: 5}} onClick={() => {setExampleUser("user")}} />
                        <a href="https://hilfe.studip.de/admin/Admins/Benutzer" target="_blank" rel="noreferrer">
                            <Button label={"More About Roles"} icon={"pi pi-search"} className="p-button-secondary" style={{margin: 5}} />
                        </a>

                        <a href="https://hilfe.studip.de/develop/Entwickler/RESTAPI#toc26" target="_blank" rel="noreferrer">
                            <Button label={"More About User Informations"} icon={"pi pi-search"} className="p-button-secondary" style={{margin: 5}} />
                        </a>
                    </div>
                </Panel>
            </div>
        </div>
    );

}
