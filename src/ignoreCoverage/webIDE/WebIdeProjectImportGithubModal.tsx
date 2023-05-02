import React, {FunctionComponent, ReactNode, useEffect, useState} from 'react';
// default style
import '@sinm/react-file-tree/styles.css';
import '@sinm/react-file-tree/icons.css';
import {
    useSynchedActiveFileKey,
    useSynchedFileExplorerTree,
    useSynchedModalState,
    useSynchedOpenedFiles,
} from "../storage/SynchedStateHelper";
import {SynchedStates} from "../storage/SynchedStates";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {getTreeFromSoftwareProject} from "./WebIdeFileExplorer";
import {SoftwareProject} from "../../api/src";
import {Octokit} from "octokit";
import {Password} from 'primereact/password';
import {Tooltip} from "primereact/tooltip";
import {MyFile} from "../../api/src/ignoreCoverage/ParsedAstTypes";
import JSZip from "jszip";

export interface WebIdeFileExplorerDropZoneModalProps {
    children?: ReactNode;
    loadSoftwareProject: (project: SoftwareProject) => Promise<void>;
}

export const WebIdeProjectImportGithubModal : FunctionComponent<WebIdeFileExplorerDropZoneModalProps> = (props: WebIdeFileExplorerDropZoneModalProps) => {

    const [loading, setLoading] = useState(false);

    const [githubModalOptions, setGitHubModalOptions] = useSynchedModalState(SynchedStates.githubImportModal);

    const [corsAnywhereActive, setCorsAnywhereActive] = useState<boolean | undefined>(undefined);
    const corsAnywhereURL = "https://cors-anywhere.herokuapp.com/";

    const [githubRepoURL, setGitHubRepoURL] = useState<string | undefined>(undefined);
    const [personalAccessToken, setPersonalAccessToken] = useState<string | undefined>(undefined);
    const [githubBranch, setGitHubBranch] = useState<string | undefined>("main");

    const visible = githubModalOptions?.visible;

    useEffect(() => {
        checkIfCorsAnywhereIsRunning();
    }, []);

    function onHide(){
        githubModalOptions.visible = false;
        setGitHubModalOptions(githubModalOptions)
    }

    async function checkIfCorsAnywhereIsRunning() {
        const corsAnywhereResponse = await fetch(corsAnywhereURL);
        if (corsAnywhereResponse.status !== 200) {
            setCorsAnywhereActive(false);
        } else {
            setCorsAnywhereActive(true);
        }
    }

    async function getAllFilesFromRepo(octokit, owner, repo, branch) {
        //console.log("getAllFilesFromRepo")
        //console.log("branch: "+branch)
        const fileDict = {};
        const ref = branch || "master";

        try{
            let response = await octokit.rest.repos.downloadZipballArchive({
                owner,
                repo,
                ref,
            });
            //console.log(response)

            const arrayBuffer = await response.data;
            //console.log(arrayBuffer)

            // get all files from zip
            const zip = new JSZip();
            const zipFile = await zip.loadAsync(arrayBuffer);
            const zipFileKeys = Object.keys(zipFile.files);
            //console.log(zipFileKeys);
            for(let i = 0; i < zipFileKeys.length; i++){
                const key = zipFileKeys[i];
                const file = zipFile.files[key];
                const fileContent = await file.async("string");
                const isDirectory = file.dir;
                if(isDirectory){
                    continue;
                } else {
                    fileDict[file.name] = fileContent;
                }
            }

        } catch (err){
            console.log("error");
            console.log(err);
        }

        return fileDict;
    }

    async function fetchProject(){
        setLoading(true);

        //Check if cors-anywhere is running

        try{
            const octokit = new Octokit({
                userAgent: "my-app/v1.2.3",
                auth: personalAccessToken,
                baseUrl: corsAnywhereURL+"https://api.github.com"
            });

            if(githubRepoURL){
                // get all files from repo
                const repo = githubRepoURL.split("/")[4];
                const owner = githubRepoURL.split("/")[3];

                const response = await getAllFilesFromRepo(octokit, owner, repo, githubBranch);
                //console.log(response)

                const newProject = new SoftwareProject(["java"]);

                let projectFileKeys = Object.keys(response);
                for(let i = 0; i < projectFileKeys.length; i++){
                    const path = projectFileKeys[i];
                    const fileContent = response[path];
                    const newFile = new MyFile(path, fileContent);
                    newProject.addFile(newFile);
                }
                await props.loadSoftwareProject(newProject);
                onHide();
                return;
            }
        } catch (err){
            console.log(err);
        }

        setLoading(false);
        return
    }

    const importButtonEnabled = githubRepoURL && githubBranch && !loading;
    let tooltipImportButton = "";
    if(!githubRepoURL){
        tooltipImportButton = "Please enter a valid GitHub repository URL";
    }
    if(!githubBranch){
        tooltipImportButton = "Please enter a valid branch name";
    }
    if(loading){
        tooltipImportButton = "Loading...";
    }


    let content: any = null;
    if(corsAnywhereActive === true || corsAnywhereActive === undefined){
        content = (
            <>
            <Tooltip target=".repositoryGroup" />
        <span className="repositoryGroup" data-pr-tooltip={"Required"}>
            <div className="col-12 md:col-4">
                <label htmlFor="basic">GitHub-Repository*</label>
                <div className="p-inputgroup">
                    <Button disabled={true} icon="pi pi-github" className="p-button-warning"/>
                    <InputText required={true} placeholder="https://github.com/..." value={githubRepoURL} onChange={(e) => setGitHubRepoURL(e.target.value)} />
                </div>
            </div>
        </span>
        <div style={{marginTop: "1em"}}></div>
        <Tooltip target=".personalAccessTokenGroup" />
        <span className="personalAccessTokenGroup" data-pr-tooltip={"Only required if private repository"}>
            <div className="col-12 md:col-4">
                <label htmlFor="basic">Personal Access Token (optional)</label>
                <div className="p-inputgroup">
                    <Button disabled={true} icon="pi pi-lock" className="p-button-warning"/>
                    <Password toggleMask={true} placeholder="personal-access-token123" value={personalAccessToken} onChange={(e) => setPersonalAccessToken(e.target.value)} />
                </div>
            </div>
        </span>
        <div style={{marginTop: "1em"}}></div>
        <Tooltip target=".refGroup" />
        <span className="refGroup" data-pr-tooltip={"Branch"}>
            <div className="col-12 md:col-4">
                <label htmlFor="basic">Branch</label>
                <div className="p-inputgroup">
                    <Button disabled={true} icon="pi pi-sitemap" className="p-button-warning"/>
                    <InputText required={true} placeholder="branch" value={githubBranch} onChange={(e) => setGitHubBranch(e.target.value)} />
                </div>
            </div>
        </span>
        <div className="col-12 md:col-4">
            <div style={{marginTop: "1em"}}></div>
            <Tooltip target=".disabled-button" />
            <span className="disabled-button" data-pr-tooltip={tooltipImportButton}>
                <Button disabled={!importButtonEnabled} label="Import" icon="pi pi-check" className="p-button-success" onClick={() => {
                    fetchProject();
                }}/>
                </span>
        </div>
        </>
        )
    }
    if(corsAnywhereActive === false){
        content = <div style={{textAlign: "center"}}>
            <h3>No connection to CORS-Anywhere</h3>
            <div>
                {"In order to import a GitHub repository, we need to use a proxy to bypass CORS restrictions. " +
                "Please activate the proxy by clicking the button below. " +
                "This will open a new tab. Please close the tab after the proxy has been activated."+
                "Afterwards reload this page and try again."}
            </div>
            <div style={{marginTop: "1em"}} />
            <Button label={"Activate cors-anywhere"} onClick={() => window.open(corsAnywhereURL, "_blank")}/>
        </div>
    }

    return(
        <Dialog key={visible+""} visible={visible} header={"Import from GitHub"} onHide={onHide} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
            {content}
        </Dialog>
    )

}
