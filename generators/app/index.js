import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {version as nodeVersion, exit} from 'node:process';
import {execSync} from 'node:child_process';

import Generator from 'yeoman-generator';
import semver from 'semver';
import chalk from 'chalk';
import yosay from 'yosay';
import slugify from '@sindresorhus/slugify';
import validatePackageName from 'validate-npm-package-name';
import packageJson from 'package-json';

import {previewAnswer} from './utilities.js';


// TODO: Use import assertions once they become stable.
const pkg = createRequire(import.meta.url)('../../package.json');
const npmVersion = execSync('npm -v', {
	encoding: 'utf8',
}).trim();

let gulpCliVersion;

try {
	gulpCliVersion = execSync('gulp -v', {
		encoding: 'utf8',
	});

	gulpCliVersion = gulpCliVersion.trim().match(/^.+: (.+)/)?.[1];
} catch {}

const versions = {
	gulpCli: {
		name: 'Gulp CLI',
		version: semver.coerce(gulpCliVersion),
		minimum: pkg.engines['gulp-cli'],
		hasMinimum: semver.satisfies(gulpCliVersion, pkg.engines['gulp-cli']),
	},
	node: {
		name: 'Node',
		version: semver.coerce(nodeVersion),
		minimum: pkg.engines.node,
		hasMinimum: semver.satisfies(nodeVersion, pkg.engines.node),
	},
	npm: {
		name: 'npm',
		version: semver.coerce(npmVersion),
		minimum: pkg.engines.npm,
		hasMinimum: semver.satisfies(npmVersion, pkg.engines.npm),
	},
};

const frontendDirectory = './FrontEnd';

const projectTypes = [
	{
		name: 'Website',
		value: 'website',
	},
	{
		name: 'NPM Package',
		value: 'npm-package',
	},
];

const conditionalTasks = [
	{
		name: 'Symbols',
		value: 'symbols',
	},
	{
		name: 'Images',
		value: 'images',
	},
	{
		name: 'Styles',
		value: 'styles',
		requiredIfNoOther: true,
	},
	{
		name: 'Scripts',
		value: 'scripts',
		requiredIfNoOther: true,
	},
	{
		name: 'Views',
		value: 'views',
		requiredIfNoOther: true,
	},
];



export default class Genesis extends Generator {
	constructor(args, options) {
		super(args, options);

		// HACK: Avoid Yeoman Environment printing a misleading error to the terminal.
		this.env.options.nodePackageManager = 'npm';
	}


	initializing() {
		const intro = [
			`Welcome to ${chalk.bold('Genesis')}!`,
			'',
		];

		const outdatedEngines = Object.values(versions).filter(({hasMinimum}) => !hasMinimum);

		if (outdatedEngines.length === 0) {
			intro.push('We\'re going to start by filling some questions.');
		} else {
			const current = outdatedEngines.map(({name, version}) => version ? `${name} ${version}` : `no ${name} installed`);
			const minimum = outdatedEngines.map(({name, minimum}) => `${name} ${minimum}`);
			const formatter = new Intl.ListFormat('en');

			intro.push(
				chalk.red(`You have ${formatter.format(current)},`),
				chalk.red(`but we need ${formatter.format(minimum)}.`),
				'',
				'Stopping now...',
			);
		}

		this.log(yosay(intro.join('\n'), {
			maxLength: 40,
		}));

		if (Object.values(versions).some(({hasMinimum}) => !hasMinimum)) {
			exit(1);
		}
	}


