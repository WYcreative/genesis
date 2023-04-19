import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path/posix';

import StyleDictionary from 'style-dictionary';

import config from '../config/index.js';

import {getDirectory} from './utilities.js';


function convertToSassValue(object, depth = 0) {
	let output = '';

	if (object === null) {
		output += '""';
	} else if (typeof object === 'string') {
		output += `"${object}"`;
	} else if (Object.prototype.hasOwnProperty.call(object, 'value')) {
		output += typeof object.value === 'string' && object.value.includes(',')
			? `(${object.value})`
			: object.value;
	} else {
		output += '(\n';
		output += Object.keys(object).map(newKey => {
			const newProp = object[newKey];
			const indent = '  '.repeat(depth + 1);
			return `${indent}"${newKey}": ${convertToSassValue(newProp, depth + 1)}`;
		}).join(',\n');
		output += '\n' + '  '.repeat(depth) + ')';
	}

	return output;
}


StyleDictionary.registerFilter({
	name: 'wycreative/filter',
	matcher: token => (
		token.attributes.category === 'font'
		|| (token.attributes.category === 'typography'
			&& [
				'paragraphIndent',
				'paragraphSpacing',
			].includes(token.path.at(-1))
		)
	) === false,
});


StyleDictionary.registerTransform({
	name: 'wycreative/size/px',
	type: 'value',
	matcher: token =>
		token.unit === undefined
		&& token.type === 'dimension'
		&& token.value !== 0
		&& token.path.at(-1) !== 'lineHeight',
	transformer: token => `${token.value}px`,
});

const originalDictionary = existsSync(config.data.tokens) ? JSON.parse(readFileSync(config.data.tokens).toString()) : {};

StyleDictionary.registerTransform({
	name: 'wycreative/size/line-height',
	type: 'value',
	matcher: token =>
		token.unit === undefined
		&& token.type === 'dimension'
		&& token.value !== 0
		&& token.path.at(-1) === 'lineHeight',
	transformer(token) {
		let property = originalDictionary;

		for (const item of token.path.slice(0, -1)) {
			property = property[item];
		}

		return token.value / property.fontSize.value;
	},
});

StyleDictionary.registerTransform({
	name: 'wycreative/typography/font-family',
	type: 'value',
	matcher: token =>
		token.type === 'string'
		&& token.path.at(-1) === 'fontFamily',
	transformer(token) {
		let fontFamily = token.value;

		if (config?.data?.fontFallbacks) {
			if (config.data.fontFallbacks[token.value]) {
				fontFamily += `, ${config.data.fontFallbacks[token.value]}`;
			}

			if (config.data.fontFallbacks['*']) {
				fontFamily += `, ${config.data.fontFallbacks['*']}`;
			}
		}

		return fontFamily;
	},
});

StyleDictionary.registerFormat({
	name: 'wycreative/scss',
	formatter: ({dictionary, file}) =>
		StyleDictionary.formatHelpers.fileHeader({
			file,
			commentStyle: 'short',
		})
		+ '\n'
		+ `$${file.mapName || 'tokens'}: ${convertToSassValue(dictionary.properties)};\n`,
});


const dictionary = StyleDictionary.extend({
	source: [
		config.data.tokens,
	],
	platforms: {
		tokens: {
			transforms: [
				...StyleDictionary.transformGroup.scss,
				'wycreative/size/px',
				'wycreative/size/line-height',
				'wycreative/typography/font-family',
			],
			files: [
				{
					destination: join(getDirectory(config.src.styles), 'abstracts/_tokens.scss'),
					format: 'wycreative/scss',
					filter: 'wycreative/filter',
					options: {
						themeable: false,
					},
				},
				{
					destination: join(getDirectory(config.atlas), 'tokens/tokens.json'),
					format: 'json/nested',
					filter: 'wycreative/filter',
					options: {
						themeable: false,
					},
				},
			],
		},
	},
});


function build(done) {
	dictionary.buildAllPlatforms();

	done();
}


build.displayName = 'build:tokens';

export {
	build,
};
