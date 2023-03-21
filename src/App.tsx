import React, {useState} from 'react';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import {Demo} from "./ignoreCoverage/flow/Demo";

export interface NetzplanInterface{
  setNodeDuration: any,
  setNodeLabel: any
}
export default class App extends React.Component<any, any> {
  static netzplanRef: NetzplanInterface = {
    setNodeDuration: undefined,
    setNodeLabel: undefined
  };

  constructor(props: any) {
    super(props);
    console.log("App Constructor");
    console.log(App.netzplanRef)
  }

  render(){
    return (
        <Demo />
    );
  }
}