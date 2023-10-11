import {join, relative, dirname, sep} from 'node:path/posix';
import {existsSync, readFileSync} from 'node:fs';

import generateAtlas from '@wycreative/atlas';
import {globbySync} from 'globby';
import gulp from 'gulp';

import config from '../config/index.js';

import {getDirectory} from './utilities.js';



const {src, dest} = gulp;



async function build(done) {
	const root = getDirectory(config.atlas);
	const files = globbySync([config.atlas, '!**/*.json']);
	const index = files.splice(files.indexOf(`./${join(root, 'index.js')}`), 1)[0];
	const pkg = JSON.parse(readFileSync('./package.json'));
	const tokensFile = join(root, 'tokens/tokens.json');
	const tokens = existsSync(tokensFile) ? JSON.parse(readFileSync(tokensFile)) : {};
	const {default: atlas} = await import(`${join('..', index)}?t=${Date.now()}`);

	if (tokens.color) {
		tokens.colors = tokens.color;
		delete tokens.color;
	}

	atlas.tokens = tokens;

	for (const file of files) {
		const type = dirname(relative(root, file)).split(sep)[0];
		const {default: value} = await import(`${join('..', file)}?t=${Date.now()}`); // eslint-disable-line no-await-in-loop

		if (atlas[type] === undefined) {
			atlas[type] = [];
		}

		atlas[type].push(value);
	}

	try {
		generateAtlas({
			package: pkg,
			atlas,
			paths: {
				destination: getDirectory(config.build.atlas),
				buildBase: config.build.base,
				symbols: config.src.symbols,
				symbolsBuild: getDirectory(config.build.images),
				examples: config.examples.base,
				views: config.examples.views,
			},
		});
	} catch (error) {
		console.error(' Skipping the generation of Atlas:\n', error);
	}

	done();
}



function dist() {
	return src(config.build.atlas, {
		ignore: [
			config.buildExamples.images,
			config.buildExamples.views,
		],
	})
		.pipe(dest(getDirectory(config.dist.atlas)));
}



build.displayName = 'build:atlas';
dist.displayName = 'dist:atlas';

export {
	build,
	dist,
};
