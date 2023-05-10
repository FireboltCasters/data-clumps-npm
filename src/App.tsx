import React, {useState} from 'react';

import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import {Demo} from "./ignoreCoverage/main/Demo";
import {SynchedStateHelper} from "./ignoreCoverage/storage/SynchedStateHelper";
import {StoreProvider} from "easy-peasy";
import {DynamicThemeLoader} from "./ignoreCoverage/main/DynamicThemeLoader";

//import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    console.log("App Constructor");
    SynchedStateHelper.initSynchedKeys();
    SynchedStateHelper.initContextStores(); //after ConfigHolder.storage.initContextStores();
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
