import {resolve} from 'node:path';

import chalk from 'chalk';
import Generator from 'yeoman-generator';

import {namePrompt, packageNamePrompt, descriptionPrompt, repositoryPrompt} from '../_common/prompts.js';
import {intro, say} from '../_common/utilities.js';
import {getEngineVersions} from '../_common/versions.js';

import getDevDependencies from './dependencies.js';
import {designPrompt, designLibraryPrompt, prototypeDesktopPrompt, prototypeMobilePrompt, hasThemesPrompt, hasBackendPrompt, backendNamePrompt, subdomainPrompt, homepagePrompt} from './prompts.js';



const frontendDirectory = './FrontEnd';



export default class websiteGenesis extends Generator {
	/**
	 * Construct the generator, setting also the package manager.
	 *
	 * @param {String[]} [args] - The Generator arguments.
	 * @param {Object} [options] - The Generator options.
	 */
	constructor(args, options) {
		super(args, options);

		// HACK: Avoid Yeoman Environment printing a misleading error to the terminal.
		this.env.options.nodePackageManager = 'npm';
	}



	/**
	 * Initiate compatibility checks and inform the user of the start of the generator.
	 */
	initializing() {
		intro(this, !this.options.initialGenerator);
	}



	/**
	 * Present the prompts to the user.
	 */
	async prompting() {
		// Prepare answers property for later use.
		// -----------------------------------------------------------------------------
		this.answers = {};


		// Present prompts.
		// -----------------------------------------------------------------------------
		Object.assign(this.answers, await namePrompt(this));
		Object.assign(this.answers, await packageNamePrompt(this));
		Object.assign(this.answers, await descriptionPrompt(this));
		Object.assign(this.answers, await designPrompt(this));
		Object.assign(this.answers, await designLibraryPrompt(this));
		Object.assign(this.answers, await prototypeDesktopPrompt(this));
		Object.assign(this.answers, await prototypeMobilePrompt(this));
		Object.assign(this.answers, await hasThemesPrompt(this));
		Object.assign(this.answers, await hasBackendPrompt(this));
		Object.assign(this.answers, await backendNamePrompt(this));
		Object.assign(this.answers, await subdomainPrompt(this));
		Object.assign(this.answers, await homepagePrompt(this));
		Object.assign(this.answers, await repositoryPrompt(this,
			{},
			this.answers.packageName,
			'https://dev.azure.com/Bycom/_git/',
		));


		// Inform end of prompts to the user.
		// -----------------------------------------------------------------------------
		say(
			[
				chalk.green('All questions asked!'),
				'',
				'Preparing files...',
			],
			this,
		);
	}



	/**
	 * Configure additional answer properties to be used later.
	 */
	configuring() {
		// Append engine versions to answers.
		// -----------------------------------------------------------------------------
		Object.assign(this.answers, getEngineVersions());


		// Append Genesis version to answers.
		// -----------------------------------------------------------------------------
		this.answers.genesisVersion = this.rootGeneratorVersion();
	}



	/**
	 * Generate the files.
	 */
	async writing() {
		// Generate common files.
		// -----------------------------------------------------------------------------

		// Files that need renaming to avoid conflict with generator.
		this.renderTemplate('_vscode/**', '.vscode', this.answers);
		this.renderTemplate('_gitignore', '.gitignore', this.answers);


		// Generate common Front-End files.
		// -----------------------------------------------------------------------------
		this.sourceRoot(resolve(this.sourceRoot(), frontendDirectory));
		this.env.cwd = this.destinationRoot(frontendDirectory);

		this.renderTemplate('config/**', 'config', this.answers);
		this.renderTemplate('data/**', 'data', this.answers, {}, {
			globOptions: {
				dot: true,
			},
		});
		this.renderTemplate('gulp/**', 'gulp', this.answers);
		this.renderTemplate('gulpfile.js', 'gulpfile.js', this.answers);
		this.renderTemplate('README.md', 'README.md', this.answers);

		// Files that need renaming to avoid conflict with generator.
		this.renderTemplate('_editorconfig', '.editorconfig', this.answers);
		this.renderTemplate('_gitignore', '.gitignore', this.answers);
		this.renderTemplate('_nvmrc', '.nvmrc', this.answers);
		this.renderTemplate('_package.json', 'package.json', this.answers);


		// Generate Front-End files based on the answers.
		// -----------------------------------------------------------------------------
		const ignoreGlobs = [];

		if (this.answers.hasThemes === false) {
			ignoreGlobs.push('**/themes/.gitkeep');
		}

		for (const directory of ['src', 'examples']) {
			this.renderTemplate(`${directory}/**`, directory, this.answers, {}, {
				ignoreNoMatch: true,
				globOptions: {
					ignore: ignoreGlobs,
					dot: true, // HACK: Workaround for ignored files to work as expected when inside nvm.
				},
			});
		}


		// Get dependencies.
		// -----------------------------------------------------------------------------
		this.packageJson.set('devDependencies', await getDevDependencies(this));
	}



	/**
	 * Install the dependencies and inform the user about it.
	 * Skip message if this generator is called from a parent.
	 */
	install() {
		if (this.options.initialGenerator) {
			say(
				[
					chalk.green('Installing dependencies!'),
					'',
					'Please wait...',
				],
				this,
			);
		}
	}



	/**
	 * Make final actions and inform the user the end of the generator.
	 */
	end() {
		// Initiate repository.
		// -----------------------------------------------------------------------------
		this.spawnCommandSync(
			'git',
			[
				'init',
				'--quiet',
			],
			{
				cwd: '.',
			},
		);


		// Commit generated project.
		// -----------------------------------------------------------------------------
		this.spawnCommandSync(
			'git',
			[
				'add',
				'-A',
				'.',
			],
			{
				cwd: '.',
			},
		);

		this.spawnCommandSync(
			'git',
			[
				'commit',
				'-m',
				'ADD - Initial Front-End project architecture',
				'--quiet',
			],
			{
				cwd: '.',
			},
		);


		// Inform end of generator to the user.
		// -----------------------------------------------------------------------------
		say(
			[
				chalk.green('The project is ready!'),
				'',
				'A new commit was made with the newly generated files.',
				'',
				`${chalk.bold.red('Note:')} Run ${chalk.cyan(`cd ${frontendDirectory}`)} before running any script (I can't do it myself).`,
			],
			this,
		);
	}
}