	async prompting() {
		this.answers = {};

		Object.assign(this.answers, await this.prompt([
			{
				type: 'list',
				name: 'type',
				message: 'Project Type:',
				choices: projectTypes,
			},
			{
				name: 'name',
				message: 'Project Name:',
				default: this.appname.replace(/(?:^|\s)\S/g, match => match.toUpperCase()),
				validate: answer => answer.length > 0 ? true : 'Project Name is required!',
				filter: answer => answer.trim(),
			},
			{
				name: 'packageName',
				message: 'Package Name:',
				default: ({type}) => (type === 'npm-package' ? '@wycreative/' : '') + slugify(this.appname),
				validate(answer) {
					const validity = validatePackageName(answer);

					if (validity.validForNewPackages === false) {
						const messages = [
							...(validity.errors || []),
							...(validity.warnings || []),
						];

						for (let [index, message] of messages.entries()) {
							if (message.startsWith(answer)) {
								message = `"${answer}"${message.slice(answer.length)}`;
							} else if (message.startsWith('name')) {
								message = `Package ${message}`;
							}

							messages[index] = `${message}.`;
						}

						return messages
							.map((line, index) => (index > 0 ? `${chalk.red('>>')} ` : '') + line)
							.join('\n');
					}

					return true;
				},
				filter: answer => answer.trim(),
			},
			{
				name: 'backendName',
				message: 'Back-End Project Name:',
				default({packageName}) {
					const name = packageName.replace(/((?:^|[\s_-]+)\S)([^\s_-]*)/g, (_, p1, p2) =>
						p1.trim().replace(/[_-]+/g, '').toUpperCase() + p2.toLowerCase(),
					);

					return `${name}.Web`;
				},
				transformer(answer, _, {isFinal}) {
					let result = isFinal ? chalk.cyan(answer) : answer;

					if (answer.length > 0 && answer.includes('.') === false) {
						result += chalk[isFinal ? 'cyan' : 'dim']('.Web');
					}

					return result;
				},
				filter: answer => answer.trim() + (answer.includes('.') ? '' : '.Web'),
				when: ({type}) => type === 'website',
			},
			{
				name: 'description',
				message: 'Description:',
				filter: answer => answer.trim(),
			},
			{
				type: 'confirm',
				name: 'themes',
				message: 'Will the project have multiple themes?',
				default: false,
				when: ({type}) => type === 'website',
			},
			{
				name: 'design',
				message: 'Design URL:',
				filter: answer => answer.trim(),
				when: ({type}) => type === 'website',
			},
			{
				name: 'designLibrary',
				message: 'Design Library URL:',
				filter: answer => answer.trim(),
				when: ({type}) => type === 'website',
			},
			{
				name: 'prototypeDesktop',
				message: 'Desktop Prototype URL:',
				filter: answer => answer.trim(),
				when: ({type}) => type === 'website',
			},
			{
				name: 'prototypeMobile',
				message: 'Mobile Prototype URL:',
				filter: answer => answer.trim(),
				when: ({type}) => type === 'website',
			},
			{
				name: 'subdomain',
				message: 'Subdomain for the development environments:',
				default: ({packageName}) => packageName,
				transformer: (answer, {packageName}, {isFinal}) =>
					previewAnswer(
						['dev', 'stage']
							.map(env => [
								{
									text: 'https://',
								},
								{
									text: answer,
									default: packageName,
								},
								{
									text: `.${env}.byclients.com`,
								},
							]),
						isFinal,
					),
				filter: answer => answer.trim(),
				when: ({type}) => type === 'website',
			},
			{
				name: 'homepage',
				message: 'Production website:',
				default: ({packageName}) => `${packageName}.com`,
				filter: answer => answer.trim(),
				when: ({type}) => type === 'website',
			},
			{
				name: 'repository',
				message: 'Repository Name:',
				default: ({type, packageName}) => type === 'npm-package' ? packageName.split('/').at(-1) : packageName,
				transformer: (answer, {type, packageName}, {isFinal}) =>
					previewAnswer(
						[
							[
								{
									text: `https://${type === 'npm-package' ? 'github.com/wycreative' : 'dev.azure.com/Bycom/_git'}/`,
								},
								{
									text: answer,
									default: type === 'npm-package' ? packageName.split('/').at(-1) : packageName,
								},
							],
						],
						isFinal,
					),
				filter: (answer, {type}) => `https://${type === 'npm-package' ? 'github.com/wycreative' : 'dev.azure.com/Bycom/_git'}/${answer.trim()}`,
			},
			{
				type: 'checkbox',
				name: 'tasks',
				message: 'Tasks:',
				choices: conditionalTasks,
				when: ({type}) => type === 'npm-package',
				validate(answer) {
					const requiredIfNoOtherTasks = conditionalTasks.filter(({requiredIfNoOther}) => requiredIfNoOther);

					if (answer.length === 0) {
						return 'At least one task is required!';
					}

					if (requiredIfNoOtherTasks.some(({value}) => answer.includes(value)) === false) {
						return `At least one of the following tasks should be present: ${requiredIfNoOtherTasks.map(({name}) => name).join(', ')}.`;
					}

					return true;
				},
			},
		])
			.then(answers => {
				if (answers.type === 'npm-package') {
					answers.homepage = `https://wycreative.github.io/${answers.packageName.split('/').at(-1)}`;
				}

				if (typeof answers.tasks === 'undefined') {
					answers.tasks = [];
				}

				return answers;
			}),
		);

		this.log(yosay([
			chalk.green('All questions asked!'),
			'',
			'Preparing files...',
		].join('\n'), {
			maxLength: 40,
		}));
	}


