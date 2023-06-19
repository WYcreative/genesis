# <%= name %>

<% if(description) { -%>

> <%= description %>
<% } -%>

## Requirements

- [Node.js](https://nodejs.org/en/) <%= nodeVersion %> or later
- [npm](https://www.npmjs.com/) <%= npmVersion %> or later
- [Gulp CLI](https://gulpjs.com) 2.2 or later

## Installation

``` shell
npm install
```

## Usage

Command | Description
---|---
`npm start` | Builds the project, starts the local server, and watches for changes.
`npm run serve` | Starts the local server and watches for changes.
`npm test` | Checks for code-style issues.
`npm run dist` | Prepares de built code for distribution.
`npm run clean` | Deletes the compiled code in `build` and `dist` directories.
`npm run deploy` | Runs the whole build and distribution process, prepares a release, and deploys the project.

## Genesis

This project was generated with Genesis <%= genesisVersion %>.
