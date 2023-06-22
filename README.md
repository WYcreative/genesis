# WYcreative's Genesis

The WYcreative Engineering Team Front-End project generator.


## Requirements

- [Node.js](https://nodejs.org/en/) 18.16 or later
- [npm](https://www.npmjs.com/) 9.5 or later
- [Yeoman](https://yeoman.io/) 4.3 or later

## Installation

``` shell
npm install --global @wycreative/generator-genesis
```

## Usage

### Generate a new project

Open a terminal pointed to the directory you want to start a new project and run:

``` shell
yo @wycreative/genesis
```

Then answer the prompts that will appear in the terminal. After that, the project files will be generated.

## Development

### Installation

With the repository cloned locally, open the terminal pointed to the repository's root and run:

``` shell
npm install
```

Then, to make the local version of the generator available as a global package in the system, with the terminal still pointing to the repository's root, run the following to create an alias:

``` shell
npm link
```

Now you can use it in any directory as described in [Usage](#usage). All changes made in the generator will reflect immediately in the globally installed alias.

### Commands

Command | Description
---|---
`npm test` | Checks for code-style issues.
