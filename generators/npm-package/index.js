import chalk from 'chalk';
import Generator from 'yeoman-generator';
import slugify from '@sindresorhus/slugify';

import {namePrompt, packageNamePrompt, descriptionPrompt, keywordsPrompt, repositoryPrompt} from '../_common/prompts.js';
import {intro, say} from '../_common/utilities.js';
import {getEngineVersions} from '../_common/versions.js';

import getDevDependencies from './dependencies.js';
import {tasksPrompt} from './prompts.js';
import {conditionalTasks} from './utilities.js';



export default class npmPackageGenesis extends Generator {
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
		Object.assign(this.answers, await packageNamePrompt(this, {
			default: `@wycreative/${slugify(this.appname)}`,
		}));
		Object.assign(this.answers, await descriptionPrompt(this));
		Object.assign(this.answers, await keywordsPrompt(this));
		Object.assign(this.answers, await repositoryPrompt(this,
			{},
			this.answers.packageName.split('/').at(-1),
			'https://github.com/wycreative/',
		));
		Object.assign(this.answers, await tasksPrompt(this));


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


		// Append import name to answers.
		// -----------------------------------------------------------------------------
		this.answers.importName = this.answers.packageName
			.split('/')
			.at(-1)
			.replace(
				/((?:^|[\s_-]+)\S)([^\s_-]*)/g,
				(_, firstCharacter, remainingCharacters) =>
					firstCharacter
						.trim()
						.replace(/[_-]+/g, '')
						.toUpperCase()
					+ remainingCharacters
						.toLowerCase(),
			);
	}



	/**
	 * Generate the files.
	 */
	async writing() {
		// Generate common files.
		// -----------------------------------------------------------------------------
		this.renderTemplate('config/**', 'config', this.answers);
		this.renderTemplate('gulpfile.js', 'gulpfile.js', this.answers);
		this.renderTemplate('README.md', 'README.md', this.answers);

		// Files that need renaming to avoid conflict with generator.
		this.renderTemplate('_vscode/**', '.vscode', this.answers);
		this.renderTemplate('_editorconfig', '.editorconfig', this.answers);
		this.renderTemplate('_gitignore', '.gitignore', this.answers);
		this.renderTemplate('_nvmrc', '.nvmrc', this.answers);
		this.renderTemplate('_package.json', 'package.json', this.answers);


		// Generate files based on requested tasks.
		// -----------------------------------------------------------------------------

		// Get list of tasks that won't be used.
		const ignoredTasks = conditionalTasks
			.filter(({value}) =>
				this.answers.tasks.includes(value) === false,
			)
			.map(({value}) => value);

		// Get list of tasks that won't be used and aren't dependencies of others to be used.
		const ignoredTasksWithoutDependencies = [...ignoredTasks];

		for (const task of this.answers.tasks) {
			const conditionalTask = conditionalTasks.find(({value}) => value === task);

			if (conditionalTask?.dependencies) {
				for (const dependency of conditionalTask.dependencies) {
					if (ignoredTasksWithoutDependencies.includes(dependency)) {
						ignoredTasksWithoutDependencies.splice(ignoredTasksWithoutDependencies.indexOf(dependency), 1);
					}
				}
			}
		}

		// List of directories and (partial) glob to ignore files that belong to ignored tasks.
		const directories = {
			gulp: `@(${ignoredTasksWithoutDependencies.join('|')}).js`,
			src: `@(${ignoredTasks.join('|')})/**`,
			examples: `@(${ignoredTasks.filter(task => task !== 'views').join('|')})/**`,
		};

		// Generate the files.
		for (const [directory, ignoreGlob] of Object.entries(directories)) {
			this.renderTemplate(`${directory}/**`, directory, this.answers, {}, {
				ignoreNoMatch: true,
				globOptions: {
					ignore: [
						`**/${directory}/${ignoreGlob}`,
					],
					dot: true, // HACK: Workaround for ignored files to work as expected when inside nvm.
				},
			});
		}


		// Get dependencies.
		// -----------------------------------------------------------------------------
		this.packageJson.set('devDependencies', await getDevDependencies(this.answers.tasks, this));
	}



	/**
	 * Install the dependencies and inform the user about it.
	 * Skip message, if this generator is called from a parent.
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
		);

		this.spawnCommandSync(
			'git',
			[
				'remote',
				'add',
				'origin',
				`https://github.com/wycreative/${this.answers.repository}.git`,
			],
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
		);

		this.spawnCommandSync(
			'git',
			[
				'commit',
				'-m',
				'ADD - Initial project architecture',
				'--quiet',
			],
		);


		// Create a `development` branch and switch to it.
		// -----------------------------------------------------------------------------
		this.spawnCommandSync(
			'git',
			[
				'checkout',
				'-b',
				'development',
				'--quiet',
			],
		);


		// Inform end of generator to the user.
		// -----------------------------------------------------------------------------
		say(
			[
				chalk.green('The project is ready!'),
				'',
				'A new commit was made with the newly generated files.',
			],
			this,
		);
	}
}
