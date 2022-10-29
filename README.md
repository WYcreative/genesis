# WYcreative Starter

> ⚠️ This is a Work In Progress. Don't use this is production.

## Requirements

- [Node.js](https://nodejs.org/en/) 18.12 or later
- [npm](https://www.npmjs.com/) 8.6 or later
- [Yeoman](https://yeoman.io/) 4.3 or later

## Installation

Due to this package being private, npm has to retrieve it from GitHub Packages registry instead of npm's.
For that to be possible, a [personal access token](https://github.com/settings/tokens) with `read:packages` scope is required. Read [GitHub's documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token) for additional information.

``` shell
npm install --global @wycreative/generator-starter
```

## Usage

### Generate a new project

Open a terminal pointed to the directory you want to start a new project and run:

``` shell
yo @wycreative/starter
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
