import React, {Component} from "react";

export default class DownloadHelper extends Component {

    static downloadTextAsFiletile(string,fileNameWithExtension){
        let encodedData = encodeURIComponent(string);
        let dataStr = "data:text/json;charset=utf-8," + encodedData;
        let link = document.createElement("a");
        link.setAttribute("download", fileNameWithExtension);
        link.setAttribute("href", dataStr);
        link.click();
    }

}
