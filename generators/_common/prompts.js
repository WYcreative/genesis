import chalk from 'chalk';
import slugify from '@sindresorhus/slugify';
import validatePackageName from 'validate-npm-package-name';

import {parseList, previewAnswer} from './utilities.js';



/**
 * Prompts the user about the project name.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 * @param {{String: any}} [overrides = {}] - The list of properties to override the `generator`'s `prompt` method options.
 *
 * @returns {{String: String}} The list of answers, containing the `name` property with the project name.
 */
const namePrompt = (generator, overrides = {}) =>
	generator.prompt({
		name: 'name',
		message: 'Project Name:',
		default: generator.appname.replace(/(?:^|\s)\S/g, match => match.toUpperCase()),
		validate: answer => answer.length > 0 ? true : 'Project Name is required!',
		filter: answer => answer.trim(),
		...overrides,
	});



/**
 * Prompts the user about the package name.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 * @param {{String: any}} [overrides = {}] - The list of properties to override the `generator`'s `prompt` method options.
 *
 * @returns {{String: String}} The list of answers, containing the `packageName` property with the package name.
 */
const packageNamePrompt = (generator, overrides) =>
	generator.prompt({
		name: 'packageName',
		message: 'Package Name:',
		default: slugify(generator.appname),
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
		...overrides,
	});



/**
 * Prompts the user about the description.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 * @param {{String: any}} [overrides = {}] - The list of properties to override the `generator`'s `prompt` method options.
 *
 * @returns {{String: String}} The list of answers, containing the `description` property with the project's description'.
 */
const descriptionPrompt = (generator, overrides) =>
	generator.prompt({
		name: 'description',
		message: 'Description:',
		filter: answer => answer.trim(),
		...overrides,
	});



/**
 * Prompts the user about the project's keywords'.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 * @param {{String: any}} [overrides = {}] - The list of properties to override the `generator`'s `prompt` method options.
 *
 * @returns {{String: String[]}} The list of answers, containing the `keywords` property with an array of keywords.
 */
const keywordsPrompt = (generator, overrides) =>
	generator.prompt({
		name: 'keywords',
		message: 'Keywords:',
		transformer(answer, _, {isFinal}) {
			if (isFinal) {
				answer = parseList(answer)
					.map(keyword => chalk.cyan(keyword))
					.join(', ');
			} else {
				answer = `${answer.length === 0 ? chalk.reset.dim('(Use comma as separator) ') : ''}${answer}`;
			}

			return answer;
		},
		...overrides,
	})
		.then(answers => {
			answers.keywords = JSON.stringify(parseList(answers.keywords));

			return answers;
		});



/**
 * Prompts the user about the repository name.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 * @param {{String: any}} [overrides = {}] - The list of properties to override the `generator`'s `prompt` method options.
 * @param {String} defaultAnswer - The default repository name.
 * @param {String} urlPrefix - The repository URL prefix, which should be the non-variable URL part for the repository platform.
 *
 * @returns {{String: String}} The list of answers, containing the `repository` property with the repository name.
 */
const repositoryPrompt = (generator, overrides, defaultAnswer, urlPrefix) =>
	generator.prompt({
		name: 'repository',
		message: 'Repository Name:',
		default: defaultAnswer,
		transformer: (answer, _, {isFinal}) =>
			previewAnswer(
				[
					[
						{
							text: urlPrefix,
						},
						{
							text: answer,
							default: defaultAnswer,
						},
					],
				],
				isFinal,
			),
		filter: answer => answer.trim(),
		...overrides,
	});



export {
	namePrompt,
	packageNamePrompt,
	descriptionPrompt,
	keywordsPrompt,
	repositoryPrompt,
};
