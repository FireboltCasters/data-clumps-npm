import React, {useState} from 'react';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import {Demo} from "./ignoreCoverage/flow/Demo";

export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    console.log("App Constructor");
  }

  render(){
    return (
        <Demo />
    );
  }
}
