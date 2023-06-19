import {exit} from 'node:process';

import chalk from 'chalk';
import yosay from 'yosay';

import {versions} from './versions.js';



/**
 * Gets a list of development dependencies and their latest possible versions.
 *
 * @param {{String: String}} devDependencies - The list of development dependencies, with either an empty string, or a version to conform to, following NPM's rules.
 * @param {Generator} generator - The Yeoman Generator instance.
 *
 * @returns {{String: String}} The list of sorted development dependencies with their respective versions, following NPM's rules.
 */
async function addDevDependencies(devDependencies, generator) {
	await generator.addDevDependencies(devDependencies)
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

	return sortedDevDependencies;
}



/**
 * Perform engine compatibility checks and inform the user of the start of the generator.
 *
 * @param {Generator} generator - The Yeoman Generator instance.
 * @param {Boolean} silentIntro - Wether to hide the intro message.
 */
function intro(generator, silentIntro) {
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

	if (!silentIntro || outdatedEngines.length > 0) {
		say(intro, generator);
	}

	if (outdatedEngines.length > 0) {
		exit(1);
	}
}



/**
 * Remove duplicate items of a list and then sort it.
 *
 * @param {String} list - The comma-separated list string.
 *
 * @returns {String[]} The de-duplicated and sorted list as an array.
 */
function parseList(list) {
	list = list
		.split(/[,\r\n\f]+/)
		.map(item => item.replace(/\s+/g, ' ').trim())
		.filter(item => item.length > 0)
		.sort();

	return [...new Set(list)];
}



/**
 * Returns a preview for a Yeoman Generator prompt answer.
 *
 * @param {AnswerPreviewTemplate[]} templates - The list of templates.
 * @param {Boolean} isFinal - Wether the result should be a final-formatted string for the Yeoman Generator's prompt method.
 *
 * @returns {String} The preview string.
 */
function previewAnswer(templates, isFinal) {
	return templates.map(template => {
		let result = `\n  ${isFinal ? ' ' : chalk.yellow.bold('>')} `;

		result += template.map(part => {
			if (part.default) {
				return part.text || chalk.dim(part.default);
			}

			return chalk.dim(part.text);
		})
			.join('');

		return isFinal ? chalk.cyan(result) : result;
	})
		.join('');
}



/**
 * Show a message to the user.
 *
 * @param {(String | Array)} message - The message to show.
 *   It accepts a string or an array, which will be then joined with newlines (`\n`).
 * @param {Generator} generator - The Yeoman Generator instance.
 */
function say(message, generator) {
	if (Array.isArray(message)) {
		message = message.join('\n');
	}

	generator.log(yosay(message, {
		maxLength: 40,
	}));
}



export {
	addDevDependencies,
	intro,
	parseList,
	previewAnswer,
	say,
};



/**
 * An answer preview template.
 *
 * @typedef {AnswerPreviewTemplatePart[]} AnswerPreviewTemplate
 */

/**
 * An answer preview template.
 *
 * @typedef {Object} AnswerPreviewTemplatePart
 *
 * @property {String} text - The part text.
 * @property {String} [default] - The default part text to be used as fallback, if `text` isn't a truthy value.
 */