	configuring() {
		for (const [engine, {version, minimum}] of Object.entries(versions)) {
			const minimumVersion = semver.coerce(minimum);

			const projectVersion = semver.gt(version.version, minimumVersion.version)
				? version
				: minimumVersion;

			this.answers[`${engine}Version`] = projectVersion.major + (projectVersion.minor > 0 ? `.${projectVersion.minor}` : '');
		}

		this.answers.genesisVersion = this.rootGeneratorVersion();
	}


	async writing() { // eslint-disable-line complexity
		this.renderTemplate('_vscode/**', '.vscode', this.answers);

		if (this.answers.type === 'website') {
			this.renderTemplate('_gitignore', '.gitignore', this.answers);
		}

		this.sourceRoot(resolve(fileURLToPath(new URL('.', import.meta.url)), '../../generators/app/templates/', frontendDirectory));

		if (this.answers.type === 'website') {
			this.env.cwd = this.destinationRoot(frontendDirectory);
		}

		const ignoredTasks = [];

		if (this.answers.type !== 'website') {
			ignoredTasks.push(
				'atlas',
				'deploy',
				'fonts',
				'tokens',
				...conditionalTasks
					.filter(({value}) => this.answers.tasks.includes(value) === false)
					.map(({value}) => value),
			);
		}

		for (const directory of ['config', 'gulp', 'src']) {
			const ignore = [];

			switch (directory) {
				case 'gulp': {
					if (this.answers.type !== 'website') {
						ignore.push(`**/gulp/@(${ignoredTasks.join('|')}).js`);
					}

					break;
				}

				case 'src': {
					if (this.answers.type !== 'website') {
						ignore.push(`**/src/@(${['backend', ...ignoredTasks].join('|')})/**`);
					}

					break;
				}

				// No default
			}

			this.renderTemplate(`./${directory}/**`, `./${directory}`, this.answers, {}, {
				ignoreNoMatch: true,
				globOptions: {
					ignore: [
						...ignore,
						...projectTypes.map(({value}) => `**/${value}/**`),
					],
				},
			});

			this.renderTemplate(`./${directory}/${this.answers.type}/**`, `./${directory}`, this.answers, {}, {
				ignoreNoMatch: true,
				globOptions: {
					ignore,
				},
			});
		}

		for (const file of ['editorconfig', 'gitignore', 'npmrc', 'nvmrc']) {
			this.renderTemplate(`./_${file}`, `./.${file}`, this.answers);
		}

		this.renderTemplate('_package.json', 'package.json', this.answers);
		this.renderTemplate('gulpfile.js', 'gulpfile.js', this.answers);
		this.renderTemplate('README.md', 'README.md', this.answers);

		const ignore = [];

		if (this.answers.type !== 'website') {
			ignore.push('**/config/atlas/**', `**/src/@(${ignoredTasks.join('|')})/**`);
		}

		if (!this.answers.themes) {
			ignore.push('**/themes/website/.gitkeep');
		}

		this.copyTemplate('**/.gitkeep', './', {
			ignoreNoMatch: true,
			globOptions: {
				ignore: [
					...ignore,
					...projectTypes.map(({value}) => `**/${value}/**`),
				],

			},
		});

		for (const directory of ['config', 'gulp', 'src']) {
			this.copyTemplate(`./${directory}/${this.answers.type}/**/.gitkeep`, `./${directory}`, {
				ignoreNoMatch: true,
				globOptions: {
					ignore,
				},
			});
		}

		const devDependencies = {
			'browser-sync': '',
			del: '',
			'glob-parent': '',
			globby: '',
			gulp: '',
			'gulp-rename': '',
			xo: '',
		};

		if (this.answers.type === 'website') {
			Object.assign(devDependencies, {
				'@wycreative/atlas': '',
				'basic-ftp': '',
				chalk: '',
				conf: '',
				execa: '',
				'gulp-rev': '',
				'gulp-rev-rewrite': '',
				inquirer: '',
				ora: '',
				semver: '',
				'style-dictionary': '',
			});
		}

		if (this.answers.type === 'npm-package') {
			Object.assign(devDependencies, {
				np: '',
			});
		}

		if (this.answers.type === 'website' || this.answers.tasks.some(task => ['symbols', 'images', 'scripts', 'views'].includes(task))) {
			Object.assign(devDependencies, {
				'gulp-plumber': '',
			});
		}

		if (this.answers.type === 'website' || this.answers.tasks.some(task => ['symbols', 'images'].includes(task))) {
			Object.assign(devDependencies, {
				'gulp-imagemin': '',
			});
		}

		if (this.answers.type === 'website' || this.answers.tasks.includes('symbols')) {
			Object.assign(devDependencies, {
				'gulp-svgstore': '',
				'gulp-tap': '',
				jsdom: '',
			});
		}

		if (this.answers.type === 'website' || this.answers.tasks.includes('styles')) {
			Object.assign(devDependencies, {
				cssnano: '',
				'gulp-postcss': '',
				'gulp-sass': '',
				postcss: '',
				'postcss-preset-env': '',
				sass: '',
			});
		}

		if (this.answers.type === 'website' || this.answers.tasks.includes('scripts')) {
			Object.assign(devDependencies, {
				'@babel/core': '',
				'@babel/preset-env': '',
				'gulp-babel': '',
				'gulp-uglify-es': '',
			});
		}

		if (this.answers.type === 'website' || this.answers.tasks.includes('views')) {
			Object.assign(devDependencies, {
				'gulp-pug': '',
			});
		}

		// FIXME: Workaround for Yeoman not detecting .npmrc in the generator.
		//        See: https://github.com/yeoman/generator/issues/1304
		//        When fixed, the following code block shouldn't be needed.
		//        Also, remove `.npmrc` from package.json `files` property.
		const npmrcPath = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../.npmrc');
		const npmrcFile = readFileSync(npmrcPath).toString();
		const registryLine = npmrcFile.split('\n').find(line => line.startsWith('@wycreative'));
		const privateDependencies = Object.keys(devDependencies).filter(name => name.startsWith('@wycreative'));

		for (const name of privateDependencies) {
			let version;

			try {
				({version} = await packageJson(name, { // eslint-disable-line no-await-in-loop
					registryUrl: registryLine.slice(registryLine.indexOf('http')).trim(),
				}));
			} catch (error) {
				if (error.constructor.name === 'VersionNotFoundError') {
					try {
						({version} = await packageJson(name, { // eslint-disable-line no-await-in-loop
							version: 'next',
							registryUrl: registryLine.slice(registryLine.indexOf('http')).trim(),
						}));
					} catch (error) {
						console.error(error.message);
						exit(1);
					}
				} else {
					console.error(error.message);
					exit(1);
				}
			}

			devDependencies[name] = `^${version}`;
		}
		// End of FIXME block.

		await this.addDevDependencies(devDependencies)
			.then(dependencies => {
				for (const [name, version] of Object.entries(dependencies)) {
					if (devDependencies[name] === '') {
						devDependencies[name] = `^${version}`;
					}
				}
			});

		const sortedDevDependencies = {};

		for (const name of Object.keys(devDependencies).sort()) {
			sortedDevDependencies[name] = devDependencies[name];
		}

		this.packageJson.set('devDependencies', sortedDevDependencies);
	}


	install() {
		this.log(yosay([
			chalk.green('Installing dependencies!'),
			'',
			'Please wait...',
		].join('\n'), {
			maxLength: 40,
		}));
	}


	end() {
		this.spawnCommandSync('git', ['init', '--quiet'], {
			cwd: '.',
		});

		const message = [
			chalk.green('The project is ready!'),
			'',
			'You can start by committing these newly added files.',
		];

		if (this.answers.type === 'website') {
			message.push(
				'',
				`${chalk.bold('Note:')} Run ${chalk.cyan(`cd ${frontendDirectory}`)} before running any script (I can't do it myself).`,
			);
		}

		this.log(yosay(message.join('\n'), {
			maxLength: 40,
		}));
	}
}
