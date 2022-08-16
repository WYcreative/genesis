import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {version as nodeVersion, exit, stdout} from 'node:process';
import {execSync} from 'node:child_process';

import Generator from 'yeoman-generator';
import semver from 'semver';
import chalk from 'chalk';
import yosay from 'yosay';
import slugify from '@sindresorhus/slugify';
import validatePackageName from 'validate-npm-package-name';
import packageJson from 'package-json';

import {getMemberChoices, validateDate, formatDate} from './utilities.js';


// TODO [2022-10-25]: Use import assertions once they become stable, assuming they will be when Node 18 enters LTS mode.
const pkg = createRequire(import.meta.url)('../../package.json');
const npmVersion = execSync('npm -v', {
	encoding: 'utf8',
}).trim();
const frontendDirectory = './FrontEnd';

export default class Starter extends Generator {
	constructor(args, options) {
		super(args, options);

		// HACK: Avoid Yeoman Environment printing a misleading error to the terminal.
		this.env.options.nodePackageManager = 'npm';
	}


	initializing() {
		const versions = {
			Node: {
				version: semver.coerce(nodeVersion),
				hasMinimum: semver.satisfies(nodeVersion, pkg.engines.node),
			},
			NPM: {
				version: semver.coerce(npmVersion),
				hasMinimum: semver.satisfies(npmVersion, pkg.engines.npm),
			},
		};

		const intro = [
			`Welcome to the ${chalk.bold('WYcreative Starter')}!`,
			chalk.dim('(name pending)'),
			'',
		];

		if (Object.values(versions).every(({hasMinimum}) => hasMinimum)) {
			intro.push('We\'re going to start by filling some questions.');
		} else {
			const current = Object.entries(versions).map(([name, {version}]) => `${name} ${version}`).join(' and ');
			const minimum = Object.keys(versions).map(name => `${name} ${pkg.engines[name.toLowerCase()]}`).join(' and ');

			intro.push(
				chalk.red(`You have ${current},`),
				chalk.red(`but we need ${minimum}.`),
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
				name: 'name',
				message: 'Project Name:',
				default: this.appname.replace(/(?:^|\s)\S/g, match => match.toUpperCase()),
				validate: answer => answer.length > 0 ? true : 'Project Name is required!',
				filter: answer => answer.trim(),
			},
			{
				name: 'packageName',
				message: 'Package Name:',
				default: slugify(this.appname),
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
				default(answers) {
					const name = answers.packageName.replace(/((?:^|[\s_-]+)\S)([^\s_-]*)/g, (_, p1, p2) =>
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
			},
			{
				name: 'description',
				message: 'Description:',
				filter: answer => answer.trim(),
			},
			{
				type: 'checkbox',
				name: 'team',
				message: 'Team:',
				validate: answer => answer.length > 0 ? true : 'At least one team member is required!',
				choices: getMemberChoices,
				pageSize: stdout.rows - 3,
				loop: false,
			},
			{
				type: 'confirm',
				name: 'themes',
				message: 'Will the project have multiple themes?',
				default: false,
			},
			{
				name: 'design',
				message: 'Design File URL:',
				filter: answer => answer.trim(),
			},
			{
				name: 'prototypeDesktop',
				message: 'Desktop Prototype URL:',
				filter: answer => answer.trim(),
			},
			{
				name: 'prototypeMobile',
				message: 'Mobile Prototype URL:',
				filter: answer => answer.trim(),
			},
			{
				name: 'subdomain',
				message: 'Subdomain for the development environments:',
				default: answers => answers.packageName,
				transformer: (answer, answers, {isFinal}) =>
					['dev', 'stage']
						.map(env => `\n  ${isFinal ? ' ' : chalk.yellow.bold('>')} ${chalk.dim('https://')}${isFinal ? chalk.cyan(answer) : answer || chalk.dim(answers.packageName)}${chalk.dim(`.${env}.byclients.com`)}`)
						.join(''),
				filter: answer => answer.trim(),
			},
			{
				name: 'homepage',
				message: 'Production website:',
				default: answers => `${answers.packageName}.com`,
				filter: answer => answer.trim(),
			},
			{
				name: 'repository',
				message: 'Repository Name:',
				default: answers => answers.packageName,
				transformer: (answer, answers, {isFinal}) =>
					`\n  ${isFinal ? ' ' : chalk.yellow.bold('>')} ${chalk.dim('https://dev.azure.com/Bycom/_git/')}${isFinal ? chalk.cyan(answer) : answer || chalk.dim(answers.packageName)}`,
				filter: answer => answer.trim(),
			},
			{
				name: 'designStart',
				message: 'Start of Design:',
				validate: validateDate,
				transformer: formatDate,
				filter: answer => answer.trim().replace(/[/-]/g, ''),
			},
			{
				name: 'designEnd',
				message: 'End of Design:',
				validate: validateDate,
				transformer: formatDate,
				filter: answer => answer.trim().replace(/[/-]/g, ''),
			},
			{
				name: 'frontendStart',
				message: 'Start of Front-End Development:',
				validate: validateDate,
				transformer: formatDate,
				filter: answer => answer.trim().replace(/[/-]/g, ''),
			},
			{
				name: 'frontendEnd',
				message: 'End of Front-End Development:',
				validate: validateDate,
				transformer: formatDate,
				filter: answer => answer.trim().replace(/[/-]/g, ''),
			},
			{
				name: 'backendStart',
				message: 'Start of Back-End Development:',
				validate: validateDate,
				transformer: formatDate,
				filter: answer => answer.trim().replace(/[/-]/g, ''),
			},
			{
				name: 'backendEnd',
				message: 'End of Back-End Development:',
				validate: validateDate,
				transformer: formatDate,
				filter: answer => answer.trim().replace(/[/-]/g, ''),
			},
			{
				name: 'stageStart',
				message: 'Start of Stage:',
				validate: validateDate,
				transformer: formatDate,
				filter: answer => answer.trim().replace(/[/-]/g, ''),
			},
			{
				name: 'stageEnd',
				message: 'End of Stage:',
				default: answers => formatDate(answers.backendEnd, undefined, {
					useColor: false,
				}),
				validate: validateDate,
				transformer: formatDate,
				filter: answer => answer.trim().replace(/[/-]/g, ''),
			},
			{
				name: 'preproductionStart',
				message: 'Start of Pre-Production:',
				validate: validateDate,
				transformer: formatDate,
				filter: answer => answer.trim().replace(/[/-]/g, ''),
			},
			{
				name: 'preproductionEnd',
				message: 'End of Pre-Production:',
				default: answers => formatDate(answers.backendEnd, undefined, {
					useColor: false,
				}),
				validate: validateDate,
				transformer: formatDate,
				filter: answer => answer.trim().replace(/[/-]/g, ''),
			},
			{
				name: 'productionStart',
				message: 'Start of Production:',
				validate: validateDate,
				transformer: formatDate,
				filter: answer => answer.trim().replace(/[/-]/g, ''),
			},
			{
				name: 'productionEnd',
				message: 'End of Production:',
				default: answers => formatDate(answers.backendEnd, undefined, {
					useColor: false,
				}),
				validate: validateDate,
				transformer: formatDate,
				filter: answer => answer.trim().replace(/[/-]/g, ''),
			},
		]));

		this.log(yosay([
			chalk.green('All questions asked!'),
			'',
			'Preparing files...',
		].join('\n'), {
			maxLength: 40,
		}));
	}


