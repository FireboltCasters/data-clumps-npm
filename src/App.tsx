import React, {useState} from 'react';

import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import {Demo} from "./ignoreCoverage/main/Demo";
import {SynchedStateHelper} from "./ignoreCoverage/storage/SynchedStateHelper";
import {StoreProvider} from "easy-peasy";
import {DynamicThemeLoader} from "./ignoreCoverage/main/DynamicThemeLoader";
import {SynchedStates} from "./ignoreCoverage/storage/SynchedStates";

//import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    SynchedStateHelper.initSynchedKeys();
    this.parseURLParams()
    SynchedStateHelper.initContextStores(); //after ConfigHolder.storage.initContextStores();
  }

  parseURLParams(){
    const queryParameters = new URLSearchParams(window?.location?.search)
    const demoTypeString = ""+queryParameters.get("demoType")
    SynchedStateHelper.registerSynchedState(SynchedStates.demoType, demoTypeString, null, null, true);
  }

  render(){
    return (
        <StoreProvider store={SynchedStateHelper.getContextStore()}>
          <DynamicThemeLoader />
          <Demo />
        </StoreProvider>
    );
  }
}
