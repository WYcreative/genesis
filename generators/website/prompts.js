import chalk from 'chalk';

import {previewAnswer} from '../_common/utilities.js';



/**
 * Prompts the user wether the project has Back-End.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: String}} The list of answers, containing the `hasBackEnd` property.
 */
const hasBackendPrompt = generator =>
	generator.prompt({
		type: 'confirm',
		name: 'hasBackend',
		message: 'Will the project have Back-End?',
		default: true,
	});



/**
 * Prompts the user the Back-End project name.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: String}} The list of answers, containing the `backendName` property with the Back-End project name.
 */
const backendNamePrompt = generator =>
	generator.prompt({
		name: 'backendName',
		message: 'Back-End Project Name:',
		when: generator.answers.hasBackend,
		default() {
			const name = generator.answers.packageName.replaceAll(/((?:^|[\s_-]+)\S)([^\s_-]*)/g, (_, p1, p2) =>
				p1.trim().replaceAll(/[_-]+/g, '').toUpperCase() + p2.toLowerCase(),
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
	});



/**
 * Prompts the user wether the project should support themes.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: Boolean}} The list of answers, containing the `hasThemes` property with its boolean value.
 */
const hasThemesPrompt = generator =>
	generator.prompt({
		type: 'confirm',
		name: 'hasThemes',
		message: 'Will the project have multiple themes?',
		default: false,
	});



/**
 * Prompts the user the design URL.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: String}} The list of answers, containing the `design` property with the URL.
 */
const designPrompt = generator =>
	generator.prompt({
		name: 'design',
		message: 'Design URL:',
		filter: answer => answer.trim(),
	});



/**
 * Prompts the user the design library URL.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: String}} The list of answers, containing the `designLibrary` property with the URL.
 */
const designLibraryPrompt = generator =>
	generator.prompt({
		name: 'designLibrary',
		message: 'Design Library URL:',
		filter: answer => answer.trim(),
	});



/**
 * Prompts the user the desktop prototype URL.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: String}} The list of answers, containing the `prototypeDesktop` property with the URL.
 */
const prototypeDesktopPrompt = generator =>
	generator.prompt({
		name: 'prototypeDesktop',
		message: 'Desktop Prototype URL:',
		filter: answer => answer.trim(),
	});



/**
 * Prompts the user the mobile prototype URL.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: String}} The list of answers, containing the `prototypeMobile` property with the URL.
 */
const prototypeMobilePrompt = generator =>
	generator.prompt({
		name: 'prototypeMobile',
		message: 'Mobile Prototype URL:',
		filter: answer => answer.trim(),
	});



/**
 * Prompts the user the subdomain for the development environments.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: String}} The list of answers, containing the `subdomain` property with the subdomain name.
 */
const subdomainPrompt = generator =>
	generator.prompt({
		name: 'subdomain',
		message: 'Subdomain for the development environments:',
		default: () => generator.answers.packageName,
		transformer: (answer, _, {isFinal}) =>
			previewAnswer(
				['dev', 'stage']
					.map(env => [
						{
							text: 'https://',
						},
						{
							text: answer,
							default: generator.answers.packageName,
						},
						{
							text: `.${env}.wycreative.com`,
						},
					]),
				isFinal,
			),
		filter: answer => answer.trim(),
	});



/**
 * Prompts the user the production website URL.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: String}} The list of answers, containing the `homepage` property with the URL.
 */
const homepagePrompt = generator =>
	generator.prompt({
		name: 'homepage',
		message: 'Production website:',
		default: () => `${generator.answers.packageName}.com`,
		filter: answer => answer.trim(),
	});



export {
	hasBackendPrompt,
	backendNamePrompt,
	hasThemesPrompt,
	designPrompt,
	designLibraryPrompt,
	prototypeDesktopPrompt,
	prototypeMobilePrompt,
	subdomainPrompt,
	homepagePrompt,
};
