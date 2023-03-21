<h2 align="center">
    npm-template
</h2>

<p align="center">
  <a href="https://badge.fury.io/js/data-clumps.svg"><img src="https://badge.fury.io/js/data-clumps.svg" alt="npm package" /></a>
  <a href="https://img.shields.io/github/license/FireboltCasters/data-clumps"><img src="https://img.shields.io/github/license/FireboltCasters/data-clumps" alt="MIT" /></a>
  <a href="https://img.shields.io/github/last-commit/FireboltCasters/data-clumps?logo=git"><img src="https://img.shields.io/github/last-commit/FireboltCasters/data-clumps?logo=git" alt="last commit" /></a>
  <a href="https://www.npmjs.com/package/data-clumps"><img src="https://img.shields.io/npm/dm/data-clumps.svg" alt="downloads week" /></a>
  <a href="https://www.npmjs.com/package/data-clumps"><img src="https://img.shields.io/npm/dt/data-clumps.svg" alt="downloads total" /></a>
  <a href="https://github.com/FireboltCasters/data-clumps"><img src="https://shields.io/github/languages/code-size/FireboltCasters/data-clumps" alt="size" /></a>
  <a href="https://david-dm.org/FireboltCasters/data-clumps"><img src="https://david-dm.org/FireboltCasters/data-clumps/status.svg" alt="dependencies" /></a>
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2FFireboltCasters%2Fdata-clumps?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FFireboltCasters%2Fdata-clumps.svg?type=shield"/></a>
  <a href="https://github.com/google/gts" alt="Google TypeScript Style"><img src="https://img.shields.io/badge/code%20style-google-blueviolet.svg"/></a>
  <a href="https://shields.io/" alt="Google TypeScript Style"><img src="https://img.shields.io/badge/uses-TypeScript-blue.svg"/></a>
  <a href="https://github.com/marketplace/actions/lint-action"><img src="https://img.shields.io/badge/uses-Lint%20Action-blue.svg"/></a>
</p>

<p align="center">
  <a href="https://github.com/FireboltCasters/data-clumps/actions/workflows/npmPublish.yml"><img src="https://github.com/FireboltCasters/data-clumps/actions/workflows/npmPublish.yml/badge.svg" alt="Npm publish" /></a>
  <a href="https://github.com/FireboltCasters/data-clumps/actions/workflows/linter.yml"><img src="https://github.com/FireboltCasters/data-clumps/actions/workflows/linter.yml/badge.svg" alt="Build status" /></a>
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

<p align="center">
    npm-template
</p>

## About

A template for creating npm packages

## Demo

https://fireboltcasters.github.io/data-clumps/

# How to setup your project

1. Clone this repo or "use as template" and upload it to GitHub
2. Setup GitHub Secrets
2. Get your Sonar credentials
3. Configure and run the setup script
4. Configure Quality Gate in Sonar


## 2. GitHub Secrets

If not done by your organisation you will need to define the following secrets for your repository or your organisation:
- GITHUB_TOKEN
- NPM_TOKEN

(Note: You will also need to add a secret for Sonar in step 3.)


## 3. Sonar

Sonar Cloud will be used to analyse our project in terms of code-quality: https://en.wikipedia.org/wiki/Software_quality
Therefore we need to get credentials for our project. Create a Sonar-Account if you dont have one (it is free).

- Visit: https://sonarcloud.io/
- Select your profile or organisation.
- Select the GitHub project: https://sonarcloud.io/projects/create
- Configure "With GitHub Actions"
- Follow Step 1: Add the secret to your repository
- "Skip" step 2
- Copy and paste the values of "sonar.projectKey" and "sonar.FireboltCasters" into the setup.json


## 4. Setup Script

For the correct upload to npm and sonar and keep everything working correctly, the package.json file needs to be setup correctly. This can be tedious, so that you only need to configure the setup.json file to match your project:

```javascript
{
  "package": {
    "name": "<data-clumps>",
    "description": "<packageDescription>",
    "keywords": [
      "npm-template"
    ],
    "repositoryURL": "https://github.com/FireboltCasters/npm-template.git",
    "author": "Steffen Droppelmann",
    "contributors": [
      {
        "name": "Nils Baumgartner",
        "email": "nilsbaumgartner1994@gmail.com",
        "url": "https://github.com/FireboltCasters"
      },
      {
        "name": "Steffen Droppelmann",
        "email": "steffen.droppelmann@gmail.com",
        "url": "https://github.com/FireboltCasters"
      }
    ],
    "license": "MIT"
  },
  "sonar": {
    "projectKey": "ExampleKey",
    "FireboltCasters": "ExampleOrganization"
  }
}
```

Then, run the following command:
(Note: After running this command, the setup files will be deleted)

```
npm run setup
```

## 5. Configure Quality Gate

Push your current project to GitHub. After that you should see on GitHub under "Actions" that some GitHub-Actions are being executed. The Sonar-Action will firstly fail with:
```
ERROR: QUALITY GATE STATUS: FAILED
```
This is because we haven't told Sonarcloud how it should measure the Quality Gate.

- Visit your project at: https://sonarcloud.io/projects/
- Select: "Set New Code definition"
- Select the code definition for your match. We recommend: "Previous version"
- Re-Upload your some minor change in your GitRepo to the master


## Contributors

The FireboltCasters

<a href="https://github.com/FireboltCasters/data-clumps"><img src="https://contrib.rocks/image?repo=FireboltCasters/data-clumps" alt="Contributors" /></a>