	configuring() {
		const minNodeVersion = '18';
		const minNPMVersion = '8.6';

		const currentNodeVersion = semver.coerce(nodeVersion);
		const currentNPMVersion = semver.coerce(npmVersion);

		const projectNodeVersion = semver.gt(currentNodeVersion.version, semver.coerce(minNodeVersion).version)
			? currentNodeVersion.major + (currentNodeVersion.minor > 0 ? `.${currentNodeVersion.minor}` : '')
			: minNodeVersion;

		const projectNPMVersion = semver.gt(currentNPMVersion.version, semver.coerce(minNPMVersion).version)
			? currentNPMVersion.major + (currentNPMVersion.minor > 0 ? `.${currentNPMVersion.minor}` : '')
			: minNPMVersion;

		this.answers.nodeVersion = projectNodeVersion;
		this.answers.npmVersion = projectNPMVersion;
		this.answers.team = JSON.stringify(this.answers.team, null, '\t\t')
			.replaceAll('"', '\'')
			.replace('\n]', ',\n\t]');

		const dates = [
			'designStart',
			'designEnd',
			'frontendStart',
			'frontendEnd',
			'backendStart',
			'backendEnd',
			'stageStart',
			'stageEnd',
			'preproductionStart',
			'preproductionEnd',
			'productionStart',
			'productionEnd',
		];

		for (const date of dates) {
			const year = this.answers[date].slice(0, 4);
			const month = this.answers[date].slice(4, 6);
			const day = this.answers[date].slice(6);

			this.answers[date] = `new Date('${year}-${month}-${day}')`;
		}

		this.answers.starterVersion = this.rootGeneratorVersion();
	}


	async writing() {
		this.renderTemplate('_vscode/**', '.vscode', this.answers);

		this.sourceRoot(resolve(fileURLToPath(new URL('.', import.meta.url)), '../../generators/app/templates/', frontendDirectory));
		this.env.cwd = this.destinationRoot(frontendDirectory);

		for (const directory of ['config', 'gulp', 'src']) {
			this.renderTemplate(`./${directory}/**`, `./${directory}`, this.answers);
		}

		for (const file of ['editorconfig', 'gitignore', 'npmrc', 'nvmrc']) {
			this.renderTemplate(`./_${file}`, `./.${file}`, this.answers);
		}

		this.renderTemplate('_package.json', 'package.json', this.answers);
		this.renderTemplate('gulpfile.js', 'gulpfile.js', this.answers);
		this.renderTemplate('README.md', 'README.md', this.answers);

		this.copyTemplate('**/.gitkeep', './', {
			globOptions: {
				ignore: [
					this.answers.themes ? '' : '**/themes/.gitkeep',
				],
			},
		});

		const devDependencies = {
			'@babel/core': '',
			'@babel/preset-env': '',
			'@wycreative/design-guide': '',
			'basic-ftp': '',
			'browser-sync': '',
			chalk: '',
			conf: '',
			cssnano: '',
			del: '',
			execa: '',
			globby: '',
			gulp: '',
			'gulp-babel': '',
			'gulp-imagemin': '',
			'gulp-plumber': '',
			'gulp-postcss': '',
			'gulp-pug': '',
			'gulp-rename': '',
			'gulp-rev': '',
			'gulp-rev-rewrite': '',
			'gulp-sass': '',
			'gulp-svgstore': '',
			'gulp-uglify-es': '',
			inquirer: '',
			ora: '',
			postcss: '',
			'postcss-preset-env': '',
			sass: '',
			semver: '',
			xo: '',
		};

		// FIXME: Workaround for Yeoman not detecting .npmrc in the generator.
		//        See: https://github.com/yeoman/generator/issues/1304
		//        When fixed, the following code block shouldn't be needed.
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

		this.packageJson.set('devDependencies', devDependencies);
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

		this.log(yosay([
			chalk.green('The project is ready!'),
			'',
			'You can start by committing these newly added files.',
		].join('\n'), {
			maxLength: 40,
		}));
	}
}
