<h2 align="center">
    data-clumps
</h2>

<p align="center">
  <a href="https://badge.fury.io/js/data-clumps.svg"><img src="https://badge.fury.io/js/data-clumps.svg" alt="npm package" /></a>
  <a href="https://img.shields.io/github/license/FireboltCasters/data-clumps"><img src="https://img.shields.io/github/license/FireboltCasters/data-clumps" alt="MIT" /></a>
  <a href="https://img.shields.io/github/last-commit/FireboltCasters/data-clumps?logo=git"><img src="https://img.shields.io/github/last-commit/FireboltCasters/data-clumps?logo=git" alt="last commit" /></a>
  <a href="https://www.npmjs.com/package/data-clumps"><img src="https://img.shields.io/npm/dm/data-clumps.svg" alt="downloads week" /></a>
  <a href="https://www.npmjs.com/package/data-clumps"><img src="https://img.shields.io/npm/dt/data-clumps.svg" alt="downloads total" /></a>
  <a href="https://github.com/FireboltCasters/data-clumps"><img src="https://shields.io/github/languages/code-size/FireboltCasters/data-clumps" alt="size" /></a>
  <a href="https://github.com/google/gts" alt="Google TypeScript Style"><img src="https://img.shields.io/badge/code%20style-google-blueviolet.svg"/></a>
  <a href="https://shields.io/" alt="Google TypeScript Style"><img src="https://img.shields.io/badge/uses-TypeScript-blue.svg"/></a>
  <a href="https://github.com/marketplace/actions/lint-action"><img src="https://img.shields.io/badge/uses-Lint%20Action-blue.svg"/></a>
</p>


<p align="center">
  <a href="https://github.com/FireboltCasters/data-clumps/actions/workflows/npmPublish.yml"><img src="https://github.com/FireboltCasters/data-clumps/actions/workflows/npmPublish.yml/badge.svg" alt="Npm publish" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_data-clumps"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_data-clumps&metric=alert_status" alt="Quality Gate" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_data-clumps"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_data-clumps&metric=bugs" alt="Bugs" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_data-clumps"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_data-clumps&metric=coverage" alt="Coverage" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_data-clumps"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_data-clumps&metric=code_smells" alt="Code Smells" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_data-clumps"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_data-clumps&metric=duplicated_lines_density" alt="Duplicated Lines (%)" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_data-clumps"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_data-clumps&metric=sqale_rating" alt="Maintainability Rating" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_data-clumps"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_data-clumps&metric=reliability_rating" alt="Reliability Rating" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_data-clumps"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_data-clumps&metric=security_rating" alt="Security Rating" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_data-clumps"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_data-clumps&metric=sqale_index" alt="Technical Debt" /></a>
  <a href="https://sonarcloud.io/dashboard?id=FireboltCasters_data-clumps"><img src="https://sonarcloud.io/api/project_badges/measure?project=FireboltCasters_data-clumps&metric=vulnerabilities" alt="Vulnerabilities" /></a>
</p>

## About

A library to calculate the critical path in an given precedence-diagram.

## Demo

https://fireboltcasters.github.io/data-clumps/

## Installtion

```
npm install data-clumps
```
## About

This package should help to communicate with a specific Stud.IP instance by using its REST-API. Please not the disclaimer on the bottom. Please note, that oAuth is a better form for authentification but due to restrictions to obtain the specific secrets this is some sort of workaround.

A full documentation of the official Stud.IP instance can be found here: http://docs.studip.de/develop/Entwickler/RESTAPI

## Installation

```
npm i data-clumps
```

## Usage example

```javascript
import {Client} from 'data-clumps';

async function userLogin() {
  const domain = 'https://<yourStudIP_Domain>.de';
  const username = '<username>';
  const password = '<password>';

  try {
    const client = await Connector.getClient(domain, username, password);

    // to get user informations
    const user = client.getUser();

    // to get the current schedule
    const schedule = await client.loadSchedule();
  } catch (err) {
    console.log('incorrect password or other error');
  }
}
```

## Example user

```
{
  "user_id": "eed2ef9............450c",
  "username": "mmuster",
  "perms": "tutor",
  "email": "mmuster@uni-osnabrueck.de",
  "name": {
    "username": "mmuster",
    "formatted": "M. Sc. Max Muster",
    "family": "Muster",
    "given": "Max",
    "prefix": "M. Sc.",
    "suffix": ""
  },
  "avatar_small": "https://studip-assets.uni-osnabrueck.de/pictures/user/nobody_small.png?d=163.....967",
  "avatar_medium": "https://studip-assets.uni-osnabrueck.de/pictures/user/nobody_medium.png?d=163.....967",
  "avatar_normal": "https://studip-assets.uni-osnabrueck.de/pictures/user/nobody_normal.png?d=163.....967",
  "avatar_original": "https://studip-assets.uni-osnabrueck.de/pictures/user/nobody_original.png?d=0",
  "phone": "",
  "homepage": "",
  "privadr": "",
  "datafields": [
    {
      "type": "textline",
      "id": "6da14fb9d1........0b1e5ca6eb4",
      "name": "Matrikelnummer",
      "value": "955625"
    }
  ]
}
```

## Disclaimer

This project is not officialy associated in any form with the Stud.IP product and does not claims to be part of the development.

## Contributors

The FireboltCasters

<a href="https://github.com/FireboltCasters/data-clumps"><img src="https://contrib.rocks/image?repo=FireboltCasters/data-clumps" alt="Contributors" /></a>
