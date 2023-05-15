import React, {FunctionComponent, ReactNode, useState} from 'react';
import {useSynchedDetectorOptions, useSynchedJSONState} from "../storage/SynchedStateHelper";
import {SynchedStates} from "../storage/SynchedStates";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {InputNumber} from "primereact/inputnumber";
import {DetectorOptionsInformation} from "../../api/src";
import {Accordion, AccordionTab} from "primereact/accordion";
import {ToggleButton} from "primereact/togglebutton";

// @ts-ignore
export interface WebIdeModalProps {

}

export interface WebIdeModalDetectorInformation {
    children: ReactNode;
    key: string
    label: string
    description: string
}

const WebIdeModalDetectorInformation : FunctionComponent<WebIdeModalDetectorInformation> = (props: WebIdeModalDetectorInformation) => {
    const [showMore, setShowMore] = useState(false);

    let renderedDescription: any = null;

    if(showMore){
        renderedDescription = (
          <div>
              {props.description}
              <div style={{height: "10px"}} />
          </div>
        );
    }

    return (
        <div>
            <div style={{
                width: "100%", display: "flex", flexDirection: "row", alignItems: "center"
            }}>
                    <h3>
                        {props.label}
                    </h3>
                <div style={{width: "10px"}} />
                    <Button
                        key={props.key}
                        onClick={() => {
                            setShowMore(!showMore)
                        }}
                        icon="pi pi-question-circle" className="p-button-rounded p-button-secondary" aria-label="More information" />
            </div>
            {renderedDescription}
            {props?.children}
        </div>
    );
}

export const WebIdeModalDetectorOptions : FunctionComponent<WebIdeModalProps> = (props: WebIdeModalProps) => {

    const [detectorOptions, setDetectorOptions] = useSynchedDetectorOptions();
    const [unsavedOptions, setUnsavedOptions] = useState({...detectorOptions});
    const existUnsavedChanges = JSON.stringify(detectorOptions) !== JSON.stringify(unsavedOptions);

    const [detectorModalOptions, setDetectorModalOptions] = useSynchedJSONState(SynchedStates.detectorModalOptions);

    const visible = detectorModalOptions?.visible;


    async function onHide(){
        let options = {...detectorModalOptions, ...{visible: false}};
        setDetectorModalOptions(options);
    }

    function setUnsavedOption(key, value){
        unsavedOptions[key] = value;
        setUnsavedOptions({...unsavedOptions});
    }

    function renderInput(key){
        let detectorOptionInformationParameter = DetectorOptionsInformation[key];
        let type = detectorOptionInformationParameter.type;
        let value = unsavedOptions[key];

        if(type==="boolean"){
            return(
                <div>
                    <ToggleButton onChange={e => {
                        // @ts-ignore
                        let newValue = e.value;
                        setUnsavedOption(key, newValue)
                    }} checked={!!value}
                        onLabel={"True"} offLabel={"False"}
                        onIcon="pi pi-check" offIcon="pi pi-times"
                    />
                </div>
            )
        }
        if(type==="number"){
            return(
                <div>

                    <InputNumber inputId="horizontal" value={value} onValueChange={(e) => {
                        // @ts-ignore
                        let newValue = e.value;
                        setUnsavedOption(key, newValue)
                    }} showButtons buttonLayout="horizontal" step={1} min={0} max={100}
                                 decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" mode="decimal"/>
                </div>
            )
        }

        return <div>{"Sorry, no settings for type: "+type}</div>;
    }

    function renderKeysInGroup(groupKey: string){
        console.log("renderKeysInGroup: "+groupKey);

        let output: any[] = [];

        let keys = Object.keys(DetectorOptionsInformation);
        for(let key of keys){
            let detectorOptionInformationParameter = DetectorOptionsInformation[key];
            let group = detectorOptionInformationParameter.group;
            if(groupKey==group){
                let label = detectorOptionInformationParameter.label;
                let description = detectorOptionInformationParameter.description;

                output.push(
                    <div className="field col-12 md:col-3">
                        <WebIdeModalDetectorInformation
                            key={key}
                            label={label}
                            description={description} >
                            {renderInput(key)}
                        </WebIdeModalDetectorInformation>
                        <div style={{
                            height: "30px"
                        }} />
                    </div>
                )
            }
        }

        return output;
    }

    function renderInputs(){
        let keys = Object.keys(DetectorOptionsInformation);
        let output: any[] = [];

        let groupDict: any = {}

        for(let key of keys){
            let detectorOptionInformationParameter = DetectorOptionsInformation[key];
            let group = detectorOptionInformationParameter.group;
            groupDict[group] = true
        }

        let groupKeys = Object.keys(groupDict);
        for(let groupKey of groupKeys){
            output.push(
                    <AccordionTab header={groupKey}>
                        {renderKeysInGroup(groupKey)}
                    </AccordionTab>
            )
        }

        return (
            <Accordion multiple={true}>
                {output}
                </Accordion>
            );
    }


    return(
        <Dialog key={visible+""} draggable={false} resizable={false} visible={visible} header={"Detector Options"} onHide={onHide} style={{width: '100vw', height: "100vh"}}>
            {renderInputs()}

            <div style={{
                height: "30px"
            }} />
            <Button label="Import (TODO)" icon="pi pi-folder" disabled={true} />
            <Button label="Export (TODO)" icon="pi pi-download" disabled={true} />
            <div style={{
                height: "30px"
            }} />
            <Button disabled={!existUnsavedChanges} label={"Save"} icon={"pi pi-save"}
                onClick={async () => {
                    await setDetectorOptions({...unsavedOptions})
                    await onHide()
                }}
            />
            <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
        </Dialog>
    )

}
