<h2 align="center">
    data-clumps
</h2>

<p align="center">
    <img src="https://github.com/FireboltCasters/data-clumps/raw/master/public/logo.png" alt="backup" style="height:100px;"/>
</p>

<h2 align="center">
Cerberus Data Clumps Detection and Refactoring (CDCD-R)
</h2>

<h3 align="center">
Let Cerberus Guard Your Code: Detect and Refactor Clumps with Ease
</h3>

<h5 align="center">
Alternative slogan: Get a Three-Headed View of Your Data: Cerberus Detects and Refactors Clumps
</h5>

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
  <a href="https://github.com/FireboltCasters/data-clumps/actions/workflows/npmPublish.yml"><img src="https://github.com/FireboltCasters/data-clumps/actions/workflows/npmPublish.yml/badge.svg" alt="Npm publish" /></a>
</p>


# Important Notice: Project Partially Discontinued

**Attention Users**: This project, Cerberus Data Clumps Detection and Refactoring (CDCD-R), will be partially discontinued due to significant performance improvements in our new project: [Data Clumps Doctor](https://github.com/NilsBaumgartner1994/data-clumps-doctor).

-------------------


### Why the Change?

While CDCD-R served as a valuable proof of concept for analyzing Java files with Antlr4 within the web, our new project offers a more robust and efficient solution. The new project has shown speed increases of up to 98% in parsing files, making it a superior choice for your data clump detection and refactoring needs.

### What Does This Mean for Current Users?

- Existing features and functionalities in CDCD-R will remain available, but future updates and enhancements will be limited.
- We strongly recommend transitioning to [PMD Data Clumps](https://github.com/FireboltCasters/pmd-data-clumps) for improved performance and continued support.

For more details, please visit the [PMD Data Clumps GitHub Repository](https://github.com/FireboltCasters/pmd-data-clumps).


## About

A library to parse files and folders to check for data clumps and refactor them.

## Dataset

We're excited to share our public [Data-Clumps Dataset](https://github.com/FireboltCasters/Data-Clumps-Dataset/) with you. We invite you to explore it and consider contributing to our growing repository. By uploading your analyzed data, you can help enrich our dataset and support the broader community in their software analysis endeavors. Together, we can enhance our understanding of data-clumps and their impact on software development.

## Demo

https://fireboltcasters.github.io/data-clumps/

<a href="https://fireboltcasters.github.io/data-clumps/">
  <img src="https://github.com/FireboltCasters/data-clumps/raw/master/docs/demo.gif" alt="backup" style="witdth:100px;"/>
</a>


## Reporting Format

In our endeavor to ensure precision and standardization in reporting data clumps, we utilize the following specification: [Data-Clumps-Type-Context](https://github.com/FireboltCasters/data-clumps-type-context/).

## Visualizer

Our tool offers a unique visualizer tool to make the analysis and refactoring of data clumps more intuitive and accessible. Our data clumps visualizer provides a comprehensive overview of your code's data clumps, allowing you to easily pinpoint areas for improvement.

You can access our visualizer here: [Data Clumps Visualizer](https://github.com/FireboltCasters/data-clumps-visualizer)



## Installation & Usage

You can either choose to run it via command-line (cli) or inside your project via imports.

### Via CLI

You can simply call the detection via command line.

```
npx data-clumps <PATH_TO_PROJECT>
```

### Inside your Project

```
npm install data-clumps
```

Have a look at the development example in [development.ts](https://github.com/FireboltCasters/data-clumps/blob/master/src/api/src/ignoreCoverage/development.ts)

```tsx
import {SoftwareProject} from "data-clumps";

async function main(){
  console.log("1. Create empty project");
  let project: SoftwareProject = new SoftwareProject(["java"]);
  console.log("2. Add files to project");
  // for all files from your project
  let virtualPathToFile = "/myExampleProject/src/HelloWorld.java";
    let fileContent = "public class HelloWorld{ ... }";
    project.addFileContent(virtualPathToFile, fileContent);
  
  console.log("3. Let the file be parsed");
  await project.parseSoftwareProject();
  
  console.log(4. Detect Data-Clumps");
  let dataClumpsContext = await project.detectDataClumps()
  
  console.log("5. Detected Data-Clumps");
  console.log(dataClumpsContext);
}

main();
```

## Roadmap

- [x] Integrate website-to-gif: https://github.com/PabloLec/website-to-gif
- [x] Visualization extracted to: A library to visualize data clumps which is used in [data-clumps-visualizer](https://github.com/FireboltCasters/data-clumps-visualizer).
- [x] Support cli
  - [ ] Improve options and add documentation
- [ ] Parser
  - [ ] Support Java
    - [X] Integrated Antlr4
    - [X] Converting of JavaCST to JavaAST
    - [X] Creating Data Clumps AST
    - [X] Find minimum of LCSD found files
    - [X] Investigate why more files than LCSD have been found
    - [ ] Support anonymous classes
    - [ ] Support Generics
    - [ ] Implement Java Refactor Interface
  - [ ] Support TypeScript
  - [ ] Support JavaScript
  - [ ] Support Python
  - [ ] Support C#
  - [ ] Support C++
- [ ] Refactoring
  - [ ] Support Java

## Roadmap - Future improvements
- [ ] Extract file parsing to PMD for speed increase: https://github.com/FireboltCasters/pmd-data-clumps
  - Using PMD will then not support web-based parsing

  

## License

All Rights Reserved.

Copyright (c) 2023 Nils Baumgartner

No part of this software may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the copyright holder, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.

For permission requests, please contact the copyright holder at nilsbaumgartner1994@gmail.com



## Contributors

The FireboltCasters

<a href="https://github.com/FireboltCasters/data-clumps"><img src="https://contrib.rocks/image?repo=FireboltCasters/data-clumps" alt="Contributors" /></a>
