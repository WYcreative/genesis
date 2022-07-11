import {createRequire} from 'node:module';
import {version as nodeVersion, exit} from 'node:process';

import Generator from 'yeoman-generator';
import semver from 'semver';
import chalk from 'chalk';
import yosay from 'yosay';
import slugify from '@sindresorhus/slugify';
import validatePackageName from 'validate-npm-package-name';


// TODO [2022-10-25]: Use import assertions once they become stable, assuming they will be when Node 18 enters LTS mode.
const pkg = createRequire(import.meta.url)('../../package.json');


export default class Starter extends Generator {
	initializing() {
		const hasMinimumNode = semver.satisfies(nodeVersion, pkg.engines.node);

		const intro = [
			`Welcome to the ${chalk.bold('WYcreative Starter')}!`,
			chalk.dim('(name pending)'),
			'',
		];

		if (hasMinimumNode) {
			intro.push('We\'re going to start by filling some questions.');
		} else {
			intro.push(
				chalk.red(`You have Node ${nodeVersion},`),
				chalk.red(`but we need to be Node ${pkg.engines.node}.`),
				'',
				'Stopping now...',
			);
		}

		this.log(yosay(intro.join('\n'), {
			maxLength: 35,
		}));

		if (!hasMinimumNode) {
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
				name: 'description',
				message: 'Description:',
				filter: answer => answer.trim(),
			},
			{
				type: 'confirm',
				name: 'themes',
				message: 'Will the project have multiple themes?',
				default: false,
			},
		]));

		this.log(yosay([
			chalk.green('All questions asked!'),
			'',
			'Preparing files...',
		].join('\n'), {
			maxLength: 35,
		}));
	}


	configuring() {
		const minNodeVersion = '18';
		const currentNodeVersion = semver.coerce(nodeVersion);

		const projectNodeVersion = semver.gt(currentNodeVersion.version, semver.coerce(minNodeVersion).version)
			? currentNodeVersion.major + (currentNodeVersion.minor > 0 ? `.${currentNodeVersion.minor}` : '')
			: minNodeVersion;

		this.answers.nodeVersion = projectNodeVersion;
		this.answers.starterVersion = this.rootGeneratorVersion();
	}


	async writing() {
		for (const directory of ['config', 'gulp', 'src']) {
			this.renderTemplate(`./${directory}/**`, `./${directory}`, this.answers);
		}

		for (const file of ['editorconfig', 'gitignore', 'nvmrc']) {
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
			'browser-sync': '',
			cssnano: '',
			del: '',
			globby: '',
			gulp: '',
			'gulp-babel': '',
			'gulp-imagemin': '',
			'gulp-plumber': '',
			'gulp-postcss': '',
			'gulp-pug': '',
			'gulp-rename': '',
			'gulp-sass': '',
			'gulp-svgstore': '',
			'gulp-uglify-es': '',
			postcss: '',
			'postcss-preset-env': '',
			sass: '',
			xo: '',
		};

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


	end() {
		this.spawnCommandSync('git', ['init', '--quiet']);

		this.log(yosay([
			chalk.green('The project is ready!'),
			'',
			'You can start by committing these newly added files.',
		].join('\n'), {
			maxLength: 35,
		}));
	}
}
