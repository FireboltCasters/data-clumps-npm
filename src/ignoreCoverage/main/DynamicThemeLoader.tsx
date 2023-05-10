import React, {FunctionComponent, useEffect} from 'react';
// default style
import {useIsDarkModeEnabled} from "../storage/SynchedStateHelper";

//import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

export const DynamicThemeLoader : FunctionComponent = (props) => {

    const isDarkMode = useIsDarkModeEnabled();
    const publicUrl = process.env.PUBLIC_URL;

    useEffect(() => {
        let themeBootstrap = isDarkMode ? "bootstrap4-dark-blue" : "bootstrap4-light-blue";
        let theme = themeBootstrap;

        let themeLink = document.getElementById('app-theme');

        if (themeLink) {
            let href = publicUrl+"/themes/"+theme + '/theme.css';

            // @ts-ignore
            themeLink.href = href;
        }
    }, [isDarkMode])

    return null;
}
